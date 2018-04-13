// ------------------------------------------------------------------
//
// This is the graphics rendering code for the game.
//
// ------------------------------------------------------------------
Game.graphics = (function() {
  'use strict';

  let canvas = null;
  let context = null;
  let world = {
    size : 0,
    top : 0,
    left : 0
  };
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
      world.size = smallestSize * 0.9;
      world.left = Math.floor(canvas.width * 0.05);
      world.top = (canvas.height - world.size) / 2;
    } else {
      smallestSize = canvas.height;
      world.size = smallestSize * 0.9;
      world.top = Math.floor(canvas.height * 0.05);
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
    context.translate(center.x * world.size + world.left, center.y * world.size + world.top);
    context.rotate(rotation);
    context.translate(-(center.x * world.size + world.left), -(center.y * world.size + world.top));
  }

  //------------------------------------------------------------------
  //
  // Draw an image out of a spritesheet into the local canvas coordinate system.
  //
  //------------------------------------------------------------------
  function drawImageSpriteSheet(spriteSheet, spriteSize, sprite, center, size) {
    drawImage(
      spriteSheet,
      sprite * spriteSize.width, // which sprite
      0,
      spriteSize.width,
      spriteSize.height,
      center.x - size.width / 2,
      center.y - size.height / 2,
      size.width,
      size.height
    );
  }

  //------------------------------------------------------------------
  //
  // Draw a circle into the local canvas coordinate system.
  //
  //------------------------------------------------------------------
  function drawCircle(center, radius, color) {
    context.beginPath();
    context.arc(
      0.5 + world.left + (center.x * world.size), 
      0.5 + world.top + (center.y * world.size), 
      radius * world.size,
      0,
      2 * Math.PI, 
    );
    context.closePath();
    context.fillStyle = color;
    context.fill();
  }

  //------------------------------------------------------------------
  //
  // This is used to create a texture object that can be used by client
  // code for rendering.
  //
  //------------------------------------------------------------------
  function Texture(spec) {
    let that = {},
      ready = false,

      image = spec.image;

    that.updateRotation = function(angle) {
      spec.rotation += angle;
    };

    that.rotateRight = function(elapsedTime) {
      spec.rotation += spec.rotateRate * (elapsedTime / 1000);
    };

    that.rotateLeft = function(elapsedTime) {
      spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
    };

    that.moveLeft = function(elapsedTime) {
      spec.center.x -= spec.moveRate * (elapsedTime / 1000);
    };

    that.moveRight = function(elapsedTime) {
      spec.center.x += spec.moveRate * (elapsedTime / 1000);
    };

    that.moveUp = function(elapsedTime) {
      spec.center.y -= spec.moveRate * (elapsedTime / 1000);
    };

    that.moveDown = function(elapsedTime) {
      spec.center.y += spec.moveRate * (elapsedTime / 1000);
    };

    that.moveTo = function(center) {
      spec.center = center;
    };

    that.draw = function() {
      context.save();

      context.translate(spec.center.x, spec.center.y);
      context.rotate(spec.rotation);
      context.translate(-spec.center.x, -spec.center.y);

      context.drawImage(
        image,
        spec.center.x - spec.width/2,
        spec.center.y - spec.height/2,
        spec.width, spec.height);

      context.restore();
    };

    return that;
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
      dWidth, dHeight;

    if (arguments.length === 3) {
      let center = arguments[1];
      let size = arguments[2];
      sx = 0;
      sy = 0;
      sWidth = image.width;
      sHeight = image.height;
      dx = (center.x - size.width / 2);
      dy = (center.y - size.height / 2);
      dWidth = size.width;
      dHeight = size.height;
    } else if (arguments.length === 5) {
      sx = 0;
      sy = 0;
      sWidth = image.width;
      sHeight = image.height;
      dx = arguments[1];
      dy = arguments[2];
      dWidth = arguments[3];
      dHeight = arguments[4];
    } else if (arguments.length === 9) {
      sx = arguments[1];
      sy = arguments[2];
      sWidth = arguments[3];
      sHeight = arguments[4];
      dx = arguments[5];
      dy = arguments[6];
      dWidth = arguments[7];
      dHeight = arguments[8];
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
  // converst from client (pixel) coordinates to world coordinates
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
    Texture,
    toggleFullScreen,
    drawText,
    measureTextHeight,
    measureTextWidth,
    clientToWorld,
    notifyResize,

  };
}());
