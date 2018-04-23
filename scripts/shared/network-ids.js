// ------------------------------------------------------------------
//
// Shared module between Nodejs and the browser that defines constants
// used for network communication.
//
// The use of the IIFE is to create a module that works on both the server
// and the client.
// Reference for this idea: https://caolan.org/posts/writing_for_node_and_the_browser.html
//
// ------------------------------------------------------------------
(function(exports) {
  'use strict';

  Object.defineProperties(exports, {
    'INPUT': {
      value: 'input',
      writable: false
    },
    'INPUT_MOVE_UP': {
      value: 'move-up',
      writable: false
    },
    'INPUT_MOVE_DOWN': {
      value: 'move-down',
      writable: false
    },
    'INPUT_MOVE_RIGHT': {
      value: 'move-right',
      writable: false
    },
    'INPUT_MOVE_LEFT': {
      value: 'move-left',
      writable: false
    },
    'DIE': {
      value: 'die',
      writable: false
    },
    'INPUT_FIRE': {
      value: 'fire',
      writable: false
    },
    'CONNECT': {
      value: 'connection',
      writable: false
    },
    'CONNECT_ACK': {
      value: 'connect-ack',
      writable: false
    },
    'CONNECT_OTHER': {
      value: 'connect-other',
      writable: false
    },
    'DISCONNECT': {
      value: 'disconnect',
      writable: false
    },
    'DISCONNECT_OTHER': {
      value: 'disconnect-other',
      writable: false
    },
    'LOGIN_REQUEST': {
      value: 'login-request',
      writable: false
    },
    'LOGIN_RESPONSE': {
      value: 'login-response',
      writable: false
    },
    'CREATE_USER_REQUEST': {
      value: 'create-user-request',
      writable: false
    },
    'CREATE_USER_RESPONSE': {
      value: 'create-user-response',
      writable: false
    },
    'UPDATE_SELF': {
      value: 'update-self',
      writable: false
    },
    'UPDATE_OTHER': {
      value: 'update-other',
      writable: false
    },
    'MISSILE_NEW': {
      value: 'missile-new',
      writable: false
    },
    'MISSILE_HIT': {
      value: 'missile-hit',
      writable: false
    },
    'CHAT_MESSAGE': {
      value: 'chat_message',
      writable: false
    },
    'LEAVE_LOBBY': {
      value: 'leave_lobby',
      writable: false
    },
    'ENTER_LOBBY': {
      value: 'enter_lobby',
      writable: false
    },
    'REQUEST_USERS': {
      value: 'request_users',
      writable: false
    },
    'START_TIMER': {
      value: 'start_timer',
      writable: false
    },
    'REQUEST_TIMER': {
      value: 'request_timer',
      writable: false
    },
    'START_GAME': {
      value: 'start_game',
      writable: false
    },
    'JOIN_LOBBY_REQUEST': {
      value: 'joint_lobby_request',
      writable: false
    },
    'JOIN_LOBBY_RESPONSE': {
      value: 'join_lobby_response',
      writable: false
    },
    'INIT_PLAYER_MODEL': {
      value: 'init_player_model',
      writiable: false
    },
    'INIT_ENEMY_MODEL': {
      value: 'init_enemy_model',
      writiable: false
    },
    'CLEAR_CHAT_MESSAGE': {
      value: 'clear_chat_message',
      writable: false
    },
    'LONG_CHAT_MESSAGE': {
      value: 'long_chat_message',
      writable: false
    },
    'MISSILE_HIT_YOU': {
      value: 'missile_hit_you',
      writable: false
    },
    'STARTING_LOOT': {
      value: 'starting-loot',
      writable: false
    },
    'LOOT_UPDATE': {
      value: 'loot-update',
      writable: false
    },
    'STARTING_ASTEROIDS': {
      value: 'starting-asteroids',
      writable: false
    },
    'ENTER_MAP': {
      value: 'enter-map',
      writable: false
    },
    'START_TIMER_MAP': {
      value: 'start-timer-map',
      writable: false
    },
    'PLAYER_POSITION': {
      value: 'player-position',
      writable: false
    },
    'UPDATE_ALIVE_PLAYERS': {
      value: 'update-alive-players',
      writable: false
    }

  });

})(typeof exports === 'undefined' ? this['NetworkIds'] = {} : exports);
