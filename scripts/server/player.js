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
    x: 0.5,
    y: 0.5
  };

  let size = {
    width: 0.01,
    height: 0.01,
    radius: 0.02
  };

  let direction = random.nextDouble() * 2 * Math.PI; // Angle in radians
  let speed = 0.0004;              // unit distance per millisecond
  let rotateRate = Math.PI / 1000; // radians per millisecond
  let reportUpdate = false;        // Indicates if this model was updated during the last update
  
  //SERVER STATS
  let health = 100;                // initial health
  let shield = 0;
  let ammo   = 0;
  let score  = {
	place : 0,
	kills : 0
  }

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

  Object.defineProperty(that, 'radius', {
    get: () => size.radius
  });

  Object.defineProperty(that, 'reportUpdate', {
    get: () => reportUpdate,
    set: value => reportUpdate = value
  });

  //SERVER OBJECT STATS
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
