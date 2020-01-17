'use strict';

const { dirname, relative } = require('path');
const { isSubPath, packages, getImport, pathToImport } = require('../utils');

module.exports.meta = {
  type: 'problem',
  docs: {
    url:
      'https://github.com/joshuajaco/eslint-plugin-workspaces/docs/rules/no-absolute-imports.md',
  },
  fixable: 'code',
};

module.exports.create = context =>
  getImport(context, ({ node, path, start, end }) => {
    packages.forEach(({ name, location }) => {
      if (isSubPath(location, context.getFilename()) && isSubPath(name, path)) {
        context.report({
          node,
          message:
            'Absolute imports within the current package are not allowed',
          fix: fixer =>
            fixer.replaceTextRange(
              [start + 1, end - 1],
              pathToImport(
                relative(
                  dirname(context.getFilename()),
                  path.replace(name, location),
                ),
              ),
            ),
        });
      }
    });
  });
