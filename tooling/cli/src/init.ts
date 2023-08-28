import type { MetaIcon } from "./types";

export type InitOptions = Omit<MetaIcon, "sources" | "sourcePath" | "clonePath">;

export const init = (options: InitOptions) => {
  console.log({ options });
};
