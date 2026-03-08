# eslint-plugin-workspaces ![npm downloads](https://img.shields.io/npm/dw/eslint-plugin-workspaces) [![Coverage Status](https://coveralls.io/repos/github/joshuajaco/eslint-plugin-workspaces/badge.svg)](https://coveralls.io/github/joshuajaco/eslint-plugin-workspaces) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

An ESLint plugin for enforcing consistent imports across monorepo packages.

It supports:

- [npm](https://docs.npmjs.com/cli/using-npm/workspaces)
- [pnpm](https://pnpm.io/workspaces)
- [yarn](https://yarnpkg.com/features/workspaces)
- [bun](https://bun.com/docs/pm/workspaces)
- [lerna](https://github.com/lerna/lerna)
- [bolt](https://github.com/boltpkg/bolt)

## Installation

```sh
# npm
npm i -D eslint-plugin-workspaces

#pnpm
pnpm add -D eslint-plugin-workspaces

# yarn
yarn add -D eslint-plugin-workspaces
```

## Configuration

Enable the rules in your `eslint.config.js` file:

```js
import workspaces from "eslint-plugin-workspaces";

export default [
  {
    plugins: { workspaces },
    rules: {
      "workspaces/no-relative-imports": "error",
      "workspaces/require-dependency": "warn",
    },
  },
  // ...
];
```

Or add the "recommended" preset:

```js
import workspaces from "eslint-plugin-workspaces";

export default [
  workspaces.configs.recommended,
  // ...
];
```

### ESLint v8 RC Config

Enable the rules in your `.eslintrc.json` file:

```json5
{
  plugins: ["workspaces"],
  rules: {
    "workspaces/no-relative-imports": "error",
    "workspaces/require-dependency": "warn",
  },
}
```

Or add the "recommended" preset:

```json5
{
  extends: ["plugin:workspaces/legacy-recommended"],
}
```

## Rules

✔ included in the "recommended" preset

🔧 fixable using the `--fix` command line option

|     |     | Name                                                                                                                      | Description                                                                |
| --- | --- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| ✔   | 🔧  | [no-absolute-imports](https://github.com/joshuajaco/eslint-plugin-workspaces/blob/main/docs/rules/no-absolute-imports.md) | disallow absolute imports for files that are within the current package    |
|     |     | [no-cross-imports](https://github.com/joshuajaco/eslint-plugin-workspaces/blob/main/docs/rules/no-cross-imports.md)       | disallow imports of files that are inside another package                  |
| ✔   | 🔧  | [no-relative-imports](https://github.com/joshuajaco/eslint-plugin-workspaces/blob/main/docs/rules/no-relative-imports.md) | disallow relative imports of files that are outside of the current package |
| ✔   |     | [require-dependency](https://github.com/joshuajaco/eslint-plugin-workspaces/blob/main/docs/rules/require-dependency.md)   | disallow importing from packages that are not listed as a dependency       |

## Presets

- `recommended` enables rules recommended for all users
- `all` enables all rules
- `legacy-recommended` same as `recommended` but for eslintrc format
- `legacy-all` same as `all` but for eslintrc format
- `flat/recommended` (**DEPRECATED**) alias for `recommended`
- `flat/all` (**DEPRECATED**) alias for `all`

# License

[MIT](https://github.com/joshuajaco/eslint-plugin-workspaces/blob/main/LICENSE)
