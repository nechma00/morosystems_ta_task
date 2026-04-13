import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'tests/services/types/openapi.d.ts',
      'todo-be/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['playwright.config.ts', 'tests/**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      // General code quality for maintainable test automation suites.
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-duplicate-imports': 'error',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-console': 'off',

      // TypeScript-focused reliability rules.
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Playwright anti-pattern guards (warning level for gradual adoption).
      'no-restricted-properties': [
        'warn',
        {
          property: 'waitForTimeout',
          message: 'Prefer web-first assertions or explicit conditions over fixed sleeps.',
        },
      ],
      'no-restricted-syntax': [
        'warn',
        {
          selector: "Property[key.name='force'][value.value=true]",
          message: 'Avoid force actions unless strictly necessary; prefer stable locators and waits.',
        },
      ],
    },
  },
];
