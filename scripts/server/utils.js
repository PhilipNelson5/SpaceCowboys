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
    },
    id = 0;

  let tot;
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
      id : ++id
    });
  }

  tot = 3*n;
  for (let i = 0; i < tot; ++i) {
    loot.ammo.push({
      position : {
        x:r.nextDoubleRange(MIN, MAX),
        y:r.nextDoubleRange(MIN, MAX),
      },
      radius: 0.02,
      val: r.nextGaussian(15,10),
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
      id : ++id
    });
  }

  console.log(JSON.stringify(loot));
  return loot;

}

module.exports.genLoot = genLoot;
