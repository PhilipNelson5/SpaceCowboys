// ------------------------------------------------------------------
//
// Provides some utility functions to generate different kinds of random numbers.
//
// ------------------------------------------------------------------
'use strict';
//
// This is used to give a small performance optimization in generating gaussian random numbers.
let usePrevious = false,
  y2 = 0;

// ------------------------------------------------------------------
//
// Generate a uniformly selected random number
//
// ------------------------------------------------------------------
function nextDouble() {
  return Math.random();
}

// ------------------------------------------------------------------
//
// Generate a uniformly selected random 'integer' within the range [min, max].
//
// ------------------------------------------------------------------
function nextRange(min, max) {
  return Math.floor((Math.random() * (max - min + 1)) + min);
}

// ------------------------------------------------------------------
//
// Generate a uniformly selected random 'integer' within the range [min, max).
//
// ------------------------------------------------------------------
function nextDoubleRange(min, max) {
  return (Math.random() * (max - min)) + min;
}

// ------------------------------------------------------------------
//
// Generate a uniformly selected vector (x,y) around the circumference of a
// unit circle.
//
// ------------------------------------------------------------------
function nextCircleVector(scale) {
  let angle = Math.random() * 2 * Math.PI;

  return {
    x: Math.cos(angle) * scale,
    y: Math.sin(angle) * scale
  };
}

// ------------------------------------------------------------------
//
// Generate a normally distributed random number.
//
// ------------------------------------------------------------------
function nextGaussian(mean, stdDev) {
  let x1 = 0,
    x2 = 0,
    y1 = 0,
    z = 0;

    //
    // This is our early out optimization.  Every other time this function is called
    // the number is quickly selected.
  if (usePrevious) {
    usePrevious = false;

    return mean + y2 * stdDev;
  }

  usePrevious = true;

  do {
    x1 = 2 * Math.random() - 1;
    x2 = 2 * Math.random() - 1;
    z = (x1 * x1) + (x2 * x2);
  } while (z >= 1);

  z = Math.sqrt((-2 * Math.log(z)) / z);
  y1 = x1 * z;
  y2 = x2 * z;

  return mean + y1 * stdDev;
}

module.exports.nextDouble = nextDouble;
module.exports.nextRange = nextRange;
module.exports.nextDoubleRange = nextDoubleRange;
module.exports.nextCircleVector = nextCircleVector;
module.exports.nextGaussian = nextGaussian;
