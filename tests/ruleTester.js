'use strict';

const { RuleTester } = require('eslint');

RuleTester.setDefaultConfig({
  parser: require.resolve('babel-eslint'),
});

module.exports.ruleTester = new RuleTester();

module.exports.ruleTesterWithSettings = new RuleTester({
  settings: { workspaces: { search: { startDir: '/test', stopDir: '/' } } },
});
