Game.screens['config'] = (function(menu,keyBindings) {
  'use strict';


  function initialize() {
	//TODO: Write a method that will capture the default keys and show them here.
    menu.addScreen('config',
      `
      <h1>Configs</h1>
      <ul class = "menu">
        <li><button id = "id-config-back">Back</button></li>
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

}(Game.menu,Game.keyBindings));
