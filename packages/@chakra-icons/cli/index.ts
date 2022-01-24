#!/usr/bin/env node

import * as chakraIcons from "@chakra-icons/core";
/** @see https://github.com/vercel/arg */
import arg from "arg";

const run = () => {
  const args = arg({
    // OPTIONS
    "--help": Boolean,
    "-h": "--help",
    "--version": Boolean,
    "-v": "--version",
    // FLAG
    "--snapshot": String,
    "-S": "--snapshot",
    "--clone-path": String,
    "-C": "--clone-path",
    // REQUIRED
    "--name": String,
    "-n": "--name",
    "--repo": String,
    "--icon-path": String,
    "-r": "--repo",
    "-i": "--icon-path",
    "--output": String,
    "-o": "--output",
  });

  if (!args["--name"]) return console.error("Missing required argument: --name");
  if (!args["--repo"]) return console.error("Missing required argument: --repo, -r (e.g org/repository)");
  if (!args["--icon-path"]) return console.error("Missing required argument: --icon-path, -i");

  const name = args["--name"];
  const repository = args["--repo"];
  const iconPath = args["--icon-path"];
  const clonePath = args["--clone-path"] ?? ".chakraIcons";
  const sourcePath = args["--output"] ?? "src";
  const snapshot = args["--snapshot"] ?? null;

  return chakraIcons.build({ name, repository, iconPath, clonePath, sourcePath, snapshot });
};

run().then(() => process.exit(0));
