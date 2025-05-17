"use strict";

const { RuleTester } = require("eslint");

RuleTester.setDefaultConfig({});

module.exports.ruleTester = new RuleTester();

module.exports.ruleTesterWithSettings = new RuleTester({
  settings: { workspaces: { search: { startDir: "/test", stopDir: "/" } } },
});
