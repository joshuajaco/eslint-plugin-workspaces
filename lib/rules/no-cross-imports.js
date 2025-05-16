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
    description: "disallow imports of files that are inside another package",
    recommended: false,
    url: "https://github.com/joshuajaco/eslint-plugin-workspaces/blob/main/docs/rules/no-cross-imports.md",
  },
  schema: [
    {
      type: "object",
      additionalProperties: false,
      properties: {
        allow: {
          description:
            "single or a list of package names to exclude from this rule",
          anyOf: [
            { type: "string" },
            {
              type: "array",
              uniqueItems: true,
              items: { type: "string" },
            },
          ],
        },
        scopes: {
          description: "deprecated",
          anyOf: [
            { type: "boolean" },
            {
              type: "object",
              additionalProperties: false,
              properties: {
                enable: { type: "boolean" },
                folderName: { type: "string" },
              },
            },
          ],
        },
      },
    },
  ],
  defaultOptions: [{ allow: [], scopes: { enable: false } }],
  messages: { noCrossImports: 'Import from package "{{name}}" is not allowed' },
};

const filterSharedPackagesInCurrentScope =
  ({ location: currentLocation }, scopedEnabled, scopedSharingFolderName) =>
  ({ location }) => {
    if (!scopedEnabled) return true;
    const locationArray = location.split("/");
    const forbiddenPackageParent = locationArray.slice(0, -1).join("/");
    if (!isSubPath(forbiddenPackageParent, currentLocation)) {
      return true;
    }

    return locationArray[locationArray.length - 1] !== scopedSharingFolderName;
  };

let scopesDeprecationShown = false;

module.exports.create = (context) => {
  const {
    options: [{ allow = [], scopes = { enable: false } } = {}],
  } = context;

  const allowed = typeof allow === "string" ? [allow] : allow;
  const scopedEnabled = scopes === true || !!scopes.enable;
  const scopedSharingFolderName = scopes.folderName || "shared";

  /* istanbul ignore if */
  if (
    scopedEnabled &&
    !scopesDeprecationShown &&
    process.stdout &&
    process.stdout.isTTY
  ) {
    scopesDeprecationShown = true;

    console.warn(
      "\x1b[1m", // bright
      "\x1b[33m", // yellow text
      "Warning:",
      "\x1b[0m", // reset
      "the 'scopes' option of the 'workspaces/no-cross-imports' rule has been deprecated and will be removed in the next major version. See https://github.com/joshuajaco/eslint-plugin-workspaces/blob/main/docs/deprecating-scopes.md for more information.",
    );
  }

  const workspaces = getWorkspaces(context);

  if (!workspaces) return {};

  const forbidden = workspaces.filter(
    ({ package: { name } }) => !allowed.includes(name),
  );

  return getImport(
    workspaces,
    context.getFilename(),
    ({ node, value, path, currentWorkspace }) => {
      forbidden
        .filter(
          filterSharedPackagesInCurrentScope(
            currentWorkspace,
            scopedEnabled,
            scopedSharingFolderName,
          ),
        )
        .forEach(({ package: { name }, location }) => {
          if (
            name !== currentWorkspace.package.name &&
            (isWorkspacePath(name, value) || isSubPath(location, path))
          ) {
            context.report({
              node,
              messageId: "noCrossImports",
              data: { name },
            });
          }
        });
    },
  );
};
