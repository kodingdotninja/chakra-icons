module.exports = {
  extends: ["squash-pr", "@commitlint/config-conventional"],
  ignores: [(msg) => /^chore\(release\): (.*) \[skip ci\]/g.test(msg)],
};
