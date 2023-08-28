const { extendEslint } = require("@kodingdotninja/style-guide");

module.exports = extendEslint(["browser-node", "react", "typescript", "tsup"], {
  root: true,
});
