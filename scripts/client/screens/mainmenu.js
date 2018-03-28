Game.screens['main-menu'] = (function(menu) {
  'use strict';

  function initialize() {
    const main = document.getElementById('game');
    const container = document.createElement('div');
    container.setAttribute('id', 'main-menu');
    container.setAttribute('class', 'screen');

    container.innerHTML =
      `
        <ul class = "menu">
          <li><button id = "id-new-game">New&nbsp;Game</button></li>
          <li><button id = "id-high-scores">High&nbsp;Scores</button></li>
          <li><button id = "id-help">Help</button></li>
          <li><button id = "id-about">About</button></li>
        </ul>
      `
    main.appendChild(container);

    // Setup each of menu events for the screens
    document.getElementById('id-new-game').addEventListener(
      'click',
      function() {menu.showScreen('game-play'); });

    document.getElementById('id-high-scores').addEventListener(
      'click',
      function() { menu.showScreen('high-scores'); });

    document.getElementById('id-help').addEventListener(
      'click',
      function() { menu.showScreen('help'); });

    document.getElementById('id-about').addEventListener(
      'click',
      function() { menu.showScreen('about'); });
  }

  function run() {
    // This is empty, there isn't anything to do.
  }

  return {
    initialize,
    run
  };

}(Game.menu));
