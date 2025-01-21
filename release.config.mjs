/**
 * @see https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  preset: 'conventional-commits',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    ['@semantic-release/gitlab', { assets: ['build/**'] }],
    ['semantic-release-jira-notes', { jiraHost: 'imolater.atlassian.net' }],
  ],
};
