import type { MetaIcon, Source, Sources } from "@chakra-icons/cli";

// API
export interface Response<Data> {
  data: Data;
  per: number;
  total: number;
  creators: string[];
}

export type ApiIcon = Omit<MetaIcon, "iconPath" | "sources" | "clonePath" | "sourcePath"> & {
  creator: string;
  code: string;
};

export type ResponseIcon = Response<ApiIcon[]>;

export type { MetaIcon, Source, Sources };
