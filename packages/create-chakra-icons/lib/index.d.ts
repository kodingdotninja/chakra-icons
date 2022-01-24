type Args = {
  n?: string;
  name?: string;
  i?: string,
  input?: string;
  o?: string;
  output?: string;
  ts?: boolean;
  typescript?: boolean;
}

type BaseFunctionType<T1, T2> = (a: T1, b: T2) => void;

type Main<T = void> = BaseFunctionType<Args, T>


declare module "create-chakra-icons" {
  namespace cli {
    export const main: Main
  }
}
