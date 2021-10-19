'use strict';

const proxyquire = require('proxyquire');
const ruleTester = require('./ruleTester');

const findWorkspaces = () => null;

const noAbsoluteImports = proxyquire('../lib/rules/no-absolute-imports', {
  'find-workspaces': { findWorkspaces },
});

ruleTester.run('no-absolute-imports (without workspaces)', noAbsoluteImports, {
  valid: ["import workspace from '@test/workspace';"],
  invalid: [],
});

const noCrossImports = proxyquire('../lib/rules/no-cross-imports', {
  'find-workspaces': { findWorkspaces },
});

ruleTester.run('no-cross-imports (without workspaces)', noCrossImports, {
  valid: ["import workspace from '@test/workspace';"],
  invalid: [],
});

const noRelativeImports = proxyquire('../lib/rules/no-relative-imports', {
  'find-workspaces': { findWorkspaces },
});

ruleTester.run('no-relative-imports (without workspaces)', noRelativeImports, {
  valid: ["import workspace from '@test/workspace';"],
  invalid: [],
});

const requireDependency = proxyquire('../lib/rules/require-dependency', {
  'find-workspaces': { findWorkspaces },
});

ruleTester.run('require-dependency (without workspaces)', requireDependency, {
  valid: ["import workspace from '@test/workspace';"],
  invalid: [],
});
