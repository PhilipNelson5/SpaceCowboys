// -----------------------------------------------------------------------------
//
// This is the game network communication system
// The network object keeps the socket so it can be used from any screens
//
// -----------------------------------------------------------------------------
Game.network = (function() {
  'use strict';

  const socket = io({reconnection: false});

  socket.on(NetworkIds.CONNECT_ACK, data => {
    console.log('┌ connection acknowledged\n│' + data + '\n└ client socket : ' + socket.id );
  });

  function initialize() {}

  return {
    initialize,
    socket
  };

}());
