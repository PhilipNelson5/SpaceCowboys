// ------------------------------------------------------------------
//
// This is the graphics rendering code for the game.
//
// ------------------------------------------------------------------
Game.graphics = (function(assets) {
  'use strict';

  let canvas = null;
  let context = null;

  let world = {
    size : 0,
    top : 0,
    left : 0
  };

  let viewport = Game.components.Viewport({
    left: 0,
    top: 0,
    buffer: 0.50 // questions
  });

  var resizeHandlers = [];

  function initialize() {
    canvas = document.getElementById('canvas-main');
    context = canvas.getContext('2d');

    window.addEventListener('resize', function() {
      resizeCanvas();
    }, false);
    window.addEventListener('orientationchange', function() {
      resizeCanvas();
    }, false);
    window.addEventListener('deviceorientation', function() {
      resizeCanvas();
    }, false);

    // force resize first time
    resizeCanvas();
  }

  //------------------------------------------------------------------
  //
  // Used to set the size of the canvas to match the size of the
  // browser window so that rendering is zixel perfect
  //
  //------------------------------------------------------------------
  function resizeCanvas() {
    let smallestSize = 0;
    let handler = null;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // determine upper left corner of world based on
    // whether width or height is largest dimension
    if (canvas.width < canvas.height) {
      smallestSize = canvas.width;
      world.size = smallestSize;
      world.left = 0;
      world.top = (canvas.height - world.size) / 2;
    } else {
      smallestSize = canvas.height;
      world.size = smallestSize;
      world.top = 0;
      world.left = (canvas.width - world.size) / 2;
    }

    for (handler in resizeHandlers) {
      resizeHandlers[handler](true);
    }
  }

  //------------------------------------------------------------------
  //
  // Quick allow other code to be notified when a resize even occurs
  //
  //------------------------------------------------------------------
  function notifyResize(handler) {
    resizeHandlers.push(handler);
  }

  //------------------------------------------------------------------
  //
  // Toggles to full-screen mode:
  // If not in full screen, enters; if in full screen, exits
  //
  //------------------------------------------------------------------
  function toggleFullScreen(element) {
    var fullScreenElement = document.fullscreenElement ||
                            document.webkitFullscreenElement ||
                            document.mozFullScreenElement ||
                            document.msFullscreenElement;
    element.requestFullScreen = element.requestFullScreen ||
                            element.webkitRequestFullscreen ||
                            element.mozRequestFullScreen ||
                            element.msRequestFullscreen;
    document.exitFullscreen = document.exitFullscreen ||
                            document.webkitExitFullscreen ||
                            document.mozCancelFullScreen ||
                            document.msExitFullscreen;

    if (!fullScreenElement && element.requestFullScreen) {
      element.requestFullScreen();
    } else if (fullScreenElement) {
      document.exitFullscreen();
    }
  }

  //------------------------------------------------------------------
  //
  // Place a 'clear' function on the Canvas prototype, this makes it a part
  // of the canvas, rather than making a function that calls and does it.
  //
  //------------------------------------------------------------------
  CanvasRenderingContext2D.prototype.clear = function() {
    this.save();
    this.setTransform(1, 0, 0, 1, 0, 0);
    this.clearRect(0, 0, canvas.width, canvas.height);
    this.restore();
  };

  //------------------------------------------------------------------
  //
  // Public function that allows the client code to clear the canvas.
  //
  //------------------------------------------------------------------
  function clear() {
    context.clear(0, 0, canvas.width, canvas.height);
  }

  //------------------------------------------------------------------
  //
  // Simple pass-through to save the canvas context.
  //
  //------------------------------------------------------------------
  function saveContext() {
    context.save();
  }

  //------------------------------------------------------------------
  //
  // Simple pass-through the restore the canvas context.
  //
  //------------------------------------------------------------------
  function restoreContext() {
    context.restore();
  }

  //------------------------------------------------------------------
  //
  // Rotate the canvas to prepare it for rendering of a rotated object.
  //
  //------------------------------------------------------------------
  function rotateCanvas(center, rotation) {
    context.translate(
      (center.x - viewport.left) * world.size + world.left,
      (center.y - viewport.top) * world.size + world.top
    );

    context.rotate(rotation);

    context.translate(
      -((center.x - viewport.left) * world.size + world.left),
      -((center.y - viewport.top) * world.size + world.top)
    );
  }

  //------------------------------------------------------------------
  //
  // Draw an image out of a spritesheet into the local canvas coordinate system.
  //
  //------------------------------------------------------------------
  function drawImageSpriteSheet(spriteSheet, spriteSize, sprite, center, size) {
    drawImage(
      spriteSheet,
      sprite * spriteSize.width,            // which sprite
      0,
      spriteSize.width,                     // size in the spritesheet
      spriteSize.height,
      center.x - size.width / 2,
      center.y - size.height / 2,
      size.width,
      size.height,
      true
    );
  }
  //------------------------------------------------------------------
  //
  // Draw a circle into the local canvas coordinate system.
  //
  //------------------------------------------------------------------
  function drawCircle(center, radius, color, useViewport) {
    var adjustLeft = (useViewport === true) ? viewport.left : 0;
    var adjustTop = (useViewport === true) ? viewport.top : 0;

    context.beginPath();
    context.arc(
      0.5 + world.left + ((center.x - adjustLeft) * world.size),
      0.5 + world.top + ((center.y - adjustTop) * world.size),
      radius * world.size,
      0,
      2 * Math.PI
    );
    context.closePath();
    context.fillStyle = color;
    context.fill();
  }

  //------------------------------------------------------------------
  //
  // Draw the clip for field of view
  //
  //------------------------------------------------------------------
  function beginClip(angle /*,distance */) {
    context.save();

    context.translate(canvas.width/2,canvas.height/2);
    context.rotate(angle);

    context.beginPath();
    context.arc(0, 0, 25, 2*Math.PI, 0, false);
    context.closePath();
    context.strokeStyle='#0000FF';
    context.lineWidth=10;
    context.stroke();

    context.beginPath();
    context.moveTo(300, -canvas.height/2 );
    context.arc(0, 0, 2 * 50, 7/4*Math.PI, 5/4* Math.PI, false);
    context.lineTo(-300, -canvas.height/2);

    context.strokeStyle='#FFFF00';
    context.lineWidth=10;
    context.stroke();
    context.clip();
    context.rotate(-angle);
    context.translate(-canvas.width/2,-canvas.height/2);
  }

  function endClip() {
    context.restore();
  }
  //------------------------------------------------------------------
  //
  // Draw the fog with a triangular field view cut out
  //
  //------------------------------------------------------------------
  function drawFog(angle /*, distance */) {
    context.save();

    context.translate(canvas.width/2,canvas.height/2);
    context.rotate(angle);

    //Path function, creates a polygon that the image will fill
    context.beginPath();
    context.moveTo(-canvas.width,-canvas.height);
    context.lineTo(-300, -canvas.height/2);
    context.arc(0, 0, 2*50, 5/4*Math.PI, 7/4* Math.PI, true);
    context.lineTo(300, -canvas.height/2);
    context.lineTo(canvas.width, -canvas.height );
    context.lineTo(canvas.width, canvas.height );
    context.lineTo(-canvas.width, canvas.height );
    context.lineTo(-canvas.width,-canvas.height );
    context.closePath();

    //Debug to view fog draw
    context.strokeStyle='#FF0000';
    context.lineWidth=10;
    context.stroke();

    //create clip and draw picture inside of it
    context.clip();
    context.globalAlpha = 0.8;
    context.rotate(-angle);
    context.translate(-canvas.width/2,-canvas.height/2);
    context.drawImage(assets['clouds-light'],
      0,
      0,
      canvas.width,
      canvas.height);
    context.restore();
  }

  function drawWeapon(hasWeapon) {
    if (hasWeapon) {
      context.drawImage(
        assets['loot-weapon'],
        canvas.width/2.5,
        canvas.height*8.5/10,
        50,
        25
      );
    } else {
      context.drawImage(
        assets['weapon-icon'],
        canvas.width/2.5,
        canvas.height*8.5/10,
        50,
        25
      );
      context.drawImage(
        assets['no-icon'],
        canvas.width/2.45,
        canvas.height*8.5/10,
        25,
        25
      );
    }
  }

  function drawAmmo(ammo) {
    writeLeftCenter({
      color: 'black',
      font : '23px sans serif', // the font size and font name
      text : ammo,              // the text to be written
      x    : .51,               // the x location
      y    : 8.5/10             // the y location
    });

    context.drawImage(
      assets['ammo-icon'],
      canvas.width/2.1,
      canvas.height*8.5/10,
      25,
      25
    );
  }

  function drawHealth(health, maxH, shield, maxS) {
    // SHIELD
    let percentS = shield/maxS;

    context.fillStyle = 'gray';
    context.fillRect(
      canvas.width/10,
      canvas.height*9/10,
      canvas.width*8/10,
      25
    );

    if (shield > 0) {
      context.fillStyle = '#548bd0';
      context.fillRect(
        canvas.width/10,
        canvas.height*9/10,
        canvas.width*percentS*8/10,
        25
      );
    } else { shield = 0; }

    writeCenter({
      color: 'black',
      font : '23px sans serif', // the font size and font name
      text : shield + ' / ' + maxS,     // the text to be written
      x    : .5,        // the x location
      y    : 9/10       // the y location
    });

    context.drawImage(
      assets['shield-icon'],
      canvas.width/15,
      canvas.height*9/10,
      25,
      25
    );

    // HEALTH
    let percentH = health/maxH;

    context.fillStyle = 'gray';
    context.fillRect(
      canvas.width/10,
      canvas.height*19/20,
      canvas.width*8/10,
      25
    );

    if (health > 0) {
      context.fillStyle = '#67DB44';
      context.fillRect(
        canvas.width/10,
        canvas.height*19/20,
        canvas.width*percentH*8/10,
        25
      );
    } else { health = 0; }

    writeCenter({
      color: 'black',
      font : '23px sans serif', // the font size and font name
      text : health + ' / ' + maxH,     // the text to be written
      x    : .5,        // the x location
      y    : 19/20       // the y location
    });

    context.drawImage(
      assets['health-icon'],
      canvas.width/15,
      canvas.height*19/20,
      25,
      25
    );
  }

  function drawMini(map, position, worldWidth, worldHeight, asteroids) {
    let x = (3 * canvas.width)/ 4;
    let y = 5;
    let width = canvas.width/4 - 5;
    let height = canvas.width/4 - 5;
    let posX = position.x / worldWidth * (width - 2) + x;
    let posY = position.y / worldHeight * (height - 2) + y;

    context.strokeRect(x, y, width, height);
    context.drawImage(map, x+1, y+1, width-2, height-2);
    context.stroke();

    for (let i = 0; i < asteroids.length; i++) {
      let a = asteroids[i];
      let aposX = (a.position.x) / worldWidth * (width - 2) + x;
      let aposY = (a.position.y) / worldHeight * (height - 2) + y;
      let radius = (a.size.width / 2) / worldWidth * (width - 2);
      context.beginPath();
      context.moveTo(aposX + radius, aposY);
      context.arc(aposX, aposY, radius, 0, 2*Math.PI);
      context.closePath();
      context.fill();
    }

    context.beginPath();
    context.moveTo(posX + 3, posY);
    context.arc(posX, posY, 3, 0, 2*Math.PI);
    context.closePath();
    context.fill();
  }

  /**
   * write text given the top right coordinate
   * spec {
   *   color: color
   *   font : '#px serif' // the font size and font name
   *   text : 'text'      // the text to be written
   *   x    : #px         // the x location
   *   y    : #px         // the y location
   * }
   */
  function writeLeftCenter(spec) {
    context.font = spec.font;
    context.fillStyle = spec.color;
    spec.x*=canvas.width;
    spec.y*=canvas.height;
    let height = context.measureText('M').width;
    context.fillText(spec.text, spec.x, spec.y+height);
  }

  /**
   * write text given the lower right coordinate
   * spec {
   *   color: color
   *   font : '#px serif'   // the font size and font name
   *   text : 'text'        // the text to be written
   *   x    :  percent of x // the x location
   *   y    :  percent in y // the y location
   * }
   */
  function writeLowerRight(spec) {
    context.font = spec.font;
    spec.x*=canvas.width;
    spec.y*=canvas.height;
    let width = context.measureText(spec.text).width;
    let height = context.measureText('M').width;
    context.fillStyle = spec.fillStyle;
    context.fillText(spec.text, spec.x-width, spec.y-height);
  }

  /**
   * write text given the lower right coordinate
   * spec {
   *   color: color
   *   font : 'px serif'    // the font size and font name
   *   text : 'text'        // the text to be written
   *   x    :  percent of x // the x location
   *   y    :  percent in y // the y location
   * }
   */
  function writeCenter(spec) {
    context.font = spec.font;
    spec.x*=canvas.width;
    spec.y*=canvas.height;
    let width = context.measureText(spec.text).width;
    let height = context.measureText('M').width;
    context.fillStyle = spec.color;
    context.fillText(spec.text, spec.x-width/2, spec.y+height);
  }

  //------------------------------------------------------------------
  //
  // Renders text based on provided spec
  //
  //------------------------------------------------------------------
  function drawText(spec) {
    context.font = spec.font;
    context.fillStyle = spec.fill;
    context.textBaseline = 'top';

    context.fillText(
      spec.text,
      world.left + spec.position.x * world.size,
      world.top + spec.position.y * world.size
    );
  }

  //------------------------------------------------------------------
  //
  // Returns the height of specified font, in world units
  //
  //------------------------------------------------------------------
  function measureTextHeight(spec) {
    var height = 0;
    context.save();

    context.font = spec.font;
    context.fillStyle = spec.fill;

    height = context.measureText('m').width / world.size;

    context.restore();
    return height;
  }

  //------------------------------------------------------------------
  //
  // Returns the width of specified font, in world units
  //
  //------------------------------------------------------------------
  function measureTextWidth(spec) {
    var width = 0;
    context.save();

    context.font = spec.font;
    context.fillStyle = spec.fill;

    width = context.measureText(spec.text).width / world.size;

    context.restore();
    return width;
  }

  //------------------------------------------------------------------
  //
  // Pass-through that allows an image to be drawn
  //
  //------------------------------------------------------------------
  function drawImage() {
    var image = arguments[0],
      sx, sy,
      sWidth, sHeight,
      dx, dy,
      dWidth, dHeight,
      useViewport;

    // image texture, position, size
    if (arguments.length === 3 || arguments.length === 4) {
      let center = arguments[1];
      let size = arguments[2];
      sx = 0;
      sy = 0;
      sWidth = image.width;
      sHeight = image.height;
      dx = center.x - (size.width / 2);
      dy = center.y - (size.height / 2);
      dWidth = size.width;
      dHeight = size.height;
      useViewport = arguments[3];
    }
    // image texture, x, y, width, height
    else if (arguments.length === 5 || arguments.length === 6) {
      sx = 0;
      sy = 0;
      sWidth = image.width;
      sHeight = image.height;
      dx = arguments[1];
      dy = arguments[2];
      dWidth = arguments[3];
      dHeight = arguments[4];
      useViewport = arguments[5];
    }
    // for animated sprites
    // image texture, x-clip, y-clip, width-clip, height-clip,
    //                x, y, width, height
    else if (arguments.length === 9 || arguments.length === 10) {
      sx = arguments[1];
      sy = arguments[2];
      sWidth = arguments[3];
      sHeight = arguments[4];
      dx = arguments[5];
      dy = arguments[6];
      dWidth = arguments[7];
      dHeight = arguments[8];
      useViewport = arguments[9];
    }

    // when using the viewport
    if (useViewport) {
      dx -= viewport.left;
      dy -= viewport.top;
    }

    context.drawImage(
      image,
      sx, sy,
      sWidth, sHeight,
      Math.floor(dx * world.size + world.left),
      Math.floor(dy * world.size + world.top),
      Math.ceil(dWidth * world.size),
      Math.ceil(dHeight * world.size)
    );
  }

  //-------------------------------------------------------------------
  //
  // converts from client (pixel) coordinates to world coordinates
  //
  //-------------------------------------------------------------------
  function clientToWorld(clientX, clientY) {
    return {
      x: (clientX - world.left) / world.size,
      y: (clientY - world.top) / world.size
    };
  }

  return {
    initialize,
    clear,
    saveContext,
    restoreContext,
    rotateCanvas,
    drawImage,
    drawImageSpriteSheet,
    drawCircle,
    beginClip,
    endClip,
    drawFog,
    drawWeapon,
    drawAmmo,
    drawHealth,
    drawMini,
    toggleFullScreen,
    drawText,
    measureTextHeight,
    measureTextWidth,
    clientToWorld,
    notifyResize,
    writeLowerRight,
    writeCenter,
    get viewport() { return viewport; }


  };
}(Game.assets));
