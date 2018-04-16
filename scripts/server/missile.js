// ------------------------------------------------------------------
//
// Nodejs module that represents the model for a missile.
//
// ------------------------------------------------------------------
'use strict';

//------------------------------------------------------------------
//
// Public function used to initially create a newly fired missile.
//
//------------------------------------------------------------------
function createMissile(spec) {
  let that = {};

  let radius = 0.0025;
  let speed = spec.speed + 0.0002;    // unit distance per millisecond
  let timeRemaining = 1500;   // milliseconds

  Object.defineProperty(that, 'clientId', {
    get: () => spec.clientId
  });

  Object.defineProperty(that, 'id', {
    get: () => spec.id
  });

  Object.defineProperty(that, 'direction', {
    get: () => spec.direction
  });

  Object.defineProperty(that, 'position', {
    get: () => spec.position
  });

  Object.defineProperty(that, 'radius', {
    get: () => radius
  });

  Object.defineProperty(that, 'speed', {
    get: () => speed
  });

  Object.defineProperty(that, 'timeRemaining', {
    get: () => timeRemaining
  });

  Object.defineProperty(that, 'dammage', {
    get: () => spec.dammage
  });

  //------------------------------------------------------------------
  //
  // Function used to update the missile during the game loop.
  //
  //------------------------------------------------------------------
  that.update = function(elapsedTime) {
    let vectorX = Math.cos(spec.direction);
    let vectorY = Math.sin(spec.direction);

    spec.position.x += (vectorX * elapsedTime * speed);
    spec.position.y += (vectorY * elapsedTime * speed);

    timeRemaining -= elapsedTime;

    if (timeRemaining <= 0) {
      return false;
    } else {
      return true;
    }
  };

  return that;
}

module.exports.create = (spec) => createMissile(spec);
