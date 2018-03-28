Game.screens['about'] = (function(menu) {
  'use strict';

  function initialize() {
    menu.addScreen('about',
      `
      <h1>About</h1>
      <h2>Developed by</h2>
      <p>Ammon Hepworth</p>
      <p>Hailee Maxwell</p>
      <p>Philip Nelson</p>
      <p>Raul Ramirez</p>
      <ul class = "menu">
        <li><button id = "id-about-back">Back</button></li>
      </ul>
    `);

    document.getElementById('id-about-back').addEventListener(
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
