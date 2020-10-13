'use strict';

const assert = require('assert');
const path = require('path');

describe('getRepositoryRoot', () => {
  it('should detect root path in monorepository', () => {
    const pkgPath = path.resolve(
      __dirname,
      './mocks/repo-with-workspaces/package/',
    );

    process.chdir(pkgPath);

    const utils = require('../../lib/utils');

    assert.ok(utils.getRepositoryRoot() === path.resolve(pkgPath, '..'));
  });
});
