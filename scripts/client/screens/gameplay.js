Game.screens['gameplay'] = (function(menu, input, graphics, assets, components, socket) {
  'use strict';

  //let Queue = require('../../shared/queue.js');
  /*
  require(['../shared/queue.js'], function (queue) {
    //foo is now loaded.
  });
  */

  let lastTimeStamp = performance.now(),
    playerSelf = {
      model: components.Player(),
      texture: Game.assets['player-self']
    },
    playerOthers = {},
    messageHistory = Queue.create(),
    messageId = 1,
    nextExplosionId = 1,
    networkQueue = Queue.create();

  var mouseCapture = false,
    //myMouse = input.Mouse(),
    myKeyboard = input.Keyboard(),
    myTexture = null,
    cancelNextRequest = false;

  socket.on(NetworkIds.CONNECT_ACK, data => {
    networkQueue.enqueue({
      type: NetworkIds.CONNECT_ACK,
      data: data
    });
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


  //------------------------------------------------------------------
  //
  // Handler for when the server ack's the socket connection.  We receive
  // the state of the newly connected player model.
  //
  //------------------------------------------------------------------
  function connectPlayerSelf(data) {
    playerSelf.model.position.x = data.position.x;
    playerSelf.model.position.y = data.position.y;

    playerSelf.model.size.x = data.size.x;
    playerSelf.model.size.y = data.size.y;

    playerSelf.model.direction = data.direction;
    playerSelf.model.speed = data.speed;
    playerSelf.model.rotateRate = data.rotateRate;
  }

  //------------------------------------------------------------------
  //
  // Handler for when a new player connects to the game.  We receive
  // the state of the newly connected player model.
  //
  //------------------------------------------------------------------
  function connectPlayerOther(data) {
    let model = components.PlayerRemote();
    model.state.position.x = data.position.x;
    model.state.position.y = data.position.y;
    model.state.direction = data.direction;
    model.state.lastUpdate = performance.now();

    model.goal.position.x = data.position.x;
    model.goal.position.y = data.position.y;
    model.goal.direction = data.direction;
    model.goal.updateWindow = 0;

    model.size.x = data.size.x;
    model.size.y = data.size.y;

    playerOthers[data.clientId] = {
      model: model,
      texture: Game.assets['player-other']
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
    playerSelf.model.position.y = data.position.y;
    playerSelf.model.direction = data.direction;

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
      model.goal.updateWindow = data.updateWindow;

      model.goal.position.x = data.position.x;
      model.goal.position.y = data.position.y;
      model.goal.direction = data.direction;
    }
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
      case NetworkIds.CONNECT_ACK:
        //connectPlayerSelf(message.data);
        console.log('connect ack recieved');
        break;
      case NetworkIds.CONNECT_OTHER:
        connectPlayerOther(message.data);
        break;
      case NetworkIds.DISCONNECT_OTHER:
        disconnectPlayerOther(message.data);
        break;
      case NetworkIds.UPDATE_SELF:
        console.log('update self recieved');
        updatePlayerSelf(message.data);
        break;
      case NetworkIds.UPDATE_OTHER:
        updatePlayerOther(message.data);
        break;
      case NetworkIds.INIT_PLAYER_MODEL:
        console.log('init player model recieved');
        connectPlayerSelf(message.data);
        break;
      }
    }
  }

  function initialize() {
    console.log('        gameplay initializing...');
    console.log(socket.id);
    menu.addScreen('gameplay',
      `
      <canvas height=1000 width=1000 id='canvas-main'></canvas>
			`
    );
    graphics.initialize();

    myTexture = graphics.Texture( {
      image : assets['player-self'],
      center : { x : 100, y : 100 },
      width : 100, height : 100,
      rotation : 0,
      moveRate : 200,       // pixels per second
      rotateRate : 3.14159  // Radians per second
    });

    myKeyboard.registerHandler(elapsedTime => {
      let message = {
        id: messageId++,
        elapsedTime: elapsedTime,
        type: NetworkIds.INPUT_MOVE
      };
      socket.emit(NetworkIds.INPUT, message);
      messageHistory.enqueue(message);
      playerSelf.model.move(elapsedTime);
    },
    input.KeyEvent.DOM_VK_W, true);

    myKeyboard.registerHandler(elapsedTime => {
      let message = {
        id: messageId++,
        elapsedTime: elapsedTime,
        type: NetworkIds.INPUT_ROTATE_RIGHT
      };
      socket.emit(NetworkIds.INPUT, message);
      messageHistory.enqueue(message);
      playerSelf.model.rotateRight(elapsedTime);
    },
    input.KeyEvent.DOM_VK_D, true);

    myKeyboard.registerHandler(elapsedTime => {
      let message = {
        id: messageId++,
        elapsedTime: elapsedTime,
        type: NetworkIds.INPUT_ROTATE_LEFT
      };
      socket.emit(NetworkIds.INPUT, message);
      messageHistory.enqueue(message);
      playerSelf.model.rotateLeft(elapsedTime);
    },
    input.KeyEvent.DOM_VK_A, true);

    myKeyboard.registerHandler(elapsedTime => {
      let message = {
        id: messageId++,
        elapsedTime: elapsedTime,
        type: NetworkIds.INPUT_FIRE
      };
      socket.emit(NetworkIds.INPUT, message);
    },
    input.KeyEvent.DOM_VK_SPACE, false);
    //
    // Create an ability to move the logo using the mouse
    // 
    /*
    myMouse = input.Mouse();
    myMouse.registerCommand('mousedown', function(e) {
      mouseCapture = true;
      myTexture.moveTo({x : e.clientX, y : e.clientY});
    });

    myMouse.registerCommand('mouseup', function() {
      mouseCapture = false;
    });

    myMouse.registerCommand('mousemove', function(e) {
      if (mouseCapture) {
        myTexture.moveTo({x : e.clientX, y : e.clientY});
      }
    });
      */
  }

  function update(elapsedTime) {
    playerSelf.model.update(elapsedTime);
    for (let id in playerOthers) {
      playerOthers[id].model.update(elapsedTime);
    }
    myKeyboard.update(elapsedTime);
    //myMouse.update(elapsedTime);
  }

  function render() {
    graphics.clear();
    graphics.Player.render(playerSelf.model, playerSelf.texture);
    for (let id in playerOthers) {
      let player = playerOthers[id];
      graphics.PlayerRemote.render(player.model, player.texture);
    }
    //graphics.clear();
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

}(Game.menu, Game.input, Game.graphics, Game.assets, Game.components, Game.network.socket));
