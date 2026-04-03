import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPrettier from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default defineConfig(
  globalIgnores(['dist']),
  js.configs.recommended,
  reactHooks.configs.flat.recommended,
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
      'simple-import-sort/exports': 'warn',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // Side-effect imports (polyfills, etc.) — keep early so order is stable
            ['^\\u0000'],

            // Core libraries: React / ReactDOM first
            ['^react$', '^react-dom(/|$)', '^react/'],

            // Third-party: scoped (@mui/...) and bare (axios, lodash, …)
            // `^@\\w` does not match `@/…` (alias) because the next char after @ must be \w
            ['^@\\w', '^[a-z]'],

            // Internal modules: path alias (matches tsconfig "@/*" → "@/…")
            ['^@/'],

            // Relative: parent dirs first, then same-folder
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],

            // Styles & assets last (relative or absolute-looking paths ending in these extensions)
            [
              '^.+\\.(css|scss|sass|less)$',
              '^.+\\.(png|jpe?g|gif|webp|svg|ico|avif)$',
              '^.+\\.(woff2?|ttf|otf|eot)$',
            ],
          ],
        },
      ],
    },
  },
);
