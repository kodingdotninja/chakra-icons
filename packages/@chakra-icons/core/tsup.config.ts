import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entryPoints: ["index.ts"],
  format: ["esm", "cjs"],
  splitting: true,
});
