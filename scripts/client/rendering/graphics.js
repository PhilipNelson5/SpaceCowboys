// ------------------------------------------------------------------
//
// This is the graphics rendering code for the game.
//
// ------------------------------------------------------------------
Game.graphics = (function(assets) {
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
      sprite * spriteSize.width, 0,                 // which sprite to render
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


  //------------------------------------------------------------------
  //
  // Draw the clip for field of view
  //
  //------------------------------------------------------------------
  function beginClip(angle,distance) {
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
  
  function endClip(angle) {
    context.restore();
  }
  //------------------------------------------------------------------
  //
  // Draw the fog with a triangular field view cut out
  //
  //------------------------------------------------------------------
  function drawFog(angle, distance) {
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
    context.drawImage(assets['clouds-light'],
      -canvas.width/Math.sqrt(2),
      -canvas.height/Math.sqrt(2),
      canvas.width*Math.sqrt(2),
      canvas.height*Math.sqrt(2));
    context.rotate(-angle);
    context.translate(-canvas.width/2,-canvas.height/2);
    context.restore();
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
    beginClip,
    endClip,
    drawFog,
    Texture,


  };
}(Game.assets));
