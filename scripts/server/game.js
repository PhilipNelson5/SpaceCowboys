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
  Loot = require('./loot.js'),
  Asteroids = require('./asteroids.js');

const SIMULATION_UPDATE_RATE_MS = 50;
const TIMER_MS = 3000;           // timer countdown in milliseconds
const TIMER_MS_MAP = 10000;      // timer countdown in milliseconds for positional
const LOBBY_MAX = 2;             // max player count for lobby
const CHAR_LEN = 300;            // max character length for post; hard coded elsewhere
let inSession = false;
let lastUpdate = 0;
let totalUpdate = 0;
let quit = false;
let numActiveClients = 0;
let activeClients = {};
let numLobbyClients = 0;
let lobbyClients = {};
let inputQueue = Queue.create();
let missileId = 0;
let newMissiles = [];
let activeMissiles = [];
let asteroids = [];
let hits = [];
let vector = null;
let loot = {};
let playersAlive = LOBBY_MAX;
let updatePlayerCount = true;
let playerStats = [];

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
    speed: playerModel.missileSpeed,
    damage: playerModel.missileDamage,
    range : playerModel.missileRange
  });

  lobbyClients[clientId].player.score.shotsFired += 1;

  newMissiles.push(missile);
}


function fireWeapon(clientId, playerModel) {
  if (playerModel.hasWeapon && playerModel.ammo > 0) {
    createMissile(clientId, playerModel);
    playerModel.ammo -= 1;
    playerModel.reportUpdate = true;
  }
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

    socket.on(NetworkIds.ENTER_MAP, function() {
      socket.emit(NetworkIds.START_TIMER_MAP, TIMER_MS_MAP);
      setTimeout( () => {
        socket.emit(NetworkIds.START_GAME);
        gameLoop(present(), 0);
      }, TIMER_MS_MAP );

    });

    socket.on(NetworkIds.PLAYER_POSITION, function(data) {
      lobbyClients[socket.id].player.position = data;
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

        asteroids = Asteroids.getAsteroids();

        loot = Loot.genLoot(numLobbyClients, asteroids);

        setTimeout( () => {
          for (let id in lobbyClients) {
            let newPlayer = Player.create();
            lobbyClients[id].player = newPlayer;
            io.to(id).emit(NetworkIds.INIT_PLAYER_MODEL, {
              direction: newPlayer.direction,
              position: newPlayer.position,
              size: newPlayer.size,
              speed: newPlayer.speed,
              health: newPlayer.health,
              shield: newPlayer.shield,
              ammo: newPlayer.ammo,
              hasWeapon : newPlayer.hasWeapon,
              score : newPlayer.score
            });

            for (let id2 in lobbyClients) {
              if (id !== id2) {
                io.to(id2).emit(NetworkIds.INIT_ENEMY_MODEL, {
                  direction: newPlayer.direction,
                  position: newPlayer.position,
                  size: newPlayer.size,
                  rotateRate: newPlayer.rotateRate,
                  speed : newPlayer.speed,
                  health: newPlayer.health,
                  shield: newPlayer.shield,
                  ammo  : newPlayer.ammo,
                  score : newPlayer.score,
                  clientId: id
                });
              }
            }
          }

          for (let id in lobbyClients) {
            io.to(id).emit(NetworkIds.STARTING_LOOT, {loot});
            io.to(id).emit(NetworkIds.STARTING_ASTEROIDS, {asteroids});
            io.to(id).emit(NetworkIds.ENTER_MAP);
          }
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
     * Enqueue inputs from clients to be processed
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
    // let move = true;
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
      fireWeapon(input.clientId, client.player);
      break;
    case NetworkIds.DIE:
      client.player.die();
      playersAlive--;
      updatePlayerCount = true;
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

let takenLoot = [];

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
  let client;
  for (let missile = 0; missile < activeMissiles.length; ++missile) {
    let hit = false;
    for (let clientId in lobbyClients) {
      client = lobbyClients[clientId];
      //
      // Don't allow a missile to hit the player it was fired from or a dead player
      if (clientId !== activeMissiles[missile].clientId && client.player.health > 0) {
        if (collided(activeMissiles[missile], client.player)) {
          hit = true;
          hits.push({
            clientId: clientId,
            missileId: activeMissiles[missile].id,
            position: activeClients[clientId].player.position
          });

          //Increase the damage dealt by the person who fired and the number of their shots that landed
          lobbyClients[activeMissiles[missile].clientId].player.score.damage += activeMissiles[missile].damage;
          lobbyClients[activeMissiles[missile].clientId].player.score.shotsLanded += 1;
          
          //
          // take damage from shield first
          if (client.player.shield > 0) {
            client.player.shield = client.player.shield - activeMissiles[missile].damage;
            if (client.player.shield < 0) {
              client.player.health = client.player.health + client.player.shield;
              client.player.shield = 0;
            }
          }
          else {
            client.player.health = client.player.health - activeMissiles[missile].damage;
            if (client.player.health <= 0) {
              lobbyClients[activeMissiles[missile].clientId].player.score.kills += 1;
              client.player.health = 0;
              client.player.score.place = playersAlive;
              let update = {
                clientId : clientId,
                lastMessageId: client.lastMessageId,
                direction : client.player.direction,
                position: client.player.position,
                health: client.player.health,
                shield: client.player.shield,
                ammo: client.player.ammo,
                hasWeapon: client.player.hasWeapon,
                score : client.player.score,
                updateWindow: lastUpdate,
                vector: vector
              };
              client.socket.emit(NetworkIds.UPDATE_SELF, update);
              for (clientId in lobbyClients) {
                if (clientId !== client.socket.id) {
                  lobbyClients[clientId].socket.emit(NetworkIds.PLAYER_DEATH, {position: client.player.position});
                }
              }

              //Did the player who got the kill just win?
              //If the players alive when they got the kill was 2, then yes
              //This is really bad and shouldnt be here but we gotta get it DONE
              if (playersAlive == 2) {
                lobbyClients[activeMissiles[missile].clientId].socket.emit(NetworkIds.WIN);
                let i = 0;
                for (let id in lobbyClients) {
                  playerStats[i] = {
                    username: lobbyClients[id].username,
                    place:    lobbyClients[id].player.score.place,
                    kills:    lobbyClients[id].player.score.kills,
                    accuracy: lobbyClients[id].player.score.shotsLanded/lobbyClients[id].player.score.shotsFired,
                    damage:   lobbyClients[id].player.score.damage
                  };
                  if (lobbyClients[id].player.score.shotsFired == 0) playerStats[i].accuracy=0;
                  i++;
                }
                for (let id in lobbyClients) {
                  lobbyClients[id].socket.emit(NetworkIds.GET_GAME_STATS, playerStats);
                }
              }
            }
          }

          client.socket.emit(NetworkIds.MISSILE_HIT_YOU, {
            health : client.player.health,
            shield : client.player.shield
          });
        }
      }
    }
    if (!hit) {
      keepMissiles.push(activeMissiles[missile]);
    }
  }

  // check to see if any missiles collided with asteroids
  // TODO: there is an error here... gotta take care of
  activeMissiles = keepMissiles;
  keepMissiles = [];
  for (let missile = 0; missile < activeMissiles.length; ++missile) {
    let hit = false;
    for (let i = 0; i < asteroids.length; i++) {
      if (collided(activeMissiles[missile], asteroids[i])) {

        hit = true;
        hits.push({
          clientId: 0,
          missileId: activeMissiles[missile].id,
          position: activeMissiles[missile].position
        });
      }
    }
    if (!hit) {
      keepMissiles.push(activeMissiles[missile]);
    }
  }

  activeMissiles = keepMissiles;

  // collision for loot
  takenLoot = [];
  for (let clientId in lobbyClients) {
    for (let l in loot) {
      for (let e = loot[l].length-1; e >= 0; --e) {
        if (collided(lobbyClients[clientId].player, loot[l][e])) {
          if (Loot.apply(loot[l][e], lobbyClients[clientId].player)) {
            // send msg to client that you picked up an item
            lobbyClients[clientId].socket.emit(NetworkIds.PICKED_UP_LOOT, {type:loot[l][e].type});
            takenLoot.push(loot[l][e].id);
            loot[l].splice(e, 1);
          }
        }
      }
    }
  }

  //a player has died, update each of the players with the new player count
  if (updatePlayerCount) {
    updatePlayerCount = false;
    for (let clientId in lobbyClients) {
      let client = lobbyClients[clientId];
      let update = {
        playersAlive: playersAlive
      };
      client.socket.emit(NetworkIds.UPDATE_ALIVE_PLAYERS, update);
    }
  }
}

function inProximity(pos1, pos2) {
  let distance = Math.sqrt(Math.pow(pos1.x - pos2.x, 2)
    + Math.pow(pos1.y - pos2.y, 2));
  return distance < .75;
}

function updateClient(elapsedTime) {
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
      shield: client.player.shield,
      ammo: client.player.ammo,
      hasWeapon: client.player.hasWeapon,
      score : client.player.score,
      updateWindow: lastUpdate,
      vector: vector
    };

    if (client.player.reportUpdate) {
      client.socket.emit(NetworkIds.UPDATE_SELF, update);

      // Notify all other connected clients about every
      // other connected client status .... but only if they are updated,
      // and if they are close to each other, individualized game updates.
      for (let otherId in lobbyClients) {
        if (otherId !== clientId &&
          (inProximity(lobbyClients[otherId].player.position, client.player.position) ||
          totalUpdate >= 500)
        ){
          lobbyClients[otherId].socket.emit(NetworkIds.UPDATE_OTHER, update);
        }
        // send an update to all clients every second to remove the ghosts
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

    if (takenLoot.length !== 0) {
      client.socket.emit(NetworkIds.LOOT_UPDATE, { takenLoot });
    }

  }

  for (let clientId in lobbyClients) {
    lobbyClients[clientId].player.reportUpdate = false;
  }

  // Reset time since last update so we know when to put out next update
  lastUpdate = 0;
  // Reset the loot taken array
  takenLoot.length = 0;
  // Reset the hits array
  hits.length = 0;

  totalUpdate %= 1000;
  totalUpdate += elapsedTime;
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
