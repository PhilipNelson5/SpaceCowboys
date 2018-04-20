// -----------------------------------------------------------------------------
//
// Nodejs module that provides the server-side game model.
//
// -----------------------------------------------------------------------------
'use strict';

const present = require('present'),
  Player = require('./player'),
  NetworkIds = require('../shared/network-ids'),
  Queue = require('../shared/queue.js'),
  login = require('./login.js'),
  Missile = require('./missile'),
  Utils = require('./utils.js');

const SIMULATION_UPDATE_RATE_MS = 50;
const TIMER_MS = 1000;           // timer countdown in milliseconds
const LOBBY_MAX = 2;             // max player count for lobby
const CHAR_LEN = 300;            // max character length for post; hard coded elsewhere
let inSession = false;
let lastUpdate = 0;
let quit = false;
let numActiveClients = 0;
let activeClients = {};
let numLobbyClients = 0;
let lobbyClients = {};
let inputQueue = Queue.create();
let missileId = 0;
let newMissiles = [];
let activeMissiles = [];
let hits = [];
let vector = null;
let loot = {};

//------------------------------------------------------------------
//
// Notifies the already connected clients about the disconnect of
// another client.
//
//------------------------------------------------------------------
function notifyDisconnectInGame(playerId) {
  for (let clientId in lobbyClients) {
    let client = lobbyClients[clientId];
    if (playerId !== clientId) {
      client.socket.emit(NetworkIds.DISCONNECT_OTHER, {
        clientId: playerId
      });
    }
  }
}

//------------------------------------------------------------------
//
// Create a missile in response to user input.
//
//------------------------------------------------------------------
function createMissile(clientId, playerModel) {
  let missile = Missile.create({
    id: ++missileId,
    clientId: clientId,
    position: {
      x: playerModel.position.x,
      y: playerModel.position.y
    },
    direction: playerModel.direction,
    speed: playerModel.speed,
    damage: 10
  });

  newMissiles.push(missile);
}


