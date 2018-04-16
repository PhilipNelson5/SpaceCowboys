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
 
  var that = {
    get viewport() { return viewport; },
    get tileSize() { return spec.tileSize; },
    get size() { return spec.size; },
    get pixel() { return spec.pixel; },
    get assetKey() { return spec.assetKey; },
    get tilesX() { return spec.pixel.width / spec.tileSize; },
    get tilesY() { return spec.pixel.height / spec.tileSize; }
  };

  return that;

};
