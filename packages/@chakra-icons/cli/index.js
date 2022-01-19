#!/usr/bin/env node

// @ts-check

/** @see https://github.com/vercel/arg */
const arg = require("arg");

const args = arg({
  // ...
  "--help": Boolean,
  "-h": "--help",
  "--version": Boolean,
  "-V": "--version",

  // ...
  "--input": String,
  "--output": String,
  "-i": "--input",
  "-o": "--output",

  // ...
  "--name": String,
  "--case": String,
  "--prefix": String,
  "--suffix": String,
  "--typescript": String,
  "-n": "--name",
  "-C": "--case",
  "-P": "--prefix",
  "-S": "--suffix",
  "--ts": "--typescript",
});

// TODO: implement new chakra-icons cli ⚡️
console.log({
  TODO: "implement new chakra-icons cli ⚡️",
  args,
});