function initializeSocketIO(httpServer) {
  let io = require('socket.io')(httpServer);
  // let end;

  /**
   * When a new client connects
   */
  io.on(NetworkIds.CONNECT, function(socket) {
    console.log('Connection established => ' + socket.id);

    activeClients[socket.id] = {
      username: undefined,
      socket: socket,
      player: null
    };
    ++numActiveClients;
    console.log(numActiveClients + ' active clients');

    /**
     * Acknowledges the connection of a new user.
     * Can be used to send information to new user.
     */
    socket.emit(NetworkIds.CONNECT_ACK, {
      message : 'welcome'
    });

    /**
     * When the client disconnects.
     * Removes client from list of clients.
     * Decrements count of active clients.
     * Notifies other clients of disconnect.
     */
    socket.on(NetworkIds.DISCONNECT, function() {
      delete activeClients[socket.id];
      --numActiveClients;
      if (lobbyClients[socket.id] != undefined) {
        inputQueue.remove(socket.id);
        delete lobbyClients[socket.id];
        --numLobbyClients;
        socket.emit(NetworkIds.LEAVE_LOBBY, numLobbyClients);
        if (inSession)
          notifyDisconnectInGame(socket.id);
      }

      console.log('DISCONNECT: ' + numActiveClients + ' active clients');

      // notify other clients about disconnect if needed
      //socket.broadcast.emit(NetworkIds.id, data)
    });

    /**
     * When the client requests to login.
     * Verifies the username / password.
     * Responds with success or failure.
     */
    socket.on(NetworkIds.LOGIN_REQUEST, data => {
      console.log('request login: ' + data.username);
      data.username = data.username.toLowerCase();

      // check if the user exists
      if (!login.userExists(data.username)) {
        socket.emit(NetworkIds.LOGIN_RESPONSE, {
          success: false, message: 'That user does not exist.'
        });
        return;
      }

      // check if the user is already logged in
      for (let id in activeClients)
        if (activeClients[id].username === data.username) {
          socket.emit(NetworkIds.LOGIN_RESPONSE, {
            success: false, message: 'User already logged in.'
          });
          return;
        }

      // verify that the password is correct
      login.verify(data.username, data.password, (err, success) => {
        if (err) {
          console.log(err);
          socket.emit(NetworkIds.LOGIN_RESPONSE, {
            success: false, message: 'Internal Server Error!'
          });
        } else if (success) {
          console.log('SUCCESS');
          activeClients[socket.id].username = data.username;
          socket.emit(NetworkIds.LOGIN_RESPONSE, {
            success: true, message: 'verification success', username: data.username
          });
        } else {
          socket.emit(NetworkIds.LOGIN_RESPONSE, {
            success: false, message: 'Incorrect username or password.'
          });
        }
      });
    });

    /**
     * When the client requests to create a new user.
     * Attempts to register the new user..
     * Responds with success or failure.
     */
    socket.on(NetworkIds.CREATE_USER_REQUEST, data => {

      // check if the username is too long
      if (data.username.length > 20) {
        socket.emit(NetworkIds.CREATE_USER_RESPONSE, {
          success: false, message: 'Maximum username length is 20 characters.'
        });
        return;
      }

      // check if the username is taken
      if (login.userExists(data.username)) {
        socket.emit(NetworkIds.CREATE_USER_RESPONSE, {
          success: false, message: 'Username already taken.'
        });
        return;
      }

      if (login.registerNewUser(data.username, data.password)) {
        activeClients[socket.id].username = data.username;
        socket.emit(NetworkIds.CREATE_USER_RESPONSE, {
          success: true, message: 'new user registered', username: data.username
        });
      } else
        socket.emit(NetworkIds.CREATE_USER_RESPONSE, {
          success: false, message: 'Error Creating User.'
        });
    });

    /**
     * Request to join lobby
     */
    socket.on(NetworkIds.JOIN_LOBBY_REQUEST, function() {
      if (inSession) {
        socket.emit(NetworkIds.JOIN_LOBBY_RESPONSE, !inSession);
      } else {
        socket.emit(NetworkIds.JOIN_LOBBY_RESPONSE, !inSession);
      }
    });

    /**
     * When the client emits a new chat message
     * Send message to all clients
     */
    socket.on(NetworkIds.CHAT_MESSAGE, function(msg) {
      if (msg.length > CHAR_LEN)
        socket.emit(NetworkIds.LONG_CHAT_MESSAGE, msg.length, msg);
      else if (msg.replace(/\s+/g, '') == 'clear')
        socket.emit(NetworkIds.CLEAR_CHAT_MESSAGE);
      else if (msg.replace(/\s+/g, '') !== '')
        io.emit(NetworkIds.CHAT_MESSAGE, lobbyClients[socket.id].username + ': ' + msg);
    });

    /**
     * When the client requests to leave the lobby
     * Removes from lobbyClient list and sends user
     * removal update to all clients
     */
    socket.on(NetworkIds.LEAVE_LOBBY, function() {
      let user = lobbyClients[socket.id].username;
      delete lobbyClients[socket.id];
      --numLobbyClients;
      io.emit(NetworkIds.LEAVE_LOBBY, numLobbyClients, user);
    });

    /**
     * When the client requests to enter the lobby
     * Adds client to lobbyClient list and sends user
     * connection update to all clients
     * Also attempts to start the timer if a certain
     * length of people are in the lobby
     */
    socket.on(NetworkIds.ENTER_LOBBY, function() {
      lobbyClients[socket.id] = activeClients[socket.id];
      ++numLobbyClients;

      io.emit(NetworkIds.ENTER_LOBBY, numLobbyClients, lobbyClients[socket.id].username);

      if (numLobbyClients >= LOBBY_MAX) {
        inSession = true;

        for (let client in lobbyClients) {
          io.to(client).emit(NetworkIds.START_TIMER, TIMER_MS);
        }

        loot = Utils.genLoot(numLobbyClients);

        setTimeout( () => {
          for (let id in lobbyClients) {
            let newPlayer = Player.create();
            lobbyClients[id].player = newPlayer;
            io.to(id).emit(NetworkIds.INIT_PLAYER_MODEL, {
              direction: newPlayer.direction,
              position: newPlayer.position,
              size: newPlayer.size,
              rotateRate: newPlayer.rotateRate,
              speed: newPlayer.speed,
              health: newPlayer.health
            });

            for (let id2 in lobbyClients) {
              if (id !== id2) {
                io.to(id2).emit(NetworkIds.INIT_ENEMY_MODEL, {
                  direction: newPlayer.direction,
                  position: newPlayer.position,
                  size: newPlayer.size,
                  rotateRate: newPlayer.rotateRate,
                  speed: newPlayer.speed,
                  health: newPlayer.health,
                  clientId: id
                });
              }
            }
          }

          for (let id in lobbyClients) {
            io.to(id).emit(NetworkIds.STARTING_LOOT, {loot});
            io.to(id).emit(NetworkIds.START_GAME);
          }

          gameLoop(present(), 0);

        }, TIMER_MS);
      }
    });

    /**
     * Requests list of users currently in lobby
     * Attempts to return list of users back to the
     * client that requested
     */
    socket.on(NetworkIds.REQUEST_USERS, function() {
      let user_list = [];
      for (let key in lobbyClients) {
        user_list.push(lobbyClients[key].username);
      }
      socket.emit(NetworkIds.REQUEST_USERS, user_list);
    });

    /**
     * Enqueues inputs from clients to be processed
     */
    socket.on(NetworkIds.INPUT, data => {
      inputQueue.enqueue({
        clientId: socket.id,
        message: data
      });
    });


    // notify other clients about new client if needed
    //socket.broadcast.emit(NetworkIds.id, data)
  });
}


