import { defineConfig } from "vite";

export default defineConfig({
  base: "/untappd-to-apple-health-importer/",
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
