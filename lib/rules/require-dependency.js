'use strict';

const { isSubPath, packages, getImport } = require('../utils');

module.exports.meta = {
  type: 'problem',
  docs: {
    url:
      'https://github.com/joshuajaco/eslint-plugin-workspaces/docs/rules/require-dependency.md',
  },
  schema: [],
};

module.exports.create = context =>
  getImport(context, ({ node, value, path, currentPackage }) => {
    packages.forEach(({ name, location }) => {
      const { dependencies, devDependencies } = currentPackage;

      if (
        name !== currentPackage.name &&
        (isSubPath(name, value) || isSubPath(location, path)) &&
        !Object.keys(dependencies).includes(name) &&
        !Object.keys(devDependencies).includes(name)
      ) {
        context.report({
          node,
          message:
            'Importing from another workspace without listing it as a dependency is not allowed',
        });
      }
    });
  });
