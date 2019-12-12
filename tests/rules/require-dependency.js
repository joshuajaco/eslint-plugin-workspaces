'use strict';

const ruleTester = require('../ruleTester');
const rule = require('../../lib/rules/require-dependency');

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
