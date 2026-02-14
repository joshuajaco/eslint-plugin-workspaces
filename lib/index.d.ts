import type { ESLint, Linter } from "eslint";

declare const plugin: ESLint.Plugin & {
  configs: {
    recommended: Linter.Config;
    all: Linter.Config;
    "legacy-recommended": ESLint.ConfigData;
    "legacy-all": ESLint.ConfigData;
    /**
     * @deprecated use 'recommended' preset instead
     */
    "flat/recommended": Linter.Config;
    /**
     * @deprecated use 'all' preset instead
     */
    "flat/all": Linter.Config;
  };
};

export = plugin;
