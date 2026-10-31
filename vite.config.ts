/// <reference types="vitest/config" />
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { playwright } from "@vitest/browser-playwright";
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
    projects: [
      {
        // Fast unit tests: pure logic, no DOM, no browser. Run on every push.
        test: {
          name: "unit",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        // Component + E2E tests: need a real browser (Fluent UI, router, MSW).
        test: {
          name: "browser",
          include: ["src/**/*.browser.test.tsx"],
          setupFiles: ["./src/test-setup.ts"],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
    coverage: {
      exclude: ["src/components/ui/**", "src/routeTree.gen.ts", "src/routes/**"],
    },
  },
});
