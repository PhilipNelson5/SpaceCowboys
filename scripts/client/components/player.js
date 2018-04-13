//------------------------------------------------------------------
//
// Model for each player in the game.
//
//------------------------------------------------------------------
Game.components.Player = function() {
  'use strict';
  let that = {};
  let position = {
    x: 0,
    y: 0
  };
  let size = {
    width: 0.05,
    height: 0.05
  };
  let direction = 0;
  let rotateRate = 0;
  let health = 0;
  let speed = 0;

  Object.defineProperty(that, 'position', {
    get: () => position
  });

  Object.defineProperty(that, 'size', {
    get: () => size
  });

  Object.defineProperty(that, 'direction', {
    get: () => direction,
    set: (value) => { direction = value; }
  });

  Object.defineProperty(that, 'speed', {
    get: () => speed,
    set: value => { speed = value; }
  });

  Object.defineProperty(that, 'rotateRate', {
    get: () => rotateRate,
    set: value => { rotateRate = value; }
  });

  Object.defineProperty(that, 'health', {
    get: () => health
  });

  //------------------------------------------------------------------
  //
  // Public function that moves the player in the current direction.
  //
  //------------------------------------------------------------------
  that.move = function(elapsedTime) {
    let vectorX = Math.cos(direction);
    let vectorY = Math.sin(direction);

    position.x += (vectorX * elapsedTime * speed);
    position.y += (vectorY * elapsedTime * speed);
  };

  //------------------------------------------------------------------
  //
  // Public function that rotates the player right.
  //
  //------------------------------------------------------------------
  that.rotateRight = function(elapsedTime) {
    direction += (rotateRate * elapsedTime);
  };

  //------------------------------------------------------------------
  //
  // Public function that rotates the player left.
  //
  //------------------------------------------------------------------
  that.rotateLeft = function(elapsedTime) {
    direction -= (rotateRate * elapsedTime);
  };

  that.update = function(elapsedTime) {
  };

  return that;
};
