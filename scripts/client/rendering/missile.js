// ------------------------------------------------------------------
//
// Rendering function for a Missile object.
//
// ------------------------------------------------------------------
MyGame.renderer.Missile = (function(graphics) {
    'use strict';
    let that = {};

    // ------------------------------------------------------------------
    //
    // Renders a Missile model.
    //
    // ------------------------------------------------------------------
    that.render = function(model, texture) {
        graphics.drawCircle(model.position, model.radius, '#FFFFFF');
    };

    return that;

}(MyGame.graphics));
