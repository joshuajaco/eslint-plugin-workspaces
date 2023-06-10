"use strict";

module.exports.findWorkspacesMock = () => [
  {
    location: "/test/workspace",
    package: {
      name: "@test/workspace",
    },
  },
  {
    location: "/test/another-workspace",
    package: {
      name: "@test/another-workspace",
      dependencies: { "@test/workspace": "^1.0.0" },
    },
  },
  {
    location: "/test/third-workspace",
    package: {
      name: "@test/third-workspace",
    },
  },
  {
    location: "/test/peer-dependencies",
    package: {
      name: "@test/peer-dependencies",
      peerDependencies: { "@test/peer-workspace": "^1.0.0" },
    },
  },
  {
    location: "/test/optional-dependencies",
    package: {
      name: "@test/optional-dependencies",
      optionalDependencies: { "@test/optional-workspace": "^1.0.0" },
    },
  },
  {
    location: "/test/scope/shared",
    package: {
      name: "@test/shared-in-scope",
    },
  },
  {
    location: "/test/other-scope/shared",
    package: {
      name: "@test/shared-outside-scope",
    },
  },
  {
    location: "/test/scope/workspace",
    package: {
      name: "@test/scoped-workspace",
    },
  },
  {
    location: "root",
    package: { name: "root" },
  },
];
