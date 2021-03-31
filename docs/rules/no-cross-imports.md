# workspaces/no-cross-imports

Disallows the use of imports of files that are inside another package. This rule only affects files that are inside a package.

## Configuration

This rule takes one argument:

```
...
"workspaces/no-cross-imports": ["error", { allow: ["@project/A", "@project/B"], scopes: { enable: true, folderName: 'shared' } }]
...
```

### allow

Takes a single or a list of package names to exclude from this rule.

#### Example

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

### scopes

Takes either a boolean or an options object. Defaults to `false`.

Scopes are a way to partially allow imports across workspace boundaries.
In larger monorepos, you might run into a situation where you want to group code
across _some_ packages, but not all of them. A natural way to do this would be
to create folder structure that visualizes this. So your structure might look
like this:

```
project
└─── packages
     └─── shared-components/
          └─── package.json
     └─── welcome-page/
          └─── package.json
     └─── user-management/
          └─── registration/
               └─── package.json
          └─── login/
               └─── package.json
```

Now, we may want to share code across the packages in the `user-management`
section (e.g. fetching the user object, user form components etc.). With scopes,
i am always allowed to import from a package with a **special folder name**
(see below) given that it shares a common folder parent. So for
the above case, I would be able to do this:

```
project
└─── packages
     └─── shared-components/
          └─── package.json
     └─── welcome-page/
          └─── package.json
     └─── user-management/
          └─── shared/
               └─── package.json
          └─── registration/
               └─── package.json
          └─── login/
               └─── package.json
```

When passing a boolean, the default folder name `shared` will be used. If you
want to configure this, pass another string via the `folderName` key.

#### Example

These examples have the following project structure:

```
project
└─── packages
     └─── shared-components/
          └─── package.json
     └─── welcome-page/
          └─── package.json
     └─── user-management/
          └─── shared/
               └─── package.json
          └─── registration/
               └─── package.json
          └─── login/
               └─── package.json
```

Examples of **incorrect** code for this rule:

```js
// inside "project/packages/welcome-page/index.js"
// configuration: [{ allow: "@project/user-management-shared", scopes: true }]
import foo from '@project/user-management-shared';
```

Examples of **correct** code for this rule:

```js
// inside "project/packages/user-management/registration/index.js"
// configuration: [{ allow: "@project/user-management-shared", scopes: true }]
import foo from '@project/user-management-shared';

// inside "project/index.js"
import foo from './packages/user-management/registration';
```
