'use strict';

const ruleTester = require('../ruleTester');
const rule = require('../../lib/rules/no-cross-imports');

ruleTester.run('no-cross-imports', rule, {
  valid: [
    "import module from 'module';",
    {
      options: [{ allow: ['@test/workspace'] }],
      code: "import workspace from '@test/workspace';",
    },
  ],

  invalid: [
    {
      code: "import module from '@test/workspace';",
      errors: [
        {
          message: 'Import from package "@test/workspace" is not allowed',
        },
      ],
    },
  ],
});
