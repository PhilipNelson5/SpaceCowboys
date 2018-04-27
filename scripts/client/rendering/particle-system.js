/* global nextRange */
/* global nextGaussian */
/* global nextCircleVector */
/* global nextCircleVectorRange */
Game.ParticleSystem = (function (graphics, assets) {
  'use-strict';

  let effects = [];

  /**
   * updates all active effects
   * @param {double} dt - the delta time or time since the last frame
   * @return {undefined}
   */
  function update(dt) {
    let keepMe = [];

    for (let i = 0; i < effects.length; ++i) {
      effects[i].update(dt);
      effects[i].duration -= dt;
      if (!effects[i].done)
        keepMe.push(effects[i]);
    }

    effects.length = 0;
    effects = keepMe;
  }

  /**
   * renders all active effects
   * @return {undefined}
   */
  function render(playerPos) {
    for (let i = 0; i < effects.length; ++i)
      effects[i].render(playerPos);
  }

  /**
   * clears all active effects
   * @return {undefined}
   */
  function clear() {
    effects.length = 0;
  }

  /**
   * @typedef {Object} pos
   * @property {double} x The X Coordinate
   * @property {double} y The Y Coordinate
   */

  /**
   * @param {double} pos1 - is the start/tail of the vector
   * @param {double} pos2 - is the end/head of the vector
   * @return {pos} - a unit vector in the direction from pos1 to pos2
   */
  function makeVector(pos1, pos2) {
    let pos = {x: pos2.x-pos1.x, y: pos2.y-pos1.y};
    let mag = Math.sqrt(pos.x*pos.x + pos.y*pos.y);
    pos.x /= mag;
    pos.y /= mag;
    return pos;
  }

  /**
   * @param {double} pos1 - the position of the player
   * @param {double} pos2 - the position of the particle
   * @return {boolean} - whether or not the particle is in view of the player
   */
  function inView(pos1, pos2) {
    let distance = Math.sqrt(Math.pow(pos1.x - pos2.x, 2)
      + Math.pow(pos1.y - pos2.y, 2));
    return distance < 0.75;
  }

  /**
   * @param {object} spec {
   * position     : {x: <px>, y: e<px>},      // center x and y location
   * image        : '/textures/image',        // path to image
   * duration     : 50 ,                      // duration to create particles
   * fade         : 500,                      // fade at this many ms left in particle life
   * fill         : {w: 50, h: 10},           // The area to fill with the effect
   * lifetime     : {mean: 1000, stdev: 250}, // ms for particle lifetime
   * particleRate : 3000,                     // particles created per second
   * size         : {mean: 10, stdev: 5},     // size of particles
   * speed        : {mean: .1, stdev: .025},  // speed of particles
   * spread       : {mean: 0, stdev: 0},      // time when particle starts rendering
   * }
   * @return {undefined}
   */
  function createFill(spec) {
    let that = {done:false, duration:spec.duration};
    let particles = [];
    that.render = function(playerPos) {
      let p = null,
        alpha = 1;
      for (let i = 0; i < particles.length; ++i) {
        p = particles[i];
        if (p.alive >= p.spread && inView(playerPos, p.position)) {
          if (p.lifetime-p.alive <= 500) {
            alpha = (p.lifetime - p.alive)/spec.fade;
          } else alpha = 1;
          graphics.alpha(alpha);
          graphics.drawImage(
            spec.image,
            p.position,
            {width: p.size, height: p.size},
            true
          );
        }
      }
      graphics.alpha(1);
    };

    that.update = function(dt) {
      if (particles.length === 0 && that.duration <= 0) {
        that.done = true;
      }
      let keepMe = [];

      let p = null;
      for (let i = 0; i < particles.length; ++i) {
        p = particles[i];
        p.alive += dt;
        p.position.x += (dt * p.speed * p.direction.x);
        p.position.y += (dt * p.speed * p.direction.y);
        p.rotation += p.speed / .5;

        if (p.alive <= p.lifetime) {
          keepMe.push(p);
        }
      }

      if (that.duration > 0)
      {
        for (let i = 0; i < spec.particleRate*dt*.001; ++i) {
          let x = nextRange(spec.position.x-spec.fill.w/2, spec.position.x+spec.fill.w/2);
          let y = nextRange(spec.position.y-spec.fill.h/2, spec.position.y+spec.fill.h/2);
          p = {
            position: {x,y},
            direction: makeVector(spec.position,{x,y}),
            speed: nextGaussian( spec.speed.mean, spec.speed.stdev ),  // pixels per millisecond
            rotation: 0,
            lifetime: nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),  // milliseconds
            alive: 0,
            size: nextGaussian(spec.size.mean, spec.size.stdev),
            spread: nextGaussian(spec.spread.mean, spec.spread.stdev),
          };
          keepMe.push(p);
        }
      }
      particles = keepMe;
    };

    effects.push(that);
  }

  /**
   * @param {object} spec {
   * duration     : duration to create particles
   * fade         : fade at this many ms left in particle life
   * image        : path to image
   * lifetime     : {mean: 1000, stdev: 250} ms for particle lifetime
   * particleRate : the particles to create per second
   * position     : {x: <px>, y: e<px>} center x and y location
   * size         : {mean: 30, stdev: 5} size of the particles
   * speed        : {mean: .25, stdev: .025} speed of the particles
   * spread       : {mean: 250, stdev: 100} when the particle starts rendering
   * }
   * @return {undefined}
   */
  function createPoint(spec) {
    spec.id = 0;
    let that = {done:false, duration:spec.duration};
    let particles = [];
    that.render = function(playerPos) {
      let p = null,
        alpha = 1;
      for (let i = 0; i < particles.length; ++i) {
        p = particles[i];
        if (p.alive >= p.spread && inView(playerPos, p.position)) {
          if (p.lifetime-p.alive <= 500) {
            alpha = (p.lifetime - p.alive)/spec.fade;
          } else alpha = 1;
          graphics.alpha(alpha);
          graphics.drawImage(
            spec.image,
            p.position,
            {width:p.size, height:p.size},
            true
          );
        }
      }
      graphics.alpha(1);
    };

    that.update = function(dt) {
      if (particles.length === 0 && that.duration <= 0) {
        that.done = true;
      }
      let keepMe = [];

      let p = null;
      for (let i = 0; i < particles.length; ++i) {
        p = particles[i];
        p.alive += dt;
        p.position.x += (dt * p.speed * p.direction.x);
        p.position.y += (dt * p.speed * p.direction.y);
        p.rotation += p.speed / .5;

        if (p.alive <= p.lifetime) {
          keepMe.push(p);
        }
      }

      if (that.duration > 0)
      {
        for (let i = 0; i < spec.particleRate*dt*.001; ++i) {
          p = {
            id : ++spec.id,
            position: { x: spec.position.x, y: spec.position.y },
            direction: nextCircleVector(1),
            speed: nextGaussian( spec.speed.mean, spec.speed.stdev ),  // pixels per millisecond
            rotation: 0,
            lifetime: nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),  // milliseconds
            alive: 0,
            size: nextGaussian(spec.size.mean, spec.size.stdev),
            spread: nextGaussian(spec.spread.mean, spec.spread.stdev),
          };
          keepMe.push(p);
        }
      }
      particles = keepMe;
    };

    effects.push(that);
  }

  /**
   * @param {object} spec {
   * duration     : duration to create particles
   * fade         : fade at this many ms left in particle life
   * image        : path to image
   * lifetime     : {mean: 1000, stdev: 250} ms for particle lifetime
   * particleRate : the particles to create per second
   * position     : {x: <px>, y: e<px>} center x and y location
   * size         : {mean: 30, stdev: 5} size of the particles
   * speed        : {mean: .25, stdev: .025} speed of the particles
   * spread       : {mean: 250, stdev: 100} when the particle starts rendering
   * }
   * @return {undefined}
   */
  function createGravityPoint(spec) {
    let that = {done:false, duration:spec.duration};
    let particles = [];
    let image = spec.image;

    that.render = function() {
      let p = null,
        alpha = 1;
      for (let i = 0; i < particles.length; ++i) {
        p = particles[i];
        if (p.alive >= p.spread) {
          if (p.lifetime-p.alive <= 500) {
            alpha = (p.lifetime - p.alive)/spec.fade;
          }
          graphics.drawImage(
            p.s,
            p.size,
            p.rotation,
            alpha,
            image
          );
        }
      }
    };

    that.update = function(dt) {
      if (particles.length === 0 && that.duration <= 0) {
        that.done = true;
      }
      let keepMe = [];

      let p = null;
      let tn;
      let t;
      for (let i = 0; i < particles.length; ++i) {
        tn = performance.now();
        p = particles[i];
        t = (tn - p.t0)/1000;
        p.alive += dt;
        p.s.x += (p.v0 * p.direction.x * t) + (.5 * p.a.x * t * t);
        p.s.y += (p.v0 * p.direction.y * t) + (.5 * p.a.y * t * t);
        p.rotation += p.speed / .5;

        if (p.alive <= p.lifetime && p.s.y <= p.s0.y) {
          keepMe.push(p);
        }
      }

      if (that.duration > 0)
      {
        for (let i = 0; i < spec.particleRate*dt*.001; ++i) {
          p = {
            t0: performance.now(),
            direction: nextCircleVectorRange(spec.angle.min, spec.angle.max),
            s: { x: spec.position.x, y: spec.position.y },
            s0: { x: spec.position.x, y: spec.position.y },
            v0: nextGaussian( spec.vel.mean, spec.vel.stdev ),  // pixels per millisecond
            a: {x: 0, y: 9.81},
            rotation: 0,
            lifetime: nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),  // milliseconds
            alive: 0,
            size: nextGaussian(spec.size.mean, spec.size.stdev),
            spread: nextGaussian(spec.spread.mean, spec.spread.stdev),
            speed: nextGaussian( spec.speed.mean, spec.speed.stdev ),  // pixels per millisecond
          };
          keepMe.push(p);
        }
      }
      particles = keepMe;
    };

    effects.push(that);
  }

  function newPlayerDeath(spec) {
    createPoint({
      position: { x: spec.position.x, y: spec.position.y},
      image : assets['splat'],
      duration : 250,
      fade : 100,
      lifetime : {mean: 1000, stdev: 100},
      particleRate : 500,
      size : {mean: 0.015, stdev: 0.005},
      speed : {mean: 0.00005, stdev: 0.00001},
      spread : {mean: 0.3, stdev: 0.075},
    });
  }

  function newMissileExplosion(spec) {
    createPoint({
      position: { x: spec.position.x, y: spec.position.y},
      image : assets['blue-particle'],
      duration : 100,
      fade : 75,
      lifetime : {mean: 250, stdev: 100},
      particleRate : 500,
      size : {mean: 0.01, stdev: 0.005},
      speed : {mean: 0.0002, stdev: 0.000075},
      spread : {mean: 0.03, stdev: 0.001},
    });
  }

  function newGravity(spec) {
    createGravityPoint({
      position: { x: spec.position.x, y: spec.position.y},
      duration : 10,
      fade : 500,
      fill : { w: 50, h: 10 },
      image : assets['splat'],
      lifetime : {mean: 2500, stdev: 250},
      particleRate : 2000,
      size : {mean: 10, stdev: 5},
      vel : {mean: 5, stdev: 1},
      speed : {mean: .1, stdev: .025},
      spread : {mean: 0, stdev: 0},
      angle : {min : -1, max: -3},
    });
  }

  return {
    render,
    update,
    createPoint,
    createFill,
    newMissileExplosion,
    newGravity,
    newPlayerDeath,
    clear,
  };

}(Game.graphics, Game.assets));
