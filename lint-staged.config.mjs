/**
 * @see https://github.com/lint-staged/lint-staged?tab=readme-ov-file#configuration
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*': 'prettier --write --ignore-unknown',
  '*.{js,ts}': 'eslint --fix',
  '*.ts': () => 'tsc --noEmit',
};
