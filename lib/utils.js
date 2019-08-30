'use strict';

const getPackages = require('get-monorepo-packages');
const { dirname, relative, sep, resolve, isAbsolute } = require('path');

const isSubPath = (parent, path) => {
  const relativePath = relative(parent, path);
  return relativePath.split(sep)[0] !== '..' && !isAbsolute(relativePath);
};

const packages = getPackages(process.cwd()).map(
  ({ package: { name }, location }) => ({ name, location }),
);

const getImport = (context, callback) => ({
  ImportDeclaration: node => {
    if (node.source.type === 'Literal') {
      const { value, range } = node.source;
      const path = resolve(dirname(context.getFilename()), value);
      const [start, end] = range;
      callback({ node, value, path, start, end });
    }
  },
  ExpressionStatement: node => {
    if (
      node.expression.type === 'CallExpression' &&
      node.expression.arguments.length > 0 &&
      node.expression.arguments[0].type === 'Literal' &&
      (node.expression.callee.type === 'Import' ||
        (node.expression.callee.type === 'Identifier' &&
          node.expression.callee.name === 'require'))
    ) {
      const { value, range } = node.expression.arguments[0];
      const path = resolve(context.getFilename(), value);
      const [start, end] = range;
      callback({ node, value, path, start, end });
    }
  },
});

module.exports = { isSubPath, packages, getImport };
