'use strict';

const { RuleTester } = require('eslint');

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
});

module.exports = new RuleTester();
