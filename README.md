# :space_invader: :alien: SpaceCowboys :gun: :cowboy_hat_face:
A battle royale, space cowboy themed!

| Criteria | Location |
| --- | --- |
| **Node.js server-based solution:** All files served to the browser from a server. |`./server.js` `./scripts/client/loader`|
| **User configuration:** Configurable controls and game options, persisted to local storage. |`./scripts/client/screens/config.js` `./scripts/client/keyBindings.js` `./scripts/client/screens/gameplay.js:~537`|
| **Sound** Sounds effects for the firing of weapons, explosions, ... |`./scripts/client/screens/gameplay.js:~409`|
| **Game scoring, with high scores persisted to server** This also includes the user interface to view and sort the scores. | |
| **Overall game and menu interface/presentation** |`./scripts/client/screens/`|
| **Particle system & effects** Player eliminated, Projectile hits another player, Projectile hits a building, Randomly around the inner edge of the shield |`./scripts/client/rendering/particle-system.js` `./scripts/client/screens/gameplay.js:~363, 445, 861, 902`|
| **Networking** - Client prediction with server reconciliation | |
| **Networking** - Entity interpolation | |
| **Networking** - Individualized game updatesEach client in the game is sent a customized update based on their spatial location in the arena. | |
| **Player registration/login** | |
| **Game Design** - Lobby | |
| **Game Design** - Player start location | |
| **Game Design** - Player perspectiveRendering of the area around a player. Can see everything around the player, except for other players who are only visible in the player's field of view. | |
| **Game Design** - MinimapRendering of the minimap overview | |
| **Game Design** - ShieldRepresentation and rendering of the energy shield | |
| **Game Design** - BuildingsBuilds are part of the terrain. The block player movement and weapon projectiles, but don't have to block the view of a player. | |
| **Game Design** - PowerupsPowerups include weapon, health, ammo, weapon upgrades. | |
