'use strict';

const proxyquire = require('proxyquire');
const { findWorkspaces } = require('../mocks');
const ruleTester = require('../ruleTester');
const rule = proxyquire('../../lib/rules/require-dependency', {
  'find-workspaces': { findWorkspaces },
});

ruleTester.run('require-dependency', rule, {
  valid: [
    {
      filename: '/test/another-workspace/index.js',
      code: "import '../workspace';",
    },
    {
      filename: '/index.js',
      code: "import '../workspace';",
    },
    {
      filename: '/test/workspace/test.js',
      code: 'require(undefined)',
    },
  ],
  invalid: [
    {
      filename: '/test/workspace/index.js',
      code: "import '../another-workspace';",
      errors: [
        {
          message:
            'Importing from another workspace without listing it as a dependency is not allowed',
        },
      ],
    },
    {
      filename: '/test/workspace/other.js',
      code: "import('../another-workspace');",
      errors: [
        {
          message:
            'Importing from another workspace without listing it as a dependency is not allowed',
        },
      ],
    },
    {
      filename: '/test/workspace/other.js',
      code: "async () => await import('../another-workspace');",
      errors: [
        {
          message:
            'Importing from another workspace without listing it as a dependency is not allowed',
        },
      ],
    },
  ],
});
