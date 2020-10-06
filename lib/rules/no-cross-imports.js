'use strict';

const { isSubPath, packages, getImport } = require('../utils');

module.exports.meta = {
  type: 'problem',
  docs: {
    description: 'disallow imports of files that are inside another package',
    url:
      'https://github.com/joshuajaco/eslint-plugin-workspaces/blob/master/docs/rules/no-cross-imports.md',
  },
  schema: [
    {
      type: 'object',
      additionalProperties: false,
      properties: {
        allow: {
          anyOf: [
            { type: 'string' },
            {
              type: 'array',
              uniqueItems: true,
              items: {
                type: 'string',
              },
            },
          ],
        },
      },
    },
  ],
};

const filterSharedPackagesInCurrentScope = ({ location: currentLocation }) => ({
  location,
}) => {
  const locationArray = location.split('/');
  const forbiddenPackageParent = locationArray.slice(0, -1).join('/');
  if (!isSubPath(forbiddenPackageParent, currentLocation)) {
    return true;
  }

  return locationArray[locationArray.length - 1] !== 'shared';
};

module.exports.create = (context) => {
  const {
    options: [{ allow = [] } = {}],
  } = context;

  const allowed = typeof allow === 'string' ? [allow] : allow;
  const forbidden = packages.filter(({ name }) => !allowed.includes(name));

  return getImport(context, ({ node, value, path, currentPackage }) => {
    forbidden
      .filter(filterSharedPackagesInCurrentScope(currentPackage))
      .forEach(({ name, location }) => {
        if (
          name !== currentPackage.name &&
          (isSubPath(name, value) || isSubPath(location, path))
        ) {
          context.report({
            node,
            message: 'Import from package "{{name}}" is not allowed',
            data: { name },
          });
        }
      });
  });
};
