Game.screens['config'] = (function(menu, keyBindings /*, input*/ ) {
  'use strict';

  let up = false;
  let down = false;
  let left = false;
  let right = false;
  let fire = false;

  // This is 100% garbage, but this is how the page listens.

  function checkKeys(key)
  {
    if (key === keyBindings.keys.forward.key
      || key === keyBindings.keys.back.key
      || key === keyBindings.keys.left.key
      || key === keyBindings.keys.right.key
      || key === keyBindings.keys.fire.key
    )
    {
      document.getElementById('rebind').innerHTML = 'Key Already bound!';
      up = false;
      down = false;
      right = false;
      left = false;
      fire = false;
    }
    else {
      document.getElementById('rebind').innerHTML = 'Please Press a Button to Rebind';
      keyBindings.keys.keysChanged = true;
    }
  }

  document.addEventListener('keydown', e => {
    if (e.keyCode === 32)
    {
      e.preventDefault();
    }
  });

  document.addEventListener('keyup', e => {
    if (e.keyCode === 32)
    {
      e.preventDefault();
    }
  });

  function keydown(e) {
    if (!e) e = event;
    document.removeEventListener('keydown',keydown);
    checkKeys(e.keyCode);
    if (up === true) {
      keyBindings.keys.forward.key = e.keyCode;
      document.getElementById('up').innerHTML = getBinding(e.keyCode);
      up = false;
    }
    if (down === true) {
      keyBindings.keys.back.key = e.keyCode;
      document.getElementById('down').innerHTML = getBinding(e.keyCode);
      down = false;
    }
    if (left === true) {
      keyBindings.keys.left.key = e.keyCode;
      document.getElementById('left').innerHTML = getBinding(e.keyCode);
      left = false;
    }
    if (right === true) {
      keyBindings.keys.right.key = e.keyCode;
      document.getElementById('right').innerHTML = getBinding(e.keyCode);
      right = false;
    }
    if (fire === true) {
      keyBindings.keys.fire.key = e.keyCode;
      document.getElementById('fire').innerHTML = getBinding(e.keyCode);
      fire = false;
    }
    document.getElementById('id-config-keyUp').disabled = false;
    document.getElementById('id-config-keyLeft').disabled = false;
    document.getElementById('id-config-keyRight').disabled = false;
    document.getElementById('id-config-keyDown').disabled = false;
    document.getElementById('id-config-keyFire').disabled = false;
    document.getElementById('id-config-back').disabled = false;
  }


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

    document.getElementById('id-config-back').addEventListener(
      'click',
      function() { menu.showScreen('main-menu'); });

    document.getElementById('id-config-keyUp').addEventListener(
      'click',
      function() {
        console.log(keyBindings.keys.forward.key);
        keyBindings.keys.oldF.key = keyBindings.keys.forward.key;
        up = true;
        document.getElementById('id-config-keyLeft').disabled = true;
        document.getElementById('id-config-keyDown').disabled = true;
        document.getElementById('id-config-keyRight').disabled = true;
        document.getElementById('id-config-keyFire').disabled = true;
        document.getElementById('id-config-back').disabled = true;
        document.getElementById('rebind').innerHTML = 'Press a Key To Rebind';
        document.addEventListener('keydown', keydown);
      });

    document.getElementById('id-config-keyDown').addEventListener(
      'click',
      function() {
        keyBindings.keys.oldB.key = keyBindings.keys.back.key;
        down = true;
        document.getElementById('id-config-keyUp').disabled = true;
        document.getElementById('id-config-keyLeft').disabled = true;
        document.getElementById('id-config-keyRight').disabled = true;
        document.getElementById('id-config-keyFire').disabled = true;
        document.getElementById('id-config-back').disabled = true;
        document.getElementById('rebind').innerHTML = 'Press a Key To Rebind';
        document.addEventListener('keydown', keydown);
      });

    document.getElementById('id-config-keyLeft').addEventListener(
      'click',
      function() {
        keyBindings.keys.oldL.key  = keyBindings.keys.left.key;
        left = true;
        document.getElementById('id-config-keyUp').disabled = true;
        document.getElementById('id-config-keyDown').disabled = true;
        document.getElementById('id-config-keyRight').disabled = true;
        document.getElementById('id-config-keyFire').disabled = true;
        document.getElementById('id-config-back').disabled = true;
        document.getElementById('rebind').innerHTML = 'Press a Key To Rebind';
        document.addEventListener('keydown', keydown);
      });

    document.getElementById('id-config-keyRight').addEventListener(
      'click',
      function() {
        keyBindings.keys.oldR.key  = keyBindings.keys.right.key;
        right = true;
        document.getElementById('id-config-keyUp').disabled = true;
        document.getElementById('id-config-keyLeft').disabled = true;
        document.getElementById('id-config-keyDown').disabled = true;
        document.getElementById('id-config-keyFire').disabled = true;
        document.getElementById('id-config-back').disabled = true;
        document.getElementById('rebind').innerHTML = 'Press a Key To Rebind';
        document.addEventListener('keydown', keydown);
      });

    document.getElementById('id-config-keyFire').addEventListener(
      'click',
      function() {
        keyBindings.keys.oldFire.key = keyBindings.keys.fire.key;
        fire = true;
        document.getElementById('id-config-keyUp').disabled = true;
        document.getElementById('id-config-keyLeft').disabled = true;
        document.getElementById('id-config-keyRight').disabled = true;
        document.getElementById('id-config-keyDown').disabled = true;
        document.getElementById('id-config-back').disabled = true;
        document.getElementById('rebind').innerHTML = 'Press a Key To Rebind';
        document.addEventListener('keydown', keydown);
      });
  }

  function getBinding(key) {
    switch (key) {
    case 3:
      return 'Cancel';

    case 6:
      return 'Help';

    case 8:
      return 'Back Space';

    case 9:
      return 'Tab';

    case 12:
      return 'Clear';

    case 13:
      return 'Return';

    case 14:
      return 'Enter';

    case 16:
      return 'Shift';

    case 17:
      return 'Control';

    case 18:
      return 'Alt';

    case 19:
      return 'Pause';

    case 20:
      return 'Caps Lock';

    case 27:
      return 'Escape';

    case 32:
      return 'Space';

    case 33:
      return 'Page Up';

    case 34:
      return 'Page Down';

    case 35:
      return 'End';

    case 36:
      return 'Home';

    case 37:
      return 'Left Arrow';

    case 38:
      return 'Up Arrow';

    case 39:
      return 'Right Arrow';

    case 40:
      return 'Down Arrow';

    case 44:
      return 'Printscreen';

    case 45:
      return 'Insert';

    case 46:
      return 'Delete';

    case 48:
      return '0';

    case 49:
      return '1';

    case 50:
      return '2';

    case 51:
      return '3';

    case 52:
      return '4';

    case 53:
      return '5';

    case 54:
      return '6';

    case 55:
      return '7';

    case 56:
      return '8';

    case 57:
      return '9';

    case 59:
      return ';';

    case 61:
      return '=';

    case 65:
      return 'a';

    case 66:
      return 'b';

    case 67:
      return 'c';

    case 68:
      return 'd';

    case 69:
      return 'e';

    case 70:
      return 'f';

    case 71:
      return 'g';

    case 72:
      return 'h';

    case 73:
      return 'i';

    case 74:
      return 'j';

    case 75:
      return 'k';

    case 76:
      return 'l';

    case 77:
      return 'm';

    case 78:
      return 'n';

    case 79:
      return 'o';

    case 80:
      return 'p';

    case 81:
      return 'q';

    case 82:
      return 'r';

    case 83:
      return 's';

    case 84:
      return 't';

    case 85:
      return 'u';

    case 86:
      return 'v';

    case 87:
      return 'w';

    case 88:
      return 'x';

    case 89:
      return 'y';

    case 90:
      return 'z';

    case 93:
      return 'Context Menu';

    case 96:
      return 'Numpad 0';

    case 97:
      return 'Numpad 1';

    case 98:
      return 'Numpad 2';

    case 99:
      return 'Numpad 3';

    case 100:
      return 'Numpad 4';

    case 101:
      return 'Numpad 5';

    case 102:
      return 'Numpad 6';

    case 103:
      return 'Numpad 7';

    case 104:
      return 'Numpad 8';

    case 105:
      return 'Numpad 9';

    case 106:
      return '*';

    case 107:
      return '+';

    case 108:
      return 'Separator';

    case 109:
      return '-';

    case 110:
      return '.';

    case 111:
      return '/';

    case 112:
      return 'F1';

    case 113:
      return 'F2';

    case 114:
      return 'F3';

    case 115:
      return 'F4';

    case 116:
      return 'F5';

    case 117:
      return 'F6';

    case 118:
      return 'F7';

    case 119:
      return 'F8';

    case 120:
      return 'F9';

    case 121:
      return 'F10';

    case 122:
      return 'F11';

    case 123:
      return 'F12';

    case 124:
      return 'F13';

    case 125:
      return 'F14';

    case 126:
      return 'F15';

    case 127:
      return 'F16';

    case 128:
      return 'F17';

    case 129:
      return 'F18';

    case 130:
      return 'F19';

    case 131:
      return 'F20';

    case 132:
      return 'F21';

    case 133:
      return 'F22';

    case 134:
      return 'F23';

    case 135:
      return 'F24';

    case 144:
      return 'Num Lock';

    case 145:
      return 'Scroll Lock';

    case 188:
      return ',';

    case 190:
      return '.';

    case 191:
      return '/';

    case 192:
      return '`';

    case 219:
      return '[';

    case 220:
      return 'Back Slash';

    case 221:
      return ']';

    case 222:
      return '\'';

    case 224:
      return 'Meta';

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
