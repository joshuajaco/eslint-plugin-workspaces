'use strict';

const getPackages = require('get-monorepo-packages');
const { dirname, relative, sep, resolve, isAbsolute } = require('path');

const isSubPath = (parent, path) => {
  const relativePath = relative(parent, path);
  return relativePath.split(sep)[0] !== '..' && !isAbsolute(relativePath);
};

const packages = getPackages(process.cwd()).map(
  ({
    package: { name, dependencies = {}, devDependencies = {} },
    location,
  }) => ({
    name,
    location,
    dependencies,
    devDependencies,
  }),
);

const isImportExpression = expression =>
  expression.type === 'CallExpression' &&
  expression.arguments.length > 0 &&
  expression.arguments[0].type === 'Literal' &&
  (expression.callee.type === 'Import' ||
    (expression.callee.type === 'Identifier' &&
      expression.callee.name === 'require'));

const resolveImport = (context, node, { value, range }) => {
  const path = resolve(dirname(context.getFilename()), value);
  const [start, end] = range;
  return { node, value, path, start, end };
};

const getImport = (context, callback) => ({
  ImportDeclaration: node => {
    if (node.source.type === 'Literal') {
      callback(resolveImport(context, node, node.source));
    }
  },
  ExpressionStatement: node => {
    if (isImportExpression(node.expression)) {
      callback(resolveImport(context, node, node.expression.arguments[0]));
    }
  },
  VariableDeclaration: node => {
    node.declarations.forEach(({ init }) => {
      if (isImportExpression(init)) {
        callback(resolveImport(context, node, init.arguments[0]));
      }
    });
  },
});

module.exports = { isSubPath, packages, getImport };
