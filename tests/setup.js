'use strict';

const mock = require('mock-require');

mock('get-monorepo-packages', () => [{ package: { name: '@test/workspace' } }]);
