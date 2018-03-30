module.exports = {
  "env": {
    "browser": true,
      "commonjs": true,
      "es6": true
  },
  "extends": "eslint:recommended",
  "globals": {
    "Game": true,
      "NetworkIds": true,
      "KeyEvent" : false,
      "io" : false,
  },
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": 0
    ,
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-console": [
      "error", { allow: ["warn", "error", "log"] }
    ],
    "keyword-spacing": [
      "error", { "before": false }
    ],
  }
};
