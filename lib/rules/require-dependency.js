'use strict';

const { isSubPath, getPackages, getImport } = require('../utils');

module.exports.meta = {
  type: 'problem',
  docs: {
    description:
      'disallow importing from packages that are not listed as a dependency',
    url: 'https://github.com/joshuajaco/eslint-plugin-workspaces/blob/master/docs/rules/require-dependency.md',
  },
  schema: [],
  messages: {
    requireDependency:
      'Importing from another workspace without listing it as a dependency is not allowed',
  },
};

module.exports.create = (context) =>
  getImport(context, ({ node, value, path, currentPackage }) => {
    getPackages(context).forEach(({ name, location }) => {
      const { dependencies, devDependencies } = currentPackage;

      if (
        name !== currentPackage.name &&
        (isSubPath(name, value) || isSubPath(location, path)) &&
        !Object.keys(dependencies).includes(name) &&
        !Object.keys(devDependencies).includes(name)
      ) {
        context.report({
          node,
          messageId: 'requireDependency',
        });
      }
    });
  });
