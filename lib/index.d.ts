import type { ESLint, Linter } from "eslint";

declare const plugin: ESLint.Plugin & {
  configs: {
    recommended: ESLint.ConfigData;
    all: ESLint.ConfigData;
    "flat/recommended": Linter.Config;
    "flat/all": Linter.Config;
  };
};

export = plugin;
