module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    './.eslintrc.js',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
    sourceType: 'module',
    useJSXTextNode: true,
    project: './tsconfig.json',
  },
  env: {
    browser: true,
    commonjs: false,
    jasmine: false,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  globals: {},
  rules: {
    'typescript/no-var-requires': 'off',
    'react/prop-types': 'off',
  },
};
