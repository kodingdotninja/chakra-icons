import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as fs from "fs/promises";
import _glob from "glob";
import path from "path";

import type { BuildOptions } from "./types";

export const clean = (options: BuildOptions) =>
  pipe(
    TE.tryCatch(() => _glob.glob(path.join(options.sourcePath, "**", "*.{ts,tsx}")), E.toError),
    TE.chainFirst(() => TE.tryCatch(() => fs.rmdir(options.clonePath, { recursive: true, maxRetries: 2 }), E.toError)),
    TE.chainFirst(() => TE.tryCatch(() => fs.rmdir(path.join("dist"), { recursive: true, maxRetries: 2 }), E.toError)),
    TE.chainFirst((files) =>
      pipe(
        files,
        A.map((file) => TE.tryCatch(() => fs.rm(file), E.toError)),
        TE.sequenceSeqArray,
      ),
    ),
  );
