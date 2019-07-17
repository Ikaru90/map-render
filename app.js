const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

server.listen(port);

app.use('/pixi', express.static(`${__dirname}/node_modules/pixi.js/dist/`));
app.use(express.static(`${__dirname}/public`));

app.get('/', function(req, res) {
  res.sendfile(`${__dirname}/index.html`);
});

function getRandom(maximum) {
  return Math.floor(Math.random() * Math.floor(maximum + 1));
};

const Room = function(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.interesect = function(room) {
    return !(room.x >= (this.x + width) || this.x >= (room.x + room.width)
      || room.y >= (this.y + height) || this.y >= (room.y + room.height));
  };
};

const Map = function(map_width, map_height) {
  const map_data = [];
  const rooms = [];

  this.getMapData = function() {
    return map_data;
  };

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
};

io.sockets.on('connection', function(socket) {
  console.log(`client connected ${socket.id}`);
  const map = new Map(80, 40);
  const map_data = map.getMapData();
  socket.emit('send_map', map_data);
  socket.on('disconnect', function() {
    console.log(`client disconnected ${socket.id}`);
  });
});

console.log(`Server Started at ${port}`);
