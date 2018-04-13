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

    //TODO 100 is the max health
    //TODO maybe move this to the main update function
    graphics.drawHealth(model.position.x, model.position.y, model.health, 100);
  };

  return that;

}(Game.graphics));
