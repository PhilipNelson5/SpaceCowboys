Game.screens['help'] = (function(menu, keyBindings) {
  'use strict';

  let forward = keyBindings.getBinding(keyBindings.keys.forward.key);
  let back = keyBindings.getBinding(keyBindings.keys.back.key);
  let left = keyBindings.getBinding(keyBindings.keys.left.key);
  let right = keyBindings.getBinding(keyBindings.keys.right.key);
  let fire = keyBindings.getBinding(keyBindings.keys.fire.key);
  
  
  function initialize() {
    menu.addScreen('help',
      `
      <h1>Help</h1>
      <p>This is some help on how to play the game</p>
	  <table style = "width:50%">
	    <caption>Controls</caption>
		<tr>
		  <th>Move Up</th>
		  <th id = "forward">a</th>
		</tr>
		<tr>
		  <th>Move Left</th>
		  <th id = "left">a</th>
		</tr>
		<tr>
		  <th>Move Back</th>
		  <th id = "back">a</th>
		</tr>
		<tr>
		  <th>Move Right</th>
		  <th id = "right">a</th>
		</tr>
        <tr>
		  <th>Shoot Projectiles</th>
		  <th id = "fire">a</th>
		</tr>
	  </table>
      <ul id = "ree"></ul>
      <ul class = "menu">
        <li><button id = "id-help-back">Back</button></li>
      </ul>
    `);

    //document.getElementById('forward').innerHTML = forward;
    //document.getElementById('left').innerHTML = left;
    //document.getElementById('back').innerHTML = back;
    //document.getElementById('right').innerHTML = right;
    //document.getElementById('fire').innerHTML = fire;
    
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
  console.log(forward);
  console.log(back);
  console.log(left);
  console.log(right);
  console.log(fire);
	document.getElementById('forward').innerHTML = forward;
	document.getElementById('left').innerHTML = left;
	document.getElementById('back').innerHTML = back;
	document.getElementById('right').innerHTML = right;
	document.getElementById('fire').innerHTML = fire;
  }

  return {
    initialize,
    run
  };

}(Game.menu, Game.keyBindings));
