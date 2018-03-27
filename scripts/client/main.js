// -----------------------------------------------------------------------------
//
// This is the main game initialization system, it initializes all the screens.
//
// -----------------------------------------------------------------------------
Game.main = (function(screens) {
  'use strict'

  // -------------------------------------------------------
  // initialize performs the one-time initialization for
  //  each screen
  // -------------------------------------------------------
  function initialize() {
    let screen = null;

    // Go through each screen and initialize each one
    for (screen in screens) {
      if(screens.hasOwnProperty(screen)) {
        screen[screen].initialize();
      }
    }

    showScreen('main-menu');
  }

  return {
    initialize
  };

}(Game.screens));
