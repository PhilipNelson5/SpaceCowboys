// ------------------------------------------------------------------
//
// Rendering function for a PlayerRemote object.
//
// ------------------------------------------------------------------
Game.graphics.PlayerRemote = (function(graphics) {
  'use strict';
  let that = {};

  // ------------------------------------------------------------------
  //
  // Renders a PlayerRemote model.
  //
  // ------------------------------------------------------------------
  that.render = function(model, texture) {
    graphics.saveContext();
    graphics.rotateCanvas(model.state.position, model.state.direction);
    graphics.drawImage(texture, model.state.position, model.size, true);
    graphics.restoreContext();
  };

  return that;

}(Game.graphics));
