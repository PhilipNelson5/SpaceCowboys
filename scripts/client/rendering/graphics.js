// ------------------------------------------------------------------
//
// This is the graphics rendering code for the game.
//
// ------------------------------------------------------------------
Game.graphics = (function() {
  'use strict';

  let canvas;
  let context;

  function initialize() {
    canvas = document.getElementById('canvas-main');
    context = canvas.getContext('2d');
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
    context.clear();
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
    context.translate(center.x * canvas.width, center.y * canvas.width);
    context.rotate(rotation);
    context.translate(-center.x * canvas.width, -center.y * canvas.width);
  }

  //------------------------------------------------------------------
  //
  // Draw an image into the local canvas coordinate system.
  //
  //------------------------------------------------------------------
  function drawImage(texture, center, size) {
    let localCenter = {
      x: center.x * canvas.width,
      y: center.y * canvas.width
    };
    let localSize = {
      width: size.width * canvas.width,
      height: size.height * canvas.height
    };

    context.drawImage(texture,
      localCenter.x - localSize.width / 2,
      localCenter.y - localSize.height / 2,
      localSize.width,
      localSize.height);
  }

  //------------------------------------------------------------------
  //
  // Draw an image out of a spritesheet into the local canvas coordinate system.
  //
  //------------------------------------------------------------------
  function drawImageSpriteSheet(spriteSheet, spriteSize, sprite, center, size) {
    let localCenter = {
      x: center.x * canvas.width,
      y: center.y * canvas.width
    };
    let localSize = {
      width: size.width * canvas.width,
      height: size.height * canvas.height
    };

    context.drawImage(spriteSheet,
      sprite * spriteSize.width, 0,           // which sprite to render
      spriteSize.width, spriteSize.height,    // size in the spritesheet
      localCenter.x - localSize.width / 2,
      localCenter.y - localSize.height / 2,
      localSize.width, localSize.height);
  }

  //------------------------------------------------------------------
  //
  // Draw a circle into the local canvas coordinate system.
  //
  //------------------------------------------------------------------
  function drawCircle(center, radius, color) {
    context.beginPath();
    context.arc(center.x * canvas.width, center.y * canvas.width, 2 * radius * canvas.width, 2 * Math.PI, false);
    context.closePath();
    context.fillStyle = color;
    context.fill();
  }

  function drawHealth(x, y, health, max) {
    let percent = health/max;

    context.fillStyle = 'red';
    context.fillRect(canvas.width/10, canvas.height*9/10, canvas.width*8/10, 25);

    if (health > 0) {
      context.fillStyle = 'green';
      context.fillRect(canvas.width/10, canvas.height*9/10, canvas.width*percent*8/10, 25);
    } else { health = 0; }

    writeCenter({
      color: 'black',
      font : '23px sans serif', // the font size and font name
      text : health + ' / ' + max,     // the text to be written
      x    : .5,        // the x location
      y    : 9/10       // the y location
    });
  }

  /**
   * write text given the top right coordinate
   * spec {
   * color: color
   * font : '#px serif' // the font size and font name
   * text : 'text'      // the text to be written
   * x    : #px         // the x location
   * y    : #px         // the y location
   * }
   */
  function write(spec) {
    context.font = spec.font;
    context.fillStyle = spec.color;
    context.fillText(spec.text, spec.x, spec.y);
  }

  /**
   * write text given the lower right coordinate
   * spec {
   * color: color
   * font : '#px serif' // the font size and font name
   * text : 'text'      // the text to be written
   * x    : #px         // the x location
   * y    : #px         // the y location
   * }
   */
  function writeLowerRight(spec) {
    context.font = spec.font;
    spec.x*=canvas.width;
    spec.y*=canvas.height;
    let width = context.measureText(spec.text).width;
    let height = context.measureText('M').width;
    write({
      font: spec.font,
      text: spec.text,
      x: spec.x-width, y: spec.y-height,
    });
  }

  /**
   * write text given the lower right coordinate
   * spec {
   * color: color
   * font : '#px serif' // the font size and font name
   * text : 'text'      // the text to be written
   * x    : #px         // the x location
   * y    : #px         // the y location
   * }
   */
  function writeCenter(spec) {
    context.font = spec.font;
    spec.x*=canvas.width;
    spec.y*=canvas.height;
    let width = context.measureText(spec.text).width;
    let height = context.measureText('M').width;
    // write({
    // font: spec.font,
    // text: spec.text,
    // x: spec.x-width/2, y: spec.y-height/2,
    // });
    context.fillStyle = spec.color;
    context.fillText(spec.text, spec.x-width/2, spec.y+height);
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

  return {
    initialize,
    clear,
    saveContext,
    restoreContext,
    rotateCanvas,
    drawImage,
    drawImageSpriteSheet,
    drawCircle,
    drawHealth,
    Texture,
    writeLowerRight,
    writeCenter,

  };
}());
