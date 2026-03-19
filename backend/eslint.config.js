import js from '@eslint/js'
import globals from 'globals'
import prettier from 'eslint-config-prettier'

export default [
  {
    ignores: ['node_modules', 'dist'],
  },
  {
    files: ['**/*.js'],
    ...js.configs.recommended,

    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module', // change to "script" if using CommonJS
      globals: {
        ...globals.node,
      },
    },

    rules: {},
  },

  prettier,
]
