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
      graphics.drawImage(
        assets['loot-ammo'],
        e.position,
        {width:0.04, height:0.04},
        true
      );
    }
    for (let e of loot.damageUp) {
      graphics.drawImage(
        assets['loot-damageUp'],
        e.position,
        {width:0.04, height:0.04},
        true
      );
    }
    for (let e of loot.health) {
      graphics.drawImage(
        assets['loot-health'],
        e.position,
        {width:0.04, height:0.04},
        true
      );
    }
    for (let e of loot.rangeUp) {
      graphics.drawImage(
        assets['loot-rangeUp'],
        e.position,
        {width:0.04, height:0.04},
        true
      );
    }
    for (let e of loot.shield) {
      graphics.drawImage(
        assets['loot-shield'],
        e.position,
        {width:0.04, height:0.04},
        true
      );
    }
    for (let e of loot.speedUp) {
      graphics.drawImage(
        assets['loot-speedUp'],
        e.position,
        {width:0.04, height:0.04},
        true
      );
    }
    for (let e of loot.weapon) {
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
