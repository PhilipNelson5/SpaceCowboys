Game = {
  assets: {},
  components: {},
  input: {},
  keyBindings: {},
  graphics: {},
  screens: {},
  utilities: {},
  user: {},
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
        scripts: ['screens/menu'],
        message: 'Loaded menu module',
        onComplete: null,
      }, {
        scripts: ['../shared/network-ids'],
        message: 'Network Ids\t\tloaded',
        onComplete: null,
      }, {
        scripts: ['../shared/queue', '../shared/random'],
        message: 'Utilities\t\tloaded',
        onComplete: null,
      }, {
        scripts: ['../client/network'],
        message: 'Network\t\t\tloaded',
        onComplete: null,
      }, {
        scripts: ['./input'],
        message: 'Input\t\t\tloaded',
        onComplete: null
      }, {
        scripts: ['./keyBindings'],
        message: 'KeyBindings\t\t\tloaded',
        onComplete: null
      },{
        scripts: ['components/viewport', 'components/tiled'],
        message: 'World\tComponents\tloaded',
        onComplete: null
      }, {
        scripts: [
          'components/player',
          'components/player-remote',
          'components/missile',
          'components/animated-sprite',
          'components/animated-sprite-remote'
        ],
        message: 'Player models\tloaded',
        onComplete: null
      }, {
        scripts: ['rendering/graphics'],
        message: 'Renderer\t\tloaded',
        onComplete: null
      }, {
        scripts: [
          'rendering/animated-sprite',
          'rendering/animated-sprite-remote',
          'rendering/loot',
          'rendering/missile',
          'rendering/player',
          'rendering/player-remote',
          'rendering/tiled',
          'rendering/particle-system'
        ],
        message: 'Graphics\t\tloaded',
        onComplete: null
      }, {
        scripts: [
          'screens/login',
          'screens/createuser',
          'screens/gamelobby',
          'screens/config',
          'screens/about',
          'screens/map',
          'screens/gameplay',
          'screens/help',
          'screens/highscores',
          'screens/mainmenu',
          'screens/endgame'
        ],
        message: 'Screens\t\t\tloaded',
        onComplete: null,
      }, {
        scripts: ['main'],
        message: 'Game model\t\tloaded',
        onComplete: null,
      }], // end scriptOrder

    assetOrder = [{
      key: 'player-self',
      source: 'assets/blue_ship.png'
    }, {
      key: 'player-other',
      source: 'assets/red_ship.png'
    }, {
      key: 'explosion',
      source: 'assets/explosion.png'
    }, {
      key: 'clouds-light',
      source: 'assets/clouds_light.png'
    }, {
      key: 'clouds-dark',
      source: 'assets/clouds_dark.png'
    }, {
      key: 'loot-health',
      source: 'assets/loot-health.png'
    }, {
      key: 'loot-shield',
      source: 'assets/loot-shield.png'
    }, {
      key: 'loot-ammo',
      source: 'assets/loot-ammo.png'
    }, {
      key: 'loot-weapon',
      source: 'assets/loot-weapon.png'
    }, {
      key: 'loot-rangeUp',
      source: 'assets/loot-rangeUp.png'
    }, {
      key: 'loot-damageUp',
      source: 'assets/loot-damageUp.png'
    }, {
      key: 'loot-speedUp',
      source: 'assets/loot-speedUp.png'
    }, {
      key: 'background-mini',
      source: 'assets/background/cropped.jpg'
    }, {
      key: 'shield-icon',
      source: 'assets/shield-icon.png'
    }, {
      key: 'health-icon',
      source: 'assets/health-icon.png'
    }, {
      key: 'ammo-icon',
      source: 'assets/ammo-icon.png'
    }, {
      key: 'weapon-icon',
      source: 'assets/weapon-icon.png'
    }, {
      key: 'no-icon',
      source: 'assets/no-icon.png'
    }, {
      key: 'asteroid',
      source: 'assets/asteroid.png'
    }, {
      key: 'kills-icon',
      source: 'assets/kills-icon.png'
    }, {
      key: 'players-left',
      source: 'assets/players-left.png'
    }, {
      key: 'blue-particle',
      source: 'assets/blue-particle.png'
    }, {
      key: 'splat',
      source: 'assets/splat.png'
    }, {
      key: 'audio-health',
      source: 'assets/soundEffects/health.wav'
    }, {
      key: 'audio-ammo',
      source: 'assets/soundEffects/ammo.wav'
    }, {
      key: 'audio-death',
      source: 'assets/soundEffects/death.wav'
    }, {
      key: 'audio-impact',
      source: 'assets/soundEffects/impact.wav'
    }, {
      key: 'audio-laser',
      source: 'assets/soundEffects/laser.wav'
    }, {
      key: 'audio-hypershield',
      source: 'assets/soundEffects/shield.wav'
    }, {
      key: 'audio-hyperspeed',
      source: 'assets/soundEffects/hyperSpeed.wav'
    }, {
      key: 'audio-weapondamage',
      source: 'assets/soundEffects/weaponDamage.wav'
    }, {
      key: 'audio-weaponrange',
      source: 'assets/soundEffects/weaponRange.wav'
    }, {
      key: 'audio-weaponpickup',
      source: 'assets/soundEffects/weaponPickup.wav'
    }, {
      key: 'map-image',
      source: 'assets/background/map.png'
    }
    ]; // end assetOrder

  //------------------------------------------------------------------
  //
  // Zero pad a number
  //
  //------------------------------------------------------------------
  function numberPad(n, p, c) {
    var pad_char = typeof c !== 'undefined' ? c : '0';
    var pad = new Array(1 + p).join(pad_char);

    return (pad + n).slice(-pad.length);
  }

  //------------------------------------------------------------------
  //
  // helper function used to generate the asset entries necessary
  // to load a tiled image into memeory
  //
  //------------------------------------------------------------------
  function prepareTiledImage(assetArray, rootName, rootKey, sizeX, sizeY, tileSize) {
    var numberX = sizeX / tileSize;
    var numberY = sizeY / tileSize;
    var tileFile = '';
    var tileSource = '';
    var tileKey = '';
    var tileX = 0;
    var tileY = 0;

    Game.assets[rootKey] = {
      width: sizeX,
      height: sizeY,
      tileSize: tileSize
    };

    for (tileY = 0; tileY < numberY; tileY += 1) {
      for (tileX = 0; tileX < numberX; tileX += 1) {
        tileFile = numberPad((tileY * numberX + tileX), 4);
        tileSource = rootName + tileFile + '.jpg';
        tileKey = rootKey + '-' + tileFile;
        assetArray.push({
          key: tileKey,
          source: tileSource
        });
      }
    }
  }

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
          } else if (fileExtension === 'wav') {
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
  // Called when all the scripts are loaded, it kicks off the menu
  //
  //------------------------------------------------------------------
  function mainComplete() {
    console.log('All scripts and asset loaded are loaded');
    console.log('Initializing Game...');

    // make sure that all assets and scripts are actually loaded
    setTimeout(Game.main.initialize, 250);
  }


  // Start with loading the assets, then the scripts.
  console.log('Starting to dynamically load project assets...');
  //prepareTiledImage(assetOrder, '../../assets/background/tiles', 'background', 4992, 4992, 128);
  //prepareTiledImage(assetOrder, '../../assets/background/tiles', 'background', 5000, 5000, 200);
  prepareTiledImage(assetOrder, '../../assets/background/tiles', 'background', 2048, 2048, 128);
  loadAssets(assetOrder, //source
    function(source, asset) { //onSuccess store the asset in Game.assets
      Game.assets[source.key] = asset;
    },
    function(error) { //onError log the error to the console
      console.log(error);
    },
    function() { //onComplete load the scripts
      console.log('All assets\t\tloaded');
      console.log('Starting to dynamically load project scripts...');
      loadScripts(scriptOrder, mainComplete);
    }
  );

}());
