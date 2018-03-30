module.exports = {
  "env": {
    "browser": true,
      "commonjs": true,
      "es6": true,
      "jquery": true,
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
    "no-console": [
      "error", { allow: ["warn", "error", "log"] }
    ],
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
      "keyword-spacing": [
        "error", {
          "before": true,
          "after": true
        }
      ]
  }
};
