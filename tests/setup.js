'use strict';

const mock = require('mock-require');

mock('@joshuajaco/get-monorepo-packages', () => [
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
  {
    location: '/test/scope/shared',
    package: {
      name: '@test/shared-in-scope',
    },
  },
  {
    location: '/test/other-scope/shared',
    package: {
      name: '@test/shared-outside-scope',
    },
  },
  {
    location: '/test/scope/workspace',
    package: {
      name: '@test/scoped-workspace',
    },
  },
  {
    location: 'root',
    package: { name: 'root' },
  },
]);
