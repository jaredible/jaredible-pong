var overlay = $("#overlay");
var theContainer = $("#the-container");
var modalLogin = $("#modal-login");
var btnLogin = $("#btn-login");
var inputLogin = $("#input-login");
var formChat = $("#form-chat");
var btnChat = $("#btn-chat");
var inputChat = $("#input-chat");
var btnPlay = $("#btn-play");
var viewport = $("#viewport");
var socket = null;
var thePlayer = null;
var players = {};
var messages = [];

function showLogin() {
  overlay.show();
  modalLogin.show();
  theContainer.addClass("blur");
  if (socket) {
    socket.disconnect();
  }
}

function hideLogin() {
  overlay.addClass("fadeOut");
  theContainer.addClass("blur-test");
  modalLogin.removeClass("bounceInDown").addClass("bounceOutDown");
  setTimeout(function() {
    inputLogin.val("");
    modalLogin.hide();
    modalLogin.removeClass("bounceOutDown");
    overlay.hide();
    overlay.removeClass("fadeOut");
    theContainer.removeClass("blur");
    inputChat.focus();
  }, 1000);
}

function showMenu() {
}

function hideMenu() {
}

function showLoading() {
  hideMenu();
}

function hideLoading() {
}

function cancelLoading() {
  hideLoading();
  setTimeout(function() {
    showMenu();
  }, 1000);
}

function showGame() {
  hideLoading();
}

function hideGame() {
  showMenu();
}

function addMessageToUIList(message) {
  var ul = $(".test3");
  var li = $("<li>");
  var div = $("<div>");
  var h5 = $("<h5>");
  var small = $("<small>");
  var p = $("<p>");

  li.addClass("list-group-item").addClass("align-items-start").addClass("p-2").addClass("animated").addClass("fadeIn").addClass("faster");
  div.addClass("d-flex").addClass("w-100").addClass("justify-content-between");
  h5.addClass("mb-0");
  small.addClass("text-muted");
  p.addClass("mb-0").css("word-wrap", "break-word");

  h5.text(message.username);
  small.text(message.datetime);
  p.text(message.message);

  ul.append(li.append(div.append(h5).append(small)).append(p));

  setTimeout(function() {
    li.removeClass("fadeIn").removeClass("faster");
  }, 500);

  ul.animate({
    scrollTop: ul.prop("scrollHeight")
  }, 500);

  return li;
}

function onNewMessage(message) {
  console.log(message);
  var li = addMessageToUIList(message);
  message.li = li;
  messages.push(message);
  if (messages.length > 100) {
    messages[0].li.remove();
    messages.shift();
  }
}

function sendMessage(message) {
  if (socket !== null) {
    socket.emit("chat", message);
  }
}

function onLoginError(error) {
  console.log(error);
  inputLogin.focus();
  modalLogin.removeClass("bounceInDown").addClass("shake");
  setTimeout(function() {
    modalLogin.removeClass("shake");
  }, 1000);
}

function addPlayerToUIList(player) {
  var ul = $("#test");
  var li = $("<li>");
  var div1 = $("<div>");
  var h5 = $("<h5>");
  var status = $("<div>");
  var i = $("<i>");
  var div2 = $("<div>");

  li.addClass("list-group-item").addClass("p-0").addClass("animated").addClass("fadeIn").addClass("faster");
  div1.addClass("d-flex").addClass("w-100").addClass("justify-content-between").addClass("align-middle");
  h5.addClass("mb-1").addClass("mt-1").addClass("ml-1").addClass("mr-1").addClass("pl-0").addClass("text-dark").addClass("d-flex").addClass("align-middle");
  status.addClass("status").addClass("d-flex").addClass("align-middle");
  i.addClass("fa").addClass("fa-circle").addClass("online");
  div2.addClass("mb-1").addClass("mt-1").addClass("ml-1").addClass("mr-1").addClass("d-flex").addClass("text-muted");

  ul.append(li.append(div1.append(h5.append(status.append(i)).append(player.username)).append(div2.append(player.score))));

  setTimeout(function() {
    li.removeClass("fadeIn").removeClass("faster");
  }, 500);

  ul.animate({
    scrollTop: 0
  }, 500);

  return li;
}

function removePlayerFromUIList(username) {
  console.log(username + " disconnected");
  players[username].li.addClass("fadeOut");
  setTimeout(function() {
    players[username].li.remove();
    delete players[username];
  }, 1000);
}

function onNewPlayer(player) {
  player.li = addPlayerToUIList(player);
  players[player.username] = player;
}

function joinGame() {
  showGame();
  console.log("here");
}

function onLogin(player) {
  thePlayer = player;
  if (socket !== null) {
    socket.emit("syncChat");
    socket.emit("syncPlayers");
    socket.on("syncChat", function(messages) {
      for (var i = 0; i < messages.length; i++) {
        addMessageToUIList(messages[i]);
      }
    });
    socket.on("syncPlayers", function(players) {
      for (var i = 0; i < players.length; i++) {
        if (player.username !== players[i].username) {
          addPlayerToUIList(players[i]);
        }
      }
    });
    socket.on("newPlayer", function(player) {
      onNewPlayer(player);
    });
    socket.on("newMessage", function(message) {
      onNewMessage(message);
    });
    socket.on("gameFound", function() {
      joinGame();
    });
    socket.on("disconnect", function() {
      showLogin();
    });
    socket.on("playerDisconnected", function(username) {
      removePlayerFromUIList(username);
    });
  }
  hideLogin();
  setTimeout(function() {
    showMenu();
  }, 1000);
}

function submitLogin(username) {
  if (socket === null) {
    socket = io.connect();
    socket.on("loginError", function(error) {
      onLoginError(error);
    });
    socket.on("loggedOn", function(player) {
      onLogin(player);
    });
  }
  socket.emit("login", username);
}

function loginAction() {
  var username = inputLogin.val();
  submitLogin(username);
}

btnLogin.click(function() {
  loginAction();
});

inputLogin.on("keypress", function(e) {
  if (e.which === 13) {
    e.preventDefault();
    loginAction();
  }
});

function messageAction() {
  var message = inputChat.val();
  if (message) {
    sendMessage(inputChat.val());
    inputChat.val("");
  } else {
    inputChat.focus();
    formChat.addClass("shake");
    setTimeout(function() {
      formChat.removeClass("shake");
    }, 1000);
  }
}

btnChat.click(function() {
  messageAction();
});

inputChat.on("keypress", function(e) {
  if (e.which === 13) {
    e.preventDefault();
    messageAction();
  }
});

function findGame() {
  socket.emit("search");
  showLoading();
}

btnPlay.click(function() {
  console.log("play");
  findGame();
});

$(function() {
  $(".test3").animate({
    scrollTop: $(".test3").prop("scrollHeight")
  }, 500);
});
