Game.screens['about'] = (function(menu) {
  'use strict';

  function initialize() {
    document.getElementById('id-about-back').addEventListener(
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
