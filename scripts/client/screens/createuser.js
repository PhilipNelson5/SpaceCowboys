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

      </div>

        <ul class = "menu">
          <li><button id = "id-register">Register New User</button></li>
          <li><button id = "id-create-user-back">Back to Login</button></li>
        </ul>
    `);

    //----------------------------------------------------------
    // Register new user
    //----------------------------------------------------------
    document.getElementById('id-register').addEventListener(
      'click',
      function() {
        let username = document.getElementById('create-username');
        let password = document.getElementById('create-password');
        let confirm = document.getElementById('create-password-confirm');
        if(password.value === confirm.value)
        {
          socket.emit(NetworkIds.CREATE_USER_REQUEST, {
            username:username.value,
            password:password.value
          });
          username.value = '';
          password.value = '';
          confirm.value = '';
        }
        else {
          console.log("Passwords do not match");
        }
      });

    //----------------------------------------------------------
    // Back button
    //----------------------------------------------------------
    document.getElementById('id-create-user-back').addEventListener(
      'click',
      function() {
        menu.showScreen('login');
      });

    //----------------------------------------------------------
    // Receive server response to CREATE_USER
    //----------------------------------------------------------
    socket.on(NetworkIds.CREATE_USER_RESPONSE, data => {
      if(data === 'success') {
        console.log('user creation success');
        menu.showScreen('main-menu');
      } else if (data === 'failure') {
        console.log('user creation failure');
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
