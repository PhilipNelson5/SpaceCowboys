Game.screens['endgame'] = (function(menu, socket) {
  'use strict';




  function initialize() {
    menu.addScreen('endgame',
      `
      <div id="main-container">
        <table id="endgame-stat-table">
          <tr>
            <td>Place</td>
            <td>Player</td>
            <td>Kills</td>
            <td>Damage Dealt</td>
            <td>Accuracy</td>
          </tr>
        </table>
      </div>
      `
    );

    socket.on(NetworkIds.GET_GAME_STATS, function(playerStats) {
      let table = document.getElementById('endgame-stat-table');
      playerStats.sort( (objA, objB) => objA.place-objB.place );
      for (let id in playerStats) {
        let row = table.insertRow(-1);
        row.insertCell(-1).innerHTML = playerStats[id].place;
        row.insertCell(-1).innerHTML = playerStats[id].username;
        row.insertCell(-1).innerHTML = playerStats[id].kills;
        row.insertCell(-1).innerHTML = playerStats[id].damage;
        row.insertCell(-1).innerHTML = Math.floor(playerStats[id].accuracy*100) + '%';
      }
    });
  }


  function run() {
    console.log('game has ended, displaying end screen');
  }

  return {
    initialize,
    run
  };

}(Game.menu, Game.network.socket));
