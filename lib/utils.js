'use strict';

const { dirname, join, relative, sep, normalize, isAbsolute } = require('path');

const isSubPath = (parent, path) => {
  const relativePath = relative(parent, path);
  return relativePath.split(sep)[0] !== '..' && !isAbsolute(relativePath);
};

const resolvePath = (parent, path) => {
  if (path[0] !== '.') return path;

  return join(parent, path).replace(/\\/g, '/');
};

const resolveImport = (filename, node, { value, range }, currentWorkspace) => {
  const path = resolvePath(dirname(filename), value);
  const [start, end] = range;
  return { node, value, path, start, end, currentWorkspace };
};

const pathToImport = (path) => {
  if (path === '') return '.';

  const normalized = normalize(path).replace(/\\/g, '/');

  if (normalized[0] !== '.') return `./${normalized}`;

  return normalized;
};

const getImport = (workspaces, filename, callback) => {
  if (!workspaces) return {};

  const currentWorkspace = workspaces.find(({ location }) =>
    isSubPath(location, filename),
  );

  if (!currentWorkspace) return {};

  return {
    ImportDeclaration: (node) => {
      callback(resolveImport(filename, node, node.source, currentWorkspace));
    },
    CallExpression: (node) => {
      if (
        node.arguments.length > 0 &&
        node.arguments[0].type === 'Literal' &&
        (node.callee.type === 'Import' ||
          (node.callee.type === 'Identifier' && node.callee.name === 'require'))
      ) {
        callback(
          resolveImport(filename, node, node.arguments[0], currentWorkspace),
        );
      }
    },
    ImportExpression: (node) => {
      if (node.source.type === 'Literal') {
        callback(resolveImport(filename, node, node.source, currentWorkspace));
      }
    },
  };
};

module.exports = {
  isSubPath,
  getImport,
  pathToImport,
};
