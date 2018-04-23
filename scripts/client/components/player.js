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

  let radius = 0.02;

  let size = {
    width: 0.05,
    height: 0.05
  };

  let target = {
    x: 0,
    y: 0
  };

  let direction = 0;
  let rotateRate = 0;
  let speed = 0.0002;

  // STATS

  let dead = false;
  let health = 1;
  let shield = 0;
  let ammo   = 0;
  let score = {
    place : 0,
    kills : 0
  };

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


  Object.defineProperty(that, 'target', {
    get: () => target,
    set: (value) => {
      target.x = value.x;
      target.y=value.y;
    }
  });

  // STATS OBJECTS
  Object.defineProperty(that, 'health', {
    get: () => health,
    set: value => health = value
  });

  Object.defineProperty(that, 'shield', {
    get: () => shield,
    set: value => shield = value
  });

  Object.defineProperty(that, 'ammo', {
    get: () => ammo,
    set: value => ammo = value
  });

  Object.defineProperty(that, 'radius', {
    get: () => radius
  });

  Object.defineProperty(that, 'dead', {
    get: () => dead,
    set: value => dead = value
  });

  Object.defineProperty(that, 'score', {
    get: () => score,
    set: (value) => {
      score.place = value.place;
      score.kills = value.kills;
    }

  });


  //------------------------------------------------------------------
  //
  // Public functions that move the player in the specified direction.
  //
  //------------------------------------------------------------------
  that.moveUp = function(sprite,elapsedTime) {
    position.y -= elapsedTime * speed;
    sprite.center.y -= elapsedTime * speed;
  };

  that.moveDown = function(sprite,elapsedTime) {
    position.y += elapsedTime * speed;
    sprite.center.y += elapsedTime * speed;
  };

  that.moveLeft = function(sprite,elapsedTime) {
    position.x -= elapsedTime * speed;
    sprite.center.x -= elapsedTime * speed;
  };

  that.moveRight = function(sprite,elapsedTime) {
    position.x += elapsedTime * speed;
    sprite.center.x += elapsedTime * speed;
  };

  function tolerance(value, test, tolerance) {
    if (Math.abs(value - test) < tolerance) {
      return true;
    } else {
      return false;
    }
  }

  //------------------------------------------------------------------
  //
  // Public function that rotates the player
  //
  //------------------------------------------------------------------
  function cp(v1, v2) {
    return (v1.x * v2.y) - (v1.y * v2.x);
  }

  that.rotate = function() {
    let v1 = {
        x : 1,
        y : 0
      },
      v2 = {
        x : target.x - window.innerWidth/2,
        y : target.y - window.innerHeight/2
      },
      angle;

    v2.len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    v2.x /= v2.len;
    v2.y /= v2.len;

    angle = Math.acos(v1.x * v2.x + v1.y * v2.y);
    angle *= (cp(v1, v2) > 0) ? 1 : -1;

    if (tolerance(direction, angle, .001)) {
      return false;
    } else {
      direction = angle;
      return true;
    }

  };

  that.update = function(/* elapsedTime */) {
  };

  return that;
};
