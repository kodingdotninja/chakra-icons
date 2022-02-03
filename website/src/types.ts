import { MetaIcon, Source, Sources } from "@chakra-icons/cli";

// API
export type Response<Data> = {
  data: Data;
  per: number;
  total: number;
};

export type ApiIcon = Omit<MetaIcon, "iconPath" | "sources" | "clonePath" | "sourcePath"> & {
  creator: string;
  code: string;
};

export type ResponseIcon = Response<ApiIcon[]>;

export type { MetaIcon, Source, Sources };
