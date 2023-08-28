export interface Source {
  readonly name: string;
  readonly svg: string;
  readonly code: string;
}

export interface Sources {
  readonly entryPoint: string;
  readonly entries: Source[];
}

export interface MetaIcon {
  name: string;
  repository: string;
  clonePath: string;
  iconPath: string;
  sources: Sources[];
  sourcePath: string;
}

export type BuildOptions = Omit<MetaIcon, "sources"> & {
  snapshot?: string;
  entryPoints: boolean;
};

export interface PrepackOptions {
  removeDevDeps?: boolean;
  addPeerDeps: string[];
  addScripts: string[];
}
