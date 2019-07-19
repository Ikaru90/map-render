const { performance } = require('perf_hooks');
const getRandom = require('./utils');
const Room = require('./room');

const Map = function(map_width, map_height) {
  const map_data = [];
  const rooms = [];

  addRooms = function() {
    for (let i = 0; i < 100; i++) {
      const room_width = 3 + getRandom(7);
      const room_height = 3 + getRandom(7);

      const newRoom = new Room(
        3 + getRandom(map_width - room_width - 6),
        3 + getRandom(map_height - room_height - 6),
        room_width,
        room_height
      );

      const foundIntersect = rooms.find(function(room){
        return newRoom.hasInteresect(room);
      });

      if (!foundIntersect) {
        rooms.push(newRoom);
      }
    }

    for (let i = 0; i < map_height; i++) {
      map_data[i] = [];
      for (let j = 0; j < map_width; j++) {
        map_data[i][j] = 0;
      }
    }

    rooms.forEach(function(room) {
      for (let i = room.y; i < room.y + room.height; i++) {
        for (let j = room.x; j < room.x + room.width; j++) {
          map_data[i][j] = 2;
        }
      }
    });
  };

  generatePassage = function(start, finish) {
    const parents = [];
    for (let i = 0; i < map_height; i++) {
      parents[i] = [];
    }
    const active = [];
    active.push(start);

    const calcCost = function(p, f){
      const cost = map_data[p.y][p.x] === 0 ? 1000 : 0;
      return cost + Math.sqrt((p.x - f.x)*(p.x - f.x) + (p.y - f.y)*(p.y - f.y));
    };

    const directions = [[1,0], [0,1], [-1,0], [0,-1]];

    while (active.length > 0) {
      const point = active.pop();

      if (point == finish)
        break;

      for (let i = 0; i < 4; i++) {
        const p = {
          x: point.x - directions[i][0],
          y: point.y - directions[i][1],
          cost: 0
        };
        if (p.x < 0 || p.y < 0 || p.x >= map_width || p.y >= map_height)
          continue;

        if (parents[p.y][p.x] === undefined) {
          p.cost = calcCost(p, finish);
          active.push(p);
          active.sort(function(a,b) { return b.cost - a.cost; });

          parents[p.y][p.x] = i;
        }
      }
    }

    let finishPoint = finish;
    while (!((finishPoint.x === start.x)&&(finishPoint.y === start.y))) {
      map_data[finishPoint.y][finishPoint.x] = 2;

      const directon = directions[parents[finishPoint.y][finishPoint.x]];
      finishPoint.x += directon[0];
      finishPoint.y += directon[1];
    }

    return parents;
  };

  generateWalls = function() {
    const offsets = [
      [-1,-1], [0,-1], [1,-1], [1, 0],
      [ 1, 1], [0, 1], [-1, 1], [-1, 0],
    ];

    for (let y = 1; y < map_height - 1; y++) {
      for (let x = 1; x < map_width - 1; x++) {
        if (map_data[y][x] == 0) {
          for (let i = 0; i < 8; i++) {
            if (map_data[(y + offsets[i][1])][(x + offsets[i][0])] == 2) {
              map_data[y][x] = 1;
              break;
            }
          }
        }
      }
    }
  };

  const roomTime = performance.now();
  addRooms();
  console.log('Cоздание комнат = ', performance.now() - roomTime);
  const passageTime = performance.now();
  for (let i = 0; i < rooms.length -1; i++){
    const start = rooms[i].getRoomCenter();
    const finish = rooms[i+1].getRoomCenter();
    generatePassage(start, finish);
  }
  console.log('Cоздание переходов = ', performance.now() - passageTime);
  const wallTime = performance.now();
  generateWalls();
  console.log('Cоздание стен = ', performance.now() - wallTime);

  this.getMapData = function() {
    return map_data;
  };
};

module.exports = Map;
