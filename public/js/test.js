var canvas = document.getElementById("viewport");
var bodyColor = window.getComputedStyle(document.body, null).backgroundColor;
var updateStats = new Stats("UPS");
var renderStats = new Stats("FPS");

canvas.blur();

document.body.appendChild(updateStats.domElement);
document.body.appendChild(renderStats.domElement);

var Keyboard = {
  _pressed: {},

  UP: [87, 38],
  DOWN: [83, 40],
  LEFT: [65, 37],
  RIGHT: [68, 39],
  SPACE: [32],

  isDown: function(key) {
    for (var i = 0; i < key.length; i++) {
      var pressed = this._pressed[key[i]];
      if (pressed) return pressed;
    }
  },

  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },

  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

var Mouse = {
  _x: 0,
  _y: 0,

  getX: function() {
    return this._x;
  },
  getY: function() {
    return this._y;
  },

  move: function(event) {
    var rect = canvas.getBoundingClientRect();
    this._x = (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    this._y = (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
  }
};

window.addEventListener("keyup", function(event) {
  Keyboard.onKeyup(event);
}, false);
window.addEventListener("keydown", function(event) {
  Keyboard.onKeydown(event);
}, false);
window.addEventListener("mousemove", function(event) {
  Mouse.move(event);
}, false);

var Game = {
  canvas: null,
  ctx: null,
  paused: false,
  pointedPolygon: null,
  init: function(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    View.resize(canvas.width, canvas.height);
    Timer.init();

    var paddle1 = new Polygon([
      [-5, -30],
      [5, -30],
      [5, 30],
      [-5, 30]
    ], 10, 10, 10, 0, "#204ecf");
    var paddle2 = new Polygon([
      [-5, -30],
      [5, -30],
      [5, 30],
      [-5, 30]
    ], 100, 100, 10, 0, "#204ecf");
    var test = new Polygon([
      [0, 0],
      [40, 0],
      [40, 400],
      [0, 400]
    ], 2, 2, 0, 0, "#f6e58d");
    paddle1.computeMassCenter();
    paddle2.computeMassCenter();
    paddle1.zendex = 1;
    World.addPolygon(paddle1);
    World.addPolygon(paddle2);
    World.addPolygon(test);
    World.player = paddle1;
  },
  getMouseOver: function() {
    var x = Mouse.getX();
    var y = Mouse.getY();
    // set pointedPolygon
  }
};

Game.processInputs = function() {
  var speed = 10;
  var mx = 0;
  var my = 0;
  if (Keyboard.isDown(Keyboard.UP)) my = -speed;
  if (Keyboard.isDown(Keyboard.DOWN)) my = speed;
  if (Keyboard.isDown(Keyboard.LEFT)) mx = -speed;
  if (Keyboard.isDown(Keyboard.RIGHT)) mx = speed;
  if (Keyboard.isDown(Keyboard.SPACE)) {
    //World.player.rot += 45;
    World.player.setPosition(320, 240);
  }
  if (mx || my) World.player.move(mx, my);
};

Game.update = function() {
  this.processInputs();
  World.update();
};

Game.draw = function(interp) {
  this.ctx.clearRect(0, 0, View.width, View.height);
  World.draw(this.ctx, 1 + interp);
};

Game.run = (function() {
  var updates = 0;
  var frames = 0;
  var skipTicks = 1000 / Timer.ticksPerSecond;
  var nextGameTick = Timer.getTime();
  var lastTimer = Timer.getTime();

  return function() {
    Game.paused = document.activeElement !== canvas;

    //if (this.paused) {
    //  var prev = Timer.renderPartialTicks;
    //  this.timer.update();
    //  Timer.renderPartialTicks = prev;
    //} else Timer.update();

    //for (var i = 0; i < Timer.elapsedTicks; i++) {
      //console.log("update");
      //nextGameTick += skipTicks;
      //if (!Game.paused) Game.update();
      //updateStats.update();
      //updates++;
    //}

    while (Timer.getTime() >= nextGameTick) {
      nextGameTick += skipTicks;
      if (!Game.paused) Game.update();
      updateStats.update();
      updates++;
    }

    //if (!Game.paused) Game.draw(Timer.renderPartialTicks);
    //if (!Game.paused) Game.draw((Timer.getTime() - nextGameTick) / skipTicks);
    renderStats.update();
    frames++;

    if (Timer.getTime() - lastTimer > 1000) {
      lastTimer += 1000;
      console.log(updates + " updates, " + frames + " fps");
      updates = 0;
      frames = 0;
    }
  }
})();

(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() {
        cb();
        requestAnimationFrame(_cb);
      }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }

  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(Game.run);

Game.init(canvas);
