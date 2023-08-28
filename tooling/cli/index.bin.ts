#!/usr/bin/env node

import arg from "arg";
import * as ruins from "ruins-ts";

import pkgJson from "./package.json";
import type { BuildOptions, InitOptions, PrepackOptions } from "./src";
import { build, init } from "./src";
import { clean } from "./src/clean";
import { prepack } from "./src/prepack";

type Command =
  | { type: "prepack"; options: PrepackOptions }
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
        // Prepack Related
        "--remove-dev-deps": Boolean,
        "--add-peer-deps": String, // example --add-peer-deps "pkg@v1,pkg2@>=2"
        "--add-scripts": String,
        "--rd": "--remove-dev-deps",
        "--ap": "--add-peer-deps",
        "--ax": "--add-scripts",
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
      "--remove-dev-deps": removeDevDeps,
      "--add-peer-deps": addPeerDeps,
      "--add-scripts": addScripts,
    } = args;

    const clonePath = _clonePath ?? ".chakraIcons";
    const sourcePath = _sourcePath ?? "src";

    if (first === "prepack")
      return {
        type: "prepack",
        options: {
          removeDevDeps,
          addPeerDeps: addPeerDeps?.split(",") ?? [],
          addScripts: addScripts?.split(",") ?? [],
        },
      };

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
USAGE: ${pkgJson.name} <SUBCOMMAND>

SUBCOMMAND:
  init:   init -n <NAME> -r <ORGS/REPO-NAME> -i <PATH/SVG>
  build:  build -n <NAME> -r <ORGS/REPO-NAME> -i <PATH/SVG>
    OPTIONS:
      --snapshot <NAME>, -S <NAME>  create snapshot information (.json).
    FLAGS:
      --with-entrypoints, -E  generate entrypoints when generating new icon.

  prepack: tools for manage package.json fields
    OPTIONS:
      --add-peer-deps, --ap     add peer dependencies (e.g --ap "react@^17,react-dom@^17")
      --add-scripts, --ax       add new script in scripts field of package.json (e.g --ax "prcommit=commitlint")
    FLAGS:
      --remove-dev-deps, --rd   remove field devDependencies in current work directory (package.json)

`);

const version = () => console.log(pkgJson.version);

const fail = (e: unknown) => {
  console.log("something wrong :( ");
  console.error(String(e));
  process.exit(1);
};

const run = async (command: Command) => {
  switch (command.type) {
    case "prepack":
      return prepack(command.options);
    case "build":
      return ruins.fromTaskEither(build(command.options)).catch((e) => fail(e));
    case "init":
      return init(command.options);
    case "clean":
      return ruins
        .fromTaskEither(clean(command.options))
        .then((files) => {
          console.log(`Clean ${(files as unknown[]).length} files`);
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
