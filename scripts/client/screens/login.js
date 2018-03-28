Game.screens['login'] = (function(menu) {
  'use strict';

  function initialize() {
    const main = document.getElementById('game');
    const screen = document.createElement('div');
    screen.setAttribute('id', 'login');
    screen.setAttribute('class', 'screen');

    screen.innerHTML =
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

      `
    main.appendChild(screen);

    document.getElementById('id-login-login').addEventListener(
      'click',
      function() { //TODO: verify with server that the user is registered
        menu.showScreen('main-menu');
      });
    document.getElementById('id-login-create-user').addEventListener(
      'click',
      function() { //TODO: Create new user
        menu.showScreen('main-menu');
      });
  }

  function run() {
    // TODO: Query the game and get the key bindings
  }

  return {
    initialize,
    run
  };

}(Game.menu));
