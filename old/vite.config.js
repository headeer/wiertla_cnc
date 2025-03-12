import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "/",
  build: {
    outDir: path.resolve(__dirname, "../wp-content/themes/your-theme/assets"), // WordPress theme assets folder
    emptyOutDir: true, // Clean output directory on each build
    manifest: true, // Generate manifest.json
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "main.js"), // Your entry point
      },
    },
  },
  server: {
    proxy: {
      "/wp-json": "http://your-local-wordpress-url", // Proxy WordPress requests
    },
  },
});
