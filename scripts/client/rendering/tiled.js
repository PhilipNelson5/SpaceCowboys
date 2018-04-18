//--------------------------------------------------------------
//
// Rendering function for a /Components/Tiles object
//
//--------------------------------------------------------------

Game.graphics.Tiled = ( function(graphics) {
  'use strict';
  
  var that = {};
  var RENDER_POS_EPISILON = 0.00001;

  //------------------------------------------------------------
  //
  // Zero pad a number, adapted from Stack Overflow
  // Source: http://stackoverflow.com/questions/1267283/
  //         how-can-i-create-a-zerofilled-value-using-javascript
  //
  //------------------------------------------------------------
  function numberPad(n, p, c) {
    var pad_char = typeof c !== 'undefined' ? c : '0';
    var pad = new Array(1 + p).join(pad_char);

    return (pad + n).slice(-pad.length);
  }

  //------------------------------------------------------------
  //
  // Renders a Tiled model
  //
  //------------------------------------------------------------
  that.render = function(image, viewport) {
    var tiledSizeWorldCoords = image.size.width * (image.tileSize / image.pixel.width);
    var oneOverTileSizeWorld = 1 / tiledSizeWorldCoords;
    var imageWorldXPos = viewport.left;
    var imageWorldYPos = viewport.top;
    var worldXRemain = 1.0;
    var worldYRemain = 1.0;
    var renderPosX = 0.0;
    var renderPosY = 0.0;
    var tileLeft,
        tileTop,
        tileAssetName,
        tileRenderXStart,
        tileRenderYStart,
        tileRenderXDist,
        tileRenderYDist,
        tileRenderWorldWidth,
        tileRenderWorldHeight;

    while (worldYRemain > RENDER_POS_EPISILON) {
      tileLeft = Math.floor(imageWorldXPos * oneOverTileSizeWorld);
      tileTop = Math.floor(imageWorldYPos * oneOverTileSizeWorld);

      if (worldXRemain === 1.0) {
        tileRenderXStart = imageWorldXPos * oneOverTileSizeWorld - tileLeft;
      } else {
        tileRenderXStart = 0.0;
      }

      if (worldYRemain === 1.0) {
        tileRenderYStart = imageWorldYPos * oneOverTileSizeWorld - tileTop;
      } else {
        tileRenderYStart = 0.0;
      }

      tileRenderXDist = 1.0 - tileRenderXStart;
      tileRenderYDist = 1.0 - tileRenderYStart;

      tileRenderWorldWidth = tileRenderXDist / oneOverTileSizeWorld;
      tileRenderWorldHeight = tileRenderYDist / oneOverTileSizeWorld;

      if (renderPosX + tileRenderWorldWidth > 1.0) {
        tileRenderWorldWidth = 1.0 - renderPosX;
        tileRenderXDist = tileRenderWorldWidth * oneOverTileSizeWorld;
      }

      if (renderPosY + tileRenderWorldHeight > 1.0) {
        tileRenderWorldHeight = 1.0 - renderPosY;
        tileRenderYDist = tileRenderWorldHeight * oneOverTileSizeWorld;
      }

      tileAssetName = image.assetKey + '-' + numberPad(tileTop * image.tilesX + tileLeft, 4);
      graphics.drawImage(
        Game.assets[tileAssetName],
        tileRenderXStart * image.tileSize,
        tileRenderYStart * image.tileSize,
        tileRenderXDist * image.tileSize,
        tileRenderYDist * image.tileSize,
        renderPosX,
        renderPosY,
        tileRenderWorldWidth,
        tileRenderWorldHeight,
      );

      imageWorldXPos += tileRenderWorldWidth;
      renderPosX += tileRenderWorldWidth;

      worldXRemain -= tileRenderWorldWidth;
      if (worldXRemain <= RENDER_POS_EPISILON) {
        imageWorldYPos += tileRenderWorldHeight;
        renderPosY += tileRenderWorldHeight;
        worldYRemain -= tileRenderWorldHeight;

        imageWorldXPos = viewport.left;
        renderPosX = 0.0;
        worldXRemain = 1.0;
      }
    }
  };

  return that;

}(Game.graphics));
