import { ApiIcon, MetaIcon, ResponseIcon } from "../../types";

import fs from "fs/promises";
import fz from "fuzzysearch";
import { glob } from "glob";
import { NextApiRequest, NextApiResponse } from "next";
import { promisify } from "util";

const getIcons = async () => {
  const snapshots: Promise<string>[] = await promisify(glob)("../packages/@chakra-icons/**/snapshot.json").then(
    (maybeSnapshots) => maybeSnapshots.map((snapshotPath) => fs.readFile(snapshotPath, { encoding: "utf8" })),
  );
  const metaIcons: MetaIcon[] = await Promise.all([...snapshots]).then((all) => all.map((j) => JSON.parse(j)));

  return ({ limit, q }: { limit?: number; q?: string }): [ApiIcon[], number] => {
    const icons: ApiIcon[] = metaIcons.flatMap((metaIcon) =>
      metaIcon.sources.flatMap((source) =>
        source.entries.flatMap((icon) => ({
          name: icon.name,
          creator: metaIcon.name,
          repository: metaIcon.repository,
          code: `import { ${icon.name} } from '@chakra-icons/${metaIcon.name}'`,
        })),
      ),
    );

    const filter = (_q?: string) => (i: ApiIcon) => _q ? _q.split(" ").some((a) => fz(a, i.name)) : true;

    return [
      icons
        .filter(filter(q))
        .sort((a, b) => a.name.length - b.name.length)
        .slice(0, limit),
      icons.length,
    ];
  };
};

export const getData = async (q: string, limit: number = 50) => {
  const icons = await getIcons();
  const [data, total] = icons({ limit, q });

  const response: ResponseIcon = {
    data,
    per: data.length,
    total,
  };

  return response;
};
/*eslint no-bitwise: ["error", { "int32Hint": true }] */
const toInt = (a: any): number => a | 0;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q, limit } = req.query;

  if (!Array.isArray(q) && !Array.isArray(limit)) {
    const _limit = toInt(limit);
    const data = await getData(q, _limit > 0 ? _limit : 50);
    if (req.method?.toLowerCase() === "get") {
      res.status(200).json(data);
    }
  }
}
