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
    graphics.rotateCanvas(texture.state.position, texture.state.direction);
	graphics.AnimatedSpriteRemote.render(texture);
    graphics.restoreContext();
  };

  return that;

}(Game.graphics));
