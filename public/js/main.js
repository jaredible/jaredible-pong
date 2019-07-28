$(function() {
  var socket = io.connect();

  var i = 0;
  var text = "Username";
  var speed = 50;
  function test() {
    if (i < text.length) {
      $("#username").attr("placeholder", $("#username").attr("placeholder") + text.charAt(i++));
      setTimeout(test, speed);
    }
  }
  setTimeout(function() {
    test();
  }, 1000);

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
    } else {
      $("#chat-box").focus();
      $("#chat-form").addClass("shake");
      setTimeout(function() {
        $("#chat-form").removeClass("shake");
      }, 1000);
    }
  });

  $("#chat-box").on("keypress", function(e) {
    if (e.which == 13) {
      e.preventDefault();
      var message = $("#chat-box").val();
      if (message !== "") {
        socket.emit("lobby-chat", $("#chat-box").val());
        $("#chat-box").val("");
      } else {
        $("#chat-form").addClass("shake");
        setTimeout(function() {
          $("#chat-form").removeClass("shake");
        }, 1000);
      }
    }
  });

  $(".thetest").click(function() {
    var chat = $("#wrapper1");
    var players = $("#wrapper2");
    var games = $("#wrapper3");
    games.addClass("zoomOutRight").addClass("faster");
    chat.addClass("zoomOutLeft").addClass("faster");
    players.addClass("zoomOut").addClass("faster");
    $("#title1").addClass("zoomOutUp").addClass("faster");
    $("#title2").addClass("zoomOutUp").addClass("faster");
    $("#title3").addClass("zoomOutUp").addClass("faster");
    $("#chat-form").addClass("zoomOutDown").addClass("faster");
    setTimeout(function() {
      $("#games").removeClass("col-md-4").addClass("col-md-3");
      games.removeClass("zoomOutRight").addClass("zoomInRight");
      setTimeout(function() {
        games.removeClass("zoomInRight").removeClass("faster");
      }, 1000);
      $("#chat").removeClass("col-md-4").addClass("col-md-3");
      chat.removeClass("zoomOutLeft").addClass("zoomInLeft");
      setTimeout(function() {
        chat.removeClass("zoomInLeft").removeClass("faster");
      }, 1000);
      $("#players").removeClass("col-md-4").addClass("col-md-3");
      players.removeClass("zoomOut").addClass("zoomIn");
      setTimeout(function() {
        players.removeClass("zoomIn").removeClass("faster");
      }, 1000);
      $("#chat-form").removeClass("zoomOutDown").addClass("zoomInDown");
      setTimeout(function() {
        $("#chat-form").removeClass("zoomInDown").removeClass("faster");
      }, 1000);
      $("#players").removeClass("col-md-4").addClass("col-md-6");
      $("#wrapper2").html("");

      // titles
      $("#title1").removeClass("zoomOutUp").addClass("zoomInUp");
      setTimeout(function() {
        $("#title1").removeClass("zoomInUp").removeClass("faster");
      }, 1000);
      $("#title2").removeClass("zoomOutUp").addClass("zoomInUp");
      $("#title2").text("Game");
      setTimeout(function() {
        $("#title2").removeClass("zoomInUp").removeClass("faster");
      }, 1000);
      $("#title3").removeClass("zoomOutUp").addClass("zoomInUp");
      $("#title3").text("Perks");
      $("#wrapper3").html("");
      setTimeout(function() {
        $("#title3").removeClass("zoomInUp").removeClass("faster");
      }, 1000);
    }, 1000);
  });
});
