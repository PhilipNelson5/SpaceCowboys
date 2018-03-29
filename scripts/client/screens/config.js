Game.screens['config'] = (function(menu) {
  'use strict';

  function initialize() {
    menu.addScreen('config',
      `
      <h1>Configs</h1>
      <ul class = "menu">
        <li><button id = "id-about-back">Back</button></li>
      </ul>
    `);

    document.getElementById('id-config-back').addEventListener(
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
