//------------------------------------------------------------------
//
// Model for each remote player in the game.
//
//------------------------------------------------------------------
Game.components.PlayerRemote = function() {
  'use strict';
  let that = {};
  let size = {
    width: 0.05,
    height: 0.05
  };
  let state = {
    direction: 0,
    position: {
      x: 0,
      y: 0
    }
  };
  let goal = {
    direction: 0,
    position: {
      x: 0,
      y: 0
    },
    updateWindow: 0      // Server reported time elapsed since last update
  };

  Object.defineProperty(that, 'state', {
    get: () => state
  });

  Object.defineProperty(that, 'goal', {
    get: () => goal
  });

  Object.defineProperty(that, 'size', {
    get: () => size
  });

  //------------------------------------------------------------------
  //
  // Update of the remote player is a simple linear progression/interpolation
  // from the previous state to the goal (new) state.
  //
  //------------------------------------------------------------------
  that.update = function(elapsedTime) {
    // Protect against divide by 0 before the first update from the server has been given
    if (goal.updateWindow === 0) return;

    let updateFraction = elapsedTime / goal.updateWindow;
    if (updateFraction > 0) {
      //
      // Turn first, then move.
      state.direction -= (state.direction - goal.direction) * updateFraction;

      state.position.x -= (state.position.x - goal.position.x) * updateFraction;
	  //sprite.center.x -= (state.position.x - goal.position.x) * updateFraction; 
      state.position.y -= (state.position.y - goal.position.y) * updateFraction;
	  //sprite.center.y -= (state.position.y - goal.position.y) * updateFraction; 
    }
  };

  return that;
};
