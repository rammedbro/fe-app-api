/**
 * @see https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  repositoryUrl: 'https://gitlab.com/imolater/fe-app-api.git',
  branches: ['master', 'next'],
  plugins: [
    '@semantic-release/commit-analyzer',
    ['semantic-release-jira-notes', { jiraHost: 'imolater.atlassian.net' }],
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/gitlab',
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
        message: 'chore(release): ${nextRelease.version}',
      },
    ],
  ],
};
