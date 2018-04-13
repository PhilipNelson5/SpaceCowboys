//--------------------------------------------------------------
//
// Defines a Tiled component, which is a large image composed
// of multiple tiles
//
// spec {
//   size: { width: , height: },  // in world coordinates
//   pixel: { width: , height: }, // in pixel coordinates
//   titleSize:                   // size of source image tiles
//   assetKey:                    // root asset key to use for asset tiles
// }
//
//--------------------------------------------------------------

Game.components.Tiled = function(spec) {
  'use strict';

  var viewport = {
    left: 0,
    top: 0
  };

  var that = {
    get viewport() { return viewport; },
    get tileSize() { return spec.tileSize; },
    get size() { return spec.size; },
    get pixel() { return spec.pixel; },
    get assetKey() { return spec.assetKey; },
    get tilesX() { return spec.pixel.width / spec.tileSize; },
    get tilesY() { return spec.pixel.height / spec.tileSize; }
  };

  that.setViewport = function(left, top) {
    viewport.left = left;
    viewport.top = top;
  }

  that.move = function(vector) {
    viewport.left += vector.x;
    viewport.top += vector.y;

    // make sure don't move beyond viewport boundaries
    viewport.left = Math.max(viewport.left, 0);
    viewport.top = Math.max(viewport.top, 0);
    
    viewport.left = Math.min(viewport.left, spec.size.width - 1);
    viewport.top = Math.min(viewport.top, spec.size.height - 1);
  }

  return that;

};
