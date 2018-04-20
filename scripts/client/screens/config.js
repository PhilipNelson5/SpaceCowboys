Game.screens['config'] = (function(menu,keyBindings,input) {
  'use strict';

  //document.getElementById("myModal");

  let up = false;
  let down = false;
  let left = false;
  let right = false;
  let fire = false;

// This is 100% garbage, but this is how the page listens. 

  function keydown(e) {
	if(!e) e = event;
	document.removeEventListener("keydown",keydown);
	document.getElementById("rebind").innerHTML = "Please Press a Button to Rebind";
	//modal.style.display = "none";
	if (up === true) {
	  keyBindings.keys.forward.key = e.keyCode;
	  document.getElementById("up").innerHTML = getBinding(e.keyCode);
	  up = false;
	}
	if (down === true) {
	  keyBindings.keys.back.key = e.keyCode;
	  document.getElementById("down").innerHTML = getBinding(e.keyCode);
	  down = false;
	}
	if (left === true) {
	  keyBindings.keys.left.key = e.keyCode;
	  document.getElementById("left").innerHTML = getBinding(e.keyCode);
	  left = false;
	}
	if (right === true) {
	  keyBindings.keys.right.key = e.keyCode;
	  document.getElementById("right").innerHTML = getBinding(e.keyCode);
	  right = false;
	}
	if (fire === true) {
	  keyBindings.keys.fire.key = e.keyCode;
	  document.getElementById("fire").innerHTML = getBinding(e.keyCode);
	  fire = false;
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
	    <li>Current:&nbsp;<span id = "up">w&nbsp;</span><button id = "id-config-keyUp">Rebind&nbsp;Forward</button></li>
	    <li>Current:&nbsp;<span id = "left">a&nbsp;</span><button id = "id-config-keyLeft">Rebind&nbsp;Left</button></li>
	    <li>Current:&nbsp;<span id = "down">s&nbsp;</span><button id = "id-config-keyDown">Rebind&nbsp;Back</button></li>
	    <li>Current:&nbsp;<span id = "right">d&nbsp;</span><button id = "id-config-keyRight">Rebind&nbsp;Right</button></li>
	    <li>Current:&nbsp;<span id = "fire">Mouse Right&nbsp;</span><button id = "id-config-keyFire">Rebind&nbsp;Fire</button></li>
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
		fire = true; 
		document.getElementById("rebind").innerHTML = "Press a Key To Rebind";
	    document.addEventListener("keydown", keydown);
	  });
  }
  
  function getBinding(key) {
	let keyName = "";
	switch(key) { 
		case 3:
			return "Cancel";
			break;
		case 6:
			return "Help";
			break;
		case 8:
			return "Back Space";
			break;
		case 9:
			return "Tab";
			break;
		case 12:
			return "Clear";
			break;
		case 13:
			return "Return";
			break;
		case 14:
			return "Enter";
			break;
		case 16:
			return "Shift";
			break;
		case 17:
			return "Control";
			break;
		case 18:
			return "Alt";
			break;
		case 19:
			return "Pause";
			break;
		case 20:
			return "Caps Lock";
			break;
		case 27:
			return "Escape";
			break;
		case 32:
			return "Space";
			break;
		case 33:
			return "Page Up";
			break;
		case 34:
			return "Page Down";
			break;
		case 35:
			return "End";
			break;
		case 36:
			return "Home";
			break;
		case 37:
			return "Left Arrow";
			break;
		case 38:
			return "Up Arrow";
			break;
		case 39:
			return "Right Arrow";
			break;
		case 40:
			return "Down Arrow";
			break;
		case 44:
			return "Printscreen";
			break;
		case 45:
			return "Insert";
			break;
		case 46:
			return "Delete";
			break;
		case 48:
			return "0";
			break;
		case 49:
			return "1";
			break;
		case 50:
			return "2";
			break;
		case 51:
			return "3";
			break;
		case 52:
			return "4";
			break;
		case 53:
			return "5";
			break;
		case 54:
			return "6";
			break;
		case 55:
			return "7";
			break;
		case 56:
			return "8";
			break;
		case 57:
			return "9";
			break;
		case 59:
			return ";";
			break;
		case 61:
			return "=";
			break;
		case 65:
			return "a";
			break;
		case 66:
			return "b";
			break;
		case 67:
			return "c";
			break;
		case 68:
			return "d";
			break;
		case 69:
			return "e";
			break;
		case 70:
			return "f";
			break;
		case 71:
			return "g";
			break;
		case 72:
			return "h";
			break;
		case 73:
			return "i";
			break;
		case 74:
			return "j";
			break;
		case 75:
			return "k";
			break;
		case 76:
			return "l";
			break;
		case 77:
			return "m";
			break;
		case 78:
			return "n";
			break;
		case 79:
			return "o";
			break;
		case 80:
			return "p";
			break;
		case 81:
			return "q";
			break;
		case 82:
			return "r";
			break;
		case 83:
			return "s";
			break;
		case 84:
			return "t";
			break;
		case 85:
			return "u";
			break;
		case 86:
			return "v";
			break;
		case 87:
			return "w";
			break;
		case 88:
			return "x";
			break;
		case 89:
			return "y";
			break;
		case 90:
			return "z";
			break;
		case 93:
			return "Context Menu";
			break;
		case 96:
			return "Numpad 0";
			break;
		case 97:
			return "Numpad 1";
			break;
		case 98:
			return "Numpad 2";
			break;
		case 99:
			return "Numpad 3";
			break;
		case 100:
			return "Numpad 4";
			break;
		case 101:
			return "Numpad 5";
			break;
		case 102:
			return "Numpad 6";
			break;
		case 103:
			return "Numpad 7";
			break;
		case 104:
			return "Numpad 8";
			break;
		case 105:
			return "Numpad 9";
			break;
		case 106:
			return "*";
			break;
		case 107:
			return "+";
			break;
		case 108:
			return "Separator";
			break;
		case 109:
			return "-";
			break;
		case 110:
			return ".";
			break;
		case 111:
			return "/";
			break;
		case 112:
			return "F1";
			break;
		case 113:
			return "F2";
			break;
		case 114:
			return "F3";
			break;
		case 115:
			return "F4";
			break;
		case 116:
			return "F5";
			break;
		case 117:
			return "F6";
			break;
		case 118:
			return "F7";
			break;
		case 119:
			return "F8";
			break;
		case 120:
			return "F9";
			break;
		case 121:
			return "F10";
			break;
		case 122:
			return "F11";
			break;
		case 123:
			return "F12";
			break;
		case 124:
			return "F13";
			break;
		case 125:
			return "F14";
			break;
		case 126:
			return "F15";
			break;
		case 127:
			return "F16";
			break;
		case 128:
			return "F17";
			break;
		case 129:
			return "F18";
			break;
		case 130:
			return "F19";
			break;
		case 131:
			return "F20";
			break;
		case 132:
			return "F21";
			break;
		case 133:
			return "F22";
			break;
		case 134:
			return "F23";
			break;
		case 135:
			return "F24";
			break;
		case 144:
			return "Num Lock";
			break;
		case 145:
			return "Scroll Lock";
			break;
		case 188:
			return ",";
			break;
		case 190:
			return ".";
			break;
		case 191:
			return "/";
			break;
		case 192:
			return "`";
			break;
		case 219:
			return "[";
			break;
		case 220:
			return "Back Slash";
			break;
		case 221:
			return "]";
			break;
		case 222:
			return "'";
			break;
		case 224:
			return "Meta";
			break;
	}
  }
  
  function run() {
    // This is empty, there isn't anything to do.
  }

  return {
    initialize,
    run,
	keydown,
  };

}(Game.menu,Game.keyBindings,Game.input));
