//--------------------------------------------------------------
//
// random generation of asteroids
//
//--------------------------------------------------------------

'use strict';

const r = require('./random');

function getAsteroids() {

  let asteroids = [];
  const NUM = 6;
  const MIN_SIZE = 0.2;
  const MAX_SIZE = 0.7;
  const MIN_POS = 0.52;
  const MAX_POS = 3.48;

  for (let i = 0; i < NUM; i++) {
    let size = r.nextDoubleRange(MIN_SIZE, MAX_SIZE);
    let asteroid = {
      size: {
        width: size,
        height: size
      },
      position: {
        x: r.nextDoubleRange(MIN_POS, MAX_POS),
        y: r.nextDoubleRange(MIN_POS, MAX_POS)
      },
      radius: (size / 2)
    };
    asteroids.push(asteroid);
  }

  return asteroids;
}

module.exports.getAsteroids = getAsteroids;
