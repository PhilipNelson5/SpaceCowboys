Game.screens['create-user'] = (function(menu, socket) {
  'use strict';

  function initialize() {
    menu.addScreen('create-user',
      `
      <div class="form">

        <div>
          <label for="username">Username:</label>
          <input type="text" id="create-username" name="name">
        </div>

        <div>
          <label for="password">Password:</label>
          <input type="password" id="create-password" name="password">
        </div>

        <div>
          <label for="password-confirm">Confirm Password:</label>
          <input type="password" id="create-password-confirm" name="password-confirm">
        </div>

        <p id="create-user-warning" class="red-text"></p>

      </div>

        <ul class = "menu">
          <li><button id = "id-register">Register New User</button></li>
          <li><button id = "id-create-user-back">Back to Login</button></li>
        </ul>
    `);

    /**
     * Register new user
     */
    document.getElementById('id-register').addEventListener(
      'click',
      function() {
        document.getElementById('create-user-warning').innerText='';
        let username = document.getElementById('create-username');
        let password = document.getElementById('create-password');
        let confirm = document.getElementById('create-password-confirm');
        if ( username.value === '' || password.value === '' || confirm.value === '') {
          document.getElementById('create-user-warning')
            .innerText='All fields must be filled.';
        }
        else if (username.value.length > 20) {
          document.getElementById('create-user-warning')
            .innerText='Maximum username length is 20 characters.';
          console.log('Maximum username length is 20 characters.');
          password.value = '';
          confirm.value = '';
        }
        else if (password.value !== confirm.value) {
          document.getElementById('create-user-warning')
            .innerText='Passwords do not match.';
          console.log('Passwords do not match');
        }
        else {
          socket.emit(NetworkIds.CREATE_USER_REQUEST, {
            username: username.value.toLowerCase(),
            password: password.value.toLowerCase()
          });
          username.value = '';
          password.value = '';
          confirm.value = '';
        }
      });

    /**
     * Back button
     */
    document.getElementById('id-create-user-back').addEventListener(
      'click',
      function() {
        menu.showScreen('login');
      });

    /**
     * Receive server response to CREATE_USER
     * Warns user if the operation failed.
     */
    socket.on(NetworkIds.CREATE_USER_RESPONSE, data => {
      if (data.success) {
        document.getElementById('create-user-warning')
          .innerText='';
        Game.user.username = data.username;
        menu.showScreen('main-menu');
      }
      else {
        document.getElementById('create-user-warning')
          .innerText=data.message;
      }
    });

  }

  function run() {
    // This is empty, there isn't anything to do.
  }

  return {
    initialize,
    run
  };

}(Game.menu, Game.network.socket));
