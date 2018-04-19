Game.keyBindings = (function() {

  let keys = {
	forward : 87,
	back    : 83,
	left    : 65,
	right   : 68
	//fire    : undefined
  }

/*
  function keyUp(e) {
	if(!e) e = event;
	forward = e.keyCode;
  }
  
  function keyDown(e) {
	back = e.keyCode;
  }
  
  function keyLeft(e) {
	left = e.keyCode;
  }

  function keyDown(e) {
	right = e.keyCode;
  }
*/
	return {keys : keys};

}());
