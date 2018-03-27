Game.screens['main-menu'] = (function(menu) {
  'use strict';

  function initialize() {
    //
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
    //
    // I know this is empty, there isn't anything to do.
  }

  return {
    initialize,
    run
  };

}(Game.menu));
