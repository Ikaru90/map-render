const socket = io();

function start(map) {
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight
  });
  document.body.appendChild(app.view);

  PIXI.loader
    .add("assets/wall.png")
    .add("assets/floor.png")
    .load(setup);

  function setup() {
    for (let y = 0; y < map.length; y++ ) {
      for (let x = 0; x < map[y].length; x++ ) {
        if (map[y][x] === 0) {
          const wall = new PIXI.Sprite(PIXI.loader.resources["assets/wall.png"].texture);
          wall.x = x * 20;
          wall.y = y * 20;
          app.stage.addChild(wall);
        }
        if (map[y][x] === 2) {
          const floor = new PIXI.Sprite(PIXI.loader.resources["assets/floor.png"].texture);
          floor.x = x * 20;
          floor.y = y * 20;
          app.stage.addChild(floor);
        }
      }
    }
  }

  function resizeGame(){
    app.renderer.resize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', resizeGame, false);
}

socket.on('connect', function() {
  socket.on('send_map', function (map) {
    start(map);
  });
});
