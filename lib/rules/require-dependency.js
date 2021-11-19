"use strict";

const { getWorkspaces, isSubPath, getImport } = require("../utils");

module.exports.meta = {
  type: "problem",
  docs: {
    description:
      "disallow importing from packages that are not listed as a dependency",
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
      workspaces.forEach(({ package: { name }, location }) => {
        const { dependencies = {}, devDependencies = {} } =
          currentWorkspace.package;

        if (
          name !== currentWorkspace.package.name &&
          (isSubPath(name, value) || isSubPath(location, path)) &&
          !Object.keys(dependencies).includes(name) &&
          !Object.keys(devDependencies).includes(name)
        ) {
          context.report({
            node,
            messageId: "requireDependency",
          });
        }
      });
    }
  );
};
