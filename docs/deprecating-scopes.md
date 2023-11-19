# Deprecating scopes

The [`scopes`](./rules/no-cross-imports.md#scopes-deprecated) option of the [`workspaces/no-cross-imports`](./rules/no-cross-imports.md) rule has been deprecated and will be removed in the next major version.  
It was made with a specific use case in mind, but it turned out to be too inflexible and confusing.  
Since there are better ways to achieve the same result, the option will be removed.

## Migration

There are two ways to migrate from `scopes` using basic ESLint configuration:

### Using `overrides` (Recommended)

The [`overrides`](https://eslint.org/docs/user-guide/configuring/configuration-files#how-do-overrides-work) key of the ESLint configuration allows you to apply rules differently to a specific set of files.

#### Example

Assuming the following project structure:

```
project
└─── packages
     └─── user-management/
          └─── shared/
               └─── package.json
          └─── registration/
               └─── package.json
          └─── login/
               └─── package.json
```

Inside `project/.eslintrc.json`:

```jsonc
{
  // ...
  "rules": {
    // ...
    "workspaces/no-cross-imports": "error"
  },
  "overrides": [
    {
      "files": ["packages/user-management/**/*"],
      "rules": {
        "workspaces/no-cross-imports": [
          "error",
          { "allow": ["@project/user-management-shared"] }
        ]
      }
    }
  ]
}
```

### Using cascading configuration files

The [cascading configuration files feature](https://eslint.org/docs/latest/use/configure/configuration-files#cascading-and-hierarchy) of ESLint allows you to create a configuration file in a subdirectory of your project.

> [!WARNING]  
> This feature will be deprecated in the next major version of ESLint, see [Flat config rollout plans](https://eslint.org/blog/2023/10/flat-config-rollout-plans).  
> It is recommended to use [`overrides`](#using-overrides-recommended) instead.

#### Example

Assuming the following project structure:

```
project
└─── packages
     └─── user-management/
          └─── shared/
               └─── package.json
          └─── registration/
               └─── package.json
          └─── login/
               └─── package.json
```

Inside `project/.eslintrc.json`:

```jsonc
{
  // ...
  "rules": {
    // ...
    "workspaces/no-cross-imports": "error"
  }
}
```

Inside `project/packages/user-management/.eslintrc.json`:

```jsonc
{
  "rules": {
    "workspaces/no-cross-imports": [
      "error",
      { "allow": ["@project/user-management-shared"] }
    ]
  }
}
```
