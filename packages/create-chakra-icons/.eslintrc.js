const { extendEslint } = require("@kodingdotninja/style-guide");

module.exports = extendEslint(["node", "typescript"], {
  root: true,
});
