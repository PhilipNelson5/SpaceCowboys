// -----------------------------------------------------------------------------
//
// This is the game network communication system
// The network object keeps the socket so it can be used from any screens
//
// -----------------------------------------------------------------------------
Game.network = (function() {
  'use strict'

  const socket = io();

  socket.on(NetworkIds.CONNECT_ACK, data => {
    console.log('connection acknowledged', data)
  });

  function initialize() {}

  return {
    initialize,
    socket
  };

}());
