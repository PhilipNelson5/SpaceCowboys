Game.screens['gamelobby'] = (function(menu) {
  'use strict';

  function initialize() {
    const main = document.getElementById('game');
    const screen = document.createElement('div');
    screen.setAttribute('id', 'gamelobby');
    screen.setAttribute('class', 'screen');

    screen.innerHTML =
      `
      <h1>Game Lobby</h1>
      <ul class = "menu">
        <li><button id = "id-gamelobby-back">Back</button></li>
      </ul>
      `
    main.appendChild(screen);

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
