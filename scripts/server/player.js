// ------------------------------------------------------------------
//
// Nodejs module that represents the model for a player.
//
// ------------------------------------------------------------------
'use strict';

let random = require ('./random');

//------------------------------------------------------------------
//
// Public function used to initially create a newly connected player
// at some random location.
//
//------------------------------------------------------------------
function createPlayer() {
  let that = {};

  let position = {
    x: random.nextDouble(),
    y: random.nextDouble()
  };

  let size = {
    width: 0.01,
    height: 0.01,
    radius: 0.02
  };

  let direction = random.nextDouble() * 2 * Math.PI; // Angle in radians
  let speed = 0.0002;              // unit distance per millisecond
  let rotateRate = Math.PI / 1000; // radians per millisecond
  let health = 100;                // initial health
  let reportUpdate = false;        // Indicates if this model was updated during the last update

  Object.defineProperty(that, 'position', {
    get: () => position
  });

  Object.defineProperty(that, 'size', {
    get: () => size
  });

  Object.defineProperty(that, 'direction', {
    get: () => direction
  });

  Object.defineProperty(that, 'speed', {
    get: () => speed
  });

  Object.defineProperty(that, 'rotateRate', {
    get: () => rotateRate
  });

  Object.defineProperty(that, 'health', {
    get: () => health,
    set: value => health = value
  });

  Object.defineProperty(that, 'radius', {
    get: () => size.radius
  });

  Object.defineProperty(that, 'reportUpdate', {
    get: () => reportUpdate,
    set: value => reportUpdate = value
  });


  //------------------------------------------------------------------
  //
  // Moves the player forward based on how long it has been since the
  // last move took place.
  //
  //------------------------------------------------------------------
  that.move = function(elapsedTime) {
    reportUpdate = true;
    /*
    let vectorX = Math.cos(direction);
    let vectorY = Math.sin(direction);

    position.x += (vectorX * elapsedTime * speed);
    position.y += (vectorY * elapsedTime * speed);

    let vector = {
      x: 0,
      y: 0
    }

    if (position.x >= 0.8 || position.x <= 0.2) { 
      vector.x = Math.cos(direction) * elapsedTime * speed;
      position.x = (position.x >= 0.8) ? 0.8 : 0.2;
    }

    if (position.y >= 0.8 || position.y <= 0.2) {
      vector.y = Math.sin(direction) * elapsedTime * speed;
      position.y = (position.y >= 0.8) ? 0.8 : 0.2;
    }

    return vector;
    */

    //TODO -- need to get world coordinates
    let vector = {
      x: 0,
      y: 0
    }

    vector.x = Math.cos(direction) * elapsedTime * speed * 2;
    vector.y = Math.sin(direction) * elapsedTime * speed * 2;
    position.x = 0.5;
    position.y = 0.5;
    return vector;
  };

  //------------------------------------------------------------------
  //
  // Rotates the player right based on how long it has been since the
  // last rotate took place.
  //
  //------------------------------------------------------------------
  that.rotateRight = function(elapsedTime) {
    reportUpdate = true;
    direction += (rotateRate * elapsedTime);
  };

  //------------------------------------------------------------------
  //
  // Rotates the player left based on how long it has been since the
  // last rotate took place.
  //
  //------------------------------------------------------------------
  that.rotateLeft = function(elapsedTime) {
    reportUpdate = true;
    direction -= (rotateRate * elapsedTime);
  };

  //------------------------------------------------------------------
  //
  // Function used to update the player during the game loop.
  //
  //------------------------------------------------------------------
  that.update = function(when) {
  };

  that.hit = function(dammage) {
    health -= dammage;
  };

  console.log('creating new player');
  return that;
}

module.exports.create = () => createPlayer();
