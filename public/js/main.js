$(function() {
  var socket = io.connect();

  $("#myModal").show();

  $("#login-btn").click(function() {
    var username = $("#username").val();
    if (username !== "") {
      socket.emit("login", $("#username").val());
      $("#username").val("");
      $("#myModal").hide();
      $(".testing").hide();
      $(".container-fluid").removeClass("blur");
    }
  });

  $("#username").on("keypress", function(e) {
    if (e.which == 13) {
      e.preventDefault();
      var username = $("#username").val();
      if (username !== "") {
        socket.emit("login", $("#username").val());
        $("#username").val("");
        $("#myModal").hide();
        $(".testing").hide();
        $(".container-fluid").removeClass("blur");
      }
    }
  });

  $("ul").scrollTop($("ul").height());

  socket.on("login", function(username) {
    $("#test").append($("<li>").append($("<div>").append($("<div>").append($("<i>").addClass("fa").addClass("fa-circle").addClass("online")).addClass("status")).append($("<div>").addClass("form-control").text(username)).append($("<div>").append($("<button>").addClass("btn").addClass("btn-success").text("Invite")).addClass("input-group-append")).append($("<div>").append($("<button>").addClass("btn").addClass("btn-primary").text("Join")).addClass("input-group-append")).addClass("input-group")).addClass("list-group-item").addClass("p-0"));
  });

  socket.on("lobby-chat", function(data) {
    $(".test").append($("<li>").append($("<div>").append($("<h5>").addClass("mb-1").text(data.username)).append($("<small>").addClass("text-muted").text(data.time)).addClass("d-flex").addClass("w-100").addClass("justify-content-between")).append($("<p>").addClass("mb-1").text(data.message)).addClass("list-group-item").addClass("align-items-start"));
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
