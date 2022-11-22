module.exports = {
  "parser": "@typescript-eslint/parser",
  parserOptions: {
    project: './tsconfig.json',
  },
  "plugins": ["@typescript-eslint", "prettier"],
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  "rules": {
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/consistent-type-definition": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
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
  },
  "env": {
    "browser": true,
    "amd": true,
    "node": true
  },
}