'use strict';

const { isSubPath, packages, getImport } = require('../utils');

module.exports.meta = {
  type: 'problem',
  docs: {
    description:
      'disallow relative imports of files that are outside of the current package',
    url:
      'https://github.com/joshuajaco/eslint-plugin-workspaces/blob/master/docs/rules/no-relative-imports.md',
  },
  fixable: 'code',
  schema: [],
};

module.exports.create = (context) =>
  getImport(context, ({ node, path, start, end, currentPackage }) => {
    packages.forEach(({ name, location }) => {
      if (name !== currentPackage.name && isSubPath(location, path)) {
        context.report({
          node,
          message: 'Relative imports of other packages are not allowed',
          fix: (fixer) =>
            fixer.replaceTextRange(
              [start + 1, end - 1],
              path.replace(location, name),
            ),
        });
      }
    });
  });
