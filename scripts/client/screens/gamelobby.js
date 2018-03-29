Game.screens['gamelobby'] = (function(menu) {
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
				<p id="lobby-announcements"></p>

				<div id="exit-lobby">
    		  <ul class = "menu">
       			<li><button id = "id-gamelobby-back">Back</button></li>
      		</ul>
				</div>
			</div>
			</div>
   	  `
		);

    document.getElementById('id-gamelobby-back').addEventListener(
      'click',
      function() { menu.showScreen('main-menu'); });
		
		document.getElementById('msg-enter-btn').addEventListener(
			'click',
			function() {
				let message = document.getElementById('msg').value;
				document.getElementById('msg').value = '';
				$("#messages").append($("<li>").text(message));

				let scroller = document.getElementById('read-messages');
				scroller.scrollTop = scroller.scrollHeight;
			}
		);
  }

  function run() {
    // This is empty, there isn't anything to do.
  }

  return {
    initialize,
    run
  };

}(Game.menu));
