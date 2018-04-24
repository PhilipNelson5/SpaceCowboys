Game.screens['config'] = (function(menu, keyBindings) {
  'use strict';

  let up = false;
  let down = false;
  let left = false;
  let right = false;
  let fire = false;

  // This is 100% garbage, but this is how the page listens.

  function noSpace(e) {
    if (e.keyCode === 32)
      e.preventDefault();
  }

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

      if (up === true) {
        keyBindings.keys.forward.key = keyBindings.keys.oldF.key;
        up = false;
      }
      if (down === true) {
        keyBindings.keys.back.key = keyBindings.keys.oldD.key;
        down = false;
      }
      if (left === true) {
        keyBindings.keys.left.key = keyBindings.keys.oldL.key;
        left = false;
      }
      if (right === true) {
        keyBindings.keys.right.key = keyBindings.keys.oldR.key;
        right = false;
      }
      if (fire === true) {
        keyBindings.keys.fire.key = keyBindings.keys.oldFire.key;
        fire = false;
      }
    }
    else {
      document.getElementById('rebind').innerHTML = 'Please Press a Button to Rebind';
      keyBindings.keysChanged = true;
    }
  }

  function keydown(e) {
    if (!e) e = event;
    document.removeEventListener('keydown',keydown);
    checkKeys(e.keyCode);
    if (up === true) {
      keyBindings.keys.forward.key = e.keyCode;
      document.getElementById('up').innerHTML = keyBindings.getBinding(e.keyCode);
	  keyBindings.updateClient();
      up = false;
    }
    if (down === true) {
      keyBindings.keys.back.key = e.keyCode;
      document.getElementById('down').innerHTML = keyBindings.getBinding(e.keyCode);
	  keyBindings.updateClient();
      down = false;
    }
    if (left === true) {
      keyBindings.keys.left.key = e.keyCode;
      document.getElementById('left').innerHTML = keyBindings.getBinding(e.keyCode);
	  keyBindings.updateClient();
      left = false;
    }
    if (right === true) {
      keyBindings.keys.right.key = e.keyCode;
      document.getElementById('right').innerHTML = keyBindings.getBinding(e.keyCode);
	  keyBindings.updateClient();
      right = false;
    }
    if (fire === true) {
      keyBindings.keys.fire.key = e.keyCode;
      document.getElementById('fire').innerHTML = keyBindings.getBinding(e.keyCode);
	  keyBindings.updateClient();
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
      <li>Current:&nbsp;<span id = "up">w</span>&nbsp;<button id = "id-config-keyUp">Rebind&nbsp;Forward</button></li>
      <li>Current:&nbsp;<span id = "left">a</span>&nbsp;<button id = "id-config-keyLeft">Rebind&nbsp;Left</button></li>
      <li>Current:&nbsp;<span id = "down">s</span>&nbsp;<button id = "id-config-keyDown">Rebind&nbsp;Back</button></li>
      <li>Current:&nbsp;<span id = "right">d</span>&nbsp;<button id = "id-config-keyRight">Rebind&nbsp;Right</button></li>
      <li>Current:&nbsp;<span id = "fire">Mouse Right</span>&nbsp;<button id = "id-config-keyFire">Rebind&nbsp;Fire</button></li>
        <li><button id = "id-config-back">Back</button></li>
      </ul>
    `);

    document.getElementById('id-config-back').addEventListener(
      'click',
      function() {
        menu.showScreen('main-menu');
        document.removeEventListener('keyup', noSpace);
        document.removeEventListener('keydown', noSpace);
      });

    document.getElementById('id-config-keyUp').addEventListener(
      'click',
      function() {
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

  function run() {
    document.addEventListener('keyup', noSpace);
    document.addEventListener('keydown', noSpace);
	console.log(JSON.stringify(keyBindings.keys));

    document.getElementById('up').innerHTML = keyBindings.getBinding(keyBindings.keys.forward.key);
    document.getElementById('down').innerHTML = keyBindings.getBinding(keyBindings.keys.back.key);
    document.getElementById('left').innerHTML = keyBindings.getBinding(keyBindings.keys.left.key);
    document.getElementById('right').innerHTML = keyBindings.getBinding(keyBindings.keys.right.key);
    document.getElementById('fire').innerHTML = keyBindings.getBinding(keyBindings.keys.fire.key);
  }

  return {
    initialize,
    run,
    keydown,
  };

}(Game.menu,Game.keyBindings));
