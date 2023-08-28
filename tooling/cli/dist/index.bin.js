#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// index.bin.ts
var import_arg = __toESM(require("arg"));
var ruins = __toESM(require("ruins-ts"));

// package.json
var package_default = {
  name: "@chakra-icons/cli",
  description: "a tooling for manage everything in @chakra-icons",
  version: "1.0.2",
  author: "ri7nz <ri7nz@koding.ninja>",
  homepage: "https://github.com/kodingdotninja/chakra-icons",
  repository: "https://github.com/kodingdotninja/chakra-icons.git",
  bugs: "https://github.com/kodingdotninja/chakra-icons/issues",
  bin: {
    "chakra-icons": "dist/index.bin.js"
  },
  main: "./dist/index.js",
  module: "./dist/index.mjs",
  types: "./dist/index.d.ts",
  scripts: {
    "# general commands": "--------------------------------------------------",
    build: "tsup",
    format: 'prettier --write "**/*.{js,json,md,svg}"',
    lint: 'eslint --fix "**/*.ts"',
    "#": "-------------------------------------------------------------------"
  },
  dependencies: {
    "@babel/generator": "^7.22.10",
    "@babel/types": "^7.22.11",
    arg: "^5.0.2",
    "change-case": "^4.1.2",
    "create-chakra-icons": "*",
    degit: "npm:tiged",
    "fp-ts": "^2.16.1",
    glob: "^10.3.3",
    "ruins-ts": "^0.0.4"
  },
  devDependencies: {
    "@types/degit": "^2.8.3",
    eslint: "^8.47.0",
    "eslint-plugin-fp-ts": "^0.3.2",
    tsup: "^7.2.0",
    typescript: "^5.2.2"
  },
  files: [
    "dist/"
  ],
  keywords: [
    "kdnj",
    "kodingdotninja",
    "chakra-icons",
    "create-chakra-icons"
  ],
  license: "MIT"
};

