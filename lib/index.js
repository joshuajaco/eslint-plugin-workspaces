"use strict";

module.exports.rules = {
  "no-cross-imports": require("./rules/no-cross-imports"),
  "no-relative-imports": require("./rules/no-relative-imports"),
  "no-absolute-imports": require("./rules/no-absolute-imports"),
  "require-dependency": require("./rules/require-dependency"),
};

module.exports.configs = {
  recommended: {
    plugins: ["workspaces"],
    rules: {
      "workspaces/no-relative-imports": "error",
      "workspaces/no-absolute-imports": "error",
      "workspaces/require-dependency": "error",
    },
  },
  all: {
    plugins: ["workspaces"],
    rules: {
      "workspaces/no-relative-imports": "error",
      "workspaces/no-absolute-imports": "error",
      "workspaces/require-dependency": "error",
      "workspaces/no-cross-imports": "error",
    },
  },
};
