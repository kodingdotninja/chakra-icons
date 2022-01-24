import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  entryPoints: ["index.ts"],
  format: ["cjs", "esm"],
});
