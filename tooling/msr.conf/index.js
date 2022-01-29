// credit for https://github.com/qiwi/semantic-release-toolkit/tree/master/packages/config-monorepo
const releaseCommitMessage = `chore(release): $\{nextRelease.gitTag} [skip ci]

$\{nextRelease.notes}`;

module.exports = {
  branches: ["main", { name: "beta", channel: "beta", prerelease: true }],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "angular",
        releaseRules: [{ type: "refactor", release: "patch" }],
        parserOpts: {
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"],
        },
      },
    ],
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semrel-extra/npm",
    [
      "@semantic-release/github",
      {
        successComment: false,
        failComment: false,
      },
    ],
    [
      "@semantic-release/git",
      {
        message: releaseCommitMessage,
      },
    ],
  ],
};
