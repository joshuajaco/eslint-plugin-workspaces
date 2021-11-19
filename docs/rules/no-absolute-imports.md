# workspaces/no-absolute-imports

Disallows the use of absolute imports of files that are within the current package. This rule only affects files that are inside a package.

**Fixable:** This rule is automatically fixable using the `--fix` command line option.

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
import foo from "@project/A/foo";
```

Examples of **correct** code for this rule:

```js
// inside "project/packages/A/index.js"
import foo from "./foo";
import bar from "@project/B/bar";

// inside "project/index.js"
import foo from ".@project/A/foo";
```
