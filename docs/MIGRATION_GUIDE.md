# Migration Guide

This guide covers the operational side of the design system: upgrading Fluent UI, swapping the table library, the testing strategy that protects those changes, and how to roll back.

Read [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) first for the layer architecture, the theme reference and the wrapper API.

## 1. Upgrading Fluent UI

### 1.1 Where Fluent is imported

| File / directory                                 | What it imports                                                                   |
| ------------------------------------------------ | --------------------------------------------------------------------------------- |
| `src/components/ui/*.tsx`                        | The Fluent primitives (`Button`, `Input`, `Menu`, `Dialog`, `Table`, `Tree`, ...) |
| `src/components/ui/styles.ts`                    | `makeStyles`, `mergeClasses`, `tokens`                                            |
| `src/theme/index.ts`                             | `webLightTheme` and the `Theme` type                                              |
| `src/components/icons/index.ts`                  | `@fluentui/react-icons`                                                           |
| `src/components/ui/__tests__/*.browser.test.tsx` | Fluent primitives used as reference markup in tests                               |

Nothing else in `src/` may import `@fluentui/*`; the ESLint ban fails the build if it happens.

### 1.2 Upgrade procedure

1. Read the Fluent UI changelog for the target version and note breaking changes for the primitives you use.
2. Bump `@fluentui/react-components` (and `@fluentui/react-icons` if needed) in `package.json` and install.
3. Run `npx tsc --noEmit`. Type errors usually point at one of three places: a renamed Fluent prop in a wrapper, a changed ref type, or a token name in `src/styles/theme.ts`.
4. Run `npx eslint . -f json` and confirm the severity-2 count is still exactly 22. A new error normally means an import escaped the allowed layers.
5. Open `src/styles/theme.ts` and verify that every `tokens.*` key still exists. Token renames surface here first because this is the only file that reads raw tokens.
6. Open `src/theme/index.ts` and verify the `webLightTheme` spread plus the three overrides (`fontFamilyBase`, `colorBrandForeground1`, `colorBrandForegroundLink`) still type-check.
7. Run the full test suite: `npm run test:unit`, `npm run test:browser`, then `npm run test:coverage`.
8. Do the visual pass described in 1.4.
9. Commit the dependency bump and any wrapper adjustments together so the change is reviewable as one unit.

### 1.3 What to change and where

| Symptom                                               | Fix in                                                                                                 |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| A wrapper no longer type-checks against a Fluent prop | The wrapper file in `src/components/ui/`                                                               |
| `tokens.someName` is gone or renamed                  | `src/styles/theme.ts` (move the key to the replacement token)                                          |
| Theme overrides no longer apply                       | `src/theme/index.ts`                                                                                   |
| Icons no longer resolve                               | `src/components/icons/index.ts`                                                                        |
| A wrapper test fails on markup comparison             | The test in `src/components/ui/__tests__/`, after confirming the wrapper still maps the prop correctly |
| New lint error                                        | The offending import; see section 6 of the design system                                               |

Do not edit application code to work around a Fluent change. The wrapper layer exists so product code never notices.

### 1.4 Visual checklist

After any Fluent bump, check these surfaces in the browser:

- Buttons: primary, secondary, subtle, outline and disabled, in all three sizes.
- Inputs: text input, textarea, field label and hint, placeholder and disabled states.
- Selection: checkbox, switch, radio group, dropdown and combobox popups.
- Overlays: menu (including radio items), popover, tooltip on hover, dialog open and Escape close.
- Data display: tables with headers, rows and cells, tabs, tree expansion.
- Feedback: message bars for all four intents, spinner and badge.
- Theme: text, borders, surfaces, brand colour and the font family.

### 1.5 Rollback

Revert the commit that bumped the dependency. Because Fluent is confined to the wrapper layer and the two theme files, the revert is limited to `package.json`, the lockfile and at most a handful of wrapper files. Reinstall, then rerun `npx tsc --noEmit` and both test projects. If only production is affected, pin the previous version and redeploy; no application code needs to change.

## 2. Swapping the table library

### 2.1 Current isolation

The table library (`@tanstack/react-table`) is isolated by lint: it may only be imported from `src/components/common/data-table/**`. Pages and features never import it; they build `DataColumn` and `DataFilter` configuration objects and pass them to the shared components.

| File                                                 | Role                                                                  |
| ---------------------------------------------------- | --------------------------------------------------------------------- |
| `src/components/common/data-table/tableAdapter.tsx`  | Adapter between the public column/filter config and the table library |
| `src/components/common/data-table/DataTableCard.tsx` | Card shell around the table                                           |
| `src/components/common/data-table/ColumnChooser.tsx` | Column visibility                                                     |
| `src/components/common/data-table/tableFeatures.ts`  | Feature registration                                                  |
| `src/components/common/data-table/DataListPage.tsx`  | List page composition                                                 |
| `src/components/ui/table.tsx`                        | Presentational table primitives used by the adapter                   |

