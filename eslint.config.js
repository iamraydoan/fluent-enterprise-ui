import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
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

const tokensUiBan = {
  name: "@/components/ui",
  importNames: ["tokens"],
  message:
    "Import tokens only in src/components/ui or src/styles/theme. Use theme from @/styles/theme.",
};

const tokensFluentBan = {
  name: "@fluentui/react-components",
  importNames: ["tokens"],
  message:
    "Import tokens only in src/components/ui or src/styles/theme. Use theme from @/styles/theme.",
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

const tanstackTableBan = {
  paths: [
    {
      name: "@tanstack/react-table",
      message:
        "Import @tanstack/react-table only in src/components/common/data-table/**. Pages must use the pure DataColumn / DataFilter configs from @/components/common.",
    },
  ],
};

const cardSurfaceBan = {
  selector: "Literal[value='#FAFAFA'], Literal[value='#fafafa']",
  message:
    "Do not hardcode the card surface color. Spread cardSurface from @/styles/shared instead (single source of truth).",
};

function isInStyleContainer(node, context) {
  for (const ancestor of context.sourceCode.getAncestors(node)) {
    if (
      ancestor.type === "JSXAttribute" &&
      ancestor.name.type === "JSXIdentifier" &&
      ancestor.name.name === "style"
    ) {
      return true;
    }
    if (
      ancestor.type === "CallExpression" &&
      ancestor.callee.type === "Identifier" &&
      ancestor.callee.name === "makeStyles"
    ) {
      return true;
    }
  }
  return false;
}

const TEXT_ONLY_ATTRIBUTES = new Set([
  "href",
  "to",
  "src",
  "srcSet",
  "id",
  "key",
  "name",
  "htmlFor",
  "role",
  "target",
  "rel",
  "alt",
  "placeholder",
  "title",
  "label",
  "description",
  "message",
  "heading",
]);

function jsxAttributeOf(node, context) {
  const ancestors = context.sourceCode.getAncestors(node);
  const parent = ancestors[ancestors.length - 1];
  if (!parent) return null;
  if (parent.type === "JSXAttribute" && parent.value === node) return parent;
  if (parent.type === "JSXExpressionContainer" && parent.expression === node) {
    const grandparent = ancestors[ancestors.length - 2];
    if (grandparent && grandparent.type === "JSXAttribute" && grandparent.value === parent) {
      return grandparent;
    }
  }
  return null;
}

function isTextOnlyAttribute(attribute) {
  if (attribute.name.type !== "JSXIdentifier") return false;
  return (
    TEXT_ONLY_ATTRIBUTES.has(attribute.name.name) ||
    attribute.name.name.startsWith("data-") ||
    attribute.name.name.startsWith("aria-")
  );
}

function isStyledLiteral(node, context) {
  const attribute = jsxAttributeOf(node, context);
  if (attribute) return !isTextOnlyAttribute(attribute);
  return isInStyleContainer(node, context) && isStylePropertyValue(node, context);
}

function isStylePropertyValue(node, context) {
  let current = node;
  const ancestors = context.sourceCode.getAncestors(node);
  for (let index = ancestors.length - 1; index >= 0; index -= 1) {
    const ancestor = ancestors[index];
    if (ancestor.type === "Property" && ancestor.value === current) return true;
    current = ancestor;
  }
  return false;
}

function containsStyleBranch(node) {
  if (!node || typeof node.type !== "string") return false;
  if (node.type === "ConditionalExpression" || node.type === "LogicalExpression") return true;
  for (const key of Object.keys(node)) {
    if (key === "parent") continue;
    const value = node[key];
    if (Array.isArray(value)) {
      for (const child of value) {
        if (child && typeof child.type === "string" && containsStyleBranch(child)) return true;
      }
    } else if (value && typeof value.type === "string" && containsStyleBranch(value)) {
      return true;
    }
  }
  return false;
}

const rawPrimitiveBans = new Set([
  "Menu",
  "MenuTrigger",
  "MenuPopover",
  "MenuList",
  "MenuItem",
  "MenuItemRadio",
  "MenuItemCheckbox",
  "Dialog",
  "DialogActions",
  "DialogBody",
  "DialogContent",
  "DialogSurface",
  "DialogTitle",
  "DialogTrigger",
  "Popover",
  "PopoverTrigger",
  "PopoverSurface",
  "Drawer",
  "DrawerBody",
  "DrawerHeader",
  "DrawerFooter",
  "Tree",
  "TreeItem",
  "TreeItemLayout",
  "Tab",
  "TabList",
  "Accordion",
  "AccordionItem",
  "AccordionHeader",
  "AccordionPanel",
]);

function isPageFile(filename) {
  return /src\/features\/.*Page\.tsx$/.test(filename.split("\\").join("/"));
}

function specifierName(node) {
  const identifier = node.imported ?? node.local;
  return identifier.type === "Identifier" ? identifier.name : String(identifier.value);
}

function resolveFeatureModule(filename, source) {
  if (!source.startsWith("./") && !source.startsWith("../")) return null;
  const base = resolve(dirname(filename), source);
  const candidates = [base + ".ts", base + ".tsx", base + "/index.ts", base + "/index.tsx"];
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

function reexportedBannedNames(targetFile) {
  const names = new Set();
  const result = { names, exportsAll: false };
  let source;
  try {
    source = readFileSync(targetFile, "utf8");
  } catch {
    return result;
  }
  for (const match of source.matchAll(
    /export\s*(?:type\s*)?\{([^}]*)\}\s*from\s*"@\/components\/ui"/g,
  )) {
    for (const raw of match[1].split(",")) {
      const parts = raw
        .trim()
        .replace(/^type\s+/, "")
        .split(/\s+as\s+/);
      const local = (parts[0] ?? "").trim();
      const exported = (parts[1] ?? parts[0] ?? "").trim();
      if (rawPrimitiveBans.has(local) && exported !== "") names.add(exported);
    }
  }
  result.exportsAll = /export\s*\*\s*from\s*"@\/components\/ui"/.test(source);
  return result;
}

const localPlugin = {
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
    "no-feature-makeStyles": {
      meta: { type: "problem", docs: { description: "Disallow makeStyles in feature files." } },
      create(context) {
        return {
          CallExpression(node) {
            if (node.callee.type === "Identifier" && node.callee.name === "makeStyles") {
              context.report({
                node,
                message:
                  "Feature files must not call makeStyles. Compose @/components/common primitives (HStack, VStack, Grid, Card, Panel, Section) and pass their props.",
              });
            }
          },
        };
      },
    },
    "no-feature-style-prop": {
      meta: { type: "problem", docs: { description: "Disallow the style prop in feature files." } },
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name.type === "JSXIdentifier" && node.name.name === "style") {
              context.report({
                node,
                message:
                  "Feature files must not use the style prop. Use the gap/align/justify/surface/p props of @/components/common stacks or a named component.",
              });
            }
          },
        };
      },
    },
    "no-feature-literal-hex": {
      meta: {
        type: "problem",
        docs: { description: "Disallow literal hex colours in feature files." },
      },
      create(context) {
        return {
          Literal(node) {
            if (
              typeof node.value === "string" &&
              /#[0-9a-fA-F]{3,8}(?![0-9a-fA-F])/.test(node.value) &&
              isStyledLiteral(node, context)
            ) {
              context.report({
                node,
                message:
                  "Feature files must not use literal hex colours in style objects or JSX attribute values. Use a design-system variant or a @/components/common or @/components/ui primitive.",
              });
            }
          },
        };
      },
    },
    "no-feature-literal-px": {
      meta: {
        type: "problem",
        docs: { description: "Disallow literal px values in feature files." },
      },
      create(context) {
        return {
          Literal(node) {
            if (
              typeof node.value === "string" &&
              /\d+(\.\d+)?px/.test(node.value) &&
              isStyledLiteral(node, context)
            ) {
              context.report({
                node,
                message:
                  "Feature files must not use literal px values in style objects or JSX attribute values. Use the theme-backed gap/align/justify/p props of @/components/common stacks.",
              });
            }
          },
        };
      },
    },
    "no-feature-literal-radius": {
      meta: { type: "problem", docs: { description: "Disallow literal radii in feature files." } },
      create(context) {
        return {
          Property(node) {
            if (
              node.key.type === "Identifier" &&
              node.key.name === "borderRadius" &&
              node.value.type === "Literal" &&
              isInStyleContainer(node, context)
            ) {
              context.report({
                node,
                message:
                  "Feature files must not set literal radii. Use a @/components/common surface (Card, Panel, Section) instead.",
              });
            }
          },
        };
      },
    },
    "no-feature-theme-import": {
      meta: {
        type: "problem",
        docs: { description: "Disallow @/styles/theme imports in feature files." },
      },
      create(context) {
        return {
          ImportDeclaration(node) {
            if (node.source.value === "@/styles/theme") {
              context.report({
                node,
                message:
                  "Feature files must not import @/styles/theme. Move the styling into a @/components/ui or @/components/common primitive that reads the token.",
              });
            }
          },
        };
      },
    },
    "no-feature-settings-import": {
      meta: {
        type: "problem",
        docs: { description: "Disallow settings store/config imports in feature files." },
      },
      create(context) {
        return {
          ImportDeclaration(node) {
            const source = String(node.source.value);
            if (
              /^@\/features\/settings(\/|$)/.test(source) ||
              /^\.\.?\/.*settings\//.test(source)
            ) {
              context.report({
                node,
                message:
                  "Feature files must not import the settings store or config. The settings provider applies configuration; features stay declarative.",
              });
            }
          },
        };
      },
    },
    "no-feature-raw-primitive-imports": {
      meta: {
        type: "problem",
        docs: { description: "Disallow raw assembly imports and re-exports in the feature layer." },
      },
      create(context) {
        const filename = String(context.filename).split("\\").join("/");
        const page = isPageFile(filename);
        const report = (node, name, kind) => {
          const detail =
            kind === "import"
              ? `Page files must not import the raw assembly primitive ${name} from @/components/ui. Extract the assembly into a component in this feature folder and compose it.`
              : kind === "indirect"
                ? `Page files must not import the raw assembly primitive ${name} through a feature-local re-export. Compose the extracted component instead.`
                : `Feature files must not re-export the raw assembly primitive ${name} from @/components/ui. Compose it in a component instead.`;
          context.report({ node, message: detail });
        };
        return {
          ImportDeclaration(node) {
            const source = String(node.source.value);
            if (source === "@/components/ui") {
              if (!page) return;
              for (const specifier of node.specifiers) {
                if (specifier.type !== "ImportSpecifier") continue;
                const name = specifierName(specifier);
                if (rawPrimitiveBans.has(name)) report(specifier, name, "import");
              }
              return;
            }
            if (!page) return;
            const target = resolveFeatureModule(filename, source);
            if (target === null) return;
            const reexported = reexportedBannedNames(target);
            for (const specifier of node.specifiers) {
              if (specifier.type !== "ImportSpecifier") continue;
              const name = specifierName(specifier);
              if (reexported.exportsAll || reexported.names.has(name)) {
                report(specifier, name, "indirect");
              }
            }
          },
          ExportNamedDeclaration(node) {
            if (node.source === null || String(node.source.value) !== "@/components/ui") return;
            for (const specifier of node.specifiers) {
              const name = specifierName(specifier);
              if (rawPrimitiveBans.has(name)) report(specifier, name, "export");
            }
          },
          ExportAllDeclaration(node) {
            if (String(node.source.value) !== "@/components/ui") return;
            report(node, "*", "export");
          },
        };
      },
    },
    "no-feature-conditional-style": {
      meta: {
        type: "problem",
        docs: { description: "Disallow conditional style or className in feature files." },
      },
      create(context) {
        return {
          JSXAttribute(node) {
            if (
              node.name.type !== "JSXIdentifier" ||
              (node.name.name !== "style" && node.name.name !== "className")
            ) {
              return;
            }
            if (!node.value || node.value.type !== "JSXExpressionContainer") return;
            if (containsStyleBranch(node.value.expression)) {
              context.report({
                node,
                message:
                  "Feature files must not branch on style or className. Use a variant prop or a named @/components/common component.",
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
      "no-restricted-imports": [
        "error",
        {
          ...fluentBan,
          paths: [...fluentBan.paths, tokensUiBan, ...i18nBan, ...tanstackTableBan.paths],
        },
      ],
    },
    linterOptions: { reportUnusedDisableDirectives: "error" },
  },
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
          paths: [...fluentBan.paths, tokensUiBan, ...i18nBan, ...tanstackTableBan.paths],
          patterns: [...fluentBan.patterns, ...coreBan.patterns],
        },
      ],
    },
  },
  {
    files: ["src/styles/theme.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [...fluentBan.paths, ...i18nBan, ...tanstackTableBan.paths],
          patterns: [...fluentBan.patterns, ...coreBan.patterns],
        },
      ],
    },
  },
  {
    // shared.ts defines cardSurface itself, so it is excluded from the card-surface
    // literal ban instead of switching the whole rule off for the file.
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/styles/shared.ts"],
    rules: { "no-restricted-syntax": ["error", cardSurfaceBan] },
  },
  {
    files: ["src/features/**/*.{ts,tsx}"],
    ignores: [
      "src/features/**/*.test.ts",
      "src/features/**/*.browser.test.tsx",
      "src/features/**/__fixtures__/**",
    ],
    plugins: { local: localPlugin },
    rules: {
      "no-restricted-syntax": [
        "warn",
        cardSurfaceBan,
        {
          selector:
            'CallExpression[callee.name="makeStyles"] Property[key.name="display"] > Literal[value=/^(flex|grid)$/]',
          message:
            "Do not hand-roll flex/grid in makeStyles. Use HStack/VStack/TileGrid from @/components/common.",
        },
        {
          selector:
            'JSXAttribute[name.name="style"] Property[key.name="display"] > Literal[value=/^(flex|grid)$/]',
          message:
            "Do not hand-roll flex/grid in style props. Use HStack/VStack/TileGrid from @/components/common.",
        },
        {
          selector: 'JSXOpeningElement[name.name="button"]',
          message:
            "Do not use raw <button> in features. Use Button/IconButton/MenuTriggerButton/OptionItem/NavItem/SectionHeader from @/components/common or @/components/ui.",
        },
        {
          selector: 'CallExpression[callee.name="makeStyles"] Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
          message:
            "Do not hardcode hex colors in makeStyles. Use theme.* from @/styles/theme (single source of truth).",
        },
        {
          selector: 'JSXAttribute[name.name="style"] Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
          message:
            "Do not hardcode hex colors in style props. Use theme.* from @/styles/theme (single source of truth).",
        },
      ],
      "local/no-feature-makeStyles": "warn",
      "local/no-feature-style-prop": "warn",
      "local/no-feature-literal-hex": "warn",
      "local/no-feature-literal-px": "warn",
      "local/no-feature-literal-radius": "warn",
      "local/no-feature-theme-import": "warn",
      "local/no-feature-settings-import": "warn",
      "local/no-feature-conditional-style": "warn",
      "local/no-feature-raw-primitive-imports": "warn",
    },
  },
  {
    files: ["src/routes/**/*.{ts,tsx}"],
    rules: { "react-refresh/only-export-components": "off" },
  },
  {
    files: ["src/i18n/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          ...fluentBan,
          paths: [...fluentBan.paths, tokensUiBan, ...tanstackTableBan.paths],
        },
      ],
    },
  },
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
            ...tanstackTableBan.paths,
          ],
          patterns: [...coreBan.patterns],
        },
      ],
    },
  },
  {
    files: ["src/theme/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            tokensUiBan,
            tokensFluentBan,
            {
              name: "@fluentui/react-icons",
              message: "Import icons only from @/components/icons.",
            },
            ...tanstackTableBan.paths,
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
            ...tanstackTableBan.paths,
          ],
          patterns: [...coreBan.patterns],
        },
      ],
    },
  },
  {
    files: ["src/components/ui/index.ts"],
    rules: { "no-restricted-imports": ["error", fluentBan] },
  },
  {
    files: ["src/components/common/index.ts"],
    rules: { "no-restricted-imports": ["error", fluentBan] },
  },
  {
    files: ["src/components/common/actions/index.ts"],
    rules: { "no-restricted-imports": ["error", fluentBan] },
  },
  {
    files: ["src/components/**/*.{ts,tsx}"],
    ignores: ["src/components/ui/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [...fluentBan.paths, tokensUiBan, ...i18nBan, ...tanstackTableBan.paths],
          patterns: [...fluentBan.patterns],
        },
      ],
    },
  },
  {
    files: ["src/components/ui/**/*.{ts,tsx}"],
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
        },
      ],
    },
  },
  {
    files: ["src/components/icons/index.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            tokensUiBan,
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
              "variant",
              "confirmVariant",
              "labelWidth",
              "labelAlign",
              "gap",
              "align",
              "justify",
              "columns",
              "wrap",
              "role",
              "shape",
              "size",
              "color",
              "positioning",
              "intent",
              "mode",
              "level",
              "fieldName",
              "relationship",
              "name",
              "value",
              "iconPosition",
              "weight",
              "command",
              "checked",
              "sortDirection",
              "itemType",
              "titleKey",
              "listTitleKey",
              "labelKey",
              "submitLabelKey",
              "messageKey",
              "confirmLabelKey",
              "top",
              "valueKey",
              "namePlaceholderKey",
              "extraPlaceholderKey",
              "fieldKey",
              "accentColor",
              "backgroundColor",
              "minWidth",
              "sidebarWidth",
              "gap",
              "align",
              "justify",
              "p",
              "mb",
              "tone",
              "headerGap",
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
              from: { element: { type: "api" } },
              allow: { to: { element: { type: "shared" } } },
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
    plugins: { local: localPlugin },
    rules: { "local/no-comments": "error" },
  },
  {
    files: ["src/components/common/data-table/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [...fluentBan.paths, tokensUiBan, ...i18nBan],
          patterns: [...fluentBan.patterns, ...coreBan.patterns],
        },
      ],
    },
  },
  prettierConfig,
);
