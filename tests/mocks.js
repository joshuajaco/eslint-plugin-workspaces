'use strict';

const sinon = require('sinon');

module.exports.stub = sinon.stub(require('find-workspaces'), 'findWorkspaces');

module.exports.findWorkspaces = (dir, opts) => {
  if (opts.stopDir) console.log('opts.stopDir', opts.stopDir);
  return [
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
  ];
};
