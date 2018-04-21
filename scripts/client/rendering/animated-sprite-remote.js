// ------------------------------------------------------------------
//
// Rendering function for an AnimatedSprite object.
//
// ------------------------------------------------------------------
Game.graphics.AnimatedSpriteRemote = (function(graphics) {
  'use strict';
  let that = {};

  that.render = function(sprite) {
    graphics.drawImageSpriteSheet(
      sprite.spriteSheet,
      { width: sprite.pixelWidth, height: sprite.pixelHeight },
      sprite.sprite,
      { x: sprite.state.position.x, y: sprite.state.position.y },
      { width: sprite.width, height: sprite.height }
    );
  };

  return that;
}(Game.graphics));
