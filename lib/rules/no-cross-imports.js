'use strict';

const { isSubPath, packages, getImport } = require('../utils');

module.exports.meta = {
  type: 'problem',
  docs: {
    description: 'disallow imports of files that are inside another package',
    url:
      'https://github.com/joshuajaco/eslint-plugin-workspaces/docs/rules/no-cross-imports.md',
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

module.exports.create = context => {
  const {
    options: [{ allow = [] } = {}],
  } = context;

  const allowed = typeof allow === 'string' ? [allow] : allow;
  const forbidden = packages.filter(({ name }) => !allowed.includes(name));

  return getImport(context, ({ node, value, path, currentPackage }) => {
    forbidden.forEach(({ name, location }) => {
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
