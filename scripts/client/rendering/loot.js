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
    for (let e of loot.ammo) {
      graphics.drawCircle(
        e.position,
        0.025,
        "#000000",
        true
      );
      graphics.drawCircle(
        e.position,
        0.02,
        "#FFFFFF",
        true
      );
      graphics.drawImage(
        assets['loot-ammo'],
        e.position,
        {width:0.04, height:0.04},
        true
      );
    }
    for (let e of loot.damageUp) {
      graphics.drawCircle(
        e.position,
        0.025,
        "#000000",
        true
      );
      graphics.drawCircle(
        e.position,
        0.02,
        "#FFFFFF",
        true
      );
      graphics.drawImage(
        assets['loot-damageUp'],
        e.position,
        {width:0.04, height:0.04},
        true
      );
    }
    for (let e of loot.health) {
      graphics.drawCircle(
        e.position,
        0.025,
        "#000000",
        true
      );
      graphics.drawCircle(
        e.position,
        0.02,
        "#FFFFFF",
        true
      );
      graphics.drawImage(
        assets['loot-health'],
        e.position,
        {width:0.04, height:0.04},
        true
      );
    }
    for (let e of loot.rangeUp) {
      graphics.drawCircle(
        e.position,
        0.025,
        "#000000",
        true
      );
      graphics.drawCircle(
        e.position,
        0.02,
        "#FFFFFF",
        true
      );
      graphics.drawImage(
        assets['loot-rangeUp'],
        e.position,
        {width:0.04, height:0.04},
        true
      );
    }
    for (let e of loot.shield) {
      graphics.drawCircle(
        e.position,
        0.025,
        "#000000",
        true
      );
      graphics.drawCircle(
        e.position,
        0.02,
        "#FFFFFF",
        true
      );
      graphics.drawImage(
        assets['loot-shield'],
        e.position,
        {width:0.04, height:0.04},
        true
      );
    }
    for (let e of loot.speedUp) {
      graphics.drawCircle(
        e.position,
        0.025,
        "#000000",
        true
      );
      graphics.drawCircle(
        e.position,
        0.02,
        "#FFFFFF",
        true
      );
      graphics.drawImage(
        assets['loot-speedUp'],
        e.position,
        {width:0.04, height:0.04},
        true
      );
    }
    for (let e of loot.weapon) {
      graphics.drawCircle(
        e.position,
        0.025,
        "#000000",
        true
      );
      graphics.drawCircle(
        e.position,
        0.02,
        "#FFFFFF",
        true
      );
      graphics.drawImage(
        assets['loot-weapon'],
        e.position,
        {width:0.08, height:0.04},
        true
      );
    }
  };

  return that;

}(Game.graphics, Game.assets));
