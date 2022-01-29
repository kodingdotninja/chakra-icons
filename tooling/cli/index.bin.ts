#!/usr/bin/env node

import { clean } from "./src/clean";
import pkgJson from "./package.json";
import { build, BuildOptions, init, InitOptions } from "./src";

import arg from "arg";
import * as ruins from "ruins-ts";

type Command =
  | { type: "init"; options: InitOptions }
  | { type: "build"; options: BuildOptions }
  | { type: "clean"; options: BuildOptions }
  | { type: "fail"; error: unknown }
  | { type: "help" }
  | { type: "version" };

const parseArgs = (): Command => {
  try {
    const argv = process.argv.slice(2);
    const args = arg(
      {
        // COMMON OPTIONS
        "--help": Boolean,
        "-h": "--help",
        "--version": Boolean,
        "-v": "--version",
        // REQUIRED
        "--name": String,
        "-n": "--name",
        "--repo": String,
        "--icon-path": String,
        "-r": "--repo",
        "-i": "--icon-path",
        "--output": String,
        "-o": "--output",
        // OPTIONS
        "--clone-path": String,
        "-C": "--clone-path",
        "--snapshot": String,
        "-S": "--snapshot",
        // FLAGS
        "--with-entrypoints": Boolean,
        "--with-clean": Boolean,
        "-E": "--with-entrypoints",
      },
      { argv },
    );

    const [first] = args._;

    const {
      "--name": name,
      "--repo": repository,
      "--icon-path": iconPath,
      "--clone-path": _clonePath,
      "--output": _sourcePath,
      "--snapshot": snapshot,
      "--with-entrypoints": entryPoints,
      "--version": version,
      "--help": help,
    } = args;

    const clonePath = _clonePath ?? ".chakraIcons";
    const sourcePath = _sourcePath ?? "src";

    if (first === "init" && name && repository && iconPath)
      return { type: "init", options: { name, repository, iconPath } };

    if (name && repository && iconPath && clonePath && sourcePath) {
      const options: BuildOptions = {
        name,
        repository,
        iconPath,
        clonePath,
        sourcePath,
        snapshot,
        entryPoints: Boolean(entryPoints),
      };

      if (first === "clean") return { type: "clean", options };

      return {
        type: "build",
        options,
      };
    }

    if (version) return { type: "version" };

    if (help) return { type: "help" };

    return { type: "fail", error: Error("cannot parse any arguments :(") };
  } catch (e: unknown) {
    return { type: "fail", error: e };
  }
};

const help = () =>
  process.stdout.write(`
USAGE: ${pkgJson?.name} <SUBCOMMAND>

SUBCOMMAND:
  build:  build -n <NAME> -r <ORGS/REPO-NAME> -i <PATH/SVG>
  init:   init -n <NAME> -r <ORGS/REPO-NAME> -i <PATH/SVG> 

OPTIONS:
  build:
    -S: save snapshot information
`);

const version = () => console.log(pkgJson?.version);

const fail = (e: unknown) => {
  console.log("something wrong :( ");
  console.error(String(e));
  process.exit(1);
};

const run = async (command: Command) => {
  switch (command.type) {
    case "build":
      return ruins.fromTaskEither(build(command.options)).catch((e) => fail(e));
    case "init":
      return init(command.options);
    case "clean":
      return ruins
        .fromTaskEither(clean(command.options))
        .then((files) => {
          console.log(`Clean ${files.length} files`);
        })
        .catch((e) => fail(e));
    case "fail":
      return fail(command.error);
    case "version":
      return version();
    default:
      return help();
  }
};

run(parseArgs())
  .then(() => process.exit(0))
  .catch((e) => console.error(e));
