export type Source = {
  readonly name: string;
  readonly svg: string;
  readonly code: string;
};

export type Sources = {
  readonly entryPoint: string;
  readonly entries: Source[];
};

export type MetaIcon = {
  name: string;
  repository: string;
  clonePath: string;
  iconPath: string;
  sources: Sources[];
  sourcePath: string;
};
