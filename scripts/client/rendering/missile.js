// ------------------------------------------------------------------
//
// Rendering function for a Missile object.
//
// ------------------------------------------------------------------
Game.graphics.Missile = (function(graphics) {
  'use strict';
  let that = {};

  // ------------------------------------------------------------------
  //
  // Renders a Missile model.
  //
  // ------------------------------------------------------------------
  that.render = function(model /*, texture */) {
    graphics.drawCircle(model.position, model.radius+.002, '#000000', true);
    graphics.drawCircle(model.position, model.radius-.001, '#ffffff', true);
  };

  return that;

}(Game.graphics));
