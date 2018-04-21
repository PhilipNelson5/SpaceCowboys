Game.keyBindings = (function() {
	
  
  let keys = {
	keysChanged : false,
	forward : {key : 87, id : 0},
	back    : {key : 83, id : 1},
	left    : {key : 65, id : 2},
	right   : {key : 68, id : 3},
	fire    : {key : undefined, id : 4},
	oldF    : {key :  0, id : 0},
	oldB    : {key :  0, id : 1},
	oldL    : {key :  0, id : 2},
	oldR    : {key :  0, id : 3},
	oldFire : {key : undefined, id : 4},
  }

  

	return {
		keys : keys,
	};

}());
