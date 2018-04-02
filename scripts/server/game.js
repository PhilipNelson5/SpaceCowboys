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
const TIMER_MS = 15000;           // timer countdown in milliseconds
const LOBBY_MAX = 3;              // max player count for lobby
const CHAR_LEN = 450;             // max character length for post
var inSession = false;
const lastUpdate = 0;
const quit = false;
const activeClients = { length:0 };
const lobbyClients = { length:0 };
const inputQueue = Queue.create();

function initializeSocketIO(httpServer) {
  let io = require('socket.io')(httpServer);
  var end;

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
      if (lobbyClients[socket.id] != undefined) {
        delete lobbyClients[socket.id];
        --lobbyClients.length;
        socket.emit(NetworkIds.LEAVE_LOBBY, lobbyClients.length);
      }

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
        () => {
          activeClients[socket.id].username = data.username;
          socket.emit(NetworkIds.LOGIN_RESPONSE, {
            success: true, message: 'verification success', username: data.username
          });
        },
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

      if (login.registerNewUser(data.username, data.password)) {
        activeClients[socket.id].username = data.username;
        socket.emit(NetworkIds.CREATE_USER_RESPONSE, {
          success: true, message: 'new user registered', username: data.username
        });
      } else
        socket.emit(NetworkIds.CREATE_USER_RESPONSE, {
          success: false, message: 'username exists'
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
        socket.emit(NetworkIds.LONG_CHAT_MESSAGE, msg.length);
      else if (msg == 'clear')
        socket.emit(NetworkIds.CLEAR_CHAT_MESSAGE);
      else if (msg.replace(/\s+/g, '') !== '')
        io.emit(NetworkIds.CHAT_MESSAGE, lobbyClients[socket.id] + ': ' + msg);
    });

    /**
     * When the client requests to leave the lobby
     * Removes from lobbyClient list and sends user
     * removal update to all clients
     */
    socket.on(NetworkIds.LEAVE_LOBBY, function() {
      let user = lobbyClients[socket.id];
      delete lobbyClients[socket.id];
      --lobbyClients.length;
      io.emit(NetworkIds.LEAVE_LOBBY, lobbyClients.length, user);
    });

    /**
     * When the client requests to enter the lobby
     * Adds client to lobbyClient list and sends user
     * connection update to all clients
     * Also attempts to start the timer if a certain
     * length of people are in the lobby
     */
    socket.on(NetworkIds.ENTER_LOBBY, function() {
      lobbyClients[socket.id] = activeClients[socket.id].username;
      ++lobbyClients.length;

      io.emit(NetworkIds.ENTER_LOBBY, lobbyClients.length, lobbyClients[socket.id]);
      if (lobbyClients.length >= LOBBY_MAX) {
        io.emit(NetworkIds.START_TIMER);
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
        if (key != 'length') user_list.push(lobbyClients[key]);
      }
      socket.emit(NetworkIds.REQUEST_USERS, user_list);
    });

    /**
     * Direction to start the timer
     * TODO: move to a function instead of dealing with
     * on client side as well
     */
    socket.on(NetworkIds.START_TIMER, function() {
      inSession = true;
      end = new Date().getTime() + TIMER_MS;
      let time = TIMER_MS;
      socket.emit(NetworkIds.REQUEST_TIMER, TIMER_MS/1000);		
    });

    /**
     * Requests timer update
     * Attempts to return timer update to client and,
     * if timer has counted down, starts the game for all
     * clients in the lobby
     */
    socket.on(NetworkIds.REQUEST_TIMER, function() {
      let time = new Date().getTime();
      if ((end - time) < 0) {
        for (let id in lobbyClients) {
          io.to(id).emit(NetworkIds.START_GAME);
        }
      } else {
        socket.emit(NetworkIds.REQUEST_TIMER, end-time);
      }
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
