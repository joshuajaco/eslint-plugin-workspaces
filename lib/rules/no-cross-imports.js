'use strict';

const { isSubPath, packages, getImport } = require('../utils');

module.exports.meta = {
  type: 'problem',
  docs: {
    url:
      'https://github.com/joshuajaco/eslint-plugin-workspaces/docs/rules/no-cross-imports.md',
  },
  schema: [],
};

module.exports.schema = [
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
];

module.exports.create = context => {
  const {
    options: [{ allow = [] } = {}],
  } = context;

  const allowed = typeof allow === 'string' ? [allow] : allow;
  const forbidden = packages.filter(({ name }) => !allowed.includes(name));

  return getImport(context, ({ node, value, path }) => {
    forbidden.forEach(({ name, location }) => {
      if (
        !isSubPath(location, context.getFilename()) &&
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
