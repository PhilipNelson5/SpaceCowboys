Game.screens['main-menu'] = (function(menu, socket) {
  'use strict';

  function initialize() {
    menu.addScreen('main-menu',
      `
        <ul class = "menu">
          <li><button id = "id-new-game">Join&nbsp;Game&nbsp;Lobby</button></li>
          <li><button id = "id-high-scores">High&nbsp;Scores</button></li>
          <li><button id = "id-config">Configurations</button></li>
          <li><button id = "id-help">Help</button></li>
          <li><button id = "id-about">About</button></li>
        </ul>
      `);

    // Setup each of menu events for the screens
    document.getElementById('id-new-game').addEventListener(
      'click',
      function() {
        socket.emit(NetworkIds.JOIN_LOBBY_REQUEST);
      });

    document.getElementById('id-high-scores').addEventListener(
      'click',
      function() { menu.showScreen('high-scores'); });

    document.getElementById('id-config').addEventListener(
      'click',
      function() { menu.showScreen('config'); });

    document.getElementById('id-help').addEventListener(
      'click',
      function() { menu.showScreen('help'); });

    document.getElementById('id-about').addEventListener(
      'click',
      function() { menu.showScreen('about'); });

    socket.on(NetworkIds.JOIN_LOBBY_RESPONSE, function(data) {
      console.log(data);
      if (data) menu.showScreen('gamelobby'); 
      else alert('game lobby full');
    });
  }

  function run() {
    // This is empty, there isn't anything to do.
  }

  return {
    initialize,
    run
  };

}(Game.menu, Game.network.socket));
