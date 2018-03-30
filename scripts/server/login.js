// ------------------------------------------------------------------
//
// Nodejs module that handles login credential management
//
// ------------------------------------------------------------------
'use strict';

const fs = require('fs'),
  credential = require('credential'),
  pw = credential(),
  creds = new Map();

module.exports = (function() {

  /**
   * initialize the login module.
   * It reads the password database into memory // not scale able
   *
   * @warning assumes the password.db exists (can be empty)
   */
  function initialize() {
    fs.readFile(__dirname + '/passwords.db', (err, data) => {
      if (err) console.log('ERROR! ' + err.toString());

      const passwords = data.toString().split('\n');
      for (let i = 0; i < passwords.length; ++i) {
        if (passwords[i] !== '')
        {
          let cred = JSON.parse(passwords[i]);
          creds.set(cred.username, cred.hash);
        }
      }
    });
  }

  /**
   * verify checks that the username is stored in the database,
   * then verifies that the password matches the stored hash.
   *
   * @param username an existing username
   * @param password the password to check
   */
  function verify(username, password) {
    if (!creds.has(username))return Promise.reject();
    return pw.verify(creds.get(username), password);
  }

  /**
   * registerNewUser registers a new username / password pair
   * It checks if the username is unique
   * Then hashes the password and stores the username / hash pair
   *
   * @param username the new username to register
   * @param password the password to hash
   */
  function registerNewUser(username, password) { // TODO return promise
    if (creds.has(username))return false;
    console.log('creating user: ' + username);
    pw.hash(password)
      .then( hash => creds.set(username, hash),
        err  => { throw err; } )
      .then( () => fs.appendFile(__dirname + '/passwords.db',
        JSON.stringify({username:username,hash:creds.get(username)})+'\n',
        err => {
          if (err)
            console.log('ERROR! ' + err.toString());
        }))
      .catch(err => console.log('ERROR: ' + err.toString()));
    console.log('user ' + username + ' created');
    return true;
  }

  return {
    initialize,
    verify,
    registerNewUser
  };

})();
