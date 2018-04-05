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
    graphics.rotateCanvas(model.position, model.direction);
    graphics.drawImage(texture, model.position, model.size);
    graphics.restoreContext();
  };

  return that;

}(Game.graphics));
