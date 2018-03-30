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

		var users = {};

		//----------------------------------------------------------
		// Go Back to Menu
		//----------------------------------------------------------
    document.getElementById('id-gamelobby-back').addEventListener(
      'click',
      function() { 
				socket.emit(NetworkIds.LEAVE_LOBBY, Game.user.username, socket.id);	
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
		socket.on(NetworkIds.ENTER_LOBBY, function(number, user) {	
			$('#announce-tag').append($('<li>').text(user + " connected... users in lobby: " + number));
			$('#users-tag').append($('<li id=user-' + user +'>').text(user));
			let scroller = document.getElementById('lobby-announcements');
			scroller.scrollTop = scroller.scrollHeight;
		});

		//----------------------------------------------------------
		// User leaves lobby
		//----------------------------------------------------------
		socket.on(NetworkIds.LEAVE_LOBBY, function(number, user) {
			$('#announce-tag').append($('<li>').text(user + " disconnected... users in lobby: " + number));
			$('#users-tag #user-'+user).remove();
			let scroller = document.getElementById('lobby-announcements');
			scroller.scrollTop = scroller.scrollHeight;
		});

		//----------------------------------------------------------
		// request user list from server
		//----------------------------------------------------------
		socket.on(NetworkIds.REQUEST_USERS, function(user_list) {
			for (let key in user_list) {
				$('#users-tag #user-'+key).remove();
				$('#users-tag').append($('<li id=user-' + key +'>').text(key));
			}
		});

		socket.on(NetworkIds.START_TIMER, function(time) {
			console.log("starting timer!");
			$('#announce-tag').append($('<li>').text("!!"));
			$('#announce-tag').append($('<li>').text("!! game starting soon !!"));
			$('#announce-tag').append($('<li>').text("!!"));
			socket.emit(NetworkIds.START_TIMER);
		});

		socket.on(NetworkIds.REQUEST_TIMER, function(time) {
			document.getElementById('timer').innerHTML = "Timer: " + (time/1000).toFixed(1) + " sec";
			socket.emit(NetworkIds.REQUEST_TIMER);
		});

		socket.on(NetworkIds.START_GAME, function() {
				menu.showScreen('game-play'); 
		});
	}

  function run() {
    socket.emit(NetworkIds.ENTER_LOBBY, Game.user.username, socket.id);
		socket.emit(NetworkIds.REQUEST_USERS, socket.id);

		/*
		let time = new Date().getTime();
		console.log(time);
		console.log(time + 3000);
		*/
  }

  return {
    initialize,
    run
  };

}(Game.menu, Game.network.socket));
