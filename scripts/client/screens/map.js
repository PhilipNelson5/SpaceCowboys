Game.screens['map'] = (function(menu, socket, assets) {
  'use strict';

  function initialize() {
    menu.addScreen('map',
      `
      <div id="map-body">
        <p id="map-tag">Pick A Position</p>
        <p id="map-timer">Timer: 0.0 sec</p>
        <p id="xpos">X: </p>
        <p id="ypos">Y: </p>
      </div>`
    );

    var posX = 0.52;
    var posY = 0.52;
    var offsetLeft = $('#map-body').offset().left;
    var offsetTop = $('#map-body').offset().top;

    document.getElementById('map-body').addEventListener(
      'click', getMousePosition
    );

    function getMousePosition(event) {
      offsetLeft = $('#map-body').offset().left;
      offsetTop = $('#map-body').offset().top;

      posX = ((event.clientX - offsetLeft) / 50);
      posY = ((event.clientY - offsetTop) / 50);
      
      if (posX <= 0.52) posX = 0.52;
      if (posX >= 7.48) posX = 7.48;
      if (posY <= 0.52) posY = 0.52;
      if (posY >= 7.48) posY = 7.48;  

      // TODO -- see if this helps fix the invisible start bug
      socket.emit(NetworkIds.PLAYER_POSITION, {x: posX, y: posY});
    }

    function timer(time, lastTime) {
      let newTime = performance.now();
      time -= newTime - lastTime;

      document.getElementById('map-timer').innerHTML = 'Timer: ' + (time/1000).toFixed(1) + ' sec';
      document.getElementById('xpos').innerHTML = 'X: ' + (posX*50).toFixed(2);
      document.getElementById('ypos').innerHTML = 'Y: ' + (posY*50).toFixed(2);
      
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
    $('#map-body').css("background-image", "url("+assets['map-image']+")");
    socket.emit(NetworkIds.ENTER_MAP);
  };

  return {
    initialize,
    run
  };

}(Game.menu, Game.network.socket, Game.assets));
