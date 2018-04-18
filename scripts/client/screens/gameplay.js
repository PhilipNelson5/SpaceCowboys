Game.screens['gameplay'] = (function(menu, input, keyBindings, graphics, assets, components, socket) {
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
    nextExplosionId = 1,
    missiles = {},
    explosions = {},
    networkQueue = Queue.create();

  // let mouseCapture = false,
  let myMouse = input.Mouse(),
    myKeyboard = input.Keyboard(),
	myKeys = keyBindings.keys,
    cancelNextRequest = false;

  let background = null;

  let world = {
    get left() { return 0; },
    get top() { return 0; },
    get width() { return 4.375; },
    get height() { return 2.5; },
    get bufferSize() { return 0.50 }
  };

  let worldBuffer = {
    get left() { return world.left + world.bufferSize; },
    get top() { return world.top + world.bufferSize; },
    get right() { return world.width - world.bufferSize; },
    get bottom() { return world.height - world.bufferSize; }
  };

  Object.defineProperty(world, 'buffer', {
    get: function() { return worldBuffer },
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
	model.ammo   = data.ammo;
	model.score.place = data.score.place;
	model.score.kills = data.score.kills;

	playerSelf = {
	  model: model,
      texture: components.AnimatedSprite ({
	  spriteSheet: Game.assets['player-self'],
      spriteSize: { width: 0.07, height : 0.07 },
      spriteCenter: {x : 0.5, y : 0.5},
      spriteCount: 10,
      spriteTime: [ 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
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
      spriteTime: [ 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
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
	playerSelf.model.ammo   = data.ammo;
	playerSelf.model.score.place = data.score.place;
	playerSelf.model.score.kills = data.score.kills;


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
    explosions[nextExplosionId] = components.AnimatedSprite({
      id: nextExplosionId++,
      spriteSheet: Game.assets['explosion'],
      spriteSize: { width: 0.07, height: 0.07 },
      spriteCenter: data.position,
      spriteCount: 16,
      spriteTime: [ 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
    });

    //
    // When we receive a hit notification, go ahead and remove the
    // associated missle from the client model.
    delete missiles[data.missileId];
  }

  //------------------------------------------------------------------
  //
  // Handler for receiving notice that a missile has hit you.
  //
  //------------------------------------------------------------------
  function missileHitYou(data) {
    // TODO: Some effect to alert the player that they were hit
    playerSelf.model.health -= data;
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
      }
    }
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

    /*
    myTexture = graphics.Texture( {
      image : assets['player-self'],
      center : { x : 100, y : 100 },
      width : 100, height : 100,
      rotation : 0,
      moveRate : 200,       // pixels per second
      rotateRate : 3.14159  // Radians per second
    });
    */

    myKeyboard.registerHandler(elapsedTime => {
      let message = {
        id: messageId++,
        elapsedTime: elapsedTime,
        type: NetworkIds.INPUT_MOVE_UP
      };
      socket.emit(NetworkIds.INPUT, message);
      messageHistory.enqueue(message);
      playerSelf.model.moveUp(playerSelf.texture,elapsedTime);
    },
    myKeys.forward, true);

    myKeyboard.registerHandler(elapsedTime => {
      let message = {
        id: messageId++,
        elapsedTime: elapsedTime,
        type: NetworkIds.INPUT_MOVE_DOWN
      };
      socket.emit(NetworkIds.INPUT, message);
      messageHistory.enqueue(message);
      playerSelf.model.moveDown(playerSelf.texture,elapsedTime);
    },
    myKeys.back, true);

    myKeyboard.registerHandler(elapsedTime => {
      let message = {
        id: messageId++,
        elapsedTime: elapsedTime,
        type: NetworkIds.INPUT_MOVE_RIGHT
      };
      socket.emit(NetworkIds.INPUT, message);
      messageHistory.enqueue(message);
      playerSelf.model.moveRight(playerSelf.texture,elapsedTime); 
    },
    myKeys.right, true);

    myKeyboard.registerHandler(elapsedTime => {
      let message = {
        id: messageId++,
        elapsedTime: elapsedTime,
        type: NetworkIds.INPUT_MOVE_LEFT
      };
      socket.emit(NetworkIds.INPUT, message);
      messageHistory.enqueue(message);
      playerSelf.model.moveLeft(playerSelf.texture,elapsedTime);
    },
    myKeys.left, true);

    myMouse.registerCommand('mousedown', function(e, elapsedTime) {
      // mouseCapture = true;
      let message = {
        id: messageId++,
        elapsedTime: elapsedTime,
        type: NetworkIds.INPUT_FIRE
      };
      socket.emit(NetworkIds.INPUT, message);

    }, true);

    // myMouse.registerCommand('mouseup', function(e, elapsedTime) {
    // mouseCapture = false;
    // });

    myMouse.registerCommand('mousemove', function(e) {
      // if (mouseCapture) { }
      playerSelf.model.target = {x : e.clientX, y : e.clientY};
    });
  }

  //------------------------------------------------------------------
  //
  // Update the game simulation
  //
  //------------------------------------------------------------------
  function update(elapsedTime) {
    playerSelf.texture.update(elapsedTime);

    // rotates the player if needed and updates server
    // this is an attempt to reduce load on the server
    // by only sending one rotational update per frame
    if (playerSelf.model.rotate()) {
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
    myKeyboard.update(elapsedTime);
    myMouse.update(elapsedTime);

    // TODO: go here
    graphics.viewport.update(playerSelf.model);
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
    graphics.Player.render(playerSelf.model, playerSelf.texture);
    //graphics.AnimatedSprite.render(playerSelf.texture,playerSelf.model.direction);

    for (let id in playerOthers) {
      let player = playerOthers[id];
      graphics.PlayerRemote.render(player.model,player.texture);
    }
    graphics.endClip();

    for (let missile in missiles) {
      graphics.Missile.render(missiles[missile]);
    }

    for (let id in explosions) {
      graphics.AnimatedSprite.render(explosions[id]);
    }

    //draw Buildings AFTER clip or else they be underneath it

    graphics.drawFog(playerSelf.model.direction + Math.PI/2);

    //TODO 100 is the max health
    graphics.drawHealth(playerSelf.model.health, 100);

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

}(Game.menu, Game.input, Game.keyBindings, Game.graphics, Game.assets, Game.components, Game.network.socket));
