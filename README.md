# eslint-plugin-workspaces [![Coverage Status](https://coveralls.io/repos/github/joshuajaco/eslint-plugin-workspaces/badge.svg)](https://coveralls.io/github/joshuajaco/eslint-plugin-workspaces) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

An ESLint plugin for enforcing consistent imports across monorepo packages.

It support [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) as well as [lerna](https://github.com/lerna/lerna).

## Installation

```sh
# npm
npm install eslint-plugin-workspaces --save-dev

# yarn
yarn add eslint-plugin-workspaces --dev
```

## Configuration

Enable the rules in your ESLint configuration file:

```json
{
  "plugins": ["workspaces"],
  "rules": {
    "workspaces/no-relative-imports": "error",
    "workspaces/require-dependency": "warn"
  }
}
```

Or add the "recommended" preset:

```json
{
  "extends": ["plugin:workspaces/recommended"]
}
```

## Rules

✔ included in the "recommended" preset

🔧 fixable using the `--fix` command line option

|     |     | Name                                                                                                                        | Description                                                                |
| --- | --- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| ✔   | 🔧  | [no-absolute-imports](https://github.com/joshuajaco/eslint-plugin-workspaces/blob/main/docs/rules/no-absolute-imports.md) | disallow absolute imports for files that are within the current package    |
|     |     | [no-cross-imports](https://github.com/joshuajaco/eslint-plugin-workspaces/blob/main/docs/rules/no-cross-imports.md)       | disallow imports of files that are inside another package                  |
| ✔   | 🔧  | [no-relative-imports](https://github.com/joshuajaco/eslint-plugin-workspaces/blob/main/docs/rules/no-relative-imports.md) | disallow relative imports of files that are outside of the current package |
| ✔   |     | [require-dependency](https://github.com/joshuajaco/eslint-plugin-workspaces/blob/main/docs/rules/require-dependency.md)   | disallow importing from packages that are not listed as a dependency       |

## Presets

- `recommended` enables rules recommended for all users
- `all` enables all rules

# License

[MIT](https://github.com/joshuajaco/eslint-plugin-workspaces/blob/main/LICENSE)
