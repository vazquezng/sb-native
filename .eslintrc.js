module.exports = {
    "extends": "airbnb",
    "env": {
      "node": true,
      "browser": true,
    },
    /*"ecmaFeatures": {
      "modules": false,
    },*/
    "rules": {
      "no-console": [2, { allow: ["warn", "error", "err", "log"] }],
      'global-require': [0],
      "no-use-before-define": ["error", { "functions": false, "classes": false }],
      "new-cap": ["error", {"capIsNewExceptions": ["Q", "Q.Promise", "express.Router"]}],
      "no-param-reassign": ["error", {
        "props": true,
        "ignorePropertyModificationsFor": ["res"]
      }]
    }
}
