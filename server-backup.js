const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

var connections = [];
var sockets = {};
var players = [];
var messages = [];

io.on('connection', (socket) => {
  console.log('A user connected!', socket.id);
  connections.push(socket);

  socket.emit('chat-init', messages);
  socket.emit('players-init', players);

  socket.on('login', (username) => {
    if (util.findIndex(players, username) > -1) {
      socket.emit('login-error', 'Username taken!');
    } else if (!util.validUsername(username)) {
      socket.emit('login-error', 'Invalid username!');
    } else {
      var player = {
        id: socket.id,
        username: username
      };
      players.push(player);
      socket.player = player;

      socket.emit('login', player);
      socket.broadcast.emit('login-new', player);
    }
  });

  socket.on('chat-global', (message) => {
    var today = new Date();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    var hour = today.getHours();
    var minute = today.getMinutes();
    var hourFormatted = hour % 12 || 12;
    var minuteFormatted = minute < 10 ? '0' + minute : minute;
    var morning = hour < 12 ? 'AM' : 'PM';

    var messageObj = {
      id: messages.length,
      username: socket.player.username,
      datetime: month + '/' + day + ' ' + hourFormatted + ':' + minuteFormatted + ' ' + morning,
      message: message
    };

    messages.push(messageObj);
    if (messages.length > 10) {
      messages.shift();
    }

    io.emit('chat-global', messageObj); // TODO io.emit()
  });

  socket.on('test-join', (player) => {
    console.log(socket.player.username + ' wants to join ' + player.username);
  });

  socket.on('disconnect', () => {
    console.log('Connection closed...', socket.id);
    connections.splice(connections.indexOf(socket), 1);
    players.splice(players.indexOf(socket.player), 1);
    socket.broadcast.emit('player-disconnect', socket.player);
  });
});

const HOST = process.env.HOST || config.server.host;
const PORT = process.env.PORT || config.server.port;
const ENV = app.get('env');
server.listen(PORT, HOST, () => {
  console.log(`[DEBUG] ${ENV.charAt(0).toUpperCase() + ENV.substring(1)} game server listening on http://${server.address().address}:${server.address().port}`);
});
