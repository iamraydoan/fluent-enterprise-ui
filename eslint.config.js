import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import importX from "eslint-plugin-import-x";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

const fluentBan = {
  paths: [
    {
      name: "@fluentui/react-components",
      message: "Import UI only from @/components/ui (theme from @/theme).",
    },
    { name: "@fluentui/react-icons", message: "Import icons only from @/components/ui." },
  ],
  patterns: [
    { group: ["@fluentui/*"], message: "Import Fluent only through @/components/ui." },
    {
      group: ["@/components/ui/*"],
      message: "Import UI only from the barrel @/components/ui, not a ui subfile.",
    },
    {
      group: [
        "./components/ui/*",
        "../components/ui/*",
        "../../components/ui/*",
        "../../../components/ui/*",
        "../../../../components/ui/*",
        "**/components/ui/*",
      ],
      message: "Import UI only from the barrel @/components/ui, not a ui subfile.",
    },
  ],
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
          patterns: [
            {
              group: ["@/components/ui/*"],
              message: "Import UI only from the barrel @/components/ui, not a ui subfile.",
            },
            {
              group: [
                "./components/ui/*",
                "../components/ui/*",
                "../../components/ui/*",
                "../../../components/ui/*",
                "../../../../components/ui/*",
                "**/components/ui/*",
              ],
              message: "Import UI only from the barrel @/components/ui, not a ui subfile.",
            },
            {
              group: ["./*", "../*"],
              message: "Core code must import internal modules via @/ alias, not relative paths.",
            },
          ],
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
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/vite-env.d.ts"],
    plugins: { local: noCommentsPlugin },
    rules: { "local/no-comments": "error" },
  },
  prettierConfig,
);
