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

  // unit distance traveled per millisecond
  let speed = spec.speed;

  // the range of the missile -> current time left
  let timeRemaining = spec.range;

  Object.defineProperty(that, 'clientId', {
    // who fired the missile
    get: () => spec.clientId
  });

  Object.defineProperty(that, 'id', {
    // missile id
    get: () => spec.id
  });

  Object.defineProperty(that, 'direction', {
    // direction of missile
    get: () => spec.direction
  });

  Object.defineProperty(that, 'position', {
    // position of missile
    get: () => spec.position
  });

  Object.defineProperty(that, 'radius', {
    // size of missile for collision detection
    get: () => radius
  });

  Object.defineProperty(that, 'speed', {
    get: () => speed
  });

  Object.defineProperty(that, 'timeRemaining', {
    get: () => timeRemaining
  });

  Object.defineProperty(that, 'damage', {
    // how much damage the missile does
    get: () => spec.damage
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
