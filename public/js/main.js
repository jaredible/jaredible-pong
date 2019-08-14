"use strict";

$(".test1").hide();

// message: sender, datetime, body
// player: id, username, room
// room: name, players, game
// game: player1, player2, paddle1, paddle2, ball
// paddle: owner, y-position

// players can only control their paddles, so server must handle this, player must know which paddle is theirs

var socket = null;
var thePlayer = null;
var onlinePlayerListItems = new Map();

var loginModal = $("#modal-login");
var loginButton = $("#btn-login");
var loginInput = $("#input-login");

var playerList = $("#list-players");

function sendLoginWithUsername(username) {
  if (socket) {
    socket.emit("login", username);
  }
}

function addLobbyMessage(message) {
}

function addPlayerToLobby(newPlayer) {
  var li = $("<li>");

  newPlayer.listItem = li;
  this.onlinePlayers[newPlayer.username] = newPlayer;
  refreshPlayerUIList();
}

function refreshPlayerUIList() {
}

loginButton.click(function() {
  sendLoginWithUsername(loginInput.val());
});

loginInput.on("keypress", function(e) {
  if (e.which === 13) {
    sendLoginWithUsername(loginInput.val());
  }
});

$(function() {
  socket = io.connect();

  socket.on("loggedOn", function(id, username) {
    thePlayer = new Player(id, username);

    // testing
    socket.emit("joinRoom", "room-test");
    $(".test2").hide();
    $(".test1").show();
  });

  socket.on("newPlayer", function(id, username) {
    let newPlayer = new Player(id, username);
    addPlayerToLobby(newPlayer);
  });

  socket.on("loginError", function() {
  });
});

class Player {
  constructor(id, username) {
    this.id = id;
    this.username = username;
  }

  destroy() {
    this.id = null;
    this.username = null;
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;

    this.context = canvas.getContext("2d");
    this.paddle1 = null;
    this.paddle2 = null;
    this.ball = null;
  }

  draw(dt) {
    this.paddle1.draw(dt);
    this.paddle2.draw(dt);
    this.ball.draw(dt);
  }
}

class Paddle {
  constructor() {
  }

  draw(dt) {
  }
}

class Ball {
  constructor() {
  }

  draw(dt) {
  }
}
