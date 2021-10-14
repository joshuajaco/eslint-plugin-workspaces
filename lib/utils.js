'use strict';

const getMonorepoPackages = require('@joshuajaco/get-monorepo-packages');
const fs = require('fs');
const {
  dirname,
  join,
  relative,
  sep,
  normalize,
  isAbsolute,
  resolve,
} = require('path');

const isSubPath = (parent, path) => {
  const relativePath = relative(parent, path);
  return relativePath.split(sep)[0] !== '..' && !isAbsolute(relativePath);
};

const directoryContainsRootPackageJson = (path) => {
  const pathToCheck = resolve(path, 'package.json');
  if (!fs.existsSync(pathToCheck)) return false;
  const pkg = require(pathToCheck);
  if (pkg && {}.hasOwnProperty.call(pkg, 'workspaces')) {
    return true;
  }
  return false;
};

const getRepositoryRoot = (path = process.cwd()) => {
  let pathForCheck = path;

  if (directoryContainsRootPackageJson(pathForCheck)) {
    return pathForCheck;
  }

  while (pathForCheck !== resolve(pathForCheck, '..')) {
    pathForCheck = resolve(pathForCheck, '..');

    if (directoryContainsRootPackageJson(pathForCheck)) {
      return pathForCheck;
    }
  }

  return path;
};

let cachedPackages = null;

const getPackages = (context) => {
  if (cachedPackages) {
    return cachedPackages;
  }

  const predefinedRoot =
    context.settings &&
    context.settings.workspaces &&
    context.settings.workspaces.root;
  const rootPath = getRepositoryRoot(predefinedRoot);
  cachedPackages = getMonorepoPackages(rootPath).map(
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
  return cachedPackages;
};

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
  getPackages(context).find(({ location }) =>
    isSubPath(location, context.getFilename()),
  );

const getImport = (context, callback) => {
  const currentPackage = findCurrentPackage(context);

  if (!currentPackage) return {};

  return {
    ImportDeclaration: (node) => {
      callback(resolveImport(context, node, node.source, currentPackage));
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

module.exports = {
  isSubPath,
  getPackages,
  getImport,
  pathToImport,
  getRepositoryRoot,
};
