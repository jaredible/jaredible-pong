$(function() {
  var socket = io.connect();

  socket.on("player-disconnect", function(username) {
    console.log(username + " disconnected");
  });

  socket.on("disconnect", function() {
    $("#myModal").show();
    $(".testing").show();
    $(".container-fluid").addClass("blur");
  });

  $("#myModal").show();

  $("#login-btn").click(function() {
    var username = $("#username").val();
    if (username !== "") {
      socket.emit("login", $("#username").val());
      // $("#username").val("");
    } else {
      $("#myModal").removeClass("bounceInDown").addClass("shake");
      setTimeout(function() {
        $("#myModal").removeClass("shake");
      }, 1000);
    }
  });

  $("#username").on("keypress", function(e) {
    if (e.which == 13) {
      e.preventDefault();
      var username = $("#username").val();
      if (username !== "") {
        socket.emit("login", $("#username").val());
        // $("#username").val("");
      } else {
        $("#myModal").removeClass("bounceInDown").addClass("shake");
        setTimeout(function() {
          $("#myModal").removeClass("shake");
        }, 1000);
      }
    }
  });

  $("ul").scrollTop($("ul").height());

  socket.on("login", function(username) {
    $(".testing").addClass("fadeOut");
    $(".container-fluid").addClass("blur-test");
    $("#myModal").removeClass("bounceInDown").addClass("bounceOutDown");
    setTimeout(function() {
      $("#username").val("");
      $("#myModal").hide();
      $("#myModal").removeClass("bounceOutDown");
      $(".testing").hide();
      $(".testing").removeClass("fadeOut");
      $(".container-fluid").removeClass("blur");
    }, 1000);
  });

  socket.on("new-player", function(username) {
    $("#test").append($("<li>").append($("<div>").append($("<div>").append($("<i>").addClass("fa").addClass("fa-circle").addClass("online")).addClass("status")).append($("<div>").addClass("form-control").text(username)).append($("<div>").append($("<button>").addClass("btn").addClass("btn-success").text("Invite")).addClass("input-group-append")).append($("<div>").append($("<button>").addClass("btn").addClass("btn-primary").text("Join")).addClass("input-group-append")).addClass("input-group")).addClass("list-group-item").addClass("p-0"));
  });

  socket.on("lobby-chat", function(data) {
    var item = $("<li>");
    $(".test3").append(item.append($("<div>").append($("<h5>").addClass("mb-1").text(data.username)).append($("<small>").addClass("text-muted").text(data.time)).addClass("d-flex").addClass("w-100").addClass("justify-content-between")).append($("<p>").addClass("mb-1").text(data.message)).addClass("list-group-item").addClass("align-items-start").addClass("animated").addClass("fadeIn").addClass("faster"));
    setTimeout(function() {
      item.removeClass("fadeIn").removeClass("faster");
    }, 1000);
    $("ul").scrollTop($("ul").height()); // TODO
  });

  $("#chat-btn").click(function() {
    var message = $("#chat-box").val();
    if (message !== "") {
      socket.emit("lobby-chat", $("#chat-box").val());
      $("#chat-box").val("");
      // $("#chat-box").focus();
    }
  });

  $("#chat-box").on("keypress", function(e) {
    if (e.which == 13) {
      e.preventDefault();
      var message = $("#chat-box").val();
      if (message !== "") {
        socket.emit("lobby-chat", $("#chat-box").val());
        $("#chat-box").val("");
      }
    }
  });
});
