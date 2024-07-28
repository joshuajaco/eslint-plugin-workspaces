import js from "@eslint/js";
import node from "eslint-plugin-n";
import eslintPlugin from "eslint-plugin-eslint-plugin";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  js.configs.recommended,
  node.configs["flat/recommended"],
  eslintPlugin.configs["flat/all"],
  prettier,
  {
    languageOptions: { globals: { ...globals.mocha, ...globals.node } },
    linterOptions: { reportUnusedDisableDirectives: true },
    rules: {
      "arrow-body-style": "error",
      strict: "error",
      "n/prefer-global/buffer": "error",
      "n/prefer-global/console": "error",
      "n/prefer-global/process": "error",
      "n/prefer-global/text-decoder": "error",
      "n/prefer-global/url": "error",
      "n/prefer-global/url-search-params": "error",
      "eslint-plugin/require-meta-docs-url": [
        "error",
        {
          pattern:
            "https://github.com/joshuajaco/eslint-plugin-workspaces/blob/main/docs/rules/{{name}}.md",
        },
      ],
    },
  },
  {
    files: ["**/*.mjs"],
    languageOptions: { sourceType: "module" },
  },
];