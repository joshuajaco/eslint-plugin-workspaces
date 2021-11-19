"use strict";

const { findWorkspaces } = require("find-workspaces");
const { ruleTester } = require("../ruleTester");
const { findWorkspacesMock } = require("../mocks");
const rule = require("../../lib/rules/require-dependency");

describe("require-dependency", () => {
  before(() => findWorkspaces.callsFake(findWorkspacesMock));

  ruleTester.run("require-dependency", rule, {
    valid: [
      {
        filename: "/test/another-workspace/index.js",
        code: "import '../workspace';",
      },
      {
        filename: "/index.js",
        code: "import '../workspace';",
      },
      {
        filename: "/test/workspace/test.js",
        code: "require(undefined)",
      },
    ],
    invalid: [
      {
        filename: "/test/workspace/index.js",
        code: "import '../another-workspace';",
        errors: [
          {
            message:
              "Importing from another workspace without listing it as a dependency is not allowed",
          },
        ],
      },
      {
        filename: "/test/workspace/other.js",
        code: "import('../another-workspace');",
        errors: [
          {
            message:
              "Importing from another workspace without listing it as a dependency is not allowed",
          },
        ],
      },
      {
        filename: "/test/workspace/other.js",
        code: "async () => await import('../another-workspace');",
        errors: [
          {
            message:
              "Importing from another workspace without listing it as a dependency is not allowed",
          },
        ],
      },
    ],
  });

  describe("without workspaces", () => {
    before(() => findWorkspaces.callsFake(() => null));

    ruleTester.run("require-dependency", rule, {
      valid: ["import workspace from '@test/workspace';"],
      invalid: [],
    });
  });
});
