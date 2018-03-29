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

  function initialize() {
    fs.readFile(__dirname + '/passwords.db', (err, data) => {
      if(err) console.log('ERROR! ' + err.toString());

      const passwords = data.toString().split('\n');
      for(let i = 0; i < passwords.length; ++i) {
        if(passwords[i] !== '')
        {
          let cred = JSON.parse(passwords[i]);
          creds.set(cred.username, cred.hash);
        }
      }
    });
  }

  function verify(username, password) {
    if(!creds.has(username)) return Promise.reject();
    return pw.verify(creds.get(username), password);
  }

  function registerNewUser(username, password) { // TODO return promise
    if(creds.has(username)) return false;
    console.log('creating user: ' + username);
    pw.hash(password)
      .then( hash => creds.set(username, hash),
             err  => { throw err } )
      .then( () => fs.appendFile(__dirname + '/passwords.db',
        JSON.stringify({username:username,hash:creds.get(username)})+'\n',
      err => {
        if (err)
          console.log('ERROR! ' + err.toString())
      }))
      .catch(err => console.log('ERROR: ' + err.toString()));
    console.log('user ' + username + ' created');
    return true;
  }

  return {
    initialize,
    verify,
    registerNewUser
  }

})();
