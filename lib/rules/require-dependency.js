"use strict";

const {
  getWorkspaces,
  isSubPath,
  isWorkspacePath,
  getImport,
} = require("../utils");

module.exports.meta = {
  type: "problem",
  docs: {
    description:
      "disallow importing from packages that are not listed as a dependency",
    recommended: true,
    url: "https://github.com/joshuajaco/eslint-plugin-workspaces/blob/main/docs/rules/require-dependency.md",
  },
  schema: [],
  messages: {
    requireDependency:
      "Importing from another workspace without listing it as a dependency is not allowed",
  },
};

module.exports.create = (context) => {
  const workspaces = getWorkspaces(context);
  return getImport(
    workspaces,
    context.getFilename(),
    ({ node, value, path, currentWorkspace }) => {
      if (isSubPath(currentWorkspace.location, path)) return;

      workspaces.forEach(({ package: { name }, location }) => {
        const {
          dependencies = {},
          peerDependencies = {},
          optionalDependencies = {},
          devDependencies = {},
        } = currentWorkspace.package;

        if (
          name !== currentWorkspace.package.name &&
          (isWorkspacePath(name, value) || isSubPath(location, path)) &&
          !Object.keys(dependencies).includes(name) &&
          !Object.keys(peerDependencies).includes(name) &&
          !Object.keys(optionalDependencies).includes(name) &&
          !Object.keys(devDependencies).includes(name)
        ) {
          context.report({
            node,
            messageId: "requireDependency",
          });
        }
      });
    },
  );
};
