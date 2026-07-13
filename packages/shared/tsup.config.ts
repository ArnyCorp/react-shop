import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    schemas: "src/schemas.ts",
    constants: "src/constants.ts",
    "cart-store": "src/cart-store.ts",
    rbac: "src/rbac.ts",
    "auth-schemas": "src/auth-schemas.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "zustand", "zod"],
});
