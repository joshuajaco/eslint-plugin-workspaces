'use strict';

const mock = require('mock-require');

mock('get-monorepo-packages', () => [
  { package: { name: '@test/workspace' } },
  { package: { name: '@test/another-workspace' } },
]);
