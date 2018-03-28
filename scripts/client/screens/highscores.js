Game.screens['high-scores'] = (function(menu) {
  'use strict';

  function initialize() {
    const main = document.getElementById('game');
    const container = document.createElement('div');
    container.setAttribute('id', 'high-scores');
    container.setAttribute('class', 'screen');

    container.innerHTML =
      `
        <h1>High Scores</h1>
        <ol id = "scores"></ol>
        <ul class = "menu">
          <li><button id = "id-high-scores-back">Back</button></li>
        </ul>
      `
    main.appendChild(container);

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
