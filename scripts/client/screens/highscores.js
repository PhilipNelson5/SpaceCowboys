Game.screens['high-scores'] = (function(menu) {
  'use strict';

  function initialize() {
    menu.addScreen('high-scores',
      `
      <h1>High Scores</h1>
      <ol id = "scores"></ol>
      <ul class = "menu">
        <li><button id = "id-high-scores-back">Back</button></li>
      </ul>
    `);

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
