// cypress configuration
const original = require('../.eslintrc.js');

module.exports = {
  ...original,
  extends: [...original.extends, 'plugin:jest/recommended'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    ...original.rules,
    'class-methods-use-this': 'off',
    'jest/no-standalone-expect': 'off',
  },
};
