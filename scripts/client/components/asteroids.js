Game.components.Asteroid = function(world) {

  let asteroids = [];

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

  let asteroid1 = {
    size: { width: 0.3, height: 0.3},
    position: { x: 1, y: 1}
  }

  let asteroid2 = {
    size: { width: 0.2, height: 0.2},
    position: { x: 3, y: 3}
  }

  let asteroid3 = {
    size: { width: 0.2, height: 0.2},
    position: { x: 3.3, y: 2.7}
  }

  let asteroid4 = {
    size: { width: 0.7, height: 0.7},
    position: { x: 1.2, y: 2.9}
  }

  let asteroid5 = {
    size: { width: 0.3, height: 0.3},
    position: { x: 1, y: 2.4}
  }

  let asteroid6 = {
    size: { width: 0.2, height: 0.2},
    position: { x: 1.5, y: 2.5}
  }

  asteroids.push(asteroid1);
  asteroids.push(asteroid2);
  asteroids.push(asteroid3);
  asteroids.push(asteroid4);
  asteroids.push(asteroid5);
  asteroids.push(asteroid6);
    
  return asteroids;

};
