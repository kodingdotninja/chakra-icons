import { ApiIcon, MetaIcon, ResponseIcon, Source, Sources } from "../../types";

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

  return ({ limit, q, qCreator }: { limit?: number; q?: string; qCreator?: string }): [ApiIcon[], number, string[]] => {
    const icons = metaIcons.flatMap((metaIcon) =>
      metaIcon.sources.flatMap((source: Sources) =>
        source.entries.flatMap((icon: Source) => ({
          name: icon.name,
          creator: metaIcon.name,
          repository: metaIcon.repository,
          code: `import { ${icon.name} } from '@chakra-icons/${metaIcon.name}'`,
        })),
      ),
    );

    const filter = (_q?: string, _qCreator?: string) => (i: ApiIcon) =>
      (_q ? _q.split(" ").some((a) => fz(a.toLowerCase(), i.name.toLowerCase())) : true) &&
      (_qCreator ? _qCreator.split(" ").some((a) => fz(a, i.creator)) : true);

    return [
      icons
        .filter(filter(q, qCreator))
        .sort((a: ApiIcon, b: ApiIcon) => a.name.length - b.name.length)
        .slice(0, limit),
      icons.length,
      icons.map((item: ApiIcon) => item.creator).filter((value, index, self) => self.indexOf(value) === index),
    ];
  };
};

export const getData = async (q: string, qCreator: string, limit: number = 50) => {
  const icons = await getIcons();
  const [data, total, creators] = icons({ limit, q, qCreator });
  const response: ResponseIcon = {
    data,
    per: data.length,
    total,
    creators,
  };

  return response;
};
const toInt = (a: any): number => a | 0; // eslint-disable-line no-bitwise, @typescript-eslint/no-explicit-any

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q, qCreator, limit } = req.query;

  if (!Array.isArray(q) && !Array.isArray(limit) && !Array.isArray(qCreator)) {
    const _limit = toInt(limit);
    const data = await getData(q, qCreator, _limit > 0 ? _limit : 50);
    if (req.method?.toLowerCase() === "get") {
      res.status(200).json(data);
    }
  }
}
