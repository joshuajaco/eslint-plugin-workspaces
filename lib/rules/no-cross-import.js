'use strict';

const getPackages = require('get-monorepo-packages');

module.exports.meta = {
  fixable: null,
  schema: [
    {
      type: 'object',
      properties: {
        allowed: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
  ],
};

const escapeRegExp = string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports.create = context => {
  const packages = getPackages(process.cwd()).map(
    ({ package: { name } }) => name,
  );

  const {
    options: [{ allowed = [] } = {}],
  } = context;

  const forbidden = packages.filter(name => !allowed.includes(name));

  return {
    ImportDeclaration: function(node) {
      if (node.source.type === 'Literal') {
        forbidden.forEach(name => {
          if (
            node.source.value.match(new RegExp(`^${escapeRegExp(name)}(\/|$)`))
          ) {
            context.report(
              node,
              `Import from package "${name}" is not allowed`,
            );
          }
        });
      }
    },
  };
};
