import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import eslintPrettier from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default defineConfig(
  {
    ignores: ['dist'],
  },
  js.configs.recommended,
  reactHooks.configs['recommended-latest'],
  eslintPrettier,
  {
    extends: [
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
    ],

    files: ['src/**/*.js', 'src/**/*.jsx', '*.config.js'],

    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },

    plugins: {
      'simple-import-sort': simpleImportSortPlugin,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      sourceType: 'module',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      // simple-import-sort
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Packages `react` related packages come first.
            ['^react', '^@?\\w'],
            // Internal packages.
            ['^(@|components)(/.*|$)'],
            // Side effect imports.
            ['^\\u0000'],
            // Parent imports. Put `..` last.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Other relative imports. Put same-folder imports and `.` last.
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports.
            ['^.+\\.?(css)$'],
          ],
        },
      ],
    },
  },
);
