"use strict";

const { findWorkspaces } = require("find-workspaces");
const { ruleTester } = require("../ruleTester");
const { findWorkspacesMock } = require("../mocks");
const rule = require("../../lib/rules/no-cross-imports");

describe("no-cross-imports", () => {
  before(() => findWorkspaces.callsFake(findWorkspacesMock));

  ruleTester.run("no-cross-imports", rule, {
    valid: [
      "import module from 'module';",
      "require('module');",
      "import('module');",
      "import 'module';",
      "import '../some/relative/path';",
      "someFunction();",
      "let a;",
      {
        options: [{ allow: "@test/workspace" }],
        filename: "/some/path.js",
        code: "import '@test/workspace';",
      },
      {
        options: [{ allow: ["@test/workspace", "@test/another-workspace"] }],
        filename: "/some/path.js",
        code: "import '@test/workspace';import '@test/another-workspace';",
      },
      {
        filename: "/test/workspace/test.js",
        code: "import '@test/workspace';",
      },
      {
        filename: "/test/workspace/test.js",
        code: "import './some/thing'",
      },
      {
        filename: "/test/workspace/test.js",
        code: "require(undefined)",
      },
      {
        filename: "/some/file.js",
        code: "import '@test/workspace';",
      },
      {
        options: [{ scopes: true }],
        filename: "/test/scope/workspace/file.js",
        code: "import '@test/shared-in-scope';",
      },
      {
        options: [{ scopes: { enable: true } }],
        filename: "/test/scope/workspace/file.js",
        code: "import '@test/shared-in-scope';",
      },
      {
        options: [{ scopes: { enable: true, folderName: "shared" } }],
        filename: "/test/scope/workspace/file.js",
        code: "import '@test/shared-in-scope';",
      },
      {
        filename: "/test/workspace/index.js",
        code: "import './no-npm-scope-workspace';",
      },
    ],

    invalid: [
      {
        code: "import workspace from '@test/workspace';",
        filename: "/test/another-workspace/test.js",
        errors: [
          {
            message: 'Import from package "@test/workspace" is not allowed',
          },
        ],
      },
      {
        code: "import('@test/workspace');",
        filename: "/test/another-workspace/test.js",
        errors: [
          {
            message: 'Import from package "@test/workspace" is not allowed',
          },
        ],
      },
      {
        code: "const test = import('@test/workspace');",
        filename: "/test/another-workspace/test.js",
        errors: [
          {
            message: 'Import from package "@test/workspace" is not allowed',
          },
        ],
      },
      {
        code: "async () => await import('@test/workspace');",
        filename: "/test/another-workspace/test.js",
        errors: [
          {
            message: 'Import from package "@test/workspace" is not allowed',
          },
        ],
      },
      {
        code: "require('@test/workspace');",
        filename: "/test/another-workspace/test.js",
        errors: [
          {
            message: 'Import from package "@test/workspace" is not allowed',
          },
        ],
      },
      {
        code: "const test = require('@test/workspace');",
        filename: "/test/another-workspace/test.js",
        errors: [
          {
            message: 'Import from package "@test/workspace" is not allowed',
          },
        ],
      },
      {
        code: "import workspace from '@test/workspace';",
        filename: "/test/another-workspace/test.js",
        errors: [
          {
            message: 'Import from package "@test/workspace" is not allowed',
          },
        ],
      },
      {
        code: "import '@test/workspace';",
        filename: "/test/another-workspace/test.js",
        errors: [
          {
            message: 'Import from package "@test/workspace" is not allowed',
          },
        ],
      },
      {
        code: "import '@test/workspace/some/path';",
        filename: "/test/another-workspace/test.js",
        errors: [
          {
            message: 'Import from package "@test/workspace" is not allowed',
          },
        ],
      },
      {
        code: "import '../../test/workspace';",
        filename: "/test/another-workspace/test.js",
        errors: [
          {
            message: 'Import from package "@test/workspace" is not allowed',
          },
        ],
      },
      {
        code: "import '../../test/workspace/some/path';",
        filename: "/test/another-workspace/test.js",
        errors: [
          {
            message: 'Import from package "@test/workspace" is not allowed',
          },
        ],
      },
      {
        code: "import '@test/workspace';import '@test/another-workspace';",
        filename: "/test/third-workspace/test.js",
        errors: [
          {
            message: 'Import from package "@test/workspace" is not allowed',
          },
          {
            message:
              'Import from package "@test/another-workspace" is not allowed',
          },
        ],
      },
      {
        code: "import '@test/workspace';import '@test/another-workspace';",
        options: [{ allow: "@test/workspace" }],
        filename: "/test/third-workspace/test.js",
        errors: [
          {
            message:
              'Import from package "@test/another-workspace" is not allowed',
          },
        ],
      },
      {
        options: [{ allow: "@test/workspacetest" }],
        filename: "/test/another-workspace/test.js",
        code: "import '@test/workspace';",
        errors: [
          {
            message: 'Import from package "@test/workspace" is not allowed',
          },
        ],
      },
      {
        filename: "/test/workspace/test.js",
        code: "import '../another-workspace/test'",
        errors: [
          {
            message:
              'Import from package "@test/another-workspace" is not allowed',
          },
        ],
      },
      {
        options: [{ scopes: true }],
        filename: "/test/scope/workspace/file.js",
        code: "import '@test/shared-outside-scope';",
        errors: [
          {
            message:
              'Import from package "@test/shared-outside-scope" is not allowed',
          },
        ],
      },
      {
        filename: "/test/scope/workspace/file.js",
        code: "import '@test/shared-in-scope';",
        errors: [
          {
            message:
              'Import from package "@test/shared-in-scope" is not allowed',
          },
        ],
      },
      {
        options: [{ scopes: { enable: true, folderName: "something-else" } }],
        filename: "/test/scope/workspace/file.js",
        code: "import '@test/shared-in-scope';",
        errors: [
          {
            message:
              'Import from package "@test/shared-in-scope" is not allowed',
          },
        ],
      },
    ],
  });

  describe("without workspaces", () => {
    before(() => findWorkspaces.callsFake(() => null));

    ruleTester.run("no-cross-imports", rule, {
      valid: ["import workspace from '@test/workspace';"],
      invalid: [],
    });
  });
});
