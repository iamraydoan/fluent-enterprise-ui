import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import prettierConfig from "eslint-config-prettier";
import importX from "eslint-plugin-import-x";
import i18nextPlugin from "eslint-plugin-i18next";
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
    { name: "@fluentui/react-icons", message: "Import icons only from @/components/icons." },
  ],
  patterns: [
    {
      group: ["@fluentui/*"],
      message: "Import Fluent only through @/components/ui or @/components/icons.",
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

const i18nBan = [
  { name: "i18next", message: "Import i18n only from @/i18n." },
  { name: "react-i18next", message: "Import i18n only from @/i18n." },
];

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
      "no-restricted-imports": ["error", { ...fluentBan, paths: [...fluentBan.paths, ...i18nBan] }],
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
          paths: [...fluentBan.paths, ...i18nBan],
          patterns: [...fluentBan.patterns, ...coreBan.patterns],
        },
      ],
    },
  },
  {
    files: ["src/routes/**/*.{ts,tsx}"],
    rules: { "react-refresh/only-export-components": "off" },
  },
  // i18n layer: only src/i18n may import i18next/react-i18next directly.
  // Everything else imports the wrapper from @/i18n.
  {
    files: ["src/i18n/**/*.{ts,tsx}"],
    rules: { "no-restricted-imports": ["error", fluentBan] },
  },
  // Wrapper layers + theme: ui and theme may import Fluent components directly
  // but not Fluent icons; icons may import Fluent icons directly but not
  // Fluent components. They still may not use relative imports, except for
  // their own barrel index.ts files (next).
  {
    files: ["src/components/ui/**/*.{ts,tsx}", "src/theme/**/*.ts"],
    ignores: ["src/components/ui/index.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@fluentui/react-icons",
              message: "Import icons only from @/components/icons.",
            },
          ],
          patterns: [...coreBan.patterns],
        },
      ],
    },
  },
  {
    files: ["src/components/icons/**/*.{ts,tsx}"],
    ignores: ["src/components/icons/index.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@fluentui/react-components",
              message: "Import UI components only from @/components/ui.",
            },
          ],
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
  // DetailShell composes sibling common components. It imports them via
  // relative paths, not the common barrel, to avoid a barrel self-cycle,
  // which dependency-cruiser forbids as circular. Fluent stays banned,
  // and boundaries still requires ui/icons imports via their barrels.
  {
    files: ["src/components/common/DetailShell.tsx"],
    rules: { "no-restricted-imports": ["error", fluentBan] },
  },
  // Barrel exception: icons/index.ts is the approved boundary for Fluent icons.
  // It may re-export icon implementations directly, but not Fluent components.
  {
    files: ["src/components/icons/index.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@fluentui/react-components",
              message: "Import UI components only from @/components/ui.",
            },
          ],
          patterns: [...coreBan.patterns],
        },
      ],
    },
  },
  // i18n enforcement: user-visible strings must go through t().
  // Only JSX text and JSX attributes are checked (mode jsx-only); plain
  // TypeScript strings (routes, ids, data) are not. Technical JSX props and
  // the words below are excluded; test files, the i18n layer itself and the
  // generated route tree are not checked.
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/i18n/**", "src/routeTree.gen.ts", "**/*.test.{ts,tsx}"],
    plugins: { i18next: i18nextPlugin },
    rules: {
      "i18next/no-literal-string": [
        "error",
        {
          mode: "jsx-only",
          "jsx-attributes": {
            exclude: [
              "className",
              "styleName",
              "style",
              "type",
              "key",
              "id",
              "width",
              "height",
              "appearance",
              "shape",
              "size",
              "color",
              "positioning",
              "relationship",
              "name",
              "value",
              "iconPosition",
              "weight",
              "command",
              "checked",
              "sortDirection",
            ],
          },
          "object-properties": {
            exclude: ["[A-Z_-]+", "^(state|size|agent|language|to)$"],
          },
          words: {
            exclude: [
              "[0-9!-/:-@[-`{-~]+",
              "[A-Z_-]+",
              /^\p{Emoji}+$/u,
              "▼",
              "Arial",
              "Segoe UI",
              "Courier New",
            ],
          },
        },
      ],
    },
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
        { type: "icons", pattern: "src/components/icons/**" },
        { type: "common", pattern: "src/components/common/**" },
        { type: "i18n", pattern: "src/i18n/**" },
        { type: "api", pattern: "src/api/**" },
        { type: "mocks", pattern: "src/mocks/**" },
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
              from: { element: { type: "icons" } },
              allow: { to: { element: { type: "icons" } } },
            },
            {
              from: { element: { type: "i18n" } },
              allow: { to: { element: { type: "i18n" } } },
            },
            {
              from: { element: { type: "api" } },
              allow: { to: { element: { type: "api" } } },
            },
            {
              from: { element: { type: "mocks" } },
              allow: { to: { element: { type: "mocks" } } },
            },
            {
              from: { element: { type: "mocks" } },
              allow: { to: { element: { type: "api", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "feature" } },
              allow: { to: { element: { type: "api", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "routes" } },
              allow: { to: { element: { type: "api", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "layout" } },
              allow: { to: { element: { type: "api", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "app" } },
              allow: { to: { element: { type: "mocks", fileInternalPath: "browser.ts" } } },
            },
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
              allow: { to: { element: { type: "i18n", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "common" } },
              allow: { to: { element: { type: "ui", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "common" } },
              allow: { to: { element: { type: "icons", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "layout" } },
              allow: { to: { element: { type: "i18n", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "layout" } },
              allow: { to: { element: { type: "ui", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "layout" } },
              allow: { to: { element: { type: "icons", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "feature" } },
              allow: { to: { element: { type: "i18n", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "feature" } },
              allow: { to: { element: { type: "ui", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "feature" } },
              allow: { to: { element: { type: "icons", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "shared" } },
              allow: { to: { element: { type: "i18n", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "shared" } },
              allow: { to: { element: { type: "ui", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "shared" } },
              allow: { to: { element: { type: "icons", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "app" } },
              allow: { to: { element: { type: "i18n", fileInternalPath: "index.ts" } } },
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
              allow: { to: { element: { type: "i18n", fileInternalPath: "index.ts" } } },
            },
            {
              from: { element: { type: "routes" } },
              allow: { to: { element: { type: "routetree" } } },
            },
            {
              from: { element: { type: "stores" } },
              allow: { to: { element: { type: "i18n", fileInternalPath: "index.ts" } } },
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
