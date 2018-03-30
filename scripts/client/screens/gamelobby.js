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
					<input type="text" id="msg" name="msg">
					<button id="msg-enter-btn">Chat</button>
				</div>
			</div>
			<div id="lobby-body">
				<div id="lobby-announcements">
					<ul id="announce-tag"></ul>
				</div>
				<div id="exit-lobby">
    		  <ul class = "menu">
       			<li><button id = "id-gamelobby-back">Back</button></li>
      		</ul>
				</div>
			</div>
			</div>
   	  `
		);

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
		document.getElementById('msg-enter-btn').addEventListener(
			'click',
			function() {
				let user = Game.user.username;
				socket.emit(NetworkIds.CHAT_MESSAGE, user, $('#msg').val());
				$('#msg').val('');				
		});
	
		//----------------------------------------------------------
		// Receive server response to CHAT_MESSAGE
		//----------------------------------------------------------
		socket.on(NetworkIds.CHAT_MESSAGE, function(user, msg) {
			$('#messages').append($('<li>').text(user, msg));
			let scroller = document.getElementById('read-messages');
			scroller.scrollTop = scroller.scrollHeight;	
		});

		//----------------------------------------------------------
		// User enters lobby
		//----------------------------------------------------------
		socket.on(NetworkIds.ENTER_LOBBY, function(users) {	
			$('#announce-tag').append($('<li>').text("user connected... users in lobby: " + users));
			let scroller = document.getElementById('lobby-announcements');
			scroller.scrollTop = scroller.scrollHeight;
		});

		//----------------------------------------------------------
		// User leaves lobby
		//----------------------------------------------------------
		socket.on(NetworkIds.LEAVE_LOBBY, function(users) {
			$('#announce-tag').append($('<li>').text("user disconnected... users in lobby: " + users));
			let scroller = document.getElementById('lobby-announcements');
			scroller.scrollTop = scroller.scrollHeight;
		});

	}

  function run() {
    socket.emit(NetworkIds.ENTER_LOBBY);
  }

  return {
    initialize,
    run
  };

}(Game.menu, Game.network.socket));
