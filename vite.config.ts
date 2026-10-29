/// <reference types="vitest/config" />
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite";

const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "src");

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routeFileIgnorePattern: "\\.test\\.(ts|tsx)$",
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": srcDir,
    },
  },
  test: {
    silent: true,
    setupFiles: ["./src/test-setup.ts"],
    browser: {
      enabled: true,
      provider: "playwright",
      headless: true,
      name: "chromium",
    },
    coverage: {
      exclude: ["src/components/ui/**", "src/routeTree.gen.ts", "src/routes/**"],
    },
  },
});
