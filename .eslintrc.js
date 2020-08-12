module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2017,
  },
  env: {
    es2017: true,
    node: true,
    commonjs: true,
    jasmine: true,
  },
  globals: {
    browser: true,
    jest: true,
  },
  rules: {
    'typescript/no-var-requires': 'off',
  },
};