### 2.2 Swap procedure

1. Freeze the public contract first: the `DataColumn` and `DataFilter` types exported through `@/components/common`. Every feature page depends on these, not on the library.
2. Write a new adapter behind the same public exports. Keep using the `Table` family from `@/components/ui`; only the row/column model, sorting, filtering and pagination logic should change.
3. Add the new library to `package.json` and update the `no-restricted-imports` entry in `eslint.config.js` so the ban names the old package and the new one is allowed only under `src/components/common/data-table/**`.
4. Port the existing browser tests for the list pages (`src/components/common/data-table/DataListPage.browser.test.tsx`) and keep them green before deleting the old adapter.
5. Remove the old dependency only when `npm run knip` no longer lists adapter files.
6. Run `npx tsc --noEmit`, both test projects and `npm run test:coverage`.

### 2.3 Rollback

Keep the old adapter file and dependency in place until the new one has passed the browser suite and a manual pass. If the swap fails, restore the old adapter export and remove the new library; because the public `DataColumn`/`DataFilter` contract never moved, no feature page changes are required.

## 3. Testing strategy and checklist

### 3.1 The two projects

| Project   | Files collected             | Environment                                                | Command                |
| --------- | --------------------------- | ---------------------------------------------------------- | ---------------------- |
| `unit`    | `src/**/*.test.ts`          | Node, no DOM                                               | `npm run test:unit`    |
| `browser` | `src/**/*.browser.test.tsx` | Headless Chromium via Playwright, with `src/test-setup.ts` | `npm run test:browser` |

Wrapper tests live in `src/components/ui/__tests__/`. The naming rule matters: a wrapper test saved as `*.test.tsx` is collected by neither project and silently never runs.

### 3.2 Checklist

| Step          | Command                                | Expected                                                 |
| ------------- | -------------------------------------- | -------------------------------------------------------- |
| Type check    | `npx tsc --noEmit`                     | exit 0                                                   |
| Lint          | `npx eslint . -f json`                 | exactly 22 severity-2 findings                           |
| Unit tests    | `npm run test:unit`                    | 22 files / 171 tests                                     |
| Browser tests | `npm run test:browser`                 | 12 files / 80 tests                                      |
| Coverage      | `npm run test:coverage`                | exit 0; wrapper layer at 100% statements/functions/lines |
| Unused code   | `npm run knip`                         | no new findings                                          |
| Formatting    | `npx prettier --check <changed files>` | clean for the files you changed                          |

### 3.3 When a change touches the wrapper layer

- Add or update a `*.browser.test.tsx` test next to the wrapper under test.
- Assert behaviour: roles, text, attributes and callback arguments. For pure prop mapping, compare the rendered markup with a directly rendered Fluent component using the target prop.
- Keep the wrapper coverage at 100% statements, functions and lines. New uncovered lines should be explained before merging.
- Re-run the theme regression test `src/styles/theme.browser.test.tsx` whenever spacing, radius, border or font tokens change.

## 4. Common issues and fixes

| Symptom                                                       | Likely cause                                           | Fix                                                                                            |
| ------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `Cannot find module '@fluentui/react-components'` in app code | New import outside the UI layer                        | Import from `@/components/ui`                                                                  |
| Theme variables are `var(--...)` and components look unstyled | Missing `FluentProvider` or the wrong theme            | Wrap the tree in `FluentProvider` with the theme from `@/theme`                                |
| A token reference stops resolving after an upgrade            | Fluent renamed or removed the token                    | Update the key in `src/styles/theme.ts`                                                        |
| Wrapper test missing from the run                             | File is not named `*.browser.test.tsx`                 | Rename it; only the browser project collects those                                             |
| Size prop type error                                          | Fluent size name passed to a wrapper                   | Use `sm`/`md`/`lg`                                                                             |
| Callback gets an event object                                 | Fluent component used directly                         | Use the wrapper and its plain-value callbacks                                                  |
| Lint error about `@tanstack/react-table`                      | Imported outside `src/components/common/data-table/**` | Use `DataColumn`/`DataFilter` from `@/components/common`                                       |
| Lint error about flex/grid or hex colours                     | Hand-rolled layout or colour in a feature              | Use `HStack`/`VStack`/`TileGrid` and `theme.*`                                                 |
| Browser test times out on a popup                             | Portal content not yet visible                         | Wait for the option/tooltip/dialog with `expect.element(...).toBeVisible()` before interacting |
