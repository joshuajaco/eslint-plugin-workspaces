'use strict';

const { findWorkspaces } = require('find-workspaces');
const { ruleTester } = require('../ruleTester');
const { findWorkspacesMock } = require('../mocks');
const rule = require('../../lib/rules/no-relative-imports');

describe('no-relative-imports', () => {
  before(() => findWorkspaces.callsFake(findWorkspacesMock));

  ruleTester.run('no-relative-imports', rule, {
    valid: [
      "import workspace from '@test/workspace';",
      "require('@test/workspace');",
      "import('@test/workspace');",
      "import '@test/workspace';",
      "import '../some/relative/path';",
      'someFunction();',
      {
        filename: '/test/workspace/test.js',
        code: "import 'root';",
      },
      {
        filename: '/test/workspace/test.js',
        code: "import '../workspace';",
      },
      {
        filename: '/test/workspace/test.js',
        code: "import './some/path';",
      },
      {
        filename: '/test/workspace/some/path.js',
        code: "import '../another/path';",
      },
      {
        filename: '/test/workspace/test.js',
        code: 'require(undefined)',
      },
      {
        filename: '/some/file.js',
        code: "import '../test/workspace';",
      },
    ],
    invalid: [
      {
        code: "import workspace from '../../test/workspace';",
        filename: '/test/another-workspace/test.js',
        output: "import workspace from '@test/workspace';",
        errors: [
          {
            message: 'Relative imports of other packages are not allowed',
          },
        ],
      },
      {
        code: "require('../../test/workspace');",
        filename: '/test/another-workspace/test.js',
        output: "require('@test/workspace');",
        errors: [
          {
            message: 'Relative imports of other packages are not allowed',
          },
        ],
      },
      {
        code: "import('../../test/workspace');",
        filename: '/test/another-workspace/test.js',
        output: "import('@test/workspace');",
        errors: [
          {
            message: 'Relative imports of other packages are not allowed',
          },
        ],
      },
      {
        code: "async () => await import('../../test/workspace');",
        filename: '/test/another-workspace/test.js',
        output: "async () => await import('@test/workspace');",
        errors: [
          {
            message: 'Relative imports of other packages are not allowed',
          },
        ],
      },
      {
        code: "import '../../test/workspace';",
        filename: '/test/another-workspace/test.js',
        output: "import '@test/workspace';",
        errors: [
          {
            message: 'Relative imports of other packages are not allowed',
          },
        ],
      },
      {
        code: "import workspace from '../another-workspace';",
        filename: '/test/workspace/test.js',
        output: "import workspace from '@test/another-workspace';",
        errors: [
          {
            message: 'Relative imports of other packages are not allowed',
          },
        ],
      },
      {
        code: "import workspace from '../another-workspace/testing';",
        filename: '/test/workspace/test.js',
        output: "import workspace from '@test/another-workspace/testing';",
        errors: [
          {
            message: 'Relative imports of other packages are not allowed',
          },
        ],
      },
    ],
  });

  describe('without workspaces', () => {
    before(() => findWorkspaces.callsFake(() => null));

    ruleTester.run('no-relative-imports', rule, {
      valid: ["import workspace from '@test/workspace';"],
      invalid: [],
    });
  });
});
