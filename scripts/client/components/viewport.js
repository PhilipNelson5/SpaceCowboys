//--------------------------------------------------------------
//
// namespace that holds the viewport component (camera)
//
//--------------------------------------------------------------
Game.components.Viewport = function(spec) {
  'use strict';

  var that = {
    get left() { return spec.left; },
    get top() { return spec.top; },
    get width() { return 1; },
    get height() { return 1; },
    get buffer() { return spec.buffer; }
  };

  Object.defineProperty(that, 'right', {
    get: function() { return that.left + that.width; },
    enumerable: true,
    configurable: false
  });

  Object.defineProperty(that, 'bottom', {
    get: function() { return that.top + that.height; },
    enumerable: true,
    configurable: false
  });

  //------------------------------------------------------------
  //
  // function used to ensure that the viewport moves to keep the
  // specified model visible.  Based upon the game-world location
  // of the model and the current state of the viewport, where
  // the viewport is updated to ensure that the model is visible
  //
  //------------------------------------------------------------
  that.update = function(model) { 
    // compute how close model is to visible edge in screen-space
    var diffRight = that.right - model.position.x;
    var diffLeft = Math.abs(spec.left - model.position.x);
    var diffBottom = that.bottom - model.position.y;
    var diffTop = Math.abs(spec.top - model.position.y);

    if (diffRight < spec.buffer) {
      spec.left += (spec.buffer - diffRight);
    }

    if (diffLeft < spec.buffer) {
      spec.left -= (spec.buffer - diffLeft);
    }

    if (diffBottom < spec.buffer) {
      spec.top += (spec.buffer - diffBottom);
    }

    if (diffTop < spec.buffer) {
      spec.top -= (spec.buffer - diffTop);
    }
  };

  //------------------------------------------------------------
  //
  // used to specify new viewport properties
  //
  //------------------------------------------------------------
  that.set = function(left, top, buffer) {
    spec.left = left;
    spec.top = top;
    spec.buffer = buffer;
  };

  return that;
}
