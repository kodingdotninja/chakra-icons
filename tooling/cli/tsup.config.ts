import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: "src/index.ts",
  entry: ["index.bin.ts", "src/index.ts"],
  format: ["cjs", "esm"],
});
