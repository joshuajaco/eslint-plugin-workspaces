'use strict';

const { RuleTester } = require('eslint');

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

const babelTester = new RuleTester();
babelTester.testerConfig.parser = require.resolve('babel-eslint');

const typescriptTester = new RuleTester();
typescriptTester.testerConfig.parser = require.resolve(
  '@typescript-eslint/parser',
);

module.exports = {
  run: (...args) => {
    babelTester.run(...args);
    typescriptTester.run(...args);
  },
};
