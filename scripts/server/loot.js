// ------------------------------------------------------------------
//
// Provides some utility functions for the server
//
// ------------------------------------------------------------------
'use strict';

const r = require ('../shared/random');

function collided(obj1, obj2) {
  let distance = Math.sqrt(Math.pow(obj1.position.x - obj2.position.x, 2)
    + Math.pow(obj1.position.y - obj2.position.y, 2));
  let radii = obj1.radius + obj2.radius;

  return distance <= radii;
}

function goodPlacement (next, asteroids) {
  for (let asteroid of asteroids) {
    if (collided (next, asteroid)) {
      return false;
    }
  }
  return true;
}

const type = Object.freeze({
  health   :1,
  shield   :2,
  ammo     :3,
  weapon   :4,
  rangeUp  :5,
  damageUp :6,
  speedUp  :7
});

function genLoot(n, asteroids) {
  n *= 2;

  n*=2;

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

  let tot, val, next, num;
  const MIN = 0.62,
    MAX = 7.38;

  tot = Math.floor(n*1.5);
  num = 0;
  while (num < tot) {
    next = {
      position : {
        x:r.nextDoubleRange(MIN, MAX),
        y:r.nextDoubleRange(MIN, MAX),
      },
      radius: 0.02,
      val: 50,
      type: type.health,
      id : id
    };

    if (goodPlacement(next, asteroids)) {
      loot.health.push(next);
      ++id;
      ++num;
    }
  }

  tot = 2*n;
  num = 0;
  while (num < tot) {
    next = {
      position : {
        x:r.nextDoubleRange(MIN, MAX),
        y:r.nextDoubleRange(MIN, MAX),
      },
      radius: 0.02,
      val: 25,
      type: type.shield,
      id : id
    };

    if (goodPlacement(next, asteroids)) {
      loot.shield.push(next);
      ++id;
      ++num;
    }
  }

  tot = 5*n;
  num = 0;
  while (num < tot) {
    val = Math.floor(r.nextGaussian(50,15));
    val = val > 5 ? val : 5;
    next = {
      position : {
        x:r.nextDoubleRange(MIN, MAX),
        y:r.nextDoubleRange(MIN, MAX),
      },
      radius: 0.02,
      val: val,
      type: type.ammo,
      id : id
    };

    if (goodPlacement(next, asteroids)) {
      loot.ammo.push(next);
      ++id;
      ++num;
    }
  }

  tot = Math.floor(1.5*n);
  num = 0;
  while (num < tot) {
    next = {
      position : {
        x:r.nextDoubleRange(MIN, MAX),
        y:r.nextDoubleRange(MIN, MAX),
      },
      radius: 0.02,
      val: 0,
      type: type.weapon,
      id : id
    };

    if (goodPlacement(next, asteroids)) {
      loot.weapon.push( next);
      ++id;
      ++num;
    }
  }

  tot = Math.floor(n/3);
  tot = (tot === 0) ? 1 : tot;
  num = 0;
  while (num < tot) {
    next = {
      position : {
        x:r.nextDoubleRange(MIN, MAX),
        y:r.nextDoubleRange(MIN, MAX),
      },
      radius: 0.02,
      val: 750,
      type: type.rangeUp,
      id : id
    };

    if (goodPlacement(next, asteroids)) {
      loot.rangeUp.push(next);
      ++id;
      ++num;
    }
  }

  tot = Math.floor(n/3);
  tot = (tot === 0) ? 1 : tot;
  num = 0;
  while (num < tot) {
    next = {
      position : {
        x:r.nextDoubleRange(MIN, MAX),
        y:r.nextDoubleRange(MIN, MAX),
      },
      radius: 0.02,
      val: 10,
      type: type.damageUp,
      id : id
    };

    if (goodPlacement(next, asteroids)) {
      loot.damageUp.push(next);
      ++id;
      ++num;
    }
  }

  tot = Math.floor(n/3);
  tot = (tot === 0) ? 1 : tot;
  num = 0;
  while (num < tot) {
    next = {
      position : {
        x:r.nextDoubleRange(MIN, MAX),
        y:r.nextDoubleRange(MIN, MAX),
      },
      radius: 0.02,
      val: 0.0002,
      type: type.speedUp,
      id : id
    };

    if (goodPlacement(next, asteroids)) {
      loot.speedUp.push(next);
      ++id;
      ++num;
    }
  }

  return loot;
}

function apply(loot, player) {
  switch (loot.type) {
  case type.health:
    if (player.health >= 100) return false; // don't pickup health if at max
    player.health = player.health + loot.val;
    if (player.health > 100) player.health = 100;
    break;
  case type.shield:
    if (player.shield >= 100) return false; // don't pickup shield if at max
    player.shield = player.shield + loot.val;
    if (player.shield > 100) player.shield = 100;
    break;
  case type.ammo:
    player.ammo = player.ammo + loot.val;
    break;
  case type.weapon:
    if (player.hasWeapon) return false; // only have one weapon
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
