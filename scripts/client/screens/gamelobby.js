Game.screens['gamelobby'] = (function(menu, socket) {
  'use strict';

  function initialize() {
    menu.addScreen('gamelobby',
      `
      <div id="lobby-container">
      <div id="message-body">
        <div id="read-messages">
          <ul id="messages"></ul>
        </div>
        <div id="enter-messages">
          <p id="char-count" style="font-size:10px; text-align: left;">Char Count: 0/300</p>
          <form action="" style="position-bottom=0">
            <input type="text" id="msg" name="msg" autocomplete="off" />
            <button id="msg-enter-btn">Chat</button>
          </form>
        </div>
      </div>
      <div id="lobby-body">
        <div id="lobby-announcements">
          <ul id="announce-tag"></ul>
        </div>
        <div id="lobby-users">
          <p style="font-size:14px; text-align: center;">Users Currently Connected</p>
          <ul id="users-tag"></ul>
        </div>
        <div id="exit-lobby">
          <ul class = "menu">
            <li><p id="timer" style="font-size:14px; text-align:center;">Timer: 0.0 sec</p>
            <li><button id = "id-gamelobby-back">Back</button></li>
          </ul>
        </div>
      </div>
      </div>
      `
    );

    const MAX_MSG = 500;   // so not too many messages in the scroller
    var message_count = 0; // current message count being displayed

    //----------------------------------------------------------
    // Go Back to Menu
    //----------------------------------------------------------
    document.getElementById('id-gamelobby-back').addEventListener(
      'click',
      function() {
        socket.emit(NetworkIds.LEAVE_LOBBY);
        menu.showScreen('main-menu');
      });

    //----------------------------------------------------------
    // Send server CHAT_MESSAGE
    //----------------------------------------------------------
    $('form').submit(function(){
      socket.emit(NetworkIds.CHAT_MESSAGE, $('#msg').val());
      $('#msg').val('');
      document.getElementById('char-count').innerHTML = 'Char Count: 0/300';
      return false;
    });

    //----------------------------------------------------------
    // dynamic character count
    //----------------------------------------------------------
    document.getElementById('msg').onkeyup = function(/* e */) {
      document.getElementById('char-count').innerHTML = 'Char Count: ' + this.value.length + '/300';
    };

    //----------------------------------------------------------
    // Receive server response to CHAT_MESSAGE
    //----------------------------------------------------------
    socket.on(NetworkIds.CHAT_MESSAGE, function(user, msg) {
      message_count++;
      if (message_count > MAX_MSG) {
        $('#messages li:first').remove();
        message_count--;
      }
      $('#messages').append($('<li>').text(user, msg));
      let scroller = document.getElementById('read-messages');
      scroller.scrollTop = scroller.scrollHeight;
    });

    //----------------------------------------------------------
    // clear chat messages
    //----------------------------------------------------------
    socket.on(NetworkIds.CLEAR_CHAT_MESSAGE, function() {
      $('#messages').empty();
      message_count = 0;
    });

    //----------------------------------------------------------
    // clear chat messages
    //----------------------------------------------------------
    socket.on(NetworkIds.LONG_CHAT_MESSAGE, function(len, msg) {
      alert('Chat message was too long at ' + len + '/300 characters.');
      $('#msg').val(msg);
    });

    //----------------------------------------------------------
    // User enters lobby
    //----------------------------------------------------------
    socket.on(NetworkIds.ENTER_LOBBY, function(number, user) {
      $('#announce-tag').append($('<li>').text(user + ' connected... users in lobby: ' + number));
      let scroller = document.getElementById('lobby-announcements');
      scroller.scrollTop = scroller.scrollHeight;
      socket.emit(NetworkIds.REQUEST_USERS);
    });

    //----------------------------------------------------------
    // User leaves lobby
    //----------------------------------------------------------
    socket.on(NetworkIds.LEAVE_LOBBY, function(number, user) {
      $('#announce-tag').append($('<li>').text(user + ' disconnected... users in lobby: ' + number));
      let scroller = document.getElementById('lobby-announcements');
      scroller.scrollTop = scroller.scrollHeight;
      socket.emit(NetworkIds.REQUEST_USERS);
    });

    //----------------------------------------------------------
    // request user list from server
    //----------------------------------------------------------
    socket.on(NetworkIds.REQUEST_USERS, function(user_list) {
      $('#users-tag').empty();
      for (let i = 0; i < user_list.length; i++) {
        let val = user_list[i];
        $('#users-tag').append($('<li id=user-' + val +'>').text(val));
      }
    });

    function timer(time, lastTime) {
      let newTime = performance.now();
      time -= newTime - lastTime;
      document.getElementById('timer').innerHTML = 'Timer: ' + (time/1000).toFixed(1) + ' sec';

      if (time > 0)
        requestAnimationFrame(() => timer(time, newTime));
    }

    //----------------------------------------------------------
    // on countdown start
    //----------------------------------------------------------
    socket.on(NetworkIds.START_TIMER, function(time) {
      $('#announce-tag').append($('<li>').text('!!'));
      $('#announce-tag').append($('<li>').text('!! game starting soon !!'));
      $('#announce-tag').append($('<li>').text('!!'));
      timer(time, performance.now());
    });

    //----------------------------------------------------------
    // request timer update from server
    //----------------------------------------------------------
    socket.on(NetworkIds.REQUEST_TIMER, function(time) {
      document.getElementById('timer').innerHTML = 'Timer: ' + (time/1000).toFixed(1) + ' sec';
      socket.emit(NetworkIds.REQUEST_TIMER);
    });

    //----------------------------------------------------------
    // change to gameplay when timer reaches 0
    //----------------------------------------------------------
    socket.on(NetworkIds.ENTER_MAP, function() {
      document.getElementById('timer').innerHTML = 'Timer: 0.0 sec';
      //menu.showScreen('gameplay');
      $('#messages').empty();
      $('#announce-tag').empty();
      menu.showScreen('map');
    });
  }

  function run() {
    socket.emit(NetworkIds.ENTER_LOBBY);
    $('#announce-tag').append($('<li>').text('!!'));
    $('#announce-tag').append($('<li>').text('!! Welcome to the Lobby Chat !!'));
    $('#announce-tag').append($('<li>').text('!! type \'clear\' to clear messages !!'));
    $('#announce-tag').append($('<li>').text('!!'));
  }

  return {
    initialize,
    run
  };

}(Game.menu, Game.network.socket));