// src/build.ts
var import_generator = __toESM(require("@babel/generator"));
var t = __toESM(require("@babel/types"));
var import_change_case = require("change-case");
var import_create_chakra_icons = require("create-chakra-icons");
var import_degit = __toESM(require("degit"));
var A = __toESM(require("fp-ts/Array"));
var E = __toESM(require("fp-ts/Either"));
var import_function = require("fp-ts/function");
var O = __toESM(require("fp-ts/Option"));
var S = __toESM(require("fp-ts/string"));
var TE = __toESM(require("fp-ts/TaskEither"));
var fs = __toESM(require("fs/promises"));
var _glob = __toESM(require("glob"));
var path = __toESM(require("path"));
var metaIconDefault = (name, repository, iconPath, clonePath, sourcePath) => ({
  name,
  repository,
  iconPath,
  clonePath,
  sourcePath,
  sources: []
});
var hotfixNameMap = [
  [
    /tabler-icons/i,
    {
      "device-game-pad": "device-dpad"
    }
  ]
];
var hotfixName = (metaIcon) => (name) => (0, import_function.pipe)(
  hotfixNameMap,
  A.findFirst(([pattern]) => pattern.test(metaIcon.repository)),
  O.fold(
    () => name,
    ([, maps]) => (0, import_function.pipe)(
      maps[name],
      O.fromNullable,
      O.getOrElse(() => name)
    )
  )
);
var prefixWhenNumeric = (prefix) => (n) => /^\d.*$/.test(n) ? `${prefix}${n}` : n;
var moduleName = (0, import_function.flow)(prefixWhenNumeric("I"), import_change_case.pascalCase, S.replace(/[^A-Z0-9]/gi, ""));
var setSources = (metaIcon) => (beSources) => {
  const createSource = (sources, svg) => {
    const { dir, name: _name } = path.parse(svg);
    const name = (0, import_function.pipe)(_name, hotfixName(metaIcon), moduleName);
    const entryPoint = path.join(
      dir.replace(path.join(metaIcon.clonePath, metaIcon.iconPath), metaIcon.sourcePath),
      "index.ts"
    );
    const entry = { name, svg, code: path.join(path.dirname(entryPoint), `${name}.tsx`) };
    const maybeIcon = sources.find((icon) => S.Eq.equals(icon.entryPoint, entryPoint));
    if (maybeIcon) {
      sources[sources.indexOf(maybeIcon)]?.entries.push(entry);
      return sources;
    }
    return [...sources, { entryPoint, entries: [entry] }];
  };
  return {
    ...metaIcon,
    sources: beSources.reduce((a, b) => createSource(a, b), metaIcon.sources)
  };
};
var writeFile2 = (file, data) => TE.tryCatch(() => fs.mkdir(path.dirname(file), { recursive: true }).then(() => fs.writeFile(file, data)), E.toError);
var glob2 = (target) => TE.tryCatch(() => _glob.glob(target), E.toError);
var cloneRepository = (metaIcon) => TE.tryCatch(
  () => (0, import_degit.default)(metaIcon.repository, { force: true }).clone(metaIcon.clonePath).then(() => metaIcon),
  E.toError
);
var findSvgs = (metaIcon) => (0, import_function.pipe)(path.join(metaIcon.clonePath, metaIcon.iconPath, "**", "*.svg"), glob2, TE.map(setSources(metaIcon)));
var createIcons = (options) => TE.tryCatch(() => Promise.resolve(import_create_chakra_icons.cli.main(options)), E.toError);
var generateIcons = (metaIcon) => (0, import_function.pipe)(
  metaIcon.sources,
  A.map(
    ({ entries }) => (0, import_function.pipe)(
      entries,
      A.map(({ name: n, svg: i, code: o }) => createIcons({ n, i, o, ts: true, T: "C", useFilename: true }))
    )
  ),
  A.flatten,
  TE.sequenceArray
);
var generateExportAllCode = (name) => (0, import_function.pipe)(`./${name}`, t.stringLiteral, t.exportAllDeclaration, import_generator.default, (b) => b.code);
var genrateExportAllNamespace = (alias, source) => (0, import_generator.default)(
  t.exportNamedDeclaration(null, [(0, import_function.pipe)(alias, t.identifier, t.exportNamespaceSpecifier)], t.stringLiteral(source))
).code;
var generateEntrypointCode = (source) => (0, import_function.pipe)(
  source.entries,
  A.map((s) => generateExportAllCode(s.name)),
  (arr) => arr.join("\r\n")
);
var generateEntrypoint = (metaIcon) => (0, import_function.pipe)(
  metaIcon.sources,
  A.map((a) => writeFile2(a.entryPoint, generateEntrypointCode(a))),
  TE.sequenceArray
);
var generateSnapshot = (options) => (metaIcon) => (0, import_function.pipe)(
  options.snapshot,
  O.fromNullable,
  O.fold(
    () => TE.of(metaIcon),
    (file) => (0, import_function.pipe)(
      TE.of(metaIcon),
      TE.chainFirst((_metaIcon) => writeFile2(file, JSON.stringify(_metaIcon, null, 2)))
    )
  )
);
var generateRootEntryPoint = (metaIcon) => (0, import_function.pipe)(
  metaIcon.sources,
  A.findFirst((source) => S.Eq.equals(source.entryPoint, path.join(metaIcon.sourcePath, "index.ts"))),
  O.fold(
    () => [
      writeFile2(
        path.join(metaIcon.sourcePath, "index.ts"),
        (0, import_function.pipe)(
          metaIcon.sources,
          // eslint-disable-next-line @typescript-eslint/unbound-method
          A.map((source) => (0, import_function.pipe)(source.entryPoint, path.dirname, path.basename)),
          A.map((source) => genrateExportAllNamespace(source, "./".concat(source))),
          (arrs) => arrs.join("\r\n")
        )
      )
    ],
    () => []
  ),
  TE.sequenceArray
);
var buildFlow = (0, import_function.flow)(
  // make MetaIcon and cloneRepository
  TE.chain(cloneRepository),
  // scan svg in target directory
  TE.chain(findSvgs),
  // generated icons (src/*.tsx) in file system
  TE.chainFirst(generateIcons),
  // generated index.ts
  TE.chainFirst(generateEntrypoint),
  // generated src/index.ts when iconPath is nested
  TE.chainFirst(generateRootEntryPoint)
);
var build = (options) => {
  const { name, repository, iconPath, clonePath, sourcePath } = options;
  const metaIcon = metaIconDefault(name, repository, iconPath, clonePath, sourcePath);
  return (0, import_function.pipe)(
    // make `metaIcon` object to TaskEither
    TE.of(metaIcon),
    // main flow
    buildFlow,
    // when pass `snapshot` in options
    TE.chainFirst(generateSnapshot(options))
    // when pass `entryPoints` in options
    // it will be make entrypoints.ts for use in tsup.config
    // TE.chainFirst(generateExportEntrypoints(options)),
    // it will be update package.json
    // TE.chainFirst(updatePkgJson(options)),
  );
};

// src/init.ts
var init = (options) => {
  console.log({ options });
};

// src/clean.ts
var A2 = __toESM(require("fp-ts/Array"));
var E2 = __toESM(require("fp-ts/Either"));
var import_function2 = require("fp-ts/function");
var TE2 = __toESM(require("fp-ts/TaskEither"));
var fs2 = __toESM(require("fs/promises"));
var import_glob = __toESM(require("glob"));
var import_path = __toESM(require("path"));
var clean = (options) => (0, import_function2.pipe)(
  TE2.tryCatch(() => import_glob.default.glob(import_path.default.join(options.sourcePath, "**", "*.{ts,tsx}")), E2.toError),
  TE2.chainFirst(() => TE2.tryCatch(() => fs2.rmdir(options.clonePath, { recursive: true, maxRetries: 2 }), E2.toError)),
  TE2.chainFirst(() => TE2.tryCatch(() => fs2.rmdir(import_path.default.join("dist"), { recursive: true, maxRetries: 2 }), E2.toError)),
  TE2.chainFirst(
    (files) => (0, import_function2.pipe)(
      files,
      A2.map((file) => TE2.tryCatch(() => fs2.rm(file), E2.toError)),
      TE2.sequenceSeqArray
    )
  )
);

