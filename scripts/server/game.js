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
const lobbyClients = { length:0 };
const inputQueue = Queue.create();

function initializeSocketIO(httpServer) {
  let io = require('socket.io')(httpServer);

  function notifyConnect(socket, newPlayer) {

  }

  function notifyDisconnect(playerId) {

  }

  io.on(NetworkIds.CONNECT, function(socket) {
    console.log('Connection established => ' + socket.id);

    activeClients[socket.id] = {
      socket: socket,
      player: null
    }
    ++activeClients.length;
    console.log(activeClients.length + ' active clients');

    socket.emit(NetworkIds.CONNECT_ACK, {
      message : 'welcome'
    });

    socket.on(NetworkIds.DISCONNECT, function() {
      delete activeClients[socket.id];
      --activeClients.length;
			if (lobbyClients[socket.id] != undefined) {
				delete lobbyClients[socket.id];
				--lobbyClients.length;
				socket.emit(NetworkIds.LEAVE_LOBBY, lobbyClients.length);
			}
      console.log("DISCONNECT: " + activeClients.length + ' active clients');
      notifyDisconnect(socket.id);
    });

    socket.on(NetworkIds.LOGIN_REQUEST, data => {
      login.verify(data.username, data.password).then(
        () => socket.emit(NetworkIds.LOGIN_RESPONSE, 'success'),
        () => socket.emit(NetworkIds.LOGIN_RESPONSE, 'failure'));
    });

    socket.on(NetworkIds.CREATE_USER_REQUEST, data => { //TODO make a promise
      if(login.registerNewUser(data.username, data.password))
        socket.emit(NetworkIds.CREATE_USER_RESPONSE, 'success');
      else
        socket.emit(NetworkIds.CREATE_USER_RESPONSE, 'failure');
    });

		socket.on(NetworkIds.CHAT_MESSAGE, function(user, msg) {
			for (var key in activeClients) {
				io.to(key).emit(NetworkIds.CHAT_MESSAGE, user + ': ' + msg);
			}
		});

		socket.on(NetworkIds.LEAVE_LOBBY, function() {
			delete lobbyClients[socket.id];
			--lobbyClients.length;
			io.emit(NetworkIds.LEAVE_LOBBY, lobbyClients.length);
		});

		socket.on(NetworkIds.ENTER_LOBBY, function() {
			lobbyClients[socket.id] = {}
			++lobbyClients.length;
			io.emit(NetworkIds.ENTER_LOBBY, lobbyClients.length);
		});

    notifyConnect(socket);
  });
}

//------------------------------------------------------------------
//
// Entry point to get the game started.
//
//------------------------------------------------------------------
function initialize(httpServer) {
  initializeSocketIO(httpServer);
  login.initialize();
}

//------------------------------------------------------------------
//
// Public function that allows the game simulation and processing to
// be terminated.
//
//------------------------------------------------------------------
function terminate() {
  this.quit = true;
}

module.exports.initialize = initialize;