function processInput(/* elapsedTime */) {

  let processMe = inputQueue;
  inputQueue = Queue.create();

  while (!processMe.empty) {
    let input =  processMe.dequeue();
    let client = lobbyClients[input.clientId];
    client.lastMessageId = input.message.id;
    switch (input.message.type) {
    case NetworkIds.INPUT_MOVE_UP:
      client.player.moveUp(input.message.elapsedTime);
      break;
    case NetworkIds.INPUT_MOVE_DOWN:
      client.player.moveDown(input.message.elapsedTime);
      break;
    case NetworkIds.INPUT_MOVE_RIGHT:
      client.player.moveRight(input.message.elapsedTime);
      break;
    case NetworkIds.INPUT_MOVE_LEFT:
      client.player.moveLeft(input.message.elapsedTime);
      break;
    case NetworkIds.INPUT_ROTATE:
      client.player.rotate(input.message);
      break;
    case NetworkIds.INPUT_FIRE:
      createMissile(input.clientId, client.player);
      break;
    case NetworkIds.DIE:
      client.player.die();
      break;
    }
  }
}

//------------------------------------------------------------------
//
// Utility function to perform a hit test between two objects.  The
// objects must have a position: { x: , y: } property and radius property.
//
//------------------------------------------------------------------
function collided(obj1, obj2) {
  let distance = Math.sqrt(Math.pow(obj1.position.x - obj2.position.x, 2)
    + Math.pow(obj1.position.y - obj2.position.y, 2));
  let radii = obj1.radius + obj2.radius;

  return distance <= radii;
}

