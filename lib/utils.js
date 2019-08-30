'use strict';

const getPackages = require('get-monorepo-packages');
const { relative, sep, isAbsolute } = require('path');

const isSubPath = (parent, path) => {
  const relativePath = relative(parent, path);
  return relativePath.split(sep)[0] !== '..' && !isAbsolute(relativePath);
};

const packages = getPackages(process.cwd()).map(
  ({ package: { name }, location }) => ({ name, location }),
);

const getImportValue = (context, callback) => ({
  ImportDeclaration: node => {
    if (node.source.type === 'Literal') {
      callback(node.source.value, node);
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
      callback(value, node);
    }
  },
});

module.exports = { isSubPath, packages, getImportValue };
