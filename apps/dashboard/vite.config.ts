import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "dashboard",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx",
      },
      shared: [
        "react",
        "react-dom",
        "react-router-dom",
        "zustand",
        "@mui/material",
        "@react-shop/auth",
        "@react-shop/shared",
      ],
    }),
  ],
  server: {
    port: 5004,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 5004,
    strictPort: true,
    cors: true,
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
