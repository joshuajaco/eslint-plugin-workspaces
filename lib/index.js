'use strict';

module.exports.rules = {
  'no-cross-imports': require('./rules/no-cross-imports'),
  'no-relative-imports': require('./rules/no-relative-imports'),
  'no-absolute-imports': require('./rules/no-absolute-imports'),
  'require-dependency': require('./rules/require-dependency'),
};
