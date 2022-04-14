import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  inject: ["../../../react-import.js"],
  entryPoints: ["src/index.ts"],
  format: ["cjs", "esm"],
  external: ["react", "@chakra-ui/react", "react/jsx-runtime"],
});
