/* eslint-disable @typescript-eslint/no-unsafe-return */

import * as fs from "fs/promises";
import path from "path";

import type { PrepackOptions } from "./types";

const noOp = <T = unknown>(a: T) => a;
const ifThen =
  <A, B>(condition: boolean, whenTrue: (a: A) => B, whenFalse: (a: A) => B) =>
  (a: A) =>
    (condition ? whenTrue : whenFalse)(a);

type Json<T> = Record<string, string | number | boolean | string[] | Record<string, T>>;
// @ts-expect-error - ignore
type IPkgJson = Json<IPkgJson>;

const removeDevDependencies_ = ({ devDependencies: _, ...pkgJson }: IPkgJson) => ({ ...pkgJson });
const addPeerDependencies_ = (peerDependencies: Record<string, string>) => (pkgJson: IPkgJson) => ({
  ...pkgJson,
  peerDependencies,
});

const addPkgScripts =
  (newScripts: Record<string, string>) =>
  ({ scripts, ...pkgJson }: IPkgJson) => ({
    ...pkgJson,
    scripts: {
      ...scripts,
      ...newScripts,
    },
  });

const mapDeps = (arr: string[]) =>
  arr.reduce((acc, cur) => {
    const pkgVerRegex =
      // eslint-disable-next-line prefer-named-capture-group
      /(^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*)@([~^]?([\dvx*]+(?:[-.](?:[\dx*]+|alpha|beta))*))?$/;
    const [, name, , version] = pkgVerRegex.exec(cur) ?? [];
    if (!name) throw Error("Package Name invalid");
    if (!version) throw Error("Package Version invalid");
    return { ...acc, [name]: version.replace("@", "") };
  }, {});

const mapScripts = (arr: string[]) =>
  arr.reduce((acc, cur) => {
    const [name, version] = cur.split("=");
    if (!name) throw Error("Package Name invalid");
    if (!version) throw Error("Package Version invalid");
    return { ...acc, [name]: version };
  }, {});

/**
 * This function for change package.json content
 * like devDependencies, add some peerDependencies,
 * & etc related for publishing any packages
 *
 * example in package.json of @chakra-icons/bootstrap
 * you want to add some script, so just run this command
 * on @chakra-icons/bootstrap directory
 *
 * $ yarn chakra-icons prepack --ax "prepack=chakra-icons prepack --rd"
 * prepack key at script is a hook and chakra-icons prepack flag --rd is
 * remove devDependencies field in package.json.
 *
 * finally, every publish it will be pack without field devDependencies
 */
export const prepack = ({ removeDevDeps = false, addPeerDeps = [], addScripts: addScripts_ = [] }: PrepackOptions) => {
  if (!removeDevDeps && addPeerDeps.length === 0 && addScripts_.length === 0) return; // do nothing
  const pkgJsonPath = path.resolve("./package.json");
  const removeDevDependencies = ifThen(removeDevDeps, removeDevDependencies_, noOp);
  const addPeerDependencies = ifThen(addPeerDeps.length > 0, addPeerDependencies_(mapDeps(addPeerDeps)), noOp);
  const addScripts = ifThen(addScripts_.length > 0, addPkgScripts(mapScripts(addScripts_)), noOp);
  const writePkgJson = (pkgJson: string) => fs.writeFile(pkgJsonPath, pkgJson);

  return fs
    .readFile(pkgJsonPath, { encoding: "utf8" })
    .then(JSON.parse)
    .then(removeDevDependencies)
    .then(addPeerDependencies)
    .then(addScripts)
    .then((pkgJson) => JSON.stringify(pkgJson, null, 2))
    .then(writePkgJson);
};

/* eslint-enable @typescript-eslint/no-unsafe-return */
