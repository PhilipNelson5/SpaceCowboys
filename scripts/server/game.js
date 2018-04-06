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
  login = require('./login.js');

const SIMULATION_UPDATE_RATE_MS = 50;
const STATE_UPDATE_RATE_MS = 100;

const TIMER_MS = 3000;           // timer countdown in milliseconds
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

function initializeSocketIO(httpServer) {
  let io = require('socket.io')(httpServer);
  let end;

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
        delete lobbyClients[socket.id];
        --numLobbyClients;
        socket.emit(NetworkIds.LEAVE_LOBBY, numLobbyClients);
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

        setTimeout( () => {
          for (let id in lobbyClients) {
            let newPlayer = Player.create();
            lobbyClients[id].player = newPlayer;
            io.to(id).emit(NetworkIds.INIT_PLAYER_MODEL, {
              direction: newPlayer.direction,
              position: newPlayer.position,
              size: newPlayer.size,
              rotateRate: newPlayer.rotateRate,
              speed: newPlayer.speed
            });

            for (let id2 in lobbyClients) {
              if (id !== id2) {
                io.to(id2).emit(NetworkIds.INIT_ENEMY_MODEL, {
                  direction: newPlayer.direction,
                  position: newPlayer.position,
                  size: newPlayer.size,
                  rotateRate: newPlayer.rotateRate,
                  speed: newPlayer.speed,
				  clientId: id
                });
              }
            }
          }

          for (let id in lobbyClients)
            io.to(id).emit(NetworkIds.START_GAME);

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


function processInput(elapsedTime) {

  let processMe = inputQueue;
  inputQueue = Queue.create();

  while (!processMe.empty) {
    let input =  processMe.dequeue();
    let client = lobbyClients[input.clientId];
    client.lastMessageId = input.message.id;
    switch (input.message.type) {
    case NetworkIds.INPUT_MOVE:
      client.player.move(input.message.elapsedTime);
      break;
    case NetworkIds.INPUT_ROTATE_LEFT:
      client.player.rotateLeft(input.message.elapsedTime);
      break;
    case NetworkIds.INPUT_ROTATE_RIGHT:
      client.player.rotateRight(input.message.elapsedTime);
      break;
    }
  }
}


function update(elapsedTime, currentTime) {
  for (let client in lobbyClients) {
    lobbyClients[client].player.update(currentTime);
  }
  //TODO: other things for collisions
}

function updateClient(elapsedTime) {
  lastUpdate += elapsedTime;
  if (lastUpdate < STATE_UPDATE_RATE_MS) {
    return;
  }
  for (let clientId in lobbyClients) {
    let client = lobbyClients[clientId];
    let update = {
      clientId : clientId,
      lastMessageId: client.lastMessageId,
      direction : client.player.direction,
      position: client.player.position,
      updateWindow: lastUpdate,
    };

    if (client.player.reportUpdate) {
      client.socket.emit(NetworkIds.UPDATE_SELF, update);
      //
      //Notify all other connected clients about every
      //other connected client status .... but only if they are updated.
      for (let otherId in lobbyClients) {
        if (otherId !== clientId) {
          lobbyClients[otherId].socket.emit(NetworkIds.UPDATE_OTHER, update);
        }
      }
    }
  }

  for (let clientId in lobbyClients) {
    lobbyClients[clientId].player.reportUpdate = false;
  }

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
function terminate() {
  this.quit = true;
}

module.exports.initialize = initialize;
