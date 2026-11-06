# Fluent Enterprise UI

Fluent Enterprise UI is a React and Vite enterprise admin UI template built on Fluent UI, with a wrapped component layer.

## Stack

- React 19.3.1
- Vite 8.3.5
- TypeScript 5.9.3
- Fluent UI 9.75.0
- TanStack Router 1.170.46
- TanStack Query 5.105.0
- TanStack Table 9.3.1
- Zustand 5.0.16
- i18next 26.5.11
- MSW 3.0.3
- Vitest 5.0.5
- vitest-browser-react 2.3.0
- Playwright 1.64.1
- Knip 6.43.0
- pnpm 10.34.9
- ESLint 10.13.0
- Prettier 3.9.10
- Husky 9.1.7
- commitlint 21.2.4
- See package.json for the exact dependency ranges.

## How to run

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm typecheck
```

## Architecture

The codebase is layered so that product code never talks to Fluent UI directly:

```text
src/features/**  src/routes/**  src/layouts/**        product code
        |
        v
src/components/common/**                              composed, app-aware components
        |
        v
src/components/ui/**                                  closed wrapper API
        |
        v
@fluentui/react-components                            Fluent UI v9
```

Key principles:

- Only `src/components/ui/**` imports `@fluentui/react-components`; application code imports UI from `@/components/ui` and icons from `@/components/icons`.
- Design values come from the semantic theme in `src/styles/theme.ts` (`theme.color`, `theme.spacing`, ...). Raw Fluent tokens are read only by that file.
- Wrappers are a closed API: explicit prop interfaces, no `any`, and plain-value callbacks such as `onChange(value)`, `onCheckedValueChange(items)` and `onTabSelect(value)`.
- Wrapper tests are `*.browser.test.tsx` under `src/components/ui/__tests__/`; pure logic tests are `*.test.ts`. Comments are banned under `src/**`.

Documentation:

- [Design System](docs/DESIGN_SYSTEM.md) - layers, theme token reference, component API, ESLint boundaries and testing.
- [Migration Guide](docs/MIGRATION_GUIDE.md) - upgrading Fluent UI, swapping the table library, testing and rollback.
- [Architecture Review](docs/ARCHITECTURE_REVIEW.md) - recorded review notes for this work.

## Author

Ray Doan
