"use strict";

const plugin = {
  rules: {
    "no-cross-imports": require("./rules/no-cross-imports"),
    "no-relative-imports": require("./rules/no-relative-imports"),
    "no-absolute-imports": require("./rules/no-absolute-imports"),
    "require-dependency": require("./rules/require-dependency"),
  },
  configs: {
    "legacy-recommended": {
      plugins: ["workspaces"],
      rules: {
        "workspaces/no-relative-imports": "error",
        "workspaces/no-absolute-imports": "error",
        "workspaces/require-dependency": "error",
      },
    },
    "legacy-all": {
      plugins: ["workspaces"],
      rules: {
        "workspaces/no-relative-imports": "error",
        "workspaces/no-absolute-imports": "error",
        "workspaces/require-dependency": "error",
        "workspaces/no-cross-imports": "error",
      },
    },
  },
};

const recommended = {
  plugins: { workspaces: plugin },
  rules: {
    "workspaces/no-relative-imports": "error",
    "workspaces/no-absolute-imports": "error",
    "workspaces/require-dependency": "error",
  },
};

const all = {
  plugins: { workspaces: plugin },
  rules: {
    "workspaces/no-relative-imports": "error",
    "workspaces/no-absolute-imports": "error",
    "workspaces/require-dependency": "error",
    "workspaces/no-cross-imports": "error",
  },
};

Object.assign(plugin.configs, { recommended, all });

let flatRecommendedDeprecationShown = false;
let flatAllDeprecationShown = false;

Object.defineProperties(plugin.configs, {
  "flat/recommended": {
    get() {
      /* istanbul ignore if */
      if (!flatRecommendedDeprecationShown && process.stdout?.isTTY) {
        flatRecommendedDeprecationShown = true;
        console.warn(
          "\x1b[1m", // bright
          "\x1b[33m", // yellow text
          `[eslint-plugin-workspaces] Warning: the 'flat/recommended' config has been deprecated and will be removed in the next major version. Use 'recommended' instead.`,
        );
      }
      return recommended;
    },
  },
  "flat/all": {
    get() {
      /* istanbul ignore if */
      if (!flatAllDeprecationShown && process.stdout?.isTTY) {
        flatAllDeprecationShown = true;
        console.warn(
          "\x1b[1m", // bright
          "\x1b[33m", // yellow text
          `[eslint-plugin-workspaces] Warning: the 'flat/all' config has been deprecated and will be removed in the next major version. Use 'all' instead.`,
        );
      }
      return all;
    },
  },
});

module.exports = plugin;
