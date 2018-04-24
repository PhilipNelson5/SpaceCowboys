# :space_invader: :alien: SpaceCowboys :gun: :cowboy_hat_face:
A battle royale, space cowboy themed!

Made by Ammon Hepworth, Hailee Maxwell, Philip Nelson, Raul Ramirez

| Criteria | Location |
| --- | --- |
| **Node.js server-based solution:** All files served to the browser from a server. |`./server.js` `./scripts/client/loader`|
| **User configuration:** Configurable controls and game options, persisted to local storage. |`./scripts/client/screens/config.js` `./scripts/client/keyBindings.js` `./scripts/client/screens/gameplay.js:~537`|
| **Sound** Sounds effects for the firing of weapons, explosions, ... |`./scripts/client/screens/gameplay.js:~409`|
| **Game scoring, with high scores persisted to server** This also includes the user interface to view and sort the scores. |`./scripts/server/game.js` it's all there but there wasn't time to display it in the highscores menu|
| **Overall game and menu interface/presentation** |`./scripts/client/screens/`|
| **Particle system & effects** Player eliminated, Projectile hits another player, Projectile hits a building, Randomly around the inner edge of the shield |`./scripts/client/rendering/particle-system.js` `./scripts/client/screens/gameplay.js:~363, 445, 861, 902`|
| **Networking** - Client prediction with server reconciliation |`./scripts/server/game.js` `./scripts/client/components/player-remote.js`|
| **Networking** - Entity interpolation |`./scripts/client/component/player-remote.js`|
| **Networking** - Individualized game updatesEach client in the game is sent a customized update based on their spatial location in the arena. |`./scripts/server/game.js:~618`|
| **Player registration/login** |`./scripts/server/login.js` `./scripts/client/screens/login.js`|
| **Game Design** - Lobby |`./scripts/client/screens/gamelobby.js`|
| **Game Design** - Player start location |`./scripts/client/screens/map.js`|
| **Game Design** - Player perspectiveRendering of the area around a player. Can see everything around the player, except for other players who are only visible in the player's field of view. | |
| **Game Design** - MinimapRendering of the minimap overview |`./scripts/client/screens/gameplay.js:~912`|
| **Game Design** - ShieldRepresentation and rendering of the energy shield |`./scripts/client/screens/gameplay.js` it is the fog|
| **Game Design** - BuildingsBuilds are part of the terrain. The block player movement and weapon projectiles, but don't have to block the view of a player. |_Asteroids_ `./scripts/server/asteroids.js`|
| **Game Design** - PowerupsPowerups include weapon, health, ammo, weapon upgrades. |`./scripts/server/loot.js`|
