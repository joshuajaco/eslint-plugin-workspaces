'use strict';

const { isSubPath, packages, getImportValue } = require('../utils');
const { resolve } = require('path');

module.exports.meta = {
  type: 'problem',
  docs: {
    url:
      'https://github.com/joshuajaco/eslint-plugin-workspaces/docs/rules/no-relative-imports.md',
  },
};

module.exports.schema = [];

module.exports.create = context =>
  getImportValue(context, (value, node) => {
    packages.forEach(({ location }) => {
      if (
        !isSubPath(location, context.getFilename()) &&
        isSubPath(location, resolve(context.getFilename(), value))
      )
        context.report({
          node,
          message: 'Relative imports of other packages are not allowed',
        });
    });
  });
