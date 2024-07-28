"use strict";

const { getWorkspaces, isSubPath, getImport } = require("../utils");

module.exports.meta = {
  type: "problem",
  docs: {
    description:
      "disallow relative imports of files that are outside of the current package",
    recommended: true,
    url: "https://github.com/joshuajaco/eslint-plugin-workspaces/blob/main/docs/rules/no-relative-imports.md",
  },
  fixable: "code",
  schema: [],
  messages: {
    noRelativeImports: "Relative imports of other packages are not allowed",
  },
};

module.exports.create = (context) => {
  const workspaces = getWorkspaces(context);
  return getImport(
    workspaces,
    context.getFilename(),
    ({ node, path, start, end, currentWorkspace }) => {
      workspaces.forEach(({ package: { name }, location }) => {
        if (
          name !== path &&
          name !== currentWorkspace.package.name &&
          isSubPath(location, path)
        ) {
          context.report({
            node,
            messageId: "noRelativeImports",
            fix: (fixer) =>
              fixer.replaceTextRange(
                [start + 1, end - 1],
                path.replace(location, name),
              ),
          });
        }
      });
    },
  );
};
