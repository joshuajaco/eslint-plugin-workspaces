'use strict';

const { RuleTester } = require('eslint');

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
});

module.exports = new RuleTester();
