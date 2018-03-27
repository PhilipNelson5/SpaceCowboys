Game.screens['high-scores'] = (function(menu) {
  'use strict';

  function initialize() {
    document.getElementById('id-high-scores-back').addEventListener(
      'click',
      function() { menu.showScreen('main-menu'); });
  }

  function run() {
    // TODO: Query the server for the high-scores and display them in the div
    //
    // I know this is empty, there isn't anything to do.
  }

  return {
    initialize,
    run
  };

}(Game.menu));
