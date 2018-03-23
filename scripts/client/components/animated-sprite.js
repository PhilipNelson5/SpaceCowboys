/* global Demo */

//------------------------------------------------------------------
//
// Defines an animated model object.  The spec is defined as:
// {
//		spriteSheet: Image,
//		spriteSize: { width: , height: },	// In world coordinates
//		spriteCenter: { x:, y: },			// In world coordinates
//		spriteCount: Number of sprites in the sheet,
//		spriteTime: [array of times (milliseconds) for each frame]
// }
//
//------------------------------------------------------------------
MyGame.components.AnimatedSprite = function(spec) {
	'use strict';
	let frame = 0,
		that = {
			get spriteSheet() { return spec.spriteSheet; },
			get pixelWidth() { return spec.spriteSheet.width / spec.spriteCount; },
			get pixelHeight() { return spec.spriteSheet.height; },
			get width() { return spec.spriteSize.width; },
			get height() { return spec.spriteSize.height; },
			get center() { return spec.spriteCenter; },
			get sprite() { return spec.sprite; }
		};

	//
	// Initialize the animation of the spritesheet
	spec.sprite = 0;		// Which sprite to start with
	spec.elapsedTime = 0;	// How much time has occured in the animation for the current sprite
	spec.lifetime = 0;
	spec.spriteTime.forEach(item => {
		spec.lifetime += item;
	});

	//------------------------------------------------------------------
	//
	// Update the animation of the sprite based upon elapsed time.
	//
	//------------------------------------------------------------------
	that.update = function(elapsedTime) {
		spec.elapsedTime += elapsedTime;
		spec.lifetime -= elapsedTime;
		//
		// Check to see if we should update the animation frame
		if (spec.elapsedTime >= spec.spriteTime[spec.sprite]) {
			//
			// When switching sprites, keep the leftover time because
			// it needs to be accounted for the next sprite animation frame.
			spec.elapsedTime -= spec.spriteTime[spec.sprite];
			spec.sprite += 1;
			//
			// This provides wrap around from the last back to the first sprite
			spec.sprite = spec.sprite % spec.spriteCount;
		}

		return spec.lifetime > 0;
	};

	return that;
};
