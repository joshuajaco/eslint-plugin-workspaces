'use strict';

const ruleTester = require('../ruleTester');
const rule = require('../../lib/rules/no-relative-imports');

ruleTester.run('no-relative-imports', rule, {
  valid: [
    "import workspace from '@test/workspace';",
    "require('@test/workspace');",
    "import('@test/workspace');",
    "import '@test/workspace';",
    "import '../some/relative/path';",
    {
      filename: '/test/workspace',
      code: "import '../workspace';",
    },
    {
      filename: '/test/workspace',
      code: "import './some/path';",
    },
    {
      filename: '/test/workspace/some/path',
      code: "import '../another/path';",
    },
  ],

  invalid: [
    {
      code: "import workspace from '../../test/workspace';",
      filename: '/some/path',
      errors: [
        {
          message: 'Relative imports of other packages are not allowed',
        },
      ],
    },
    {
      code: "require('../../test/workspace');",
      filename: '/some/path',
      errors: [
        {
          message: 'Relative imports of other packages are not allowed',
        },
      ],
    },
    {
      code: "import('../../test/workspace');",
      filename: '/some/path',
      errors: [
        {
          message: 'Relative imports of other packages are not allowed',
        },
      ],
    },
    {
      code: "import '../../test/workspace';",
      filename: '/some/path',
      errors: [
        {
          message: 'Relative imports of other packages are not allowed',
        },
      ],
    },
    {
      code: "import workspace from '../another-workspace';",
      filename: '/test/workspace',
      errors: [
        {
          message: 'Relative imports of other packages are not allowed',
        },
      ],
    },
    {
      code: "import workspace from '../another-workspace/testing';",
      filename: '/test/workspace',
      errors: [
        {
          message: 'Relative imports of other packages are not allowed',
        },
      ],
    },
  ],
});
