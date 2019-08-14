var canvas = document.getElementById("viewport");
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

function Polygon(points) {
  this.points = points;
  this.massCenterX = 0;
  this.massCenterY = 0;
  this.prevPosX = 0;
  this.prevPosY = 0;
  this.posX = 0;
  this.posY = 0;
  this.velX = 0;
  this.velY = 0;
  this.prevRot = 0;
  this.rot = 0;
}

Polygon.prototype.computeMassCenter = function() {
  var off = this.points[0];
  var twicearea = 0;
  var x = 0;
  var y = 0;
  var p1, p2;
  var f;
  for (var i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
    p1 = this.points[i];
    p2 = this.points[j];
    f = (p1[0] - off[0]) * (p2[1] - off[1]) - (p2[0] - off[0]) * (p1[1] - off[1]);
    twicearea += f;
    x += (p1[0] + p2[0] - 2 * off[0]) * f;
    y += (p1[1] + p2[1] - 2 * off[1]) * f;
  }

  f = twicearea * 3;

  this.massCenterX = x / f + off[0];
  this.massCenterY = y / f + off[1];
};

Polygon.prototype.rotate = function(pivotX, pivotY, angle) {
  var radians = angle * Math.PI / 180;
  for (var i = 0; i < this.points.length; i++) {
    var rx = Math.cos(radians) * (this.points[i][0] - pivotX) - Math.sin(radians) * (this.points[i][1] - pivotY) + pivotX;
    var ry = Math.sin(radians) * (this.points[i][0] - pivotX) + Math.cos(radians) * (this.points[i][1] - pivotY) + pivotY;
    this.points[i][0] = rx;
    this.points[i][1] = ry;
  }
};

Polygon.prototype.update = function() {
  this.prevPosX = this.posX;
  this.prevPosY = this.posY;
  this.prevRot = this.rot;
  this.posX += this.velX;
  this.posY += this.velY;
  this.velX *= 0.8;
  this.velY *= 0.8;
  if (Math.abs(this.velX) < 0.01) this.velX = 0;
  if (Math.abs(this.velY) < 0.01) this.velY = 0;
};

Polygon.prototype.draw = function(ctx, interp) {
  ctx.save();

  ctx.translate(this.posX, this.posY);

  ctx.fillStyle = "black";

  ctx.beginPath();
  ctx.moveTo(this.points[0][0], this.points[0][1]);
  for (var i = 0; i < this.points.length; i++) {
    ctx.lineTo(this.points[i][0], this.points[i][1]);
  }
  ctx.lineTo(this.points[0][0], this.points[0][1]);
  ctx.closePath();

  ctx.fill();

  ctx.restore();
};

var World = {
  polygons: [],
  ticks: 0
};

World.update = function() {
  for (var i = 0; i < this.polygons.length; i++) {
    this.polygons[i].update();
  }
  this.ticks++;
};

World.draw = function(ctx, interp) {
  ctx.save();
  for (var i = 0; i < this.polygons.length; i++) {
    this.polygons[i].draw(ctx, interp);
  }
  ctx.restore();
};

var test = new Polygon([[0, 100], [50, 0], [100, 100]]);
test.computeMassCenter();

function Rect() {
  this.x = Math.floor(Math.random() * (640 - 10));
  this.y = Math.floor(Math.random() * (480 - 10));
  this.vx = 0;
  this.vy = 0;
  this.px = 0;
  this.py = 0;
  this.r = 0;
  this.pr = 0;
}

Rect.prototype.update = function() {
  if (this.x < 0 || this.x >= 640 - 10) this.vx = -this.vx;
  if (this.y < 0 || this.y >= 480 - 10) this.vy = -this.vy;

  this.px = this.x;
  this.py = this.y;
  this.x += this.vx;
  this.y += this.vy;
};

Rect.prototype.update2 = function() {
  this.px = this.x;
  this.py = this.y;
  this.x += this.vx;
  this.y += this.vy;
  this.pr = this.r;
  this.r++;
};

Rect.prototype.draw = function(context, interpolation) {
  context.fillRect(this.x + this.vx * interpolation, this.y + this.vy * interpolation, 10, 10);
};

Rect.prototype.draw2 = function(context, interpolation) {
  context.fillRect(this.x + this.vx * interpolation, this.y + this.vy * interpolation, 10, 40);
};

Rect.prototype.draw3 = function(context, interpolation) {
  return;
  context.save();
  context.translate(this.x + this.vx * interpolation, this.y + this.vy * interpolation);
  context.rotate(this.r * Math.PI / 360);
  context.moveTo(-5, -20);
  context.lineTo(5, -20);
  context.lineTo(5, 20);
  context.lineTo(-5, 20);
  context.lineTo(-5, -20);
  context.strokeStyle = "black";
  context.stroke();
  //context.fillRect(-5, -20, 10, 40);
  context.restore();
};

var Game = {
  fps: 2,
  paused: false,
  getTime: function() {
    return window.performance.now();
  }
};

Game.initialize = function() {
  this.entities = [];
  this.spinner = new Rect();
  this.spinner.x = 100;
  this.spinner.y = 100;
  this.player = new Rect();
  this.player.x = 30;
  this.player.y = 30;
  this.context = document.getElementById("viewport").getContext("2d");
};

