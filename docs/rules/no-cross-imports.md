# workspaces/no-cross-imports

Disallows the use of imports of files that are inside another package. This rule only affects files that are inside a package.

## Configuration

This rule takes one argument:

```
...
"workspaces/no-cross-imports": ["error", { allow: ["@project/A", "@project/B"] }]
...
```

### allow

Takes a single or a list of package names to exclude from this rule.

## Example

These examples have the following project structure:

```
project
└───packages
    └─── A
    └─── B
```

Examples of **incorrect** code for this rule:

```js
// inside "project/packages/A/index.js"
import foo from '@project/B/foo';
import bar from '../B/bar';
```

Examples of **correct** code for this rule:

```js
// inside "project/packages/A/index.js"
// configuration: [{ allow: "@project/B" }]
import foo from '@project/B/foo';
import bar from '../B/bar';

// inside "project/index.js"
import foo from './packages/B/foo';
```
