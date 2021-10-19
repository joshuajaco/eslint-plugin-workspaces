'use strict';

const assert = require('assert');
const path = require('path');

describe('getRepositoryRoot', () => {
  const runTest = (targetPath, expectedRoot, predefinedRoot) => {
    process.chdir(targetPath);

    const utils = require('../../lib/utils');

    assert.ok(utils.getRepositoryRoot(predefinedRoot) === expectedRoot);
  };

  it('should detect root path from package in monorepository', () => {
    const expectedRoot = path.resolve(
      __dirname,
      './mocks/repo-with-workspaces',
    );
    const targetPath = path.resolve(expectedRoot, './package');

    runTest(targetPath, expectedRoot);
  });

  it('should detect root path from root in monorepository', () => {
    const expectedRoot = path.resolve(
      __dirname,
      './mocks/repo-with-workspaces/',
    );
    const targetPath = expectedRoot;

    runTest(targetPath, expectedRoot);
  });

  it('should detect root from package in nested workspaces', () => {
    const expectedRoot = path.resolve(
      __dirname,
      './mocks/repo-with-nested-workspaces/folder-two',
    );
    const targetPath = path.resolve(expectedRoot, './packages/package-one');
    const lintConfig = require(path.resolve(expectedRoot, '.eslintrc'));
    const predefinedRoot = lintConfig.settings.workspaces.root;

    runTest(targetPath, expectedRoot, predefinedRoot);
  });

  it('should detect root from root in nested workspaces', () => {
    const expectedRoot = path.resolve(
      __dirname,
      './mocks/repo-with-nested-workspaces/folder-two',
    );
    const targetPath = expectedRoot;
    const lintConfig = require(path.resolve(expectedRoot, '.eslintrc'));
    const predefinedRoot = lintConfig.settings.workspaces.root;

    runTest(targetPath, expectedRoot, predefinedRoot);
  });
});
