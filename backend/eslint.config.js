import jsESlint from '@eslint/js';
import tsESlint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier/recommended';

export default defineConfig(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  jsESlint.configs.recommended,
  ...tsESlint.configs.recommended,
  prettierPlugin,
  prettierConfig,
  {
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'arrow-body-style': ['error', 'as-needed'],
    },
  },
);
