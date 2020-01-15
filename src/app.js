const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const Map = require('./server/map');

server.listen(port);

app.use('/pixi', express.static(`${__dirname.replace('\\\src', '')}/node_modules/pixi.js/dist/`));
app.use(express.static(`${__dirname}/client`));

app.get('/', function(req, res) {
  res.sendfile(`${__dirname}/index.html`);
});

io.sockets.on('connection', function(socket) {
  console.log(`client connected ${socket.id}`);
  const map = new Map(80, 50, socket);
  const map_data = map.getMapData();
  socket.emit('send_map', map_data);
  socket.on('disconnect', function() {
    console.log(`client disconnected ${socket.id}`);
  });
});

console.log(`Server Started at ${port}`);
