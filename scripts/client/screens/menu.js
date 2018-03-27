// -----------------------------------------------------------------------------
//
// This is the menuing system. It allows for changing screens.
//
// -----------------------------------------------------------------------------
Game.menu = (function(screens) {
  'use strict'

  // -------------------------------------------------------
  // showScreen removes the 'active' class from all divs
  //  which hides them. Then adds 'active' to the new screen
  // -------------------------------------------------------
  function showScreen(id) {
    let screen = 0,
      active = null;

    active = document.getElementsByClassName('active');
    for(screen = 0; screen < active.length; ++screen) {
      active[screen].classList.remove('active');
    }

    console.log("running "+id);
    screens[id].run();

    document.getElementById(id).classList.add('active');
  }

  return {
    showScreen
  };

}(Game.screens));
