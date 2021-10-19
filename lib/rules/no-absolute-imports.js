'use strict';

const { dirname, relative } = require('path');
const { findWorkspaces } = require('find-workspaces');
const { isSubPath, getImport, pathToImport } = require('../utils');

module.exports.meta = {
  type: 'problem',
  docs: {
    description:
      'disallow absolute imports for files that are within the current package',
    url: 'https://github.com/joshuajaco/eslint-plugin-workspaces/blob/master/docs/rules/no-absolute-imports.md',
  },
  fixable: 'code',
  schema: [],
  messages: {
    noAbsoluteImports:
      'Absolute imports within the current package are not allowed',
  },
};

module.exports.create = (context) => {
  const filename = context.getFilename();
  const workspaces = findWorkspaces(filename);
  return getImport(workspaces, filename, ({ node, path, start, end }) => {
    workspaces.forEach(({ package: { name }, location }) => {
      if (isSubPath(location, filename) && isSubPath(name, path)) {
        context.report({
          node,
          messageId: 'noAbsoluteImports',
          fix: (fixer) =>
            fixer.replaceTextRange(
              [start + 1, end - 1],
              pathToImport(
                relative(dirname(filename), path.replace(name, location)),
              ),
            ),
        });
      }
    });
  });
};
