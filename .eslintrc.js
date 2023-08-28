const { extendEslint } = require("@kodingdotninja/style-guide");

module.exports = extendEslint(["node"], {
  rules: {
    "import/no-default-export": ["off"],
  },
  root: true,
});
