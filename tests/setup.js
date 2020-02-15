'use strict';

const mock = require('mock-require');

mock('get-monorepo-packages', () => [
  {
    location: '/test/workspace',
    package: {
      name: '@test/workspace',
    },
  },
  {
    location: '/test/another-workspace',
    package: {
      name: '@test/another-workspace',
      dependencies: { '@test/workspace': '^1.0.0' },
    },
  },
  {
    location: '/test/third-workspace',
    package: {
      name: '@test/third-workspace',
    },
  },
]);
