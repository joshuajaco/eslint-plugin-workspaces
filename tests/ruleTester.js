"use strict";

const { RuleTester } = require("eslint");

RuleTester.setDefaultConfig({
  languageOptions: {
    parser: require("@babel/eslint-parser"),
    parserOptions: { requireConfigFile: false },
  },
});

module.exports.ruleTester = new RuleTester();

module.exports.ruleTesterWithSettings = new RuleTester({
  settings: { workspaces: { search: { startDir: "/test", stopDir: "/" } } },
});
