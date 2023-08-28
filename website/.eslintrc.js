const { extendEslint } = require("@kodingdotninja/style-guide");

module.exports = extendEslint(["browser-node", "react", "next", "typescript"], {
  root: true,
});
