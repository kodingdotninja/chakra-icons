module.exports = {
  extends: ["squash-pr", "@commitlint/config-conventional"],
  ignores: [
    // ignore lint commit when committed by release commit
    (msg) => /^chore\((release|deps-dev|deps)?\):\s(@?\D+\d+.\d+.\d+|bump.*)\s(from|\[skip ci\]|to.*)?/g.test(msg),
    // ignore lint commit when squash message
    (msg) => /.*:.*\(#\d+\)/g.test(msg),
  ],
};
