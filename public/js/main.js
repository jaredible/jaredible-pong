$(function() {
  var socket = io.connect();

  $("#myModal").show();

  var login = $("#login");

  login.submit(function(e) {
    e.preventDefault();
    socket.emit("login", $("#username").val());
    $("#username").val("");
    $("#myModal").hide();
    $(".testing").hide();
    $(".container-fluid").removeClass("blur");
    return false;
  });

  $("ul").scrollTop($("ul").height());

  socket.on("login", function(username) {
    var item = $("#test");
    item.append($("<li>").append($("<div>").append($("<div>").addClass("form-control").text(username)).addClass("input-group")).addClass("list-group-item").addClass("p-0"));
    console.log(data);
  });

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
});
