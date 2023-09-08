import * as fs from "fs/promises";
import { glob } from "glob";
import * as path from "path";

import type { MetaIcon } from "../src/types";

const generateSnapshot = async () => {
  const snapshotPaths = await glob("./node_modules/@chakra-icons/*/snapshot.json");

  const snapshots = await Promise.all(
    snapshotPaths.map(async (snapshotPath) => {
      const content = await fs.readFile(snapshotPath, { encoding: "utf8" });
      return JSON.parse(content) as MetaIcon;
    }),
  );

  const dest = path.resolve("./src/snapshots.json");
  await fs.writeFile(dest, JSON.stringify(snapshots), { encoding: "utf-8" });
};

void generateSnapshot();
