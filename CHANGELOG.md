## [v0.9.0] - 2023-06-10

- Added support for listing workspaces as `peerDependencies` & `optionalDependencies` (https://github.com/joshuajaco/eslint-plugin-workspaces/pull/25)
- Fixed a bug where workspaces that do not have a `name` property defined in their `package.json` file resulted in crashes. They are now being ignored instead. (https://github.com/joshuajaco/eslint-plugin-workspaces/issues/24)

## [v0.8.0] - 2023-03-04

- Replaced the underlying package to resolve monorepo packages (from [get-monorepo-packages](https://github.com/azz/get-monorepo-packages) to [find-workspaces](https://github.com/joshuajaco/find-workspaces)) which comes with a few benefits:
  - [pnpm workspaces](https://pnpm.io/workspaces) support
  - [bolt](https://github.com/boltpkg/bolt) support
  - caching layer which allows this plugin to look for the workspaces root relative to the file that is being linted instead of the current working directory.  
    This means you can run now eslint from outside a monorepo.

## [v0.7.0] - 2021-10-08

- Fixed a bug where imports were incorrectly flagged as relative imports ([#11](https://github.com/joshuajaco/eslint-plugin-workspaces/issues/11))
- It is no longer necessary to add the plugin when also extending one of the presets:

```patch
{
-  "plugins": ["workspaces"],
  "extends": ["plugin:workspaces/recommended"]
}
```

## [v0.6.2] - 2020-10-16

- Fixed a bug where mismatched dependencies were listed as disallowed ([#9](https://github.com/joshuajaco/eslint-plugin-workspaces/issues/9))

## [v0.6.1] - 2020-10-15

- Added support for lerna-based eslint runs ([@isachivka](https://github.com/isachivka) in [#10](https://github.com/joshuajaco/eslint-plugin-workspaces/pull/10))

## [v0.6.0] - 2020-10-06

- Added [Scopes](https://github.com/joshuajaco/eslint-plugin-workspaces/blob/main/docs/rules/no-cross-imports.md#scopes) -- a way to partially allow imports across workspace boundaries ([@tobilen](https://github.com/tobilen) in [#8](https://github.com/joshuajaco/eslint-plugin-workspaces/pull/8))
- Added this CHANGELOG file

[v0.9.0]: https://github.com/joshuajaco/eslint-plugin-workspaces/compare/v0.8.0...v0.9.0
[v0.8.0]: https://github.com/joshuajaco/eslint-plugin-workspaces/compare/v0.7.0...v0.8.0
[v0.7.0]: https://github.com/joshuajaco/eslint-plugin-workspaces/compare/v0.6.2...v0.7.0
[v0.6.2]: https://github.com/joshuajaco/eslint-plugin-workspaces/compare/v0.6.1...v0.6.2
[v0.6.1]: https://github.com/joshuajaco/eslint-plugin-workspaces/compare/v0.6.0...v0.6.1
[v0.6.0]: https://github.com/joshuajaco/eslint-plugin-workspaces/compare/v0.5.5...v0.6.0
