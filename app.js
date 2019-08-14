'use strict';

const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const chalk = require('chalk');
const config = require('./config');

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use('/socket.io', express.static(path.join(__dirname, '/node_modules/socket.io-client/dist/')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/test', (req, res) => {
  res.render('test');
});

var onlinePlayers = new Map();
var gameRooms = new Map();

io.on('connection', (socket) => {
  console.log(chalk.cyan('[DEBUG] A user connected with ID ' + socket.id));

  socket.on('login', function(username) {
    if (!validUsername(username)) {
      socket.emit('loginError');
    } else if (usernameTaken(username)) {
      socket.emit('loginError');
    } else {
      let newPlayer = new Player(socket, username, 'room-' + username);
      onlinePlayers.set(username, newPlayer);
      socket.player = newPlayer;
      socket.emit('loggedOn', newPlayer.id, newPlayer.username);
      socket.broadcast.emit('newPlayer', newPlayer.id, newPlayer.username);
      console.log(chalk.cyan('[DEBUG] Player \'' + newPlayer.username + '\' logged in'));
    }
  });

  socket.on('joinRoom', function(roomName) {
    if (!gameRooms.has(roomName)) { // if GameRoom doesn't exist
      let gameRoom = new GameRoom(roomName); // create it
      gameRooms.set(roomName, gameRoom); // store it
    }
    if (!socket.player.joinRoom(gameRooms.get(roomName))) {
      // join error
    }
  });

  socket.on('leaveRoom', function(roomName) {
    if (!socket.player.leaveRoom()) {
      // leave error
    } else {
      if (gameRooms.get(roomName).empty()) { // if GameRoom is empty
        gameRooms.get(roomName).destroy(); // clean up
        gameRooms.delete(roomName); // delete GameRoom
      }
    }
  });

  socket.on('disconnect', () => { // TODO
    if (socket.player) {
      console.log(chalk.cyan('[DEBUG] Player \'' + socket.player.username + '\' disconnected'));
      socket.player.leaveRoom();
      socket.broadcast.emit('playerDisconnected', socket.player.username); // notify others
      onlinePlayers.delete(socket.player.username); // delete player
      socket.player.destroy(); // clean up
      socket.player = null;
    } else {
      console.log(chalk.cyan('[DEBUG] A user disconnected with ID ' + socket.id));
    }
  });
});

const HOST = process.env.HOST || config.host;
const PORT = process.env.PORT || config.port;
const ENV = app.get('env');
server.listen(PORT, HOST, () => {
  console.log(`[DEBUG] ${ENV.charAt(0).toUpperCase() + ENV.substring(1)} app listening on http://${server.address().address}:${server.address().port}`);
});

class Player {
  constructor(socket, username, roomName) {
    this.socket = socket;
    this.username = username;
    this.roomName = roomName;

    this.gameRoom = null;
    this.score = 0;
  }

  joinRoom(gameRoom) {
    if (this.gameRoom) {
      console.log(chalk.red('[DEBUG] Player \'' + this.username + '\' is already in a room'));
      return false;
    } else {
      this.gameRoom = gameRoom;
      this.gameRoom.addPlayer(this);
      this.socket.join(gameRoom.roomName);
      this.socket.to(gameRoom.roomName).emit('playerJoined', this.username);
      console.log(chalk.cyan('[DEBUG] Player \'' + this.username + '\' joined room \'' + this.gameRoom.roomName + '\''));
      return true;
    }
  }

  leaveRoom() {
    if (!this.gameRoom) {
      console.log(chalk.red('[DEBUG] Player \'' + this.username + '\' is not in a room'));
      return false;
    } else {
      console.log(chalk.cyan('[DEBUG] Player \'' + this.username + '\' left room \'' + this.gameRoom.roomName + '\''));
      this.socket.leave(this.gameRoom.roomName);
      this.socket.to(this.gameRoom.roomName).emit('playerLeft', this.username);
      this.gameRoom.removePlayer(this);
      this.gameRoom = null;
      return true;
    }
  }

  destroy() {
    this.socket = null;
    this.username = null;
    this.roomName = null;
    this.gameRoom = null;
    this.score = null;
  }
}

class GameRoom {
  constructor(roomName) {
    this.roomName = roomName;

    this.player1 = null;
    this.player2 = null;
    this.paddle1 = null;
    this.paddle2 = null;
    this.ticks = 0;
  }

  addPlayer(player) {
    if (this.player1 === null) {
      this.player1 = player;
      this.paddle1 = new Paddle(this.player1);
    } else if (this.player2 === null) {
      this.player2 = player;
      this.paddle2 = new Paddle(this.player2);
    }
  }

  removePlayer(player) {
    if (player.username === this.player1.username) {
      if (this.player2) {
        this.player2.leaveRoom();
      }
      this.player1 = null;
    } else if (player.username === this.player2.username) {
      this.player2 = null;
    }
  }

  start() {
  }

  update(dt) {
    this.ticks++;
    console.log(this.ticks);
  }

  end() {
  }

  destroy() {
    this.room = null;
    this.paddle1 = null;
    this.paddle2 = null;
  }

  empty() {
    return this.player1 === null && this.player2 === null;
  }
}

var DIRECTION = {
  IDLE: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4
};

class Paddle {
  constructor(player) {
    this.player = player;

    this.pos = 'start';
    this.direction = DIRECTION.IDLE;
  }

  update() {
  }

  move() {
  }

  destroy() {
  }
}

class Ball {
  constructor() {
  }

  update() {
  }

  move() {
  }

  destroy() {
  }
}

class Room {
  constructor(name) {
    this.name = name;

    this.game = null;
    this.player1 = null;
    this.player2 = null;
  }

  addPlayer(player) {
    if (this.player1 === null) {
      this.player1 = player;
      setupGame();
    } else if (this.player2 === null) {
      this.player2 = player;
    }
  }

  removePlayer(player) {
    if (player.username === this.player1.username) {
      this.player2.leaveRoom();
      this.player1 = null;
    } else if (player.username === this.player2.username) {
      this.player2 = null;
    }
  }

  setupGame() {
    this.game = new Game(this);
  }

  startGame() {
  }

  updateGame() {
    this.game.update();
  }

  endGame() {
  }

  destroy() {
    this.name = null;
    this.game = null;
    this.player1 = null;
    this.player2 = null;
  }

  empty() {
    return this.player1 === null && this.player2 === null;
  }
}

function validUsername(username) {
  return /^\w*$/.exec(username) !== null;
}

function usernameTaken(username) {
  return onlinePlayers.has(username);
}

function updateGameRooms() {
  gameRooms.forEach((gameRoom, roomName) => {
    gameRoom.update(0);
  });
}

setInterval(updateGameRooms, 1000);
