'use strict';

const escapeStringRegexp = require('escape-string-regexp');
const getPackages = require('get-monorepo-packages');

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
  const packages = getPackages(process.cwd()).map(
    ({ package: { name } }) => name,
  );

  const {
    options: [{ allow = [] } = {}],
  } = context;

  const forbidden = packages.filter(name => !allow.includes(name));

  return {
    ImportDeclaration: node => {
      if (node.source.type === 'Literal') {
        forbidden.forEach(name => {
          if (
            node.source.value.match(
              new RegExp(`^${escapeStringRegexp(name)}(/|$)`),
            )
          ) {
            context.report({
              node,
              message: 'Import from package "{{name}}" is not allowed',
              data: { name },
            });
          }
        });
      }
    },
  };
};
