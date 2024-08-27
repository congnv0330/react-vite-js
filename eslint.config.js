import { fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPrettier from 'eslint-plugin-prettier/recommended';
import reactConfigJsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';
import reactConfigRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

/**
 * @param  {...(import('eslint').Linter.Config & { extends: any[] })} configs
 * @returns {import('eslint').Linter.Config[]}
 */
function defineConfig(...configs) {
  return configs.flatMap((configWithExtends) => {
    const { extends: extendsArr, ...config } = configWithExtends;

    if (extendsArr == null || extendsArr.length === 0) {
      return config;
    }

    const extension = {
      ...(config.files && { files: config.files }),
      ...(config.ignores && { ignores: config.ignores }),
    };

    return [
      ...extendsArr.map((conf) => ({
        ...conf,
        ...extension,
      })),
      config,
    ];
  });
}

export default defineConfig({
  extends: [
    js.configs.recommended,
    reactConfigRecommended,
    reactConfigJsxRuntime,
    jsxA11y.flatConfigs.recommended,
    eslintPrettier,
  ],

  files: ['src/**/*.js', 'src/**/*.jsx', '*.config.js'],

  linterOptions: {
    reportUnusedDisableDirectives: 'error',
  },

  plugins: {
    'simple-import-sort': simpleImportSortPlugin,
    'react-hooks': fixupPluginRules(reactHooks),
  },

  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },

    ecmaVersion: 2020,

    sourceType: 'module',
  },

  settings: {
    react: {
      version: 'detect',
    },
  },

  rules: {
    // eslint-plugin-react
    'react/display-name': 'off',

    // eslint-plugin-react-hooks
    ...reactHooks.configs.recommended.rules,

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
});
