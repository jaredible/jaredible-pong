const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = process.env.port || 3000;
const ENV = app.get('env');

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use('/socket.io', express.static(path.join(__dirname, '/node_modules/socket.io-client/dist/')));

var connections = [];
var players = [];
var messages = [];
var games = [];

app.get('/', (req, res) => {
  res.render('index', {
    messages: messages,
    players: players
  });
});

app.get('/lobby', (req, res) => {
  res.render('lobby');
});

app.get('/game', (req, res) => {
  res.render('game');
});

app.get('/login', (req, res) => {
  res.render('login');
});

io.on('connection', (socket) => {
  console.log('Connection established...', socket.id);
  connections.push(socket);

  socket.on('login', (username) => {
    socket.username = username;
    var player = {
      id: socket.id,
      username: username
    };
    players.push(player);
    socket.emit('login', username);
    socket.broadcast.emit('new-player', username);
  });

  socket.on('lobby-chat', (message) => {
    var today = new Date();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    var hour = today.getHours();
    var minute = today.getMinutes();
    var hourFormatted = hour % 12 || 12;
    var minuteFormatted = minute < 10 ? '0' + minute : minute;
    var morning = hour < 12 ? 'AM' : 'PM';
    var message = {
      username: socket.username,
      time: hourFormatted + ':' + minuteFormatted + ' ' + morning + ' ' + month + '/' + day,
      message: message
    };
    messages.push(message);
    socket.emit('lobby-chat', message);
    socket.broadcast.emit('lobby-chat', message);
  });

  socket.on('disconnect', () => {
    console.log('Connection closed...', socket.id);
    connections.splice(connections.indexOf(socket), 1);
    socket.broadcast.emit('player-disconnect', socket.username);
  });
});

server.listen(PORT, () => {
  console.log(`${ENV.charAt(0).toUpperCase() + ENV.substring(1)} server listening at http://localhost:${server.address().port}`);
});
