# workspaces/require-dependency

Disallow importing from packages that are not listed as a dependency or devDependency in the package that is being imported to. This rule only affects files that are inside a package.

## Example

These examples have the following project structure:

```
project
└───packages
    └─── A
    └─── B
    └─── C
```

Examples of **incorrect** code for this rule:

```js
// inside "project/packages/A/index.js"
import foo from '@project/B/foo';
import bar from '../B/bar';
```

Examples of **correct** code for this rule:

```js
// "project/packages/A/package.json" containing:
// {
//   "dependencies": { "@project/B": "1.0.0" },
//   "devDependencies": { "@project/C": "1.0.0" }
// }

// inside "project/packages/A/index.js"
import foo from '@project/B/foo';
import bar from '../B/bar';
import baz from '@project/C/baz';
```
