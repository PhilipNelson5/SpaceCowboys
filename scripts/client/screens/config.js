Game.screens['config'] = (function(menu,keyBindings) {
  'use strict';

  let up = false;
  let down = false;
  let left = false;
  let right = false;

  function keydown(e) {
	if(!e) e = event;
	document.removeEventListener("keydown",keydown);
	if (up === true) {
	  keyBindings.keys.forward = e.keyCode;
	  up = false;
	}
	if (down === true) {
	  keyBindings.keys.back = e.keyCode;
	  down = false;
	}
	if (left === true) {
	  keyBindings.keys.left = e.keyCode;
	  left = false;
	}
	if (right === true) {
	  keyBindings.keys.right = e.keyCode;
	  right = false;
	}
	console.log(keyBindings.keys);
  }


//	  <dialog id = "myDialog">Press Any Key</dialog>
  function initialize() {
	//TODO: Write a method that will capture the default keys and show them here.
    menu.addScreen('config',
      `
      <h1>Configs</h1>
      <ul class = "menu">
	    <li><button id = "id-config-keyUp">Rebind&nbsp;Forward</button>&nbsp;Current:&nbsp;</li>
	    <li><button id = "id-config-keyDown">Rebind&nbsp;Back</button></li>
	    <li><button id = "id-config-keyLeft">Rebind&nbsp;Left</button></li>
	    <li><button id = "id-config-keyRight">Rebind&nbsp;Right</button></li>
	    <li><button id = "id-config-keyFire">Rebind&nbsp;Fire</button></li>
        <li><button id = "id-config-back">Back</button></li>
      </ul>
    `);

	var x = document.getElementById("myDialog");
    document.getElementById('id-config-back').addEventListener(
      'click',
      function() { menu.showScreen('main-menu'); });

    document.getElementById('id-config-keyUp').addEventListener(
      'click',
      function() { 
		console.log(keyBindings.keys.forward); 
		up = true; 
	    document.addEventListener("keydown", keydown);
//		x.show();
//		x.close();
	  });

    document.getElementById('id-config-keyDown').addEventListener(
      'click',
      function() { 
		console.log(keyBindings.keys.back);  
		down = true; 
	    document.addEventListener("keydown", keydown);
//		x.show();
//		x.close();
	  });
    
	document.getElementById('id-config-keyLeft').addEventListener(
      'click',
      function() { 
		console.log(keyBindings.keys.left);  
		left = true; 
	    document.addEventListener("keydown", keydown);
//		x.show();
//		x.close();  
	  });
	
    document.getElementById('id-config-keyRight').addEventListener(
      'click',
      function() { 
		console.log(keyBindings.keys.right);  
		right = true; 
	    document.addEventListener("keydown", keydown);
//		x.show();
//		x.close();
	  });
  }

  function run() {
    // This is empty, there isn't anything to do.
  }

  return {
    initialize,
    run,
	keydown
  };

}(Game.menu,Game.keyBindings));
