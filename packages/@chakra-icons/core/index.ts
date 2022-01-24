import babelGenerator from "@babel/generator";
import * as t from "@babel/types";
import { pascalCase } from "change-case";
import { cli } from "create-chakra-icons";
import degit from "degit";
import * as E from "fp-ts/Either";
import { flow, pipe } from "fp-ts/function";
import * as S from "fp-ts/string";
import * as TE from "fp-ts/TaskEither";
import fs from "fs";
import * as _glob from "glob";
import * as path from "path";
import { promisify } from "util";

export type Source = {
  name: string;
  svg: string;
  code: string;
};

export type Sources = {
  entryPoint: string;
  entries: Source[];
};

export type MetaIcon = {
  name: string;
  repository: string;
  clonePath: string;
  iconPath: string;
  sources: Sources[];
  sourcePath: string;
};

export interface BuildOptions extends Omit<MetaIcon, "sources"> {
  snapshot: string | null;
}

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

const createEntryPoint = (str: string) => {
  const [, , , ...p] = str.split(path.sep);
  return [...p, "index.ts"];
};

const prefixWhenNumeric = (prefix: string) => (n: string) => /^\d.*$/.test(n) ? `${prefix}${n}` : n;

const moduleName = flow(prefixWhenNumeric("I"), pascalCase, S.replace(/[^A-Z0-9]/gi, ""));

const setSources = (metaIcon: MetaIcon, beSources: string[]): MetaIcon => {
  const createSource = (sources: Sources[], svg: string) => {
    const { dir, name: _name } = path.parse(svg);

    const name = moduleName(_name);

    const entryPoint = [metaIcon.sourcePath].concat(createEntryPoint(dir)).join(path.sep);

    const entry = { name, svg, code: path.join(path.parse(entryPoint).dir, `${name}.tsx`) };

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

const writeFile = TE.taskify(fs.writeFile);
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
  pipe(
    glob(path.join(metaIcon.clonePath, metaIcon.name, metaIcon.iconPath, "**", "*.svg")),
    TE.map((icons: string[]) => setSources(metaIcon, icons)),
  );

const createIcons = ({ n, i, o, ts }: { n: string; i: string; o: string; ts: boolean }) =>
  TE.tryCatch(async () => cli.main({ n, i, o, ts }), E.toError);

const generateSnapshot = (options: BuildOptions) =>
  flow((metaIcon: MetaIcon) =>
    options.snapshot ? writeFile(options.snapshot, JSON.stringify(metaIcon)) : TE.of(metaIcon),
  );

const generateIcons = (metaIcon: MetaIcon) =>
  pipe(
    metaIcon.sources.flatMap((source) =>
      source.entries.map(({ name: n, svg: i, code: o }) => createIcons({ n, i, o, ts: true })),
    ),
    TE.sequenceArray,
    TE.map((_) => metaIcon),
  );

const generateExportAllCode = (entry: Source): string =>
  babelGenerator(t.exportAllDeclaration(t.stringLiteral(`./${entry.name}`))).code;

const generateEntrypointCode = (s: Sources) => s.entries.map((source) => generateExportAllCode(source)).join("\r\n");

const generateEntrypoint = (metaIcon: MetaIcon) =>
  pipe(
    metaIcon.sources.map((a) => writeFile(a.entryPoint, generateEntrypointCode(a))),
    // same with Promise.all
    TE.sequenceArray,
    TE.map((_) => metaIcon),
  );

export const buildFlow = flow(
  // make MetaIcon and cloneRepository
  TE.chain(cloneRepository),
  // scan svg in target directory
  TE.chain(findSvgs),
  // generated icons (src/*.tsx) in file system
  TE.chain(generateIcons),
  // generated index.ts
  TE.chain(generateEntrypoint),
);

export const build = (options: BuildOptions) => {
  const { name, repository, iconPath, clonePath, sourcePath } = options;
  return pipe(
    TE.of(metaIconDefault(name, repository, iconPath, clonePath, sourcePath)),
    buildFlow,
    TE.chain(generateSnapshot(options)),
    TE.getOrElse((e) => {
      console.error(String(e));
      process.exit(1);
    }),
  )();
};
