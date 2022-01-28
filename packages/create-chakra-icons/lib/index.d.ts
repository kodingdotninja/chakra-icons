export type Option = {
  n?: string | undefined;
  name?: string | undefined;
  i?: string | undefined;
  input?: string | undefined;
  o?: string | undefined;
  output?: string | undefined;
  ts?: boolean | undefined;
  typescript?: boolean | undefined;
}

declare module "create-chakra-icons" {
  namespace cli {
    export function main(option: Option): void;
  }
}