Game.update = function() {
  if (Keyboard.isDown(Keyboard.UP)) this.player.vy = -20;
  if (Keyboard.isDown(Keyboard.DOWN)) this.player.vy = 20;
  if (Keyboard.isDown(Keyboard.LEFT)) this.player.vx = -20;
  if (Keyboard.isDown(Keyboard.RIGHT)) this.player.vx = 20;

  for (var i = 0; i < this.entities.length; i++) {
    this.entities[i].update();
  }

  this.player.update2();
  this.player.vx *= 0.8;
  this.player.vy *= 0.8;
  if (Math.abs(this.player.vx) < 0.001) this.player.vx = 0;
  if (Math.abs(this.player.vy) < 0.001) this.player.vy = 0;
  this.spinner.update2();

  test.rotate(test.massCenterX, test.massCenterY, 1);
};

Game.draw = function(interpolation) {
  this.context.clearRect(0, 0, 640, 480);
  this.context.fillStyle = "#ffaaff";
  this.context.fillRect(0, 0, 640, 480);
  //this.context.save();
  //this.context.scale(10, 10);
  //this.context.translate(320, 240);

  // get mouse over object
  var x = Mouse.getX();
  var y = Mouse.getY();
  var xx = Math.floor(x / 10);
  var yy = Math.floor(y / 10);
  if (x < 0) x = 0;
  if (x > 640) x = 640;
  if (y < 0) y = 0;
  if (y > 480) y = 480;
  this.context.fillStyle = "#000000";
  this.context.fillRect(xx * 10, yy * 10, 10, 10);

  //this.context.translate(-this.player.x, -this.player.y);
  for (var y = 0; y < 48; y++) {
    for (var x = 0; x < 64; x++) {
      this.context.fillStyle = "#ff00ff";
      this.context.fillRect(x * 10 + 1, y * 10 + 1, 8, 8);
    }
  }
  //this.context.translate(this.player.x, this.player.y);

  this.context.fillStyle = "#770077";
  for (var i = 0; i < this.entities.length; i++) {
    this.entities[i].draw(this.context, interpolation);
  }

  this.context.fillStyle = "rgba(0, 0, 0, 0.5)";
  this.player.draw2(this.context, interpolation);
  this.spinner.draw3(this.context, interpolation);
  //this.context.translate(-320, -240);
  //this.context.restore();

  var gradient = this.context.createLinearGradient(50, 50, 50, 150);
  gradient.addColorStop("0", "magenta");
  gradient.addColorStop("0.5", "blue");
  gradient.addColorStop("1", "red");
  this.context.fillStyle = gradient;
  this.context.fillRect(50, 50, 10, 100);

  test.draw(this.context, interpolation);

  this.context.save();
  //this.context.translate(Game.getTime() / 10 % 640 - 500, 0);
  this.context.fillStyle = "#183a9e";
  this.context.fillRect(400, 200, 200, 200);
  this.context.fillStyle = "#0f256e";
  this.context.fillRect(450, 250, 100, 50);
  this.context.fillStyle = "rgba(255, 255, 0, 0.25)";
  //this.context.fillRect(448, 243, 104, 54);
  this.context.fillStyle = "rgba(" + (18 + (Math.random() + 1) * 20) + ", " + (131 + Math.random() * 20) + ", " + (240 + (Math.random() - 1) * 20) + ", 1)";
  this.context.fillRect(450, 245, 100, 50);
  this.context.fillStyle = "#204ecf";
  this.context.fillRect(452, 247, 96, 46);
  this.context.restore();
};

Game.addRect = function() {
  var rect = new Rect();
  rect.vx = Math.random() * 10;
  rect.vy = Math.random() * 10;
  Game.entities.push(rect);
};

Game.initialize();

var i = 10;
while (i--) {
  Game.addRect();
}

var Timer = {
  ticksPerSecond: 20,
  lastSyncTime: Game.getTime(),
  skipTicks: 1000 / Game.fps,
  nextGameTick: Game.getTime(),
  lastTimer: Game.getTime()
};

Timer.update = function() {
  //var now = Game.getTime();
  //var delta = now - this.lastSyncTime;
  //this.lastSyncTime = Game.getTime();
};

Game.run = (function() {
  var loops = 0,
    ticks = 0,
    frames = 0,
    skipTicks = 1000 / Game.fps,
    nextGameTick = window.performance.now(),
    lastTimer = window.performance.now();

  return function() {
    loops = 0;

    //Timer.update();

    //for (var i = 0; i < Timer.elapsedTicks; i++) {
    //  console.log("update");
    //}

    Game.paused = $("#viewport").is(":focus");
    Game.paused = !Game.paused;

    while (Game.getTime() >= nextGameTick) {
      updateStats.update();
      ticks++;
      if (!Game.paused) Game.update();
      nextGameTick += skipTicks;
      loops++;
    }

    renderStats.update();
    frames++;
    if (!Game.paused) Game.draw((Game.getTime() - nextGameTick) / skipTicks);

    if (Game.getTime() - lastTimer > 1000) {
      lastTimer += 1000;
      console.log(ticks + " ticks, " + frames + " fps");
      ticks = 0;
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
