Game = {
  assets: {},
  components: {},
  input: {},
  renderer: {},
  screens: {},
  utilities: {},
};

//------------------------------------------------------------------
//
// Purpose of this code is to bootstrap (maybe I should use that as the name)
// the rest of the application. Only this file is specified in the index.html
// file, then the code in this file gets all the other code and assets
// loaded. Once the code and assets are loaded, it will initialize the game.
//
//------------------------------------------------------------------
Game.loader = (function() {
  'use strict';
  // The file paths are from the client directory
  let scriptOrder = [
    {
      scripts: ['../shared/network-ids'],
      message: 'Network Ids loaded',
      onComplete: null,
    }, {
      scripts: ['../shared/queue'],
      message: 'Utilities loaded',
      onComplete: null,
    }, {
      scripts: ['../client/network'],
      message: 'Network loaded',
      onComplete: null,
    }, {
      scripts: ['input'],
      message: 'Input loaded',
      onComplete: null
    }, {
      scripts: ['rendering/renderer'],
      message: 'Renderers loaded',
      onComplete: null
    }, {
      scripts: ['screens/menu', 'screens/login', 'screens/createuser', 'screens/gamelobby','screens/config', 'screens/about', 'screens/playgame', 'screens/help', 'screens/highscores', 'screens/mainmenu'],
      message: 'Screens loaded',
      onComplete: null,
    }, {
      scripts: ['main'],
      message: 'Game model loaded',
      onComplete: null,
    // }, {
      // scripts: ['components/player', 'components/player-remote', 'components/missile', 'components/animated-sprite'],
      // message: 'Player models loaded',
      // onComplete: null
    // }, {
      // scripts: ['rendering/graphics'],
      // message: 'Graphics loaded',
      // onComplete: null
    }], // end scriptOrder

    assetOrder = [{
      key: 'player-self',
      source: 'assets/playerShip1_blue.png'
    }, {
      key: 'player-other',
      source: 'assets/playerShip1_red.png'
    }, {
      key: 'explosion',
      source: 'assets/explosion.png'
    }]; // end assetOrder

  //------------------------------------------------------------------
  //
  // Helper function used to load scripts in the order specified by the
  // 'scripts' parameter. 'scripts' expects an array of objects with
  // the following format...
  //    {
  //        scripts: [script1, script2, ...],
  //        message: 'Console message displayed after loading is complete',
  //        onComplete: function to call when loading is complete, may be null
  //    }
  //
  //------------------------------------------------------------------
  function loadScripts(scripts, onComplete) {
    // TODO: maybe make this iterative
    // Although recursion is beautiful, iteration seems more efficient

    //
    // When we run out of things to load, that is when we call onComplete.
    if (scripts.length > 0) {
      let entry = scripts[0];
      require(entry.scripts, function() {
        console.log(entry.message);
        if (entry.onComplete) {
          entry.onComplete();
        }
        scripts.splice(0, 1);
        loadScripts(scripts, onComplete);
      });
    } else {
      onComplete();
    }
  }

  //------------------------------------------------------------------
  //
  // Helper function used to load assets in the order specified by the
  // 'assets' parameter.  'assets' expects an array of objects with
  // the following format...
  //    {
  //        key: 'asset-1',
  //        source: 'assets/url/asset.png'
  //    }
  //
  // onSuccess  is invoked per asset as: onSuccess(key, asset)
  // onError    is invoked per asset as: onError(error)
  // onComplete is invoked once per 'assets' array as: onComplete()
  //
  //------------------------------------------------------------------
  function loadAssets(assets, onSuccess, onError, onComplete) {
    // TODO: maybe make this iterative
    // Although recursion is beautiful, iteration seems more efficient

    //
    // When we run out of things to load, that is when we call onComplete.
    if (assets.length > 0) {
      let entry = assets[0];
      loadAsset(entry.source, // source
        function(asset) { // onSuccess
          onSuccess(entry, asset);
          assets.splice(0, 1);
          loadAssets(assets, onSuccess, onError, onComplete);
        },
        function(error) { // onError
          onError(error);
          assets.splice(0, 1);
          loadAssets(assets, onSuccess, onError, onComplete);
        });
    } else {
      onComplete();
    }
  }

  //------------------------------------------------------------------
  //
  // This function is used to asynchronously load image and audio assets.
  // On success the asset is provided through the onSuccess callback.
  // Reference: http://www.html5rocks.com/en/tutorials/file/xhr2/
  //
  //------------------------------------------------------------------
  function loadAsset(source, onSuccess, onError) {
    let xhr = new XMLHttpRequest(),
      asset = null,

      // Source: http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
      fileExtension = source.substr(source.lastIndexOf('.') + 1);

    if (fileExtension) {
      xhr.open('GET', source, true);
      xhr.responseType = 'blob';

      xhr.onload = function() {
        if (xhr.status === 200) {
          if (fileExtension === 'png' || fileExtension === 'jpg') {
            asset = new Image();
          } else if (fileExtension === 'mp3') {
            asset = new Audio();
          } else {
            if (onError) { onError('Unknown file extension: ' + fileExtension); }
          }
          asset.onload = function() {
            window.URL.revokeObjectURL(asset.src);
          };
          asset.src = window.URL.createObjectURL(xhr.response);
          if (onSuccess) { onSuccess(asset); }
        } else {
          if (onError) { onError('Failed to retrieve: ' + source); }
        }
      };
    } else {
      if (onError) { onError('Unknown file extension: ' + fileExtension); }
    }

    xhr.send();
  }

  //------------------------------------------------------------------
  //
  // Called when all the scripts are loaded, it kicks off the game.
  //
  //------------------------------------------------------------------
  function mainComplete() {
    console.log('All scripts and asset loaded are loaded\n\nInitializing Game...\n');
    Game.main.initialize();
  }

  //
  // Start with loading the assets, then the scripts.
  console.log('Starting to dynamically load project assets...');
  loadAssets(assetOrder, //source
    function(source, asset) { //onSuccess store the asset in Game.assets
      Game.assets[source.key] = asset;
    },
    function(error) { //onError log the error to the console
      console.log(error);
    },
    function() { //onComplete load the scripts
      console.log('All assets loaded');
      console.log('Starting to dynamically load project scripts');
      loadScripts(scriptOrder, mainComplete);
    }
  );

}());
