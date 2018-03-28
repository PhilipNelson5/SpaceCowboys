Game.screens['gamelobby'] = (function(menu) {
  'use strict';

  function initialize() {
    menu.addScreen('gamelobby',
      `
      <h1>Game Lobby</h1>
      <ul class = "menu">
        <li><button id = "id-gamelobby-back">Back</button></li>
      </ul>
    `);

    document.getElementById('id-gamelobby-back').addEventListener(
      'click',
      function() { menu.showScreen('main-menu'); });
  }

  function run() {
    // This is empty, there isn't anything to do.
  }

  return {
    initialize,
    run
  };

}(Game.menu));
