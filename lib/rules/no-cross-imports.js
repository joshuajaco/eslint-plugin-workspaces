'use strict';

const { getWorkspaces, isSubPath, getImport } = require('../utils');

module.exports.meta = {
  type: 'problem',
  docs: {
    description: 'disallow imports of files that are inside another package',
    url: 'https://github.com/joshuajaco/eslint-plugin-workspaces/blob/master/docs/rules/no-cross-imports.md',
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
  messages: { noCrossImports: 'Import from package "{{name}}" is not allowed' },
};

const filterSharedPackagesInCurrentScope =
  ({ location: currentLocation }, scopedEnabled, scopedSharingFolderName) =>
  ({ location }) => {
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

  const workspaces = getWorkspaces(context);

  if (!workspaces) return {};

  const forbidden = workspaces.filter(
    ({ package: { name } }) => !allowed.includes(name),
  );

  return getImport(
    workspaces,
    context.getFilename(),
    ({ node, value, path, currentWorkspace }) => {
      forbidden
        .filter(
          filterSharedPackagesInCurrentScope(
            currentWorkspace,
            scopedEnabled,
            scopedSharingFolderName,
          ),
        )
        .forEach(({ package: { name }, location }) => {
          if (
            name !== currentWorkspace.package.name &&
            (isSubPath(name, value) || isSubPath(location, path))
          ) {
            context.report({
              node,
              messageId: 'noCrossImports',
              data: { name },
            });
          }
        });
    },
  );
};
