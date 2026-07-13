import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

const sharedSingletons = {
  react: { singleton: true },
  "react-dom": { singleton: true },
  "react-router-dom": { singleton: true },
  zustand: { singleton: true },
  "@mui/material": { singleton: true },
  "@react-shop/auth": { singleton: true, version: "0.0.1" },
  "@react-shop/shared": { singleton: true, version: "0.0.1" },
  "@react-shop/ui": { singleton: true, version: "0.0.1" },
} as const;

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shell",
      remotes: {
        catalog: "http://localhost:5001/assets/remoteEntry.js",
        cart: "http://localhost:5002/assets/remoteEntry.js",
        user: "http://localhost:5003/assets/remoteEntry.js",
        dashboard: "http://localhost:5004/assets/remoteEntry.js",
      },
      shared: sharedSingletons as unknown as string[],
    }),
  ],
  server: {
    port: 5000,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 5000,
    strictPort: true,
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
