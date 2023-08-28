const { extendEslint } = require("@kodingdotninja/style-guide");

module.exports = extendEslint(["node", "tsup", "typescript"], {
  rules: {
    "tsdoc/syntax": ["off"],
  },
  root: true,
});
