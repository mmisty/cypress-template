// cypress configuration
const original = require('../.eslintrc.js');

module.exports = {
  ...original,
  parserOptions: {
    project: '../tsconfig.json',
  },
  rules: {
    ...original.rules,
    'class-methods-use-this': 'off',
  },
};
