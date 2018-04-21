// ------------------------------------------------------------------
//
// Provides some utility functions for the server
//
// ------------------------------------------------------------------
'use strict';

const r = require ('./random');

const type = Object.freeze({
  health   :1,
  shield   :2,
  ammo     :3,
  weapon   :4,
  rangeUp  :5,
  damageUp :6,
  speedUp  :7
});

function genLoot(n) {

  let loot = {
      health    : [], // n  - 50pts
      shield    : [], // 2n - 25pts
      ammo      : [], // 3n - avg 15 stdev 5
      weapon    : [], // n  - one per person
      rangeUp   : [], // 1/3 n
      damageUp  : [], // 1/3 n
      speedUp   : []  // 1/3 n
    },
    id = 0;

  let tot, val;
  const MIN = 0.5,
    MAX = 3.5;

  tot = n;
  for (let i = 0; i < tot; ++i) {
    loot.health.push({
      position : {
        x:r.nextDoubleRange(MIN, MAX),
        y:r.nextDoubleRange(MIN, MAX),
      },
      radius: 0.02,
      val: 50,
      type: type.health,
      id : ++id
    });
  }

  tot = 2*n;
  for (let i = 0; i < tot; ++i) {
    loot.shield.push({
      position : {
        x:r.nextDoubleRange(MIN, MAX),
        y:r.nextDoubleRange(MIN, MAX),
      },
      radius: 0.02,
      val: 25,
      type: type.shield,
      id : ++id
    });
  }

  tot = 3*n;
  for (let i = 0; i < tot; ++i) {
    val = Math.floor(r.nextGaussian(35,10));
    val = val > 5 ? val : 5;
    loot.ammo.push({
      position : {
        x:r.nextDoubleRange(MIN, MAX),
        y:r.nextDoubleRange(MIN, MAX),
      },
      radius: 0.02,
      val: val,
      type: type.ammo,
      id : ++id
    });
  }

  tot = n;
  for (let i = 0; i < tot; ++i) {
    loot.weapon.push( {
      position : {
        x:r.nextDoubleRange(MIN, MAX),
        y:r.nextDoubleRange(MIN, MAX),
      },
      radius: 0.02,
      val: 0,
      type: type.weapon,
      id : ++id
    });
  }

  tot = Math.floor(n/3);
  tot = (tot === 0) ? 1 : tot;
  for (let i = 0; i < tot; ++i) {
    loot.rangeUp.push({
      position : {
        x:r.nextDoubleRange(MIN, MAX),
        y:r.nextDoubleRange(MIN, MAX),
      },
      radius: 0.02,
      val: 750,
      type: type.rangeUp,
      id : ++id
    });
  }

  tot = Math.floor(n/3);
  tot = (tot === 0) ? 1 : tot;
  for (let i = 0; i < tot; ++i) {
    loot.damageUp.push({
      position : {
        x:r.nextDoubleRange(MIN, MAX),
        y:r.nextDoubleRange(MIN, MAX),
      },
      radius: 0.02,
      val: 10,
      type: type.damageUp,
      id : ++id
    });
  }

  tot = Math.floor(n/3);
  tot = (tot === 0) ? 1 : tot;
  for (let i = 0; i < tot; ++i) {
    loot.speedUp.push( {
      position : {
        x:r.nextDoubleRange(MIN, MAX),
        y:r.nextDoubleRange(MIN, MAX),
      },
      radius: 0.02,
      val: 0.0001,
      type: type.speedUp,
      id : ++id
    });
  }

  return loot;
}

function apply(loot, player) {
  switch (loot.type) {
  case type.health:
    if (player.health >= 100) return false; // don't pickup health if at max
    console.log(player.health);
    player.health = player.health + loot.val;
    if (player.health > 100) player.health = 100;
    break;
  case type.shield:
    if (player.shield >= 100) return false; // don't pickup shield if at max
    console.log(player.shield);
    player.shield = player.shield + loot.val;
    if (player.shield > 100) player.shield = 100;
    break;
  case type.ammo:
    player.ammo = player.ammo + loot.val;
    break;
  case type.weapon:
    if (player.hasWeapon) return false; // only have one weapon
    console.log(player.hasWeapon);
    player.hasWeapon = true;
    break;
  case type.rangeUp:
    player.missileRange = player.missileRange + loot.val;
    player.loot.push(type.rangeUp);
    break;
  case type.damageUp:
    player.missileDamage = player.missileDamage + loot.val;
    player.loot.push(type.damageUp);
    break;
  case type.speedUp:
    player.missileSpeed = player.missileSpeed + loot.val;
    player.loot.push(type.speedUp);
    break;
  }

  return true;
}

module.exports.genLoot = genLoot;
module.exports.type = type;
module.exports.apply = apply;
