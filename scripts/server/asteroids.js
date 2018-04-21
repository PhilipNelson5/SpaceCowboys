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

  /*
  // TODO: the wall
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (i == 0 || i == 7 || j == 0 || j==7) {
        let asteroid = {
          size: { width: 0.5, height: 0.5},
          position: { x: world.left + 0.25 + i * 0.5, y: world.top + 0.25 + j * 0.5}
        }
        asteroids.push(asteroid);
      }
    }
  }
  */

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
    }
    asteroids.push(asteroid);
  }

  return asteroids;

}

module.exports.getAsteroids = getAsteroids;
