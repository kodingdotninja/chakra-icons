import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  external: ["react", "@chakra-ui/icon"],
  format: ["cjs", "esm"],
  treeshake: true,
});
