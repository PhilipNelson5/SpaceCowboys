// ------------------------------------------------------------------
//
// Rendering function for powerups
//
// ------------------------------------------------------------------
Game.graphics.Loot = (function(graphics, assets) {
  'use strict';
  let that = {};

  // ------------------------------------------------------------------
  //
  // Renders the loot object
  //
  // ------------------------------------------------------------------
  that.render = function(loot) {
    graphics.drawCircle(model.position, model.radius, '#FFFFFF', true);
  };

  return that;

}(Game.graphics, Game.assets));
