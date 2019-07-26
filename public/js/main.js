$(function() {
  var socket = io.connect();

  socket.on("message-global", function(data) {
    $(".chat-messages").append($("<li>").text(data));
    console.log(data);
  });

  socket.on("message-ingame", function(data) {
  });

  $(".chat-form").submit(function(e) {
    e.preventDefault();
    socket.emit("message-global", $(".message-box").val());
    $(".message-box").val("");
    return false;
  });

  var login = $("#login-wrapper");
  var game = $(".game-container");
  var lobby = $(".lobby-container");
  var chat = $(".chat-container");

  setTimeout(function() {
    login.hide();
    lobby.show();
    showGlobalChat(chat);
    setTimeout(function() {
      lobby.hide();
      game.show();
      showIngameChat(chat);
    }, 1000);
  }, 1000);

  function showGlobalChat(chat) {
    // TODO
    chat.show();
    $(".chat-title").text("Global Chat");
  }

  function showIngameChat(chat) {
    // TODO
    chat.show();
    $(".chat-title").text("Ingame Chat");
  }

  var DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
  }

  var Player = {
    initialize: function() {
      return {
        width: 10,
        height: 10,
        x: 200,
        y: 200,
        direction: DIRECTION.IDLE
      }
    }
  }

  var Game = {
    initialize: function(canvas) {
      this.canvas = canvas;
      this.context = this.canvas.getContext("2d");
      this.canvas.width = 400;
      this.canvas.height = 400;
      this.canvas.style.width = this.canvas.width + "px";
      this.canvas.style.height = this.canvas.height + "px";
      this.running = false;
      this.player = Player.initialize();

      this.menu();
      this.listen();
    },
    menu: function() {
      this.draw();
    },
    update: function() {
      console.log("x: " + this.player.x + ", y: " + this.player.y + ", dir: " + this.player.direction);
    },
    draw: function() {
      this.context.fillStyle = "#FF0000";
      this.context.fillRect(0, 0, 200, 200);
      this.context.fillStyle = "#FFFF00";
      this.context.fillRect(200, 0, 200, 200);
      this.context.fillStyle = "#00FF00";
      this.context.fillRect(0, 200, 200, 200);
      this.context.fillStyle = "#0000FF";
      this.context.fillRect(200, 200, 200, 200);
    },
    loop: function() {
      this.update();
      this.draw();
      requestAnimationFrame(this.loop);
    },
    listen: function() {
      document.addEventListener("keydown", function(key) {
        if (this.running === false) {
          this.running = true;
          window.requestAnimationFrame(this.loop);
        }
        if (key.keyCode === 38 || key.keyCode === 87) Game.player.direction = DIRECTION.UP;
        if (key.keyCode === 40 || key.keyCode === 83) Game.player.direction = DIRECTION.DOWN;
        if (key.keyCode === 37 || key.keyCode === 65) Game.player.direction = DIRECTION.LEFT;
        if (key.keyCode === 39 || key.keyCode === 68) Game.player.direction = DIRECTION.RIGHT;
      });
      document.addEventListener("keyup", function(key) {
        Game.player.direction = DIRECTION.IDLE;
      });
    }
  };

  var Game = Object.assign({}, Game);
  Game.initialize(document.getElementsByTagName("canvas")[0]);
});
