import { MetaIcon, Sources } from "./types";

import babelGenerator from "@babel/generator";
import * as t from "@babel/types";
import { pascalCase } from "change-case";
import { cli, Option } from "create-chakra-icons";
import degit from "degit";
import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import { flow, pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as S from "fp-ts/string";
import * as TE from "fp-ts/TaskEither";
import * as fs from "fs/promises";
import * as _glob from "glob";
import * as path from "path";
import { promisify } from "util";

export type BuildOptions = Omit<MetaIcon, "sources"> & {
  snapshot?: string;
  entryPoints: boolean;
};

const metaIconDefault = (
  name: MetaIcon["name"],
  repository: MetaIcon["repository"],
  iconPath: MetaIcon["iconPath"],
  clonePath: MetaIcon["clonePath"],
  sourcePath: MetaIcon["sourcePath"],
): MetaIcon => ({
  name,
  repository,
  iconPath,
  clonePath,
  sourcePath,
  sources: [],
});

const prefixWhenNumeric = (prefix: string) => (n: string) => /^\d.*$/.test(n) ? `${prefix}${n}` : n;

const moduleName = flow(prefixWhenNumeric("I"), pascalCase, S.replace(/[^A-Z0-9]/gi, ""));

const setSources =
  (metaIcon: MetaIcon) =>
    (beSources: string[]): MetaIcon => {
      const createSource = (sources: Sources[], svg: string) => {
        const { dir, name: _name } = path.parse(svg);

        const name = moduleName(_name);

        const entryPoint = path.join(
          dir.replace(path.join(metaIcon.clonePath, metaIcon.iconPath), metaIcon.sourcePath),
          "index.ts",
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
        sources: beSources.reduce((a, b) => createSource(a, b), metaIcon.sources),
      };
    };

const writeFile = (file: string, data: string) =>
  TE.tryCatch(() => fs.mkdir(path.dirname(file), { recursive: true }).then(() => fs.writeFile(file, data)), E.toError);

/**
const readFile = (file: string, options: BaseEncodingOptions) =>
  TE.tryCatch(() => fs.readFile(file, options), E.toError);
  */

const glob = (target: string) => TE.tryCatch(() => promisify(_glob.default)(target), E.toError);

const cloneRepository = (metaIcon: MetaIcon) =>
  TE.tryCatch(
    () =>
      degit(metaIcon.repository, { force: true })
        .clone(metaIcon.clonePath)
        .then(() => metaIcon),
    E.toError,
  );

const findSvgs = (metaIcon: MetaIcon) =>
  pipe(path.join(metaIcon.clonePath, metaIcon.iconPath, "**", "*.svg"), glob, TE.map(setSources(metaIcon)));

const createIcons = (options: Option) => TE.tryCatch(async () => cli.main(options), E.toError);

const generateIcons = (metaIcon: MetaIcon) =>
  pipe(
    metaIcon.sources,
    A.map(({ entries }) =>
      pipe(
        entries,
        A.map(({ name: n, svg: i, code: o }) => createIcons({ n, i, o, ts: true })),
      ),
    ),
    A.flatten,
    TE.sequenceArray,
  );

const generateExportAllCode = (name: string): string =>
  pipe(`./${name}`, t.stringLiteral, t.exportAllDeclaration, babelGenerator, (b) => b.code);

const genrateExportAllNamespace = (alias: string, source: string): string =>
  babelGenerator(
    t.exportNamedDeclaration(null, [pipe(alias, t.identifier, t.exportNamespaceSpecifier)], t.stringLiteral(source)),
  ).code;

const generateEntrypointCode = (source: Sources) =>
  pipe(
    source.entries,
    A.map((s) => generateExportAllCode(s.name)),
    (arr) => arr.join("\r\n"),
  );

const generateEntrypoint = (metaIcon: MetaIcon) =>
  pipe(
    metaIcon.sources,
    A.map((a) => writeFile(a.entryPoint, generateEntrypointCode(a))),
    TE.sequenceArray,
  );

const generateSnapshot = (options: BuildOptions) => (metaIcon: MetaIcon) =>
  pipe(
    options.snapshot,
    O.fromNullable,
    O.fold(
      () => TE.of(metaIcon),
      (file) =>
        pipe(
          TE.of(metaIcon),
          TE.chainFirst((_metaIcon) => writeFile(file, JSON.stringify(_metaIcon, null, 2))),
        ),
    ),
  );

/**
const constDeclarator = (...declarators: t.VariableDeclarator[]) => t.variableDeclaration("const", declarators);

const pkgJsonExportField = (entryPoint: string): string[] => {
  if (path.dirname(entryPoint) === "src" && path.basename(entryPoint).startsWith("index")) return [".", "./dist"];

  return [path.dirname(entryPoint).replace("src/", "./"), path.dirname(entryPoint).replace("src/", "./dist/")];
};

const updatePkgJson = (options: BuildOptions) => (metaIcon: MetaIcon) =>
  pipe(
    options.entryPoints,
    B.fold(
      () => TE.of(metaIcon),
      () =>
        pipe(
          TE.of(metaIcon),
          TE.chainFirst((_metaIcon) =>
            pipe(
              readFile("./package.json", { encoding: "utf8" }),
              TE.chainFirst((pkgJson) =>
                pipe(
                  _metaIcon.sources,
                  A.map((source) => source.entryPoint),
                  A.map(pkgJsonExportField),
                  Object.fromEntries,
                  (exports) => Object.assign(JSON.parse(typeof pkgJson === "string" ? pkgJson : ""), { exports }),
                  (json) => JSON.stringify(json, null, 2),
                  (data) => writeFile("./package.json", data),
                ),
              ),
            ),
          ),
        ),
    ),
  );
const generateExportEntrypoints = (options: BuildOptions) => (metaIcon: MetaIcon) =>
  pipe(
    options.entryPoints,
    B.fold(
      () => TE.of(metaIcon),
      () =>
        pipe(
          TE.of(metaIcon),
          TE.chainFirst((_metaIcon) =>
            pipe(
              metaIcon.sources,
              A.map((sources) => sources.entryPoint),
              A.map(t.stringLiteral),
              t.arrayExpression,
              (arrayExpression) => t.variableDeclarator(t.identifier("entryPoints"), arrayExpression),
              constDeclarator,
              t.exportNamedDeclaration,
              babelGenerator,
              ({ code }) => writeFile("./entryPoints.ts", code),
            ),
          ),
        ),
    ),
  );
*/
/**
 * In some case of clone the icons from the project
 * icons directory have a nested directory
 * this function for making root entry point when have
 * a nested directory and nothing `src/index.tsx` in
 * sources field.
 */
const generateRootEntryPoint = (metaIcon: MetaIcon) =>
  pipe(
    metaIcon.sources,
    A.findFirst((source) => S.Eq.equals(source.entryPoint, path.join(metaIcon.sourcePath, "index.ts"))),
    O.fold(
      () => [
        writeFile(
          path.join(metaIcon.sourcePath, "index.ts"),
          pipe(
            metaIcon.sources,
            A.map((source) => pipe(source.entryPoint, path.dirname, path.basename)),
            A.map((source) => genrateExportAllNamespace(source, "./".concat(source))),
            (arrs) => arrs.join("\r\n"),
          ),
        ),
      ],
      () => [],
    ),
    TE.sequenceArray,
  );

export const buildFlow = flow(
  // make MetaIcon and cloneRepository
  TE.chain(cloneRepository),
  // scan svg in target directory
  TE.chain(findSvgs),
  // generated icons (src/*.tsx) in file system
  TE.chainFirst(generateIcons),
  // generated index.ts
  TE.chainFirst(generateEntrypoint),
  // generated src/index.ts when iconPath is nested
  TE.chainFirst(generateRootEntryPoint),
);

export const build = (options: BuildOptions) => {
  const { name, repository, iconPath, clonePath, sourcePath } = options;
  const metaIcon = metaIconDefault(name, repository, iconPath, clonePath, sourcePath);
  return pipe(
    // make `metaIcon` object to TaskEither
    TE.of(metaIcon),
    // main flow
    buildFlow,
    // when pass `snapshot` in options
    TE.chainFirst(generateSnapshot(options)),
    // when pass `entryPoints` in options
    // it will be make entrypoints.ts for use in tsup.config
    // TE.chainFirst(generateExportEntrypoints(options)),
    // it will be update package.json
    // TE.chainFirst(updatePkgJson(options)),
  );
};
