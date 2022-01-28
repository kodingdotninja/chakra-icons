import { defineConfig } from "tsup";

export default defineConfig({
  dts: "src/index.ts",
  clean: true,
  entryPoints: ["index.bin.ts", "src/index.ts"],
  format: ["cjs", "esm"],
});
