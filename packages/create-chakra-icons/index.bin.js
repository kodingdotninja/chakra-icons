#!/usr/bin/env node
const args = require("minimist")(process.argv.slice(2));

const { main, pipeline } = require("./lib/cli");

if (process.stdin.isTTY) {
  main(args);
} else {
  pipeline(args);
}
