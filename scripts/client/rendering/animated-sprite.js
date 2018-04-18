// ------------------------------------------------------------------
//
// Rendering function for an AnimatedSprite object.
//
// ------------------------------------------------------------------
Game.graphics.AnimatedSprite = (function(graphics) {
  'use strict';
  let that = {};

  that.render = function(sprite) {
    graphics.drawImageSpriteSheet(
      sprite.spriteSheet,
      { width: sprite.pixelWidth, height: sprite.pixelHeight },
      sprite.sprite,
      { x: sprite.center.x, y: sprite.center.y },
      { width: sprite.width, height: sprite.height }
    );
  };

  return that;
}(Game.graphics));
