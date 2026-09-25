import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // Build output, the frozen legacy SPA, tooling caches and the git-ignored
  // corporate/client folders (which can contain third-party JS, e.g. Python venvs).
  {
    ignores: [
      'dist',
      'legacy',
      'node_modules',
      '.astro',
      'playwright-report',
      'test-results',
      'Clients',
      'asic',
      'bills',
      'apple-developer',
      'business-bank-account',
      'Bustle-studios',
      'SOW*',
    ],
  },
  // Node.js scripts + serverless API routes - use Node environment
  {
    files: ['scripts/**/*.{js,mjs}', 'api/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  // Browser/React files
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['scripts/**/*.{js,mjs}', 'api/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^[A-Z_]|^motion$',
        argsIgnorePattern: '^_|^[A-Z]',
        ignoreRestSiblings: true
      }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
