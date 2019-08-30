'use strict';

const getPackages = require('get-monorepo-packages');
const { relative, resolve, sep, isAbsolute } = require('path');

module.exports.meta = {
  type: 'problem',
  docs: {
    url:
      'https://github.com/joshuajaco/eslint-plugin-workspaces/docs/rules/no-relative-imports.md',
  },
};

module.exports.schema = [];

const isSubPath = (parent, path) => {
  const relativePath = relative(parent, path);
  return relativePath.split(sep)[0] !== '..' && !isAbsolute(relativePath);
};

const isRelativeImport = (packages, context, node, value) => {
  packages.forEach(location => {
    if (
      !isSubPath(location, context.getFilename()) &&
      isSubPath(location, resolve(context.getFilename(), value))
    )
      context.report({
        node,
        message: 'Relative imports of other packages are not allowed',
      });
  });
};

module.exports.create = context => {
  const packages = getPackages(process.cwd()).map(({ location }) => location);

  return {
    ImportDeclaration: node => {
      if (node.source.type === 'Literal') {
        isRelativeImport(packages, context, node, node.source.value);
      }
    },
    ExpressionStatement: node => {
      if (
        node.expression.type === 'CallExpression' &&
        node.expression.arguments[0].type === 'Literal' &&
        (node.expression.callee.type === 'Import' ||
          (node.expression.callee.type === 'Identifier' &&
            node.expression.callee.name === 'require'))
      ) {
        const { value } = node.expression.arguments[0];
        isRelativeImport(packages, context, node, value);
      }
    },
  };
};
