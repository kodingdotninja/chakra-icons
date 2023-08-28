export interface Option {
  n?: string | undefined;
  name?: string | undefined;
  i?: string | undefined;
  input?: string | undefined;
  o?: string | undefined;
  output?: string | undefined;
  ts?: boolean | undefined;
  typescript?: boolean | undefined;
  useFilename?: boolean | undefined;
  appendFile?: boolean | undefined;
  ignoreImport?: boolean | undefined;
  T?: string | undefined;
}

declare const cli: {
  main: (option: Option) => void;
  pipeline: (option: Option) => void;
};
