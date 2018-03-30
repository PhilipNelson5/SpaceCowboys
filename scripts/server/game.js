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
const lastUpdate = 0;
const quit = false;
const activeClients = { length:0 };
const inputQueue = Queue.create();

function initializeSocketIO(httpServer) {
  let io = require('socket.io')(httpServer);

  /**
   * When a new client connects
   */
  io.on(NetworkIds.CONNECT, function(socket) {
    console.log('Connection established => ' + socket.id);

    activeClients[socket.id] = {
      socket: socket,
      player: null
    };
    ++activeClients.length;
    console.log(activeClients.length + ' active clients');

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
      --activeClients.length;

      console.log('DISCONNECT: ' + activeClients.length + ' active clients');

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

      login.verify(data.username, data.password).then(
        () => socket.emit(NetworkIds.LOGIN_RESPONSE, {
          success: true, message: 'verification success', username: data.username
        }),
        () => socket.emit(NetworkIds.LOGIN_RESPONSE, {
          success: false, message: 'verification failed'
        }));
    });

    /**
     * When the client requests to create a new user.
     * Attempts to register the new user..
     * Responds with success or failure.
     */
    socket.on(NetworkIds.CREATE_USER_REQUEST, data => { //TODO make a promise

      if (login.registerNewUser(data.username, data.password))
        socket.emit(NetworkIds.CREATE_USER_RESPONSE, {
          success: true, message: 'new user registered', username: data.username
        });
      else
        socket.emit(NetworkIds.CREATE_USER_RESPONSE, {
          success: false, message: 'username exists'
        });
    });

    // notify other clients about new client if needed
    //socket.broadcast.emit(NetworkIds.id, data)
  });
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
