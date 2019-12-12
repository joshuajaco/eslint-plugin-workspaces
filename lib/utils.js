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
  CallExpression: node => {
    if (
      node.arguments.length > 0 &&
      node.arguments[0].type === 'Literal' &&
      (node.callee.type === 'Import' ||
        (node.callee.type === 'Identifier' && node.callee.name === 'require'))
    ) {
      callback(resolveImport(context, node, node.arguments[0]));
    }
  },
});

module.exports = { isSubPath, packages, getImport };
