"use strict";

const { findWorkspaces } = require("find-workspaces");
const { ruleTester, ruleTesterWithSettings } = require("../ruleTester");
const { findWorkspacesMock } = require("../mocks");
const rule = require("../../lib/rules/no-absolute-imports");

describe("no-absolute-imports", () => {
  before(() => findWorkspaces.callsFake(findWorkspacesMock));

  ruleTester.run("no-absolute-imports", rule, {
    valid: [
      "import workspace from '@test/workspace';",
      "require('@test/workspace');",
      "import('@test/workspace');",
      "import '@test/workspace';",
      "import '../some/relative/path';",
      "someFunction();",
      {
        filename: "/test/workspace/test.js",
        code: "import '../workspace';",
      },
      {
        filename: "/test/workspace/test.js",
        code: "import(`/some/path/${someVar}`);",
      },
      {
        filename: "/test/workspace/test.js",
        code: "import './some/path';",
      },
      {
        filename: "/test/workspace/some/path.js",
        code: "import '../another/path';",
      },
      {
        filename: "/test/workspace/test.js",
        code: "require(undefined)",
      },
      {
        code: "import workspace from '@test/workspace';",
        filename: "/some/path.js",
      },
      {
        filename: "/test/no-npm-scope-workspace/index.js",
        code: "import './no-npm-scope-workspace';",
      },
    ],

    invalid: [
      {
        code: "import workspace from '@test/workspace/some/path';",
        filename: "/test/workspace/some/file.js",
        output: "import workspace from './path';",
        errors: [
          {
            message:
              "Absolute imports within the current package are not allowed",
          },
        ],
      },
      {
        code: "import '@test/workspace/some/path';",
        filename: "/test/workspace/some/file.js",
        output: "import './path';",
        errors: [
          {
            message:
              "Absolute imports within the current package are not allowed",
          },
        ],
      },
      {
        code: "const workspace = require('@test/workspace/some/path');",
        filename: "/test/workspace/some/file.js",
        output: "const workspace = require('./path');",
        errors: [
          {
            message:
              "Absolute imports within the current package are not allowed",
          },
        ],
      },
      {
        code: "require('@test/workspace/some/path');",
        filename: "/test/workspace/some/file.js",
        output: "require('./path');",
        errors: [
          {
            message:
              "Absolute imports within the current package are not allowed",
          },
        ],
      },
      {
        code: "import '@test/workspace/some/long/path/file.js';",
        filename: "/test/workspace/some/longer/path/file.js",
        output: "import '../../long/path/file.js';",
        errors: [
          {
            message:
              "Absolute imports within the current package are not allowed",
          },
        ],
      },
      {
        code: "import '@test/workspace/some/long/path/file.js';",
        filename: "/test/workspace/some/file.js",
        output: "import './long/path/file.js';",
        errors: [
          {
            message:
              "Absolute imports within the current package are not allowed",
          },
        ],
      },
      {
        code: "import '@test/workspace';",
        filename: "/test/workspace/file.js",
        output: "import '.';",
        errors: [
          {
            message:
              "Absolute imports within the current package are not allowed",
          },
        ],
      },
    ],
  });

  describe("without workspaces", () => {
    before(() => findWorkspaces.callsFake(() => null));

    ruleTester.run("no-absolute-imports", rule, {
      valid: ["import workspace from '@test/workspace';"],
      invalid: [],
    });
  });

  describe("with settings", () => {
    ruleTesterWithSettings.run("no-absolute-imports", rule, {
      valid: ["import workspace from '@test/workspace';"],
      invalid: [],
    });
  });
});
