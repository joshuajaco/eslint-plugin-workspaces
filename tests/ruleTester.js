'use strict';

const { RuleTester } = require('eslint');

RuleTester.setDefaultConfig({
  parser: require.resolve('babel-eslint'),
});

module.exports = new RuleTester();
