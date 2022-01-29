module.exports = {
  extends: ["squash-pr", "@commitlint/config-conventional"],
  ignores: [
    // ignore lint commit when committed by release commit
    (msg) => /^chore\(release\): (.*) \[skip ci\]/g.test(msg),
    // ignore lint commit when squash message
    (msg) => /.*:.*\(#\d+\)/g.test(msg),
  ],
};
