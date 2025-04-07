import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import-x';
import nodePlugin from 'eslint-plugin-n';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  nodePlugin.configs['flat/recommended-module'],
  {
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      'import-x/no-named-as-default-member': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
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
