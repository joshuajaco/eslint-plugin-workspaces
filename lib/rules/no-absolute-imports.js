"use strict";

const { dirname, relative } = require("path");
const {
  getWorkspaces,
  isWorkspacePath,
  getImport,
  pathToImport,
} = require("../utils");

module.exports.meta = {
  type: "problem",
  docs: {
    description:
      "disallow absolute imports for files that are within the current package",
    recommended: true,
    url: "https://github.com/joshuajaco/eslint-plugin-workspaces/blob/main/docs/rules/no-absolute-imports.md",
  },
  fixable: "code",
  schema: [],
  messages: {
    noAbsoluteImports:
      "Absolute imports within the current package are not allowed",
  },
};

module.exports.create = (context) => {
  const workspaces = getWorkspaces(context);
  const filename = context.getFilename();
  return getImport(
    workspaces,
    filename,
    ({ node, path, value, start, end, currentWorkspace }) => {
      if (isWorkspacePath(currentWorkspace.package.name, value)) {
        context.report({
          node,
          messageId: "noAbsoluteImports",
          fix: (fixer) =>
            fixer.replaceTextRange(
              [start + 1, end - 1],
              pathToImport(
                relative(
                  dirname(filename),
                  path.replace(
                    currentWorkspace.package.name,
                    currentWorkspace.location,
                  ),
                ),
              ),
            ),
        });
      }
    },
  );
};
