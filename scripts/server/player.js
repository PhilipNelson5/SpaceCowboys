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
    x: 1,
    y: 0.75
  };

  let size = {
    width: 0.01,
    height: 0.01,
    radius: 0.02
  };

  let direction = random.nextDouble() * 2 * Math.PI; // Angle in radians
  let speed = 0.0002;              // unit distance per millisecond
  //let rotateRate = Math.PI / 1000; // radians per millisecond
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
  // Public functions that move the player in the specified direction.
  //
  //------------------------------------------------------------------
  that.moveUp = function(elapsedTime) {
    reportUpdate = true;
    position.y -= elapsedTime * speed;
  };

  that.moveDown = function(elapsedTime) {
    reportUpdate = true;
    position.y += elapsedTime * speed;
  };

  that.moveLeft = function(elapsedTime) {
    reportUpdate = true;
    position.x -= elapsedTime * speed;
  };

  that.moveRight = function(elapsedTime) {
    reportUpdate = true;
    position.x += elapsedTime * speed;
  };

  that.rotate = function(message) {
    reportUpdate = true;
    direction = message.data.direction;
  };

  that.die = function() {
    reportUpdate = true;
    position.x = null;
    position.y = null;
  };

  //------------------------------------------------------------------
  //
  // Function used to update the player during the game loop.
  //
  //------------------------------------------------------------------
  that.update = function(/* when */) {

  };

  that.hit = function(dammage) {
    health -= dammage;
  };

  console.log('creating new player');
  return that;
}

module.exports.create = () => createPlayer();
