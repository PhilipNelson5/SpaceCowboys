Game.screens['help'] = (function(menu) {
  'use strict';

  function initialize() {
    document.getElementById('id-help-back').addEventListener(
      'click',
      function() { menu.showScreen('main-menu'); });
  }

  function run() {
    //
    // I know this is empty, there isn't anything to do.
  }

  return {
    initialize,
    run
  };

}(Game.menu));
