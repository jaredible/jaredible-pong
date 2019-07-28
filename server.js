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

var players = [];
var messages = [];

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

var connections = [];

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
    socket.broadcast.emit('login', username);
  });

  socket.on('lobby-chat', (message) => {
    var today = new Date();
    var message = {
      username: socket.username,
      time: today.getHours() + ":" + today.getMinutes(),
      message: message
    };
    messages.push(message);
    socket.emit('lobby-chat', message);
    socket.broadcast.emit('lobby-chat', message);
  });

  socket.on('disconnect', () => {
    console.log('Connection closed...', socket.id);
    connections.splice(connections.indexOf(socket), 1);
  });
});

server.listen(PORT, () => {
  console.log(`${ENV.charAt(0).toUpperCase() + ENV.substring(1)} server listening at http://localhost:${server.address().port}`);
});
