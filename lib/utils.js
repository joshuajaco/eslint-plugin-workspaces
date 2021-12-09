"use strict";

const {
  dirname,
  join,
  relative,
  sep,
  normalize,
  isAbsolute,
  posix,
} = require("path");
const { findWorkspaces, createWorkspacesCache } = require("find-workspaces");

const isSubPath = (parent, path) => {
  const relativePath = relative(parent, path);
  return relativePath.split(sep)[0] !== ".." && !isAbsolute(relativePath);
};

const resolvePath = (parent, path) => {
  if (path[0] !== ".") return path;

  return join(parent, path).split(sep).join(posix.sep);
};

const resolveImport = (filename, node, { value, range }, currentWorkspace) => {
  const path = resolvePath(dirname(filename), value);
  const [start, end] = range;
  return { node, value, path, start, end, currentWorkspace };
};

const pathToImport = (path) => {
  if (path === "") return ".";

  const normalized = normalize(path).split(sep).join(posix.sep);

  if (normalized[0] !== ".") return `./${normalized}`;

  return normalized;
};

const getImport = (workspaces, filename, callback) => {
  if (!workspaces) return {};

  const currentWorkspace = workspaces.find(({ location }) =>
    isSubPath(location, filename)
  );

  if (!currentWorkspace) return {};

  return {
    ImportDeclaration: (node) => {
      callback(resolveImport(filename, node, node.source, currentWorkspace));
    },
    CallExpression: (node) => {
      if (
        node.arguments.length > 0 &&
        node.arguments[0].type === "Literal" &&
        (node.callee.type === "Import" ||
          (node.callee.type === "Identifier" && node.callee.name === "require"))
      ) {
        callback(
          resolveImport(filename, node, node.arguments[0], currentWorkspace)
        );
      }
    },
    ImportExpression: (node) => {
      if (node.source.type === "Literal") {
        callback(resolveImport(filename, node, node.source, currentWorkspace));
      }
    },
  };
};

const cache = createWorkspacesCache();

const getWorkspaces = (context) => {
  const searchSetting =
    context.settings &&
    context.settings.workspaces &&
    context.settings.workspaces.search;

  const dir = searchSetting
    ? searchSetting.startDir
    : dirname(context.getFilename());

  const stopDir = searchSetting && searchSetting.stopDir;

  return findWorkspaces(dir, { stopDir, cache });
};

module.exports = {
  isSubPath,
  getImport,
  pathToImport,
  getWorkspaces,
};
