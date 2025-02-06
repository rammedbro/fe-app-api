import type { UserConfig } from '@commitlint/types';

/**
 * @see https://commitlint.js.org/reference/configuration.html#configuration
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-empty': [2, 'never'],
    'subject-case': [2, 'always', ['sentence-case']],
    'body-max-line-length': [2, 'always', 200],
  },
} as UserConfig;
