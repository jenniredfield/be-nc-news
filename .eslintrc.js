module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "mocha": true,
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-multiple-empty-lines": [
            "error",
            { "max" : 2, 
              "maxEOF": 1 }
           ]
    }
};
