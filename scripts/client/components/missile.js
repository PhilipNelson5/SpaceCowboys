//------------------------------------------------------------------
//
// Model for each missile in the game.
//
//------------------------------------------------------------------
MyGame.components.Missile = function(spec) {
    'use strict';
    let that = {};

    Object.defineProperty(that, 'position', {
        get: () => spec.position
    });

    Object.defineProperty(that, 'radius', {
        get: () => spec.radius
    });

    Object.defineProperty(that, 'id', {
        get: () => spec.id
    });

    //------------------------------------------------------------------
    //
    // Update the position of the missle.  We don't receive updates from
    // the server, because the missile moves in a straight line until it
    // explodes.
    //
    //------------------------------------------------------------------
    that.update = function(elapsedTime) {
        let vectorX = Math.cos(spec.direction);
        let vectorY = Math.sin(spec.direction);

        spec.position.x += (vectorX * elapsedTime * spec.speed);
        spec.position.y += (vectorY * elapsedTime * spec.speed);

        spec.timeRemaining -= elapsedTime;

        if (spec.timeRemaining <= 0) {
            return false;
        } else {
            return true;
        }
    };

    return that;
};
