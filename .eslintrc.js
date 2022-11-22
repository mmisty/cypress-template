module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: ['*.yaml', '*.yml', '*.csv'],
  env: {
    es6: true,
    browser: false,
    node: true,
    commonjs: false,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier', 'eslint-config-prettier'],
  plugins: ['prettier'],
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/consistent-type-definition': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'all',
        semi: true,
        singleQuote: true,
        printWidth: 120,
        tabWidth: 2,
        useTabs: false,
        arrowParens: 'avoid',
      },
    ],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: ['class', 'function', 'return', 'try', 'switch'],
      },
      { blankLine: 'always', prev: 'import', next: '*' },
      { blankLine: 'never', prev: 'import', next: 'import' },
      {
        blankLine: 'always',
        prev: '*',
        next: ['multiline-block-like', 'multiline-const'],
      },
    ],
  },
};
