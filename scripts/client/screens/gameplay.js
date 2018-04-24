Game.screens['gameplay'] = (function(menu, input, keyBindings, graphics, particleSystem, assets, components, socket) {
  'use strict';

  //let Queue = require('../../shared/queue.js');
  /*
  require(['../shared/queue.js'], function (queue) {
    //foo is now loaded.
  });
  */

  let lastTimeStamp = performance.now(),
    playerSelf = {},
    playerOthers = {},
    messageHistory = Queue.create(),
    messageId = 1,
    // nextExplosionId = 1,
    missiles = {},
    explosions = {},
    networkQueue = Queue.create(),
    playersAlive = 0;

  let loot = {
    health    : [],
    shield    : [],
    ammo      : [],
    weapon    : [],
    rangeUp   : [],
    damageUp  : [],
    speedUp   : []
  };

  let asteroids = [];

  // let mouseCapture = false,
  let myMouse = input.Mouse(),
    myKeyboard = input.Keyboard(),
    myKeys = keyBindings.keys,
    cancelNextRequest = false;
  let background = null;

  let world = {
    get left() { return 0; },
    get top() { return 0; },
    get width() { return 8.0; },
    get height() { return 8.0; },
    get bufferSize() { return 0.62; }
  };

  let worldBuffer = {
    get left() { return world.left + world.bufferSize; },
    get top() { return world.top + world.bufferSize; },
    get right() { return world.width - world.bufferSize; },
    get bottom() { return world.height - world.bufferSize; }
  };

  Object.defineProperty(world, 'buffer', {
    get: function() { return worldBuffer; },
    enumerable: true,
    configurable: false
  });

  socket.on(NetworkIds.CONNECT_OTHER, data => {
    networkQueue.enqueue({
      type: NetworkIds.CONNECT_OTHER,
      data: data
    });
  });

  socket.on(NetworkIds.DISCONNECT_OTHER, data => {
    networkQueue.enqueue({
      type: NetworkIds.DISCONNECT_OTHER,
      data: data
    });
  });

  socket.on(NetworkIds.UPDATE_SELF, data => {
    networkQueue.enqueue({
      type: NetworkIds.UPDATE_SELF,
      data: data
    });
  });

  socket.on(NetworkIds.UPDATE_OTHER, data => {
    networkQueue.enqueue({
      type: NetworkIds.UPDATE_OTHER,
      data: data
    });
  });

  socket.on(NetworkIds.MISSILE_NEW, data => {
    networkQueue.enqueue({
      type: NetworkIds.MISSILE_NEW,
      data: data
    });
  });

  socket.on(NetworkIds.MISSILE_HIT, data => {
    networkQueue.enqueue({
      type: NetworkIds.MISSILE_HIT,
      data: data
    });
  });

  socket.on(NetworkIds.INIT_PLAYER_MODEL, data => {
    networkQueue.enqueue({
      type: NetworkIds.INIT_PLAYER_MODEL,
      data: data
    });
  });

  socket.on(NetworkIds.INIT_ENEMY_MODEL, data => {
    networkQueue.enqueue({
      type: NetworkIds.INIT_ENEMY_MODEL,
      data: data
    });
  });

  socket.on(NetworkIds.MISSILE_HIT_YOU, data => {
    networkQueue.enqueue({
      type: NetworkIds.MISSILE_HIT_YOU,
      data: data
    });
  });

  socket.on(NetworkIds.STARTING_LOOT, data => {
    networkQueue.enqueue({
      type: NetworkIds.STARTING_LOOT,
      data: data
    });
  });

  socket.on(NetworkIds.LOOT_UPDATE, data => {
    networkQueue.enqueue({
      type: NetworkIds.LOOT_UPDATE,
      data: data
    });
  });

  socket.on(NetworkIds.STARTING_ASTEROIDS, data => {
    networkQueue.enqueue({
      type: NetworkIds.STARTING_ASTEROIDS,
      data: data
    });
  });

  socket.on(NetworkIds.UPDATE_ALIVE_PLAYERS, data => {
    networkQueue.enqueue({
      type: NetworkIds.UPDATE_ALIVE_PLAYERS,
      data: data
    });
  });

  socket.on(NetworkIds.PLAYER_DEATH, data => {
    networkQueue.enqueue({
      type: NetworkIds.PLAYER_DEATH,
      data: data
    });
  });

  socket.on(NetworkIds.PICKED_UP_LOOT, data => {
    networkQueue.enqueue({
      type: NetworkIds.PICKED_UP_LOOT,
      data: data
    });
  });

  //------------------------------------------------------------------
  //
  // collision function
  //
  //------------------------------------------------------------------
  function collided(obj1, obj2) {
    let distance = Math.sqrt(Math.pow(obj1.position.x - obj2.position.x, 2)
      + Math.pow(obj1.position.y - obj2.position.y, 2));
    let radii = obj1.radius + obj2.radius;

    return distance < radii;
  }

  //------------------------------------------------------------------
  //
  // Handler for when the server ack's the socket connection.  We receive
  // the state of the newly connected player model.
  //
  //------------------------------------------------------------------
  function connectPlayerSelf(data) {
    let model = components.Player();
    model.position.x = data.position.x;
    model.position.y = data.position.y;

    model.size.x = data.size.x;
    model.size.y = data.size.y;

    model.direction = data.direction;
    model.speed = data.speed;
    model.rotateRate = data.rotateRate;

    model.health = data.health;
    model.shield = data.shield;

    model.ammo = data.ammo;
    model.hasWeapon = data.hasWeapon;

    model.score.place = data.score.place;
    model.score.kills = data.score.kills;

    model.dead = false;

    playerSelf = {
      model: model,
      texture: components.AnimatedSprite ({
        spriteSheet: Game.assets['player-self'],
        spriteSize: { width: 0.07, height : 0.07 },
        spriteCenter: {x : 0.5, y : 0.5},
        spriteCount: 10,
        spriteTime: [ 50, 50, 50, 50, 50, 50, 50, 50, 50, 50 ],
      })
    };
  }

  //------------------------------------------------------------------
  //
  // Handler for when a new player connects to the game.  We receive
  // the state of the newly connected player model.
  //
  //------------------------------------------------------------------
  function connectPlayerOther(data) {
    let model = components.PlayerRemote();
    let texture = components.AnimatedSpriteRemote ({
      spriteSheet: Game.assets['player-other'],
      spriteSize: { width: 0.07, height : 0.07 },
      spriteCount: 10,
      spriteTime: [ 50, 50, 50, 50, 50, 50, 50, 50, 50, 50 ]
    });

    model.state.position.x = data.position.x;
    model.state.position.y = data.position.y;
    model.state.direction = data.direction;
    model.state.lastUpdate = performance.now();

    texture.state.position.x = data.position.x;
    texture.state.position.y = data.position.y;
    texture.state.direction = data.direction;
    texture.state.lastUpdate = performance.now();

    model.goal.position.x = data.position.x;
    model.goal.position.y = data.position.y;
    model.goal.direction = data.direction;
    model.goal.updateWindow = 0;

    texture.goal.position.x = data.position.x;
    texture.goal.position.y = data.position.y;
    texture.goal.direction = data.direction;
    texture.goal.updateWindow = 0;

    model.size.x = data.size.x;
    model.size.y = data.size.y;

    playerOthers[data.clientId] = {
      model: model,
      texture: texture
    };
  }

  //------------------------------------------------------------------
  //
  // Handler for when another player disconnects from the game.
  //
  //------------------------------------------------------------------
  function disconnectPlayerOther(data) {
    delete playerOthers[data.clientId];
  }

  //------------------------------------------------------------------
  //
  // Handler for receiving state updates about the self player.
  //
  //------------------------------------------------------------------
  function updatePlayerSelf(data) {
    playerSelf.model.position.x = data.position.x;
    playerSelf.texture.center.x = data.position.x;
    playerSelf.model.position.y = data.position.y;
    playerSelf.texture.center.y = data.position.y;
    playerSelf.model.direction = data.direction;
    playerSelf.model.health = data.health;
    playerSelf.model.shield = data.shield;
    playerSelf.model.ammo = data.ammo;
    playerSelf.model.hasWeapon = data.hasWeapon;
    playerSelf.model.score.kills = data.score.kills;
    playerSelf.model.score.place = data.score.place;

    //
    // Remove messages from the queue up through the last one identified
    // by the server as having been processed.
    let done = false;
    while (!done && !messageHistory.empty) {
      if (messageHistory.front.id === data.lastMessageId) {
        done = true;
      }
      messageHistory.dequeue();
    }

    //
    // Update the client simulation since this last server update, by
    // replaying the remaining inputs.
    let memory = Queue.create();
    while (!messageHistory.empty) {
      let message = messageHistory.dequeue();
      memory.enqueue(message);
    }
    messageHistory = memory;
  }

  //------------------------------------------------------------------
  //
  // Handler for receiving state updates about other players.
  //
  //------------------------------------------------------------------
  function updatePlayerOther(data) {
    console.log('update other');
    if (playerOthers.hasOwnProperty(data.clientId)) {
      let model = playerOthers[data.clientId].model;
      let player = playerOthers[data.clientId].texture;

      model.goal.updateWindow = data.updateWindow;
      model.goal.position.x = data.position.x;
      model.goal.position.y = data.position.y;
      model.goal.direction = data.direction;

      player.goal.position.x = data.position.x;
      player.goal.position.y = data.position.y;
      player.goal.updateWindow = data.updateWindow;
      player.goal.direction = data.direction;
    }
  }

  //------------------------------------------------------------------
  //
  // Handler for receiving notice of a new missile in the environment.
  //
  //------------------------------------------------------------------
  function missileNew(data) {
    missiles[data.id] = components.Missile({
      id: data.id,
      radius: data.radius,
      speed: data.speed,
      direction: data.direction,
      position: {
        x: data.position.x,
        y: data.position.y
      },
      timeRemaining: data.timeRemaining
    });

  }

  //------------------------------------------------------------------
  //
  // Handler for receiving notice that a missile has hit a player.
  //
  //------------------------------------------------------------------
  function missileHit(data) {
    particleSystem.newMissileExplosion({position:data.position});

    let distance = Math.sqrt(Math.pow(playerSelf.model.position.x - data.position.x, 2)
    + Math.pow(playerSelf.model.position.y - data.position.y,2));
    if (distance < .52)
    {
      Game.assets['audio-impact'].currentTime = 0;
      Game.assets['audio-impact'].play();
    }

    //
    // When we receive a hit notification, go ahead and remove the
    // associated missile from the client model.
    delete missiles[data.missileId];
  }

  //------------------------------------------------------------------
  //
  // Handler for receiving notice that a missile has hit you.
  //
  //------------------------------------------------------------------
  function missileHitYou(data) {
    // TODO: Some effect to alert the player that they were hit
    playerSelf.model.health = data.health;
    playerSelf.model.shield = data.shield;
    if (playerSelf.model.health <= 0)
    {
      Game.assets['audio-impact'].currentTime = 0;
      Game.assets['audio-death'].play();
    }
    else {
      Game.assets['audio-impact'].currentTime = 0;
      Game.assets['audio-impact'].play();
    }
  }

  function initLoot(data) {
    loot.health    = data.loot.health;
    loot.shield    = data.loot.shield;
    loot.ammo      = data.loot.ammo;
    loot.weapon    = data.loot.weapon;
    loot.rangeUp   = data.loot.rangeUp;
    loot.damageUp  = data.loot.damageUp;
    loot.speedUp   = data.loot.speedUp;
  }

  function pickedUpLoot(data) {
    switch (data.type) {
    case 1:
      Game.assets['audio-health'].play();
      break;
    case 2:
      Game.assets['audio-hypershield'].play();
      break;
    case 3:
      Game.assets['audio-ammo'].play();
      break;
    case 4:
      Game.assets['audio-weaponpickup'].play();
      break;
    case 5:
      Game.assets['audio-weaponrange'].play();
      break;
    case 6:
      Game.assets['audio-weapondamage'].play();
      break;
    case 7:
      Game.assets['audio-hyperspeed'].play();
      break;

    }
  }

  function lootUpdate(data) {
    let found = false;
    for (let id of data.takenLoot) {
      found = false;
      for (let l in loot) {
        for (let e = 0; e < loot[l].length; ++e) {
          if (id === loot[l][e].id) {
            loot[l].splice(e, 1);
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }
  }

  function playerElimination(data) {
    console.log(JSON.stringify(data));
    particleSystem.newPlayerDeath({position:data.position});
  }

  //------------------------------------------------------------------
  //
  // Process the registered input handlers here.
  //
  //------------------------------------------------------------------
  function processInput(elapsedTime) {
    //
    // Start with the keyboard updates so those messages can get in transit
    // while the local updating of received network messages are processed.
    if (playerSelf.model != null && playerSelf.model.health > 0)
      myKeyboard.update(elapsedTime);

    //
    // Double buffering on the queue so we don't asynchronously receive messages
    // while processing.
    let processMe = networkQueue;
    networkQueue = networkQueue = Queue.create();
    while (!processMe.empty) {
      let message = processMe.dequeue();
      switch (message.type) {
      case NetworkIds.DISCONNECT_OTHER:
        disconnectPlayerOther(message.data);
        break;
      case NetworkIds.UPDATE_SELF:
        updatePlayerSelf(message.data);
        break;
      case NetworkIds.UPDATE_OTHER:
        updatePlayerOther(message.data);
        break;
      case NetworkIds.INIT_PLAYER_MODEL:
        connectPlayerSelf(message.data);
        break;
      case NetworkIds.INIT_ENEMY_MODEL:
        connectPlayerOther(message.data);
        break;
      case NetworkIds.MISSILE_NEW:
        missileNew(message.data);
        break;
      case NetworkIds.MISSILE_HIT:
        missileHit(message.data);
        break;
      case NetworkIds.MISSILE_HIT_YOU:
        missileHitYou(message.data);
        break;
      case NetworkIds.STARTING_LOOT:
        initLoot(message.data);
        break;
      case NetworkIds.LOOT_UPDATE:
        lootUpdate(message.data);
        break;
      case NetworkIds.STARTING_ASTEROIDS:
        asteroids = message.data.asteroids;
        // TODO: the wall
        for (let i = 0; i < 16; i++) {
          for (let j = 0; j < 16; j++) {
            if (i == 0 || i == 15 || j == 0 || j==15) {
              let asteroid = {
                size: { width: 0.5, height: 0.5},
                position: { x: world.left + 0.25 + i * 0.5, y: world.top + 0.25 + j * 0.5},
                drawOnMap: false
              };
              asteroids.push(asteroid);
            }
          }
        }
        break;
      case NetworkIds.UPDATE_ALIVE_PLAYERS:
        playersAlive = message.data.playersAlive;
        break;
      case NetworkIds.PLAYER_DEATH:
        playerElimination(message.data);
        break;
      case NetworkIds.PICKED_UP_LOOT:
        pickedUpLoot(message.data);
        break;
      }
    }
  }

  function registerControls() {
    // MOVE UP
    myKeyboard.registerHandler(elapsedTime => {
      let player = {
        position: {
          x: playerSelf.model.position.x,
          y: playerSelf.model.position.y - (elapsedTime * playerSelf.model.speed)
        },
        texture: {
          x: playerSelf.texture.center.x,
          y: playerSelf.texture.center.y - (elapsedTime * playerSelf.model.speed)
        },
        radius: playerSelf.model.radius
      };

      if (player.position.y <= world.buffer.top || player.texture.y <= world.buffer.top) {
        playerSelf.model.position.y = world.buffer.top;
        playerSelf.texture.center.y = world.buffer.top;
      } else {
        let move = true;
        for (let i = 0; i < asteroids.length; i++) {
          if (collided(player, asteroids[i])) move = false;
        }
        if (move) {
          let message = {
            id: messageId++,
            elapsedTime: elapsedTime,
            type: NetworkIds.INPUT_MOVE_UP
          };
          socket.emit(NetworkIds.INPUT, message);
          playerSelf.model.moveUp(playerSelf.texture, elapsedTime);
          messageHistory.enqueue(message);
        } else {
          let message = {
            id: messageId++,
            elapsedTime: elapsedTime,
            type: NetworkIds.INPUT_MOVE_DOWN
          };
          socket.emit(NetworkIds.INPUT, message);
          playerSelf.model.moveDown(playerSelf.texture, elapsedTime);
        }
      }
    },
    myKeys.forward.key, myKeys.forward.id,true);

    // MOVE DOWN
    myKeyboard.registerHandler(elapsedTime => {
      let player = {
        position: {
          x: playerSelf.model.position.x,
          y: playerSelf.model.position.y + (elapsedTime * playerSelf.model.speed)
        },
        texture: {
          x: playerSelf.texture.center.x,
          y: playerSelf.texture.center.y + (elapsedTime * playerSelf.model.speed)
        },
        radius: playerSelf.model.radius
      };

      if (player.position.y >= world.buffer.bottom || player.texture.y >= world.buffer.bottom) {
        playerSelf.model.position.y = world.buffer.bottom;
        playerSelf.texture.center.y = world.buffer.bottom;
      } else {
        let move = true;
        for (let i = 0; i < asteroids.length; i++) {
          if (collided(player, asteroids[i])) move = false;
        }
        if (move) {
          let message = {
            id: messageId++,
            elapsedTime: elapsedTime,
            type: NetworkIds.INPUT_MOVE_DOWN
          };
          socket.emit(NetworkIds.INPUT, message);
          playerSelf.model.moveDown(playerSelf.texture, elapsedTime);
          messageHistory.enqueue(message);
        } else {
          let message = {
            id: messageId++,
            elapsedTime: elapsedTime,
            type: NetworkIds.INPUT_MOVE_UP
          };
          socket.emit(NetworkIds.INPUT, message);
          playerSelf.model.moveUp(playerSelf.texture, elapsedTime);
        }
      }
    },
    myKeys.back.key, myKeys.back.id,true);

    // MOVE RIGHT
    myKeyboard.registerHandler(elapsedTime => {
      let player = {
        position: {
          x: playerSelf.model.position.x + (elapsedTime * playerSelf.model.speed),
          y: playerSelf.model.position.y
        },
        texture: {
          x: playerSelf.texture.center.x + (elapsedTime * playerSelf.model.speed),
          y: playerSelf.texture.center.y
        },
        radius: playerSelf.model.radius
      };

      if (player.position.x >= world.buffer.right || player.texture.x >= world.buffer.right) {
        playerSelf.model.position.x = world.buffer.right;
        playerSelf.texture.center.x = world.buffer.right;
      } else {
        let move = true;
        for (let i = 0; i < asteroids.length; i++) {
          if (collided(player, asteroids[i])) move = false;
        }
        if (move) {
          let message = {
            id: messageId++,
            elapsedTime: elapsedTime,
            type: NetworkIds.INPUT_MOVE_RIGHT
          };
          socket.emit(NetworkIds.INPUT, message);
          playerSelf.model.moveRight(playerSelf.texture, elapsedTime);
          messageHistory.enqueue(message);
        } else {
          let message = {
            id: messageId++,
            elapsedTime: elapsedTime,
            type: NetworkIds.INPUT_MOVE_LEFT
          };
          socket.emit(NetworkIds.INPUT, message);
          playerSelf.model.moveLeft(playerSelf.texture, elapsedTime);
        }
      }
    },
    myKeys.right.key, myKeys.right.id,true);

    // MOVE LEFT
    myKeyboard.registerHandler(elapsedTime => {
      let player = {
        position: {
          x: playerSelf.model.position.x - (elapsedTime * playerSelf.model.speed),
          y: playerSelf.model.position.y
        },
        texture: {
          x: playerSelf.texture.center.x - (elapsedTime * playerSelf.model.speed),
          y: playerSelf.texture.center.y
        },
        radius: playerSelf.model.radius
      };

      if (player.position.x <= world.buffer.left || player.texture.x <= world.buffer.left) {
        playerSelf.model.position.x = world.buffer.left;
        playerSelf.texture.center.x = world.buffer.left;
      } else {
        let move = true;
        player.position.y -= 0.001;
        for (let i = 0; i < asteroids.length; i++) {
          if (collided(player, asteroids[i])) move = false;
        }
        if (move) {
          let message = {
            id: messageId++,
            elapsedTime: elapsedTime,
            type: NetworkIds.INPUT_MOVE_LEFT
          };
          socket.emit(NetworkIds.INPUT, message);
          playerSelf.model.moveLeft(playerSelf.texture, elapsedTime);
          messageHistory.enqueue(message);
        } else {
          let message = {
            id: messageId++,
            elapsedTime: elapsedTime,
            type: NetworkIds.INPUT_MOVE_RIGHT
          };
          socket.emit(NetworkIds.INPUT, message);
          playerSelf.model.moveRight(playerSelf.texture, elapsedTime);
        }
      }
    },
    myKeys.left.key, myKeys.left.id,true);

    myKeyboard.registerHandler(elapsedTime => {
      let message = {
        id: messageId++,
        elapsedTime: elapsedTime,
        type: NetworkIds.INPUT_FIRE
      };
      socket.emit(NetworkIds.INPUT, message);
      messageHistory.enqueue(message);
      if (playerSelf.model.ammo > 0 && playerSelf.model.hasWeapon === true) {
        Game.assets['audio-laser'].currentTime = 0;
        Game.assets['audio-laser'].play();
      }
    },
    myKeys.fire.key, myKeys.fire.id,false);

    myMouse.registerCommand('mousedown', function(e, elapsedTime) {
      // mouseCapture = true;
      let message = {
        id: messageId++,
        elapsedTime: elapsedTime,
        type: NetworkIds.INPUT_FIRE
      };
      socket.emit(NetworkIds.INPUT, message);
      if (playerSelf.model.ammo > 0 && playerSelf.model.hasWeapon === true) {
        Game.assets['audio-laser'].currentTime = 0;
        Game.assets['audio-laser'].play();
      }
    }, true);

    // myMouse.registerCommand('mouseup', function(e, elapsedTime) {
    // mouseCapture = false;
    // });

    myMouse.registerCommand('mousemove', function(e) {
      // if (mouseCapture) { }
      playerSelf.model.target = {x : e.clientX, y : e.clientY};
    });

  }

  function unRegisterControls() {

    myKeyboard.unregisterHandler(myKeys.oldF.key,myKeys.oldF.id);
    myKeyboard.unregisterHandler(myKeys.oldB.key,myKeys.oldB.id);
    myKeyboard.unregisterHandler(myKeys.oldL.key,myKeys.oldL.id);
    myKeyboard.unregisterHandler(myKeys.oldR.key,myKeys.oldR.id);

    registerControls();
  }

  function initialize() {
    menu.addScreen('gameplay',
      `
      <canvas height=100% width=100% id='canvas-main'></canvas>
      `
    );

    graphics.initialize();

    graphics.viewport.set(0, 0, 0.50);

    var backgroundKey = 'background';
    background = components.Tiled( {
      pixel: { width: assets[backgroundKey].width, height: assets[backgroundKey].height },
      size: { width: world.width, height: world.height },
      tileSize: assets[backgroundKey].tileSize,
      assetKey: backgroundKey
    });

    registerControls();
  }

  //------------------------------------------------------------------
  //
  // Update the game simulation
  //
  //------------------------------------------------------------------
  function update(elapsedTime) {

    if (playerSelf.model.health <= 0 && !playerSelf.model.dead ) {
      playerSelf.model.dead = true;
      let message = {
        id: messageId++,
        elapsedTime: elapsedTime,
        type: NetworkIds.DIE,
        data: { }
      };
      socket.emit(NetworkIds.INPUT, message);
      messageHistory.enqueue(message);
    }

    if (playerSelf.model.health > 0)
      playerSelf.texture.update(elapsedTime);


    if (myKeys.keysChanged === true)
    {
      unRegisterControls();
      myKeys.keysChanged = false;
    }

    // rotates the player if needed and updates server
    // this is an attempt to reduce load on the server
    // by only sending one rotational update per frame
    if (playerSelf.model.rotate() && playerSelf.model.health > 0) {
      let message = {
        id: messageId++,
        elapsedTime: elapsedTime,
        type: NetworkIds.INPUT_ROTATE,
        data: { direction : playerSelf.model.direction }
      };
      socket.emit(NetworkIds.INPUT, message);
      messageHistory.enqueue(message);
    }

    // update all other players
    for (let id in playerOthers) {
      playerOthers[id].texture.update(elapsedTime);
    }

    let removeMissiles = [];
    for (let missile in missiles) {
      if (!missiles[missile].update(elapsedTime)) {
        removeMissiles.push(missiles[missile]);
      }
    }

    for (let missile = 0; missile < removeMissiles.length; missile++) {
      delete missiles[removeMissiles[missile].id];
    }

    for (let id in explosions) {
      if (!explosions[id].update(elapsedTime)) {
        delete explosions[id];
      }
    }

    if (playerSelf.model.health>0) {
      myKeyboard.update(elapsedTime);
      myMouse.update(elapsedTime);
    }

    // TODO: go here
    if (playerSelf.model.health > 0)
      graphics.viewport.update(playerSelf.model);

    particleSystem.update(elapsedTime);
  }

  //------------------------------------------------------------------
  //
  // Render the current state of the game simulation
  //
  //------------------------------------------------------------------
  function render() {

    graphics.clear();

    graphics.Tiled.render(background, graphics.viewport);
    graphics.beginClip(playerSelf.model.direction + Math.PI/2, 50);
    if (playerSelf.model.health>0)
      graphics.Player.render(playerSelf.model, playerSelf.texture);

    for (let id in playerOthers) {
      let player = playerOthers[id];
      graphics.PlayerRemote.render(player.model,player.texture);
    }

    graphics.Loot.render(loot);

    graphics.endClip();
    //draw Buildings AFTER clip or else they be underneath it

    for (let missile in missiles) {
      graphics.Missile.render(missiles[missile]);
    }

    for (let id in explosions) {
      graphics.AnimatedSprite.render(explosions[id]);
    }

    for (let a in asteroids) {
      if (asteroids[a].position != undefined) {
        graphics.drawImage(assets['asteroid'], asteroids[a].position, asteroids[a].size, true);
      }
    }

    particleSystem.render(playerSelf.model.position);

    //draw Buildings AFTER clip or else they be underneath it

    graphics.drawFog(playerSelf.model.direction + Math.PI/2);

    graphics.BLACKNESS();
    graphics.drawHealth(playerSelf.model.health, 100, playerSelf.model.shield, 100);
    graphics.drawAmmo(playerSelf.model.ammo);
    graphics.drawMini(assets['background-mini'], playerSelf.model.position, world.width, world.height, asteroids);
    graphics.drawWeapon(playerSelf.model.hasWeapon);
    graphics.drawKills(playerSelf.model.score.kills);
    graphics.drawPlayersAlive(playersAlive);

    if (playerSelf.model.dead) {
      graphics.displayDeathScreen(playerSelf.model.score.kills, playerSelf.model.score.place);
    }

    if (playersAlive == 1) {
      cancelNextRequest = true;
      menu.showScreen('endgame');
    }

  }

  //------------------------------------------------------------------
  //
  // This is the Game Loop function!
  //
  //------------------------------------------------------------------
  function gameLoop(time) {

    let elapsedTime = time - lastTimeStamp;
    lastTimeStamp = time;
    processInput(elapsedTime);
    update(elapsedTime);
    render();

    if (!cancelNextRequest) {
      requestAnimationFrame(gameLoop);
    }
  }

  function run() {
    lastTimeStamp = performance.now();
    //
    // Start the animation loop
    cancelNextRequest = false;
    requestAnimationFrame(gameLoop);
  }

  return {
    initialize,
    run
  };

}(Game.menu, Game.input, Game.keyBindings, Game.graphics, Game.ParticleSystem, Game.assets, Game.components, Game.network.socket));
