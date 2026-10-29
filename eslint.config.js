import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import prettierConfig from "eslint-config-prettier";
import importX from "eslint-plugin-import-x";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import boundaries from "eslint-plugin-boundaries";

const fluentBan = {
  paths: [
    {
      name: "@fluentui/react-components",
      message: "Import UI only from @/components/ui (theme from @/theme).",
    },
    { name: "@fluentui/react-icons", message: "Import icons only from @/components/ui." },
  ],
  patterns: [{ group: ["@fluentui/*"], message: "Import Fluent only through @/components/ui." }],
};

const coreBan = {
  patterns: [
    {
      group: ["./*", "../*"],
      message: "Core code must import internal modules via @/ alias, not relative paths.",
    },
  ],
};

const noCommentsPlugin = {
  rules: {
    "no-comments": {
      meta: { type: "suggestion", docs: { description: "Disallow all comments." } },
      create(context) {
        return {
          "Program:exit"() {
            for (const comment of context.sourceCode.getAllComments()) {
              context.report({
                loc: comment.loc,
                message: "Comments are not allowed. Make the code self-explanatory.",
              });
            }
          },
        };
      },
    },
  },
};

export default tseslint.config(
  { ignores: ["dist", "node_modules", "pnpm-lock.yaml"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginQuery.configs["flat/recommended"],
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "import-x": importX,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-ignore": true, "ts-nocheck": true, "ts-expect-error": true },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "react-refresh/only-export-components": "error",
      "no-console": "error",
      "no-debugger": "error",
      "no-alert": "error",
      "no-eval": "error",
      "import-x/no-duplicates": "error",
      "import-x/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [{ pattern: "@/**", group: "internal", position: "before" }],
          alphabetize: { order: "asc" },
          "newlines-between": "never",
        },
      ],
      "no-restricted-imports": ["error", fluentBan],
    },
    linterOptions: { reportUnusedDisableDirectives: "error" },
  },
  // Core-only: alias-only imports, plus the Fluent ban for core files.
  {
    files: [
      "src/components/**/*.{ts,tsx}",
      "src/layouts/**/*.{ts,tsx}",
      "src/routes/**/*.{ts,tsx}",
      "src/stores/**/*.{ts,tsx}",
      "src/lib/**/*.{ts,tsx}",
      "src/theme/**/*.ts",
      "src/styles/**/*.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: fluentBan.paths,
          patterns: [...fluentBan.patterns, ...coreBan.patterns],
        },
      ],
    },
  },
  // Wrapper layer + theme: the only places allowed to import Fluent directly.
  // They still may not use relative imports or ui subfiles (index.ts is next).
  {
    files: ["src/components/ui/**/*.{ts,tsx}", "src/theme/**/*.ts"],
    ignores: ["src/components/ui/index.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [...coreBan.patterns],
        },
      ],
    },
  },
  // Barrel exception: ui/index.ts re-exports its own folder via relative paths.
  // It still may not import Fluent directly or a ui subfile by alias.
  {
    files: ["src/components/ui/index.ts"],
    rules: { "no-restricted-imports": ["error", fluentBan] },
  },
  // Barrel exception: common/index.ts re-exports its own folder via relative paths.
  // It still may not import Fluent directly or a common subfile by alias.
  {
    files: ["src/components/common/index.ts"],
    rules: { "no-restricted-imports": ["error", fluentBan] },
  },
  // Architecture boundaries: layer direction + ui entry-point.
  // Ui may only be imported via its barrel by non-ui elements; ui itself
  // may import its own files (index.ts re-exports them). External packages
  // (react, etc.) are allowed for all elements; Fluent itself is still
  // gated by no-restricted-imports above, not by boundaries.
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "import/resolver": {
        typescript: { project: "./tsconfig.json" },
      },
      "boundaries/elements": [
        { type: "ui", pattern: "src/components/ui/**" },
        { type: "common", pattern: "src/components/common/**" },
        { type: "layout", pattern: "src/layouts/**" },
        { type: "feature", pattern: "src/features/*/**", capture: ["feature"] },
        { type: "routes", pattern: "src/routes/**" },
        { type: "stores", pattern: "src/stores/**" },
        { type: "shared", pattern: "src/data/**" },
        { type: "shared", pattern: "src/styles/**" },
        { type: "shared", pattern: "src/theme/**" },
        { type: "shared", pattern: "src/lib/**" },
        { type: "app", pattern: "src/main.tsx", mode: "file" },
        { type: "routetree", pattern: "src/routeTree.gen.ts", mode: "file" },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: [
            { allow: { to: { module: { origin: "external" } } } },
            { from: { element: { type: "ui" } }, allow: { to: { element: { type: "ui" } } } },
            {
              from: { element: { type: "common" } },
              allow: { to: { element: { type: "common" } } },
            },
            {
              from: { element: { type: "layout" } },
              allow: { to: { element: { type: "layout" } } },
            },
            {
              from: { element: { type: "shared" } },
              allow: { to: { element: { type: "shared" } } },
            },
            { from: { element: { type: "app" } }, allow: { to: { element: { type: "app" } } } },
            {
              from: { element: { type: "feature" } },
              allow: {
                to: {
                  element: {
                    type: "feature",
                    captured: { feature: "{{from.element.captured.feature}}" },
                  },
                },
              },
            },
            {
              from: { element: { type: "common" } },
              allow: { to: { element: { type: "ui", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "layout" } },
              allow: { to: { element: { type: "ui", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "feature" } },
              allow: { to: { element: { type: "ui", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "shared" } },
              allow: { to: { element: { type: "ui", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "app" } },
              allow: { to: { element: { type: "ui", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "common" } },
              allow: { to: { element: { type: "shared" } } },
            },
            {
              from: { element: { type: "layout" } },
              allow: { to: { element: { type: "feature" } } },
            },
            {
              from: { element: { type: "layout" } },
              allow: { to: { element: { type: "common", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "layout" } },
              allow: { to: { element: { type: "shared" } } },
            },
            {
              from: { element: { type: "feature" } },
              allow: { to: { element: { type: "common", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "feature" } },
              allow: { to: { element: { type: "shared" } } },
            },
            { from: { element: { type: "app" } }, allow: { to: { element: { type: "layout" } } } },
            { from: { element: { type: "app" } }, allow: { to: { element: { type: "feature" } } } },
            {
              from: { element: { type: "app" } },
              allow: { to: { element: { type: "common", fileInternalPath: "index.ts" } } },
            },
            { from: { element: { type: "app" } }, allow: { to: { element: { type: "shared" } } } },
            { from: { element: { type: "app" } }, allow: { to: { element: { type: "routes" } } } },
            {
              from: { element: { type: "app" } },
              allow: { to: { element: { type: "routetree" } } },
            },
            {
              from: { element: { type: "routes" } },
              allow: { to: { element: { type: "routetree" } } },
            },
            {
              from: { element: { type: "stores" } },
              allow: { to: { element: { type: "stores" } } },
            },
            {
              from: { element: { type: "stores" } },
              allow: { to: { element: { type: "shared" } } },
            },
            {
              from: { element: { type: "routes" } },
              allow: { to: { element: { type: "feature" } } },
            },
            {
              from: { element: { type: "routes" } },
              allow: { to: { element: { type: "layout" } } },
            },
            {
              from: { element: { type: "routes" } },
              allow: { to: { element: { type: "shared" } } },
            },
            {
              from: { element: { type: "routes" } },
              allow: { to: { element: { type: "stores" } } },
            },
            {
              from: { element: { type: "routes" } },
              allow: { to: { element: { type: "ui", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "layout" } },
              allow: { to: { element: { type: "stores" } } },
            },
            {
              from: { element: { type: "feature" } },
              allow: { to: { element: { type: "stores" } } },
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/vite-env.d.ts"],
    plugins: { local: noCommentsPlugin },
    rules: { "local/no-comments": "error" },
  },
  prettierConfig,
);
