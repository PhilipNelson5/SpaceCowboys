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
    x: 0.52,
    y: 0.52
  };

  let size = {
    width : 0.01,
    height: 0.01,
    radius: 0.02
  };

  let direction = random.nextDouble() * 2 * Math.PI; // Angle in radians
  let speed         = 0.0002;   // unit distance per millisecond
  let health        = 100;      // initial health
  let shield        = 0;        // initial shield
  let reportUpdate  = false;    // Indicates if this model was updated during the last update
  let missileSpeed  = .0007;    // How fast missiles fired by this player travel
  let missileDamage = 10;       // How much damage a missile will do
  let missileRange  = 1500;     // Time that a missile will travel
  let hasWeapon     = false;    // Players do not start out with a gun
  let ammo          = 0;        // Player ammo, starts with none
  let loot = [];
  let score  = {
    place : 1,
    kills : 0
  };

  Object.defineProperty(that, 'position', {
    get: () => position,
    set: value => position = value
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

  Object.defineProperty(that, 'radius', {
    get: () => size.radius
  });

  Object.defineProperty(that, 'health', {
    get: () => health,
    set: value => health = value
  });

  Object.defineProperty(that, 'shield', {
    get: () => shield,
    set: value => shield = value
  });

  Object.defineProperty(that, 'reportUpdate', {
    get: () => reportUpdate,
    set: value => reportUpdate = value
  });

  Object.defineProperty(that, 'missileSpeed', {
    get: () => missileSpeed,
    set: value => missileSpeed = value
  });

  Object.defineProperty(that, 'missileDamage', {
    get: () => missileDamage,
    set: value => missileDamage = value
  });

  Object.defineProperty(that, 'missileRange', {
    get: () => missileRange,
    set: value => missileRange = value
  });

  Object.defineProperty(that, 'hasWeapon', {
    get: () => hasWeapon,
    set: value => hasWeapon = value
  });

  Object.defineProperty(that, 'ammo', {
    get: () => ammo,
    set: value => ammo = value
  });

  Object.defineProperty(that, 'loot', {
    get: () => loot,
    set: value => loot = value
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

  that.hit = function(damage) {
    health -= damage;
  };

  console.log('creating new player');
  return that;
}

module.exports.create = () => createPlayer();