function update(elapsedTime, currentTime) {
  for (let client in lobbyClients) {
    lobbyClients[client].player.update(currentTime);
  }

  for (let missile = 0; missile < newMissiles.length; ++missile) {
    newMissiles[missile].update(elapsedTime);
  }

  let keepMissiles = [];
  for (let missile = 0; missile < activeMissiles.length; ++missile) {
    //
    // If update returns false, that means the missile lifetime ended and
    // we don't keep it around any longer.
    if (activeMissiles[missile].update(elapsedTime)) {
      keepMissiles.push(activeMissiles[missile]);
    }
  }
  activeMissiles = keepMissiles;
  // Check to see if any missiles collide with any players (no friendly fire)
  keepMissiles = [];
  for (let missile = 0; missile < activeMissiles.length; ++missile) {
    let hit = false;
    for (let clientId in lobbyClients) {
      //
      // Don't allow a missile to hit the player it was fired from or a dead player
      if (clientId !== activeMissiles[missile].clientId && lobbyClients[clientId].player.health > 0) {
        if (collided(activeMissiles[missile], activeClients[clientId].player)) {
          hit = true;
          hits.push({
            clientId: clientId,
            missileId: activeMissiles[missile].id,
            position: activeClients[clientId].player.position
          });
          lobbyClients[clientId].player.health -= activeMissiles[missile].damage;
          lobbyClients[clientId].socket.emit(NetworkIds.MISSILE_HIT_YOU, activeMissiles[missile].damage);
        }
      }
    }
    if (!hit) {
      keepMissiles.push(activeMissiles[missile]);
    }
  }
  activeMissiles = keepMissiles;
  //TODO: other things for collisions

  // collision for loot
  let takenLoot = [];
  for (let clientId in lobbyClients) {
    for (let l in loot) {
      for (let e = 0; e < loot[l].length; ++e) {
        if (loot[l][e] && collided(lobbyClients[clientId].player, loot[l][e])) {
          takenLoot.push(loot[l][e].id);
          console.log('loot taken: ', JSON.stringify(loot[l][e].id));
          //TODO apply powerup to player
          delete loot[l][e];

        }
      }
    }
  }

  if (takenLoot.length !== 0)
    io.emit(NetworkIds.LOOT_UPDATE, { takenLoot });
}

function updateClient(elapsedTime) {
  // simulate network lag
  lastUpdate += elapsedTime;
  // if (lastUpdate < STATE_UPDATE_RATE_MS) {
  // return;
  // }

  // Build the missile messages one time, then reuse inside the loop
  let missileMessages = [];
  for (let i = 0; i < newMissiles.length; ++i) {
    let missile = newMissiles[i];
    missileMessages.push({
      id: missile.id,
      direction: missile.direction,
      position: {
        x: missile.position.x,
        y: missile.position.y
      },
      radius: missile.radius,
      speed: missile.speed,
      timeRemaining: missile.timeRemaining
    });
  }

  // Move all the new missiles over to the active missiles array
  for (let missile = 0; missile < newMissiles.length; ++missile) {
    activeMissiles.push(newMissiles[missile]);
  }
  newMissiles.length = 0;

  for (let clientId in lobbyClients) {
    let client = lobbyClients[clientId];
    let update = {
      clientId : clientId,
      lastMessageId: client.lastMessageId,
      direction : client.player.direction,
      position: client.player.position,
      health: client.player.health,
      updateWindow: lastUpdate,
      vector: vector
    };

    if (client.player.reportUpdate) {
      client.socket.emit(NetworkIds.UPDATE_SELF, update);

      //Notify all other connected clients about every
      //other connected client status .... but only if they are updated.
      for (let otherId in lobbyClients) {
        if (otherId !== clientId) {
          lobbyClients[otherId].socket.emit(NetworkIds.UPDATE_OTHER, update);
        }
      }
    }

    // Report any new missiles to the active clients
    for (let missile = 0; missile < missileMessages.length; ++missile) {
      client.socket.emit(NetworkIds.MISSILE_NEW, missileMessages[missile]);
    }

    // Report any missile hits to this client
    for (let hit = 0; hit < hits.length; ++hit) {
      client.socket.emit(NetworkIds.MISSILE_HIT, hits[hit]);
    }

  }

  for (let clientId in lobbyClients) {
    lobbyClients[clientId].player.reportUpdate = false;
  }

  hits.length = 0;
  //Reset time since last update so we know when to put out next update
  lastUpdate = 0;

}

function gameLoop(currentTime, elapsedTime) {
  processInput(elapsedTime);
  update(elapsedTime,currentTime);
  updateClient(elapsedTime);

  if (!quit) {
    setTimeout(() => {
      let now = present();
      gameLoop(now, now - currentTime);
    }, SIMULATION_UPDATE_RATE_MS);
  }
}


/**
 *
 * Entry point to get the game started
 *
 */
function initialize(httpServer) {
  initializeSocketIO(httpServer);
  login.initialize();
}

/**
 *
 * stops the game simulation and processing
 *
 */
// function terminate() {
// this.quit = true;
// }

module.exports.initialize = initialize;
