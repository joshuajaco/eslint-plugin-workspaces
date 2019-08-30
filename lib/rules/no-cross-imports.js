'use strict';

const { isSubPath, packages, getImportValue } = require('../utils');
const { resolve } = require('path');

module.exports.meta = {
  type: 'problem',
  docs: {
    url:
      'https://github.com/joshuajaco/eslint-plugin-workspaces/docs/rules/no-cross-imports.md',
  },
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

  return getImportValue(context, (value, node) => {
    forbidden.forEach(({ name, location }) => {
      if (
        isSubPath(name, value) ||
        isSubPath(location, resolve(context.getFilename(), value))
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
