'use strict';

const getPackages = require('get-monorepo-packages');
const { relative, resolve, sep, isAbsolute } = require('path');

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

const isSubPath = (parent, path) => {
  const relativePath = relative(parent, path);
  return relativePath.split(sep)[0] !== '..' && !isAbsolute(relativePath);
};

module.exports.create = context => {
  const packages = getPackages(process.cwd()).map(
    ({ package: { name }, location }) => ({ name, location }),
  );

  const {
    options: [{ allow = [] } = {}],
  } = context;

  const forbidden = packages.filter(({ name }) => !allow.includes(name));
  const filename = context.getFilename();
  return {
    ImportDeclaration: node => {
      if (node.source.type === 'Literal') {
        forbidden.forEach(({ name, location }) => {
          if (
            isSubPath(name, node.source.value) ||
            isSubPath(location, resolve(filename, node.source.value))
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
