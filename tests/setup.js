'use strict';

const mock = require('mock-require');

mock('get-monorepo-packages', () => [
  { location: '/test/workspace', package: { name: '@test/workspace' } },
  {
    location: '/test/another-workspace',
    package: { name: '@test/another-workspace' },
  },
]);