// src/prepack.ts
var fs3 = __toESM(require("fs/promises"));
var import_path2 = __toESM(require("path"));
var noOp = (a) => a;
var ifThen = (condition, whenTrue, whenFalse) => (a) => (condition ? whenTrue : whenFalse)(a);
var removeDevDependencies_ = ({ devDependencies: _, ...pkgJson }) => ({ ...pkgJson });
var addPeerDependencies_ = (peerDependencies) => (pkgJson) => ({
  ...pkgJson,
  peerDependencies
});
var addPkgScripts = (newScripts) => ({ scripts, ...pkgJson }) => ({
  ...pkgJson,
  scripts: {
    ...scripts,
    ...newScripts
  }
});
var mapDeps = (arr) => arr.reduce((acc, cur) => {
  const pkgVerRegex = (
    // eslint-disable-next-line prefer-named-capture-group
    /(^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*)@([~^]?([\dvx*]+(?:[-.](?:[\dx*]+|alpha|beta))*))?$/
  );
  const [, name, , version2] = pkgVerRegex.exec(cur) ?? [];
  if (!name)
    throw Error("Package Name invalid");
  if (!version2)
    throw Error("Package Version invalid");
  return { ...acc, [name]: version2.replace("@", "") };
}, {});
var mapScripts = (arr) => arr.reduce((acc, cur) => {
  const [name, version2] = cur.split("=");
  if (!name)
    throw Error("Package Name invalid");
  if (!version2)
    throw Error("Package Version invalid");
  return { ...acc, [name]: version2 };
}, {});
var prepack = ({ removeDevDeps = false, addPeerDeps = [], addScripts: addScripts_ = [] }) => {
  if (!removeDevDeps && addPeerDeps.length === 0 && addScripts_.length === 0)
    return;
  const pkgJsonPath = import_path2.default.resolve("./package.json");
  const removeDevDependencies = ifThen(removeDevDeps, removeDevDependencies_, noOp);
  const addPeerDependencies = ifThen(addPeerDeps.length > 0, addPeerDependencies_(mapDeps(addPeerDeps)), noOp);
  const addScripts = ifThen(addScripts_.length > 0, addPkgScripts(mapScripts(addScripts_)), noOp);
  const writePkgJson = (pkgJson) => fs3.writeFile(pkgJsonPath, pkgJson);
  return fs3.readFile(pkgJsonPath, { encoding: "utf8" }).then(JSON.parse).then(removeDevDependencies).then(addPeerDependencies).then(addScripts).then((pkgJson) => JSON.stringify(pkgJson, null, 2)).then(writePkgJson);
};

// index.bin.ts
var parseArgs = () => {
  try {
    const argv = process.argv.slice(2);
    const args = (0, import_arg.default)(
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
        "--add-peer-deps": String,
        // example --add-peer-deps "pkg@v1,pkg2@>=2"
        "--add-scripts": String,
        "--rd": "--remove-dev-deps",
        "--ap": "--add-peer-deps",
        "--ax": "--add-scripts"
      },
      { argv }
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
      "--version": version2,
      "--help": help2,
      "--remove-dev-deps": removeDevDeps,
      "--add-peer-deps": addPeerDeps,
      "--add-scripts": addScripts
    } = args;
    const clonePath = _clonePath ?? ".chakraIcons";
    const sourcePath = _sourcePath ?? "src";
    if (first === "prepack")
      return {
        type: "prepack",
        options: {
          removeDevDeps,
          addPeerDeps: addPeerDeps?.split(",") ?? [],
          addScripts: addScripts?.split(",") ?? []
        }
      };
    if (first === "init" && name && repository && iconPath)
      return { type: "init", options: { name, repository, iconPath } };
    if (name && repository && iconPath && clonePath && sourcePath) {
      const options = {
        name,
        repository,
        iconPath,
        clonePath,
        sourcePath,
        snapshot,
        entryPoints: Boolean(entryPoints)
      };
      if (first === "clean")
        return { type: "clean", options };
      return {
        type: "build",
        options
      };
    }
    if (version2)
      return { type: "version" };
    if (help2)
      return { type: "help" };
    return { type: "fail", error: Error("cannot parse any arguments :(") };
  } catch (e) {
    return { type: "fail", error: e };
  }
};
var help = () => process.stdout.write(`
USAGE: ${package_default.name} <SUBCOMMAND>

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
var version = () => console.log(package_default.version);
var fail = (e) => {
  console.log("something wrong :( ");
  console.error(String(e));
  process.exit(1);
};
var run = async (command) => {
  switch (command.type) {
    case "prepack":
      return prepack(command.options);
    case "build":
      return ruins.fromTaskEither(build(command.options)).catch((e) => fail(e));
    case "init":
      return init(command.options);
    case "clean":
      return ruins.fromTaskEither(clean(command.options)).then((files) => {
        console.log(`Clean ${files.length} files`);
      }).catch((e) => fail(e));
    case "fail":
      return fail(command.error);
    case "version":
      return version();
    default:
      return help();
  }
};
run(parseArgs()).then(() => process.exit(0)).catch((e) => console.error(e));
