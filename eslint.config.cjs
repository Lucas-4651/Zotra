// eslint.config.cjs
const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');

module.exports = [
  {
    files: ['**/*.js'],
    ignores: ['node_modules', 'dist'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        require: true,
        module: true,
        console: true,
        process: true,
        __dirname: true,
        setTimeout: true,
        window: true,
        document: true,
        fetch: true,
        alert: true,
        confirm: true,
        Blob: true,
        URL: true,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
  prettier,
];
