import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import-x';
import unusedImports from 'eslint-plugin-unused-imports';
import tsParser from '@typescript-eslint/parser';
import nodePlugin from 'eslint-plugin-n';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  nodePlugin.configs['flat/recommended-module'],
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      'import-x/no-named-as-default-member': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'n/no-missing-import': 'off',
      'n/no-unpublished-import': 'off',
      'n/prefer-node-protocol': 'error',
      'n/no-sync': ['error', { allowAtRootLevel: true }],
      'n/no-path-concat': 'error',
    },
  },
  {
    ignores: ['node_modules', 'build', 'src/app/providers/router/routes.ts'],
  }
);
