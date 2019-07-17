const getRandom = require('./utils');
const Room = require('./room');

const Map = function(map_width, map_height) {
  const map_data = [];
  const rooms = [];

  addRooms = function() {
    for (let i = 0; i < 500; i++) {
      const room_width = 4 + getRandom(17);
      const room_height = 4 + getRandom(17);

      const newRoom = new Room(
        1 + getRandom(map_width - room_width - 2),
        1 + getRandom(map_height - room_height - 2),
        room_width,
        room_height
      );

      const foundIntersect = rooms.find(function(room){
        return newRoom.interesect(room);
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

  addRooms();

  this.getMapData = function() {
    return map_data;
  };
};

module.exports = Map;
