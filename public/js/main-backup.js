var thePlayer;
var players = [];

class Test {
  constructor(id) {
    this.id = id;
  }
}

var a = new Test(0);
console.log(a.id);

var socket = io.connect();

$(function() {
  $("#canvas").hide();

  $("#canvas").mouseenter(function() {
    console.log('enter');
  });

  $("#canvas").mouseleave(function() {
    console.log('leave');
  });

  $("#canvas").focus();
  //$("#canvas").blur();

  var i = 0;
  var text = "Username";
  var speed = 50;

  function test() {
    if (i < text.length) {
      $("#loginUsername").attr("placeholder", $("#loginUsername").attr("placeholder") + text.charAt(i++));
      setTimeout(test, speed);
    }
  }
  setTimeout(function() {
    test();
  }, 1000);

  socket.on("player-disconnect", function(player) {
    console.log(player.username + " disconnected");
    $.each(players, function(i, v) {
      if (v.player.username === player.username) {
        v.li.addClass("fadeOut").addClass("faster");
        setTimeout(function() {
          v.li.remove();
        }, 500);
      }
    });
  });

  socket.on("disconnect", function() {
    $("#loginModal").show();
    $(".overlay").show();
    $(".container-fluid").addClass("blur");
    socket.disconnect();
  });

  $("#loginModal").show();

  $("#loginButton").click(function() {
    var username = $("#loginUsername").val();
    if (username !== "") {
      socket.emit("login", $("#loginUsername").val());
      // $("#loginUsername").val("");
    } else {
      $("#loginModal").removeClass("bounceInDown").addClass("shake");
      setTimeout(function() {
        $("#loginModal").removeClass("shake");
      }, 1000);
    }
  });

  $("#play").click(function() {
    console.log("play");
    var play = $("#play");
    var canvas = $("#canvas");
    play.addClass("bounceOutDown");
    setTimeout(function() {
      play.remove();
      canvas.show();
      canvas.focus();
      // play.removeClass("bounceOutDown");
    }, 1000);
  });

  $("#loginUsername").on("keypress", function(e) {
    if (e.which == 13) {
      e.preventDefault();
      var username = $("#loginUsername").val();
      if (username !== "") {
        socket.emit("login", $("#loginUsername").val());
        // $("#loginUsername").val("");
      } else {
        $("#loginModal").removeClass("bounceInDown").addClass("shake");
        setTimeout(function() {
          $("#loginModal").removeClass("shake");
        }, 1000);
      }
    }
  });

  $("ul").scrollTop($("ul").height());

  socket.on("login", function(player) {
    $(".overlay").addClass("fadeOut");
    $(".container-fluid").addClass("blur-test");
    $("#loginModal").removeClass("bounceInDown").addClass("bounceOutDown");
    setTimeout(function() {
      $("#loginUsername").val("");
      $("#loginModal").hide();
      $("#loginModal").removeClass("bounceOutDown");
      $(".overlay").hide();
      $(".overlay").removeClass("fadeOut");
      $(".container-fluid").removeClass("blur");
    }, 1000);
  });

  socket.on("login-error", function(error) {
    $("#loginModal").removeClass("bounceInDown").addClass("shake");
    setTimeout(function() {
      $("#loginModal").removeClass("shake");
    }, 1000);
  });

  socket.on("chat-global", function(messageObj) {
    addMessage(messageObj);
  });

  socket.on("login-new", function(playerObj) {
    addPlayer(playerObj);
  });

  $("#chat-btn").click(function() {
    var message = $("#chat-box").val();
    if (message !== "") {
      socket.emit("chat-global", $("#chat-box").val());
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
        socket.emit("chat-global", $("#chat-box").val());
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

  socket.on("chat-init", function(messageObjs) {
    messageObjs.forEach(function(messageObj) {
      addMessage(messageObj);
    });
  });

  socket.on("players-init", function(players) {
    players.forEach(function(player) {
      addPlayer(player);
    });
  });
});

var messages = [];

function addMessage(messageObj) {
  var ul = $(".test3");
  var li = $("<li>");
  var div = $("<div>");
  var h5 = $("<h5>");
  var small = $("<small>");
  var p = $("<p>");

  li.addClass("list-group-item").addClass("align-items-start").addClass("animated").addClass("fadeIn").addClass("faster");
  div.addClass("d-flex").addClass("w-100").addClass("justify-content-between");
  h5.addClass("mb-1");
  small.addClass("text-muted");
  p.addClass("mb-1");

  h5.text(messageObj.username);
  small.text(messageObj.datetime);
  p.text(messageObj.message);

  ul.append(li.append(div.append(h5).append(small)).append(p));

  setTimeout(function() {
    li.removeClass("fadeIn").removeClass("faster");
  }, 500);

  ul.animate({
    scrollTop: ul.prop("scrollHeight")
  }, 500);

  messages.push(li);
  if (messages.length > 10) {
    messages[0].remove();
    messages.shift();
  }
}

function addPlayer(player) {
  var ul = $("#test");
  var li = $("<li>");
  var inputGroup = $("<div>");
  var status = $("<div>");
  var i = $("<i>");
  var inputGroupJoin = $("<div>");
  var buttonJoin = $("<button>");
  var username = $("<div>");
  var inputGroupInvite = $("<div>");
  var buttonInvite = $("<button>");
  var inputGroupSpectate = $("<div>");
  var buttonSpectate = $("<button>");

  li.addClass("list-group-item").addClass("p-0").addClass("animated").addClass("fadeIn").addClass("faster");
  inputGroup.addClass("input-group");
  status.addClass("status");
  i.addClass("fa").addClass("fa-circle").addClass("online");
  username.addClass("form-control").addClass("pl-0");
  inputGroupJoin.addClass("input-group-append");
  buttonJoin.addClass("btn").addClass("btn-primary");
  inputGroupInvite.addClass("input-group-append");
  buttonInvite.addClass("btn").addClass("btn-success");
  inputGroupSpectate.addClass("input-group-append");
  buttonSpectate.addClass("btn").addClass("btn-info");

  username.text(player.username);
  buttonJoin.text("Join");
  buttonInvite.text("Invite");
  buttonSpectate.text("Spectate");

  buttonJoin.click(function() {
    console.log(player.username);
    socket.emit("test-join", player);
  });

  // ul.append(li.append(inputGroup.append(status.append(i)).append(username).append(inputGroupJoin.append(buttonJoin)).append(inputGroupInvite.append(buttonInvite)).append(inputGroupSpectate.append(buttonSpectate))));
  ul.append(li.append(inputGroup.append(status.append(i)).append(username).append(inputGroupJoin.append(buttonJoin))));

  setTimeout(function() {
    li.removeClass("fadeIn").removeClass("faster");
  }, 500);

  // TODO?
  ul.animate({
    scrollTop: 0
  }, 500);

  var playerObj = {
    player: player,
    li: li
  };

  players.push(playerObj);
}
