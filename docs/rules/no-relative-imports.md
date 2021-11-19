# workspaces/no-relative-imports

Disallows the use of relative imports of files that are outside of the current package. This rule only affects files that are inside a package.

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
import foo from "../B/foo";
```

Examples of **correct** code for this rule:

```js
// inside "project/packages/A/index.js"
import foo from "@project/B/foo";

// inside "project/packages/B/index.js"
import foo from "./foo";

// inside "project/index.js"
import foo from "./packages/B/foo";
```
