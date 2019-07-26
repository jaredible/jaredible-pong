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
app.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));
app.use('/socket.io', express.static(path.join(__dirname, '/node_modules/socket.io-client/dist/')));

app.get('/', (req, res) => {
  res.render('index');
});

var connections = [];

io.on('connection', (socket) => {
  console.log('Connection established...', socket.id);
  connections.push(socket);

  socket.on('message-global', (data) => {
    console.log(data);
    socket.broadcast.emit('message-global', data);
  });

  socket.on('message-ingame', (data) => {
  });

  socket.on('disconnect', () => {
    console.log('Connection closed...', socket.id);
    connections.splice(connections.indexOf(socket), 1);
  });
});

server.listen(PORT, () => {
  console.log(`${ENV.charAt(0).toUpperCase() + ENV.substring(1)} server listening at http://localhost:${server.address().port}`);
});
