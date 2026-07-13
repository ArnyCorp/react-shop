import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shell",
      remotes: {
        catalog: "http://localhost:5001/assets/remoteEntry.js",
        cart: "http://localhost:5002/assets/remoteEntry.js",
      },
      shared: ["react", "react-dom", "react-router-dom", "zustand", "@mui/material"],
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
