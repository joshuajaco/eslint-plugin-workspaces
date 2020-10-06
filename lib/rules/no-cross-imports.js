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
        scopes: {
          anyOf: [
            { type: 'boolean', additionalProperties: false },
            {
              type: 'object',
              additionalProperties: false,
              properties: {
                enable: { type: 'boolean' },
                folderName: { type: 'string' },
              },
            },
          ],
        },
      },
    },
  ],
};

const filterSharedPackagesInCurrentScope = (
  { location: currentLocation },
  scopedEnabled,
  scopedSharingFolderName,
) => ({ location }) => {
  if (!scopedEnabled) return true;
  const locationArray = location.split('/');
  const forbiddenPackageParent = locationArray.slice(0, -1).join('/');
  if (!isSubPath(forbiddenPackageParent, currentLocation)) {
    return true;
  }

  return locationArray[locationArray.length - 1] !== scopedSharingFolderName;
};

module.exports.create = (context) => {
  const {
    options: [{ allow = [], scopes = { enable: false } } = {}],
  } = context;

  const allowed = typeof allow === 'string' ? [allow] : allow;
  const scopedEnabled = scopes === true || !!scopes.enable;
  const scopedSharingFolderName = scopes.folderName || 'shared';

  const forbidden = packages.filter(({ name }) => !allowed.includes(name));

  return getImport(context, ({ node, value, path, currentPackage }) => {
    forbidden
      .filter(
        filterSharedPackagesInCurrentScope(
          currentPackage,
          scopedEnabled,
          scopedSharingFolderName,
        ),
      )
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
