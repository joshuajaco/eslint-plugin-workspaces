'use strict';

const getPackages = require('get-monorepo-packages');
const { dirname, join, relative, sep, normalize, isAbsolute } = require('path');

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

const resolvePath = (parent, path) => {
  if (path[0] !== '.') return path;

  return join(parent, path).replace(/\\/g, '/');
};

const resolveImport = (context, node, { value, range }, currentPackage) => {
  const path = resolvePath(dirname(context.getFilename()), value);
  const [start, end] = range;
  return { node, value, path, start, end, currentPackage };
};

const pathToImport = (path) => {
  if (path === '') return '.';

  const normalized = normalize(path).replace(/\\/g, '/');

  if (normalized[0] !== '.') return `./${normalized}`;

  return normalized;
};

const findCurrentPackage = (context) =>
  packages.find(({ location }) => isSubPath(location, context.getFilename()));

const getImport = (context, callback) => {
  const currentPackage = findCurrentPackage(context);

  if (!currentPackage) return {};

  return {
    ImportDeclaration: (node) => {
      if (node.source.type === 'Literal') {
        callback(resolveImport(context, node, node.source, currentPackage));
      }
    },
    CallExpression: (node) => {
      if (
        node.arguments.length > 0 &&
        node.arguments[0].type === 'Literal' &&
        (node.callee.type === 'Import' ||
          (node.callee.type === 'Identifier' && node.callee.name === 'require'))
      ) {
        callback(
          resolveImport(context, node, node.arguments[0], currentPackage),
        );
      }
    },
    ImportExpression: (node) => {
      if (node.source.type === 'Literal') {
        callback(resolveImport(context, node, node.source, currentPackage));
      }
    },
  };
};

module.exports = { isSubPath, packages, getImport, pathToImport };
