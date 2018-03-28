Game.screens['help'] = (function(menu) {
  'use strict';

  function initialize() {
    const main = document.getElementById('game');
    const container = document.createElement('div');
    container.setAttribute('id', 'help');
    container.setAttribute('class', 'screen');

    container.innerHTML =
      `
        <h1>Help</h1>
        <p>This is some help on how to play the game</p>
        <ul id = "controls"></ul>
        <ul class = "menu">
          <li><button id = "id-help-back">Back</button></li>
        </ul>
      `
    main.appendChild(container);

    document.getElementById('id-help-back').addEventListener(
      'click',
      function() { menu.showScreen('main-menu'); });
  }

  function run() {
    // TODO: Query the game and get the key bindings
  }

  return {
    initialize,
    run
  };

}(Game.menu));
