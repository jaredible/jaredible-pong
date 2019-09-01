'use strict';

const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const chalk = require('chalk');
const device = require('express-device');
const config = require('./config');

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use('/socket.io', express.static(path.join(__dirname, '/node_modules/socket.io-client/dist/')));
app.use(device.capture());

var players = new Map();
var messages = [];

app.get('/', (req, res) => {
  res.render('index', {
    title: 'DEFAULT TITLE',
    motd: 'DEFAULT MOTD'
  });
});

io.on('connection', (socket) => {
  console.log(chalk.cyan('[DEBUG] A user connected with ID ' + socket.id));

  socket.on('login', (username) => {
    if (!username) {
      socket.emit('loginError', 'username empty');
    } else if (!validUsername(username)) {
      socket.emit('loginError', 'username invalid');
    } else if (usernameTaken(username)) {
      socket.emit('loginError', 'username taken');
    } else {
      let newPlayer = new Player(socket, username);
      players.set(username, newPlayer);
      socket.player = newPlayer;
      let newPlayerObj = {
        username: newPlayer.username,
        score: newPlayer.score
      };
      socket.emit('loggedOn', newPlayerObj);
      socket.broadcast.emit('newPlayer', newPlayerObj);
      console.log(chalk.cyan('[DEBUG] Player \'' + newPlayer.username + '\' logged on'));
    }
  });

  socket.on('chat', (message) => {
    var today = new Date();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    var hour = today.getHours();
    var minute = today.getMinutes();
    var hourFormatted = hour % 12 || 12;
    var minuteFormatted = minute < 10 ? '0' + minute : minute;
    var morning = hour < 12 ? 'AM' : 'PM';

    var messageObj = {
      username: socket.player.username,
      datetime: month + '/' + day + ' ' + hourFormatted + ':' + minuteFormatted + ' ' + morning,
      message: message
    };
    messages.push(messageObj);
    if (messages.length > 100) {
      messages.shift();
    }
    io.emit('newMessage', messageObj);
  });

  socket.on('search', () => {
    console.log('here');
    socket.emit('gameFound');
  });

  socket.on('syncChat', () => {
    socket.emit('syncChat', messages);
  });

  socket.on('syncPlayers', () => {
    var playerList = [];

    players.forEach((value, key) => {
      playerList.push({
        username: key,
        score: value.score
      });
    });

    socket.emit('syncPlayers', playerList);
  });

  socket.on('disconnect', () => {
    if (socket.player) {
      console.log(chalk.cyan('[DEBUG] Player \'' + socket.player.username + '\' disconnected'));
      socket.broadcast.emit('playerDisconnected', socket.player.username);
      players.delete(socket.player.username);
      socket.player.destroy();
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
  constructor(socket, username) {
    this.socket = socket;
    this.username = username;

    this.score = 0;
  }

  destroy() {
    this.socket = null;
    this.username = null;
    this.score = null;
  }
}

function validUsername(username) {
  return /^\w*$/.exec(username) !== null;
}

function usernameTaken(username) {
  return players.has(username);
}
