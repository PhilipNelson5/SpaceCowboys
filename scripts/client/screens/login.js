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

        <p id="login-warning" class="red-text"></p>

      </div>

        <ul class = "menu">
          <li><button id = "id-login-login">Login</button></li>
          <li><button id = "id-login-create-user">Create User</button></li>
        </ul>
    `);

    /**
     * Request server to login
     */
    document.getElementById('id-login-login').addEventListener(
      'click',
      function() { //TODO: verify with server that the user is registered
        let username = document.getElementById('username').value.toLowerCase();
        let password = document.getElementById('password').value.toLowerCase();
        if( username.value === '' || password.value === '') {
          document.getElementById('login-warning')
            .innerText='All fields must be filled.';
        }
        socket.emit(NetworkIds.LOGIN_REQUEST, {username, password});
      });

    /**
     * Go to create-user screen
     */
    document.getElementById('id-login-create-user').addEventListener(
      'click',
      function() { //TODO: Create new user
        menu.showScreen('create-user');
      });

    /**
     * Receive server response to LOGIN_REQUEST
     */
    socket.on(NetworkIds.LOGIN_RESPONSE, data => {
      if(data.success) {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('login-warning')
          .innerText='';
        Game.user.username = data.username;
        console.log('Welcome ' + Game.user.username);
        menu.showScreen('main-menu');
      }
      else {
        document.getElementById('login-warning')
          .innerText='Incorrect username or password.';
        console.log(data.message);
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
