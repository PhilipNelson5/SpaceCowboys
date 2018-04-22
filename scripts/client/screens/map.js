Game.screens['map'] = (function(menu, socket) {
  'use strict';

  function initialize() {
    menu.addScreen('map',
      `
      <div id="map-body">
        <p id="map-timer">Timer: 0.0 sec</p>
        <br/>
        <p id="xpos">X: </p>
        <br/>
        <p id="ypos">Y: </p>
      </div>
      `
    );

    var posX = 0.52;
    var posY = 0.52;

    document.getElementById('map-body').addEventListener(
      'click', getMousePosition
    );

    function getMousePosition(event) {
      let offsetLeft = $('#map-body').offset().left;
      let offsetTop = $('#map-body').offset().top;

      posX = ((event.clientX - offsetLeft) / 100);
      posY = ((event.clientY - offsetTop) / 100);
      
      if (posX <= 0.52) posX = 0.52;
      if (posX >= 3.48) posX = 3.48;
      if (posY <= 0.52) posY = 0.52;
      if (posY >= 3.48) posY = 3.48;  
    }

    function timer(time, lastTime) {
      let newTime = performance.now();
      time -= newTime - lastTime;

      document.getElementById('map-timer').innerHTML = 'Timer: ' + (time/1000).toFixed(1) + ' sec';
      document.getElementById('xpos').innerHTML = 'X: ' + posX.toFixed(2);
      document.getElementById('ypos').innerHTML = 'Y: ' + posY.toFixed(2);
      
      if (time > 0) {
        requestAnimationFrame( () => timer(time, newTime) );
      }
    }

    socket.on(NetworkIds.START_TIMER_MAP, function(time) {
      timer(time, performance.now());
    });

    socket.on(NetworkIds.START_GAME, function() {
      socket.emit(NetworkIds.PLAYER_POSITION, {x: posX, y: posY});
      menu.showScreen('gameplay');
    });

  }

  function run() {
    socket.emit(NetworkIds.ENTER_MAP);
  };

  return {
    initialize,
    run
  };

}(Game.menu, Game.network.socket));
