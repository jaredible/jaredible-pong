$(function() {
  var socket = io.connect();

  $("#myModal").show();

  $("#login-btn").click(function() {
    socket.emit("login", $("#username").val());
    $("#username").val("");
    $("#myModal").hide();
    $(".testing").hide();
    $(".container-fluid").removeClass("blur");
  });

  $("ul").scrollTop($("ul").height());

  socket.on("login", function(username) {
    var item = $("#test");
    item.append($("<li>").append($("<div>").append($("<div>").addClass("form-control").text(username)).addClass("input-group")).addClass("list-group-item").addClass("p-0"));
    console.log(username);
  });

  socket.on("lobby-chat", function(data) {
    $(".test").append($("<li>").append($("<div>").append($("<h5>").addClass("mb-1").text(data.username)).append($("<small>").addClass("text-muted").text(data.time)).addClass("d-flex").addClass("w-100").addClass("justify-content-between")).append($("<p>").addClass("mb-1").text(data.message)).addClass("list-group-item").addClass("align-items-start"));
    console.log(data.username);
    $("ul").scrollTop($("ul").height());
  });

  $("#chat-btn").click(function() {
    socket.emit("lobby-chat", $("#chat-box").val());
    $("#chat-box").val("");
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
});
