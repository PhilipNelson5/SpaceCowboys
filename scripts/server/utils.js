// ------------------------------------------------------------------
//
// Provides some utility functions for the server
//
// ------------------------------------------------------------------
'use strict';

const r = require ('./random');

function genLoot(n) {
  let loot = {
    health    : [], // n  - 50pts
    shield    : [], // 2n - 25pts
    ammo      : [], // 3n - avg15 stdev15
    weapon    : [], // n  - one per person
    rangeUp   : [], // 1/3 n
    damageUp  : [], // 1/3 n
    speedUp   : []  // 1/3 n
  };

  let tot;
  const MIN = 0.5,
    MAX = 3.5;

  tot = n;
  for (let i = 0; i < tot; ++i) {
    loot.health.push({
      x:r.nextDoubleRange(MIN, MAX),
      y:r.nextDoubleRange(MIN, MAX),
      val:50
    });
  }

  tot = 2*n;
  for (let i = 0; i < tot; ++i) {
    loot.shield.push({
      x:r.nextDoubleRange(MIN, MAX),
      y:r.nextDoubleRange(MIN, MAX),
      val:25
    });
  }

  tot = 3*n;
  for (let i = 0; i < tot; ++i) {
    loot.ammo.push({
      x:r.nextDoubleRange(MIN, MAX),
      y:r.nextDoubleRange(MIN, MAX),
      val:r.nextGaussian(15,10)
    });
  }

  tot = n;
  for (let i = 0; i < tot; ++i) {
    loot.weapon.push( {
      x:r.nextDoubleRange(MIN, MAX),
      y:r.nextDoubleRange(MIN, MAX),
      val:0}
    );
  }

  tot = Math.floor(n/3);
  tot = (tot === 0) ? 1 : tot;
  for (let i = 0; i < tot; ++i) {
    loot.rangeUp.push({
      x:r.nextDoubleRange(MIN, MAX),
      y:r.nextDoubleRange(MIN, MAX),
      val:750
    });
  }

  tot = Math.floor(n/3);
  tot = (tot === 0) ? 1 : tot;
  for (let i = 0; i < tot; ++i) {
    loot.damageUp.push({
      x:r.nextDoubleRange(MIN, MAX),
      y:r.nextDoubleRange(MIN, MAX),
      val:10
    });
  }

  tot = Math.floor(n/3);
  tot = (tot === 0) ? 1 : tot;
  for (let i = 0; i < tot; ++i) {
    loot.speedUp.push( {
      x:r.nextDoubleRange(MIN, MAX),
      y:r.nextDoubleRange(MIN, MAX),
      val:0.0001}
    );
  }

  return loot;

}

module.exports.genLoot = genLoot;
