Game.screens['gameplay'] = (function(menu, input, graphics, assets) {
  'use strict';

  var mouseCapture = false,
    myMouse = input.Mouse(),
    myKeyboard = input.Keyboard(),
    myTexture = null,
    cancelNextRequest = false,
    lastTimeStamp;

  console.log(Game.input);
  function initialize() {
    console.log('        gameplay initializing...');
    menu.addScreen('gameplay',
      `
      <canvas id="canvas-main"></canvas>
			<p> hello </p>
			`
    );

    myTexture = graphics.Texture( {
      image : assets['player-self'],
      center : { x : 100, y : 100 },
      width : 100, height : 100,
      rotation : 0,
      moveRate : 200,       // pixels per second
      rotateRate : 3.14159  // Radians per second
    });

    //
    // Create the keyboard input handler and register the keyboard commands
    myKeyboard.registerCommand(KeyEvent.DOM_VK_A, myTexture.moveLeft);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_D, myTexture.moveRight);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_W, myTexture.moveUp);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_S, myTexture.moveDown);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_Q, myTexture.rotateLeft);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_E, myTexture.rotateRight);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
      //
      // Stop the game loop by canceling the request for the next animation frame
      cancelNextRequest = true;
      //
      // Then, return to the main menu
    });

    //
    // Create an ability to move the logo using the mouse
    myMouse = input.Mouse();
    myMouse.registerCommand('mousedown', function(e) {
      mouseCapture = true;
      myTexture.moveTo({x : e.clientX, y : e.clientY});
    });

    myMouse.registerCommand('mouseup', function() {
      mouseCapture = false;
    });

    myMouse.registerCommand('mousemove', function(e) {
      if (mouseCapture) {
        myTexture.moveTo({x : e.clientX, y : e.clientY});
      }
    });
  }

  function update(elapsedTime) {
    myKeyboard.update(elapsedTime);
    myMouse.update(elapsedTime);
  }

  function render() {
    //graphics.clear();
    //myTexture.draw();
  }

  //------------------------------------------------------------------
  //
  // This is the Game Loop function!
  //
  //------------------------------------------------------------------
  function gameLoop(time) {

    update(time - lastTimeStamp);
    lastTimeStamp = time;

    render();

    if (!cancelNextRequest) {
      requestAnimationFrame(gameLoop);
    }
  }

  function run() {
    lastTimeStamp = performance.now();
    //
    // Start the animation loop
    cancelNextRequest = false;
    requestAnimationFrame(gameLoop);
  }

  return {
    initialize,
    run
  };

}(Game.menu, Game.input, Game.graphics, Game.assets));
