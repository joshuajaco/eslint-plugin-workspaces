'use strict';

const ruleTester = require('../ruleTester');
const rule = require('../../lib/rules/no-cross-imports');

ruleTester.run('no-cross-imports', rule, {
  valid: [
    "import module from 'module';",
    "import module from '../some/relative/path';",
    {
      options: [{ allow: '@test/workspace' }],
      filename: '/some/path',
      code: "import workspace from '@test/workspace';",
    },
    {
      options: [{ allow: ['@test/workspace', '@test/another-workspace'] }],
      filename: '/some/path',
      code:
        "import workspace from '@test/workspace';" +
        "import anotherWorkspace from '@test/another-workspace';",
    },
  ],

  invalid: [
    {
      code: "import module from '@test/workspace';",
      filename: '/some/path',
      errors: [
        {
          message: 'Import from package "@test/workspace" is not allowed',
        },
      ],
    },
    {
      code: "import module from '@test/workspace/some/path';",
      filename: '/some/path',
      errors: [
        {
          message: 'Import from package "@test/workspace" is not allowed',
        },
      ],
    },
    {
      code: "import module from '../../test/workspace';",
      filename: '/some/path',
      errors: [
        {
          message: 'Import from package "@test/workspace" is not allowed',
        },
      ],
    },
    {
      code: "import module from '../../test/workspace/some/path';",
      filename: '/some/path',
      errors: [
        {
          message: 'Import from package "@test/workspace" is not allowed',
        },
      ],
    },
    {
      code:
        "import workspace from '@test/workspace';" +
        "import anotherWorkspace from '@test/another-workspace';",
      filename: '/some/path',
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
      code:
        "import workspace from '@test/workspace';" +
        "import anotherWorkspace from '@test/another-workspace';",
      options: [{ allow: '@test/workspace' }],
      filename: '/some/path',
      errors: [
        {
          message:
            'Import from package "@test/another-workspace" is not allowed',
        },
      ],
    },
  ],
});
