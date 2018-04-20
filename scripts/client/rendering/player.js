// ------------------------------------------------------------------
//
// Rendering function for a Player object.
//
// ------------------------------------------------------------------
Game.graphics.Player = (function(graphics) {
  'use strict';
  let that = {};

  // ------------------------------------------------------------------
  //
  // Renders a Player model.
  //
  // ------------------------------------------------------------------
  that.render = function(model, texture) {
    graphics.saveContext();
    graphics.rotateCanvas(texture.center, model.direction);
  	graphics.AnimatedSprite.render(texture); 
    graphics.restoreContext();

  };

  return that;

}(Game.graphics));
