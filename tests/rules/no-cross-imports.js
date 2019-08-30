'use strict';

const ruleTester = require('../ruleTester');
const rule = require('../../lib/rules/no-cross-imports');

ruleTester.run('no-cross-imports', rule, {
  valid: [
    "import module from 'module';",
    "require('module');",
    "import('module');",
    "import 'module';",
    "import '../some/relative/path';",
    'someFunction();',
    {
      options: [{ allow: '@test/workspace' }],
      filename: '/some/path.js',
      code: "import '@test/workspace';",
    },
    {
      options: [{ allow: ['@test/workspace', '@test/another-workspace'] }],
      filename: '/some/path.js',
      code: "import '@test/workspace';import '@test/another-workspace';",
    },
    {
      filename: '/test/workspace/test.js',
      code: "import '@test/workspace';",
    },
    {
      filename: '/test/workspace/test.js',
      code: "import './some/thing'",
    },
  ],

  invalid: [
    {
      code: "import workspace from '@test/workspace';",
      filename: '/some/path.js',
      errors: [
        {
          message: 'Import from package "@test/workspace" is not allowed',
        },
      ],
    },
    {
      code: "import('@test/workspace');",
      filename: '/some/path.js',
      errors: [
        {
          message: 'Import from package "@test/workspace" is not allowed',
        },
      ],
    },
    {
      code: "require('@test/workspace');",
      filename: '/some/path.js',
      errors: [
        {
          message: 'Import from package "@test/workspace" is not allowed',
        },
      ],
    },
    {
      code: "import workspace from '@test/workspace';",
      filename: '/some/path.js',
      errors: [
        {
          message: 'Import from package "@test/workspace" is not allowed',
        },
      ],
    },
    {
      code: "import '@test/workspace';",
      filename: '/some/path.js',
      errors: [
        {
          message: 'Import from package "@test/workspace" is not allowed',
        },
      ],
    },
    {
      code: "import '@test/workspace/some/path';",
      filename: '/some/path.js',
      errors: [
        {
          message: 'Import from package "@test/workspace" is not allowed',
        },
      ],
    },
    {
      code: "import '../../test/workspace';",
      filename: '/some/path.js',
      errors: [
        {
          message: 'Import from package "@test/workspace" is not allowed',
        },
      ],
    },
    {
      code: "import '../../test/workspace/some/path';",
      filename: '/some/path.js',
      errors: [
        {
          message: 'Import from package "@test/workspace" is not allowed',
        },
      ],
    },
    {
      code: "import '@test/workspace';import '@test/another-workspace';",
      filename: '/some/path.js',
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
      options: [{ allow: '@test/workspace' }],
      filename: '/some/path.js',
      errors: [
        {
          message:
            'Import from package "@test/another-workspace" is not allowed',
        },
      ],
    },
    {
      options: [{ allow: '@test/workspacetest' }],
      filename: '/some/path.js',
      code: "import '@test/workspace';",
      errors: [
        {
          message: 'Import from package "@test/workspace" is not allowed',
        },
      ],
    },
    {
      filename: '/test/workspace/test.js',
      code: "import '../another-workspace/test'",
      errors: [
        {
          message:
            'Import from package "@test/another-workspace" is not allowed',
        },
      ],
    },
  ],
});
