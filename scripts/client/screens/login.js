Game.screens['login'] = (function(menu, socket) {
  'use strict';

  function initialize() {
    menu.addScreen('login',
      `
      <div class="form">

        <div>
          <label for="username">Username:</label>
          <input type="text" id="username" name="name">
        </div>

        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" name="password">
        </div>

      </div>

        <ul class = "menu">
          <li><button id = "id-login-login">Login</button></li>
          <li><button id = "id-login-create-user">Create User</button></li>
        </ul>
    `);

    //----------------------------------------------------------
    // Request to login
    //----------------------------------------------------------
    document.getElementById('id-login-login').addEventListener(
      'click',
      function() { //TODO: verify with server that the user is registered
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        socket.emit(NetworkIds.LOGIN_REQUEST, {username, password});
      });

    //----------------------------------------------------------
    // Go to create-user screen
    //----------------------------------------------------------
    document.getElementById('id-login-create-user').addEventListener(
      'click',
      function() { //TODO: Create new user
        menu.showScreen('create-user');
      });

    //----------------------------------------------------------
    // Receive server response to LOGIN_REQUEST
    //----------------------------------------------------------
    socket.on(NetworkIds.LOGIN_RESPONSE, data => {
      if(data === 'success') {
        console.log('login success');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        menu.showScreen('main-menu');
      }
      else if (data === 'failure') {
        console.log('login failure');
      }
    });

  }

  function run() {
    // Nothing to do
  }

  return {
    initialize,
    run
  };

}(Game.menu, Game.network.socket));
