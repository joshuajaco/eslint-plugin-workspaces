'use strict';

const { isSubPath, packages, getImport } = require('../utils');

module.exports.meta = {
  type: 'problem',
  docs: {
    url:
      'https://github.com/joshuajaco/eslint-plugin-workspaces/docs/rules/require-dependency.md',
  },
};

module.exports.create = context =>
  getImport(context, ({ node, value, path }) => {
    const currentPackage = packages.find(({ location }) =>
      isSubPath(location, context.getFilename()),
    );

    if (!currentPackage) return;

    const { dependencies, devDependencies } = currentPackage;

    packages.forEach(({ name, location }) => {
      if (
        name !== currentPackage.name &&
        (isSubPath(name, value) || isSubPath(location, path)) &&
        !Object.keys(dependencies).includes(name) &&
        !Object.keys(devDependencies).includes(name)
      ) {
        context.report({
          node,
          message:
            'Importing packages without listing them as dependency is not allowed',
        });
      }
    });
  });
