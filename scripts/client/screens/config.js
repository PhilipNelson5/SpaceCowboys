Game.screens['config'] = (function(menu,keyBindings,input) {
  'use strict';

  //document.getElementById("myModal");

  let up = false;
  let down = false;
  let left = false;
  let right = false;

// This is 100% garbage, but this is how the page listens. 

  function keydown(e) {
	if(!e) e = event;
	document.removeEventListener("keydown",keydown);
	document.getElementById("rebind").innerHTML = "Please Press a Button to Rebind";
	//modal.style.display = "none";
	if (up === true) {
	  keyBindings.keys.forward.key = e.keyCode;
	  up = false;
	}
	if (down === true) {
	  keyBindings.keys.back.key = e.keyCode;
	  down = false;
	}
	if (left === true) {
	  keyBindings.keys.left.key = e.keyCode;
	  left = false;
	}
	if (right === true) {
	  keyBindings.keys.right.key = e.keyCode;
	  right = false;
	}
	keyBindings.keys.keysChanged = true;
  }


//	  <dialog id = "myDialog">Press Any Key</dialog>
  function initialize() {
	//TODO: Write a method that will capture the default keys and show them here.
    menu.addScreen('config',
      `
      <h1>Configs</h1>
      <ul class = "menu">
		<p id = "rebind">Please&nbsp;Press&nbsp;a&nbsp;Button&nbsp;to&nbsp;Rebind</p>
	    <li><button id = "id-config-keyUp">Rebind&nbsp;Forward</button>&nbsp;Current:&nbsp;</li>
	    <li><button id = "id-config-keyDown">Rebind&nbsp;Back</button></li>
	    <li><button id = "id-config-keyLeft">Rebind&nbsp;Left</button></li>
	    <li><button id = "id-config-keyRight">Rebind&nbsp;Right</button></li>
	    <li><button id = "id-config-keyFire">Rebind&nbsp;Fire</button></li>
        <li><button id = "id-config-back">Back</button></li>
      </ul>
    `);

	//var modal = document.getElementById("myModal");
    document.getElementById('id-config-back').addEventListener(
      'click',
      function() { menu.showScreen('main-menu'); });

    document.getElementById('id-config-keyUp').addEventListener(
      'click',
      function() { 
		console.log(keyBindings.keys.forward.key); 
		keyBindings.keys.oldF.key = keyBindings.keys.forward.key;
		up = true; 
		document.getElementById("rebind").innerHTML = "Press a Key To Rebind";
	    document.addEventListener("keydown", keydown);
	  });

    document.getElementById('id-config-keyDown').addEventListener(
      'click',
      function() { 
		keyBindings.keys.oldB.key = keyBindings.keys.back.key;
		down = true; 
		document.getElementById("rebind").innerHTML = "Press a Key To Rebind";
	    document.addEventListener("keydown", keydown);
	  });
    
	document.getElementById('id-config-keyLeft').addEventListener(
      'click',
      function() { 
		keyBindings.keys.oldL.key  = keyBindings.keys.left.key;
		left = true; 
		document.getElementById("rebind").innerHTML = "Press a Key To Rebind";
	    document.addEventListener("keydown", keydown);
	  });
	
    document.getElementById('id-config-keyRight').addEventListener(
      'click',
      function() { 
		keyBindings.keys.oldR.key  = keyBindings.keys.right.key;
		right = true; 
		document.getElementById("rebind").innerHTML = "Press a Key To Rebind";
	    document.addEventListener("keydown", keydown);
	  });
    
	document.getElementById('id-config-keyFire').addEventListener(
      'click',
      function() { 
		keyBindings.keys.oldFire.key  = keyBindings.keys.fire.key;
		right = true; 
		document.getElementById("rebind").innerHTML = "Press a Key To Rebind";
	    document.addEventListener("keydown", keydown);
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

}(Game.menu,Game.keyBindings,Game.input));
