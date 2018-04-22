Game.screens['help'] = (function(menu, keyBindings) {
  'use strict';

  let forward,
  back,
  left,
  right,
  fire;
  
  
  function initialize() {
    menu.addScreen('help',
      `
      <h1>Help</h1>
            <ul id = "ree"></ul>
      <ul class = "menu">
<p>A Battle Royal! Be the last person to survive to win the game! When you spawn in the world, make sure you pick up a weapon! Grab some ammo, shields, power ups, git gud and survive!</p>
	  <table style = "width:40%" class = "inlineTable">
	    <caption>Controls</caption>
		<tr>
		  <th>Move Up</th>
		  <th id = "forward-input">a</th>
		</tr>
		<tr>
		  <th>Move Left</th>
		  <th id = "left-input">a</th>
		</tr>
		<tr>
		  <th>Move Back</th>
		  <th id = "back-input">a</th>
		</tr>
		<tr>
		  <th>Move Right</th>
		  <th id = "right-input">a</th>
		</tr>
        <tr>
		  <th>Shoot</th>
		  <th id = "fire-input">a</th>
		</tr>
	  </table>
	  <table style = "width:40%" class = "inlineTable">
	    <caption>Items</caption>
		<tr>
		  <th><img src = "../../../assets/loot-weapon.png" width = "30%" height = "30%"/></th>
		  <th>Blaster</th>
		</tr>
		<tr>
		  <th><img src = "../../../assets/loot-ammo.png" width = "30%" height = "70%"/></th>
		  <th>Energy Cells</th>
		</tr>
		<tr>
		  <th><img src = "../../../assets/loot-health.png" width = "30%" height = "70%"/></th>
		  <th>Repair Kit</th>
		</tr>
		<tr>
		  <th><img src = "../../../assets/loot-shield.png" width = "30%" height = "70%"/></th>
		  <th>Hyper Shield</th>
		</tr>
		<tr>
		  <th><img src = "../../../assets/loot-speedUp.png" width = "30%" height = "70%"/></th>
		  <th>Hyper Speed</th>
		</tr>
		<tr>
		  <th><img src = "../../../assets/loot-rangeUp.png" width = "30%" height = "70%"/></th>
		  <th>Increased Weapon Range</th>
		</tr>
		<tr>
		  <th><img src = "../../../assets/loot-damageUp.png" width = "30%" height = "70%"/></th>
		  <th>Increased Weapon Damage</th>
		</tr>
	  </table>
        <li><button id = "id-help-back">Back</button></li>

      </ul>
    `);

    
	document.getElementById('id-help-back').addEventListener(
      'click',
      function() { menu.showScreen('main-menu'); });
  }
	

  function run() {
    // TODO: Query the game and get the key bindings
	forward = keyBindings.getBinding(keyBindings.keys.forward.key);
    left = keyBindings.getBinding(keyBindings.keys.left.key);
    back = keyBindings.getBinding(keyBindings.keys.back.key);
    right = keyBindings.getBinding(keyBindings.keys.right.key);
    fire = keyBindings.getBinding(keyBindings.keys.fire.key);
	
	document.getElementById('forward-input').innerHTML = forward;
	document.getElementById('left-input').innerHTML = left;
	document.getElementById('back-input').innerHTML = back;
	document.getElementById('right-input').innerHTML = right;
	document.getElementById('fire-input').innerHTML = fire;
  }

  return {
    initialize,
    run
  };

}(Game.menu, Game.keyBindings));
