# Theme Settings & Page Encapsulation Plan

Status: proposed. Owner: lead. Companion files: `docs/PAGE_ENCAPSULATION_CHECKLIST.md` (per-page task board), `docs/CODE_REVIEW_RULES.md` (review rubric).

## 1. Problem (measured at 9a7786a)

| Metric                                    | Count |
| ----------------------------------------- | ----- |
| Page files scanned                        | 158   |
| Pages carrying styling debt               | 64    |
| Pages calling `makeStyles`                | 40    |
| Pages with inline `style={{...}}`         | 49    |
| Pages importing `@/styles/theme` directly | 59    |
| `makeStyles` calls in `src/features/**`   | 105   |
| Inline style props in features + common   | 541   |

ESLint currently excuses this debt instead of preventing it:

- `eslint.config.js:183-187` exempts three files from the style rules (`src/features/ai/chat/AiChatPage.tsx`, `src/features/**/dialogStyles.ts`, `src/features/**/dialogShared.ts`). `AiChatPage.tsx` still hardcodes `backgroundColor: "#FFFFFF"` - exactly what the rule would catch were the file not exempt.
- `eslint.config.js:179` turns `no-restricted-syntax` off for `src/styles/shared.ts`.
- The rules themselves are shallow: they catch hex in `makeStyles`/style props and `display: flex|grid`, but not literal px, literal radius, inline style objects, or a page calling `makeStyles` at all.

Consequence: the design system exists (`@/components/ui` 23 exports, `@/components/common` 41 exports) but pages bypass it, so a global theme setting cannot restyle the app.

## 2. Goal and definition of done

Ship a simple theme-settings panel, in the style of commercial template packages, whose settings restyle every page **without editing any page source**. That property is the operational definition of "components are encapsulated", and it is testable.

Done means all of:

1. ESLint enforces the page-layer rules with no hand-written escape hatches; the only exceptions are entries in a ledger that can only shrink.
2. `src/features/settings/**` provides theme settings that a user can change at runtime.
3. All 64 debt pages are converted; the ledger reaches zero.
4. The encapsulation test passes: mutating the theme changes rendered output on every page with zero source changes.

## 3. Workstreams

| Id  | Workstream                              | Output                                                |
| --- | --------------------------------------- | ----------------------------------------------------- |
| A   | ESLint honest + strict page-layer rules | config changes, debt ledger, meta test                |
| B   | Theme settings feature                  | `src/features/settings/**`, store, provider, panel UI |
| C   | Page-by-page encapsulation (64 pages)   | one converted page per commit, checklist updated      |
| D   | Encapsulation proof                     | theme-mutation test wired as a gate                   |

## 4. Page-layer rules (target)

"Page layer" means `src/features/**/*Page.tsx`. Forbidden there:

| Forbidden                                                                | Rationale                                                   | Replacement                                                           |
| ------------------------------------------------------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------- |
| `makeStyles`                                                             | layout decisions must live with the component, not the page | primitives + props                                                    |
| `style={{...}}`                                                          | same                                                        | `gap` / `align` / `justify` / `variant` / `density` / `surface` props |
| literal px, hex, radius                                                  | values must come from the token layer                       | `theme.*` (and later the settings provider)                           |
| `import { theme } from "@/styles/theme"`                                 | a page must not know token names                            | component reads the token                                             |
| importing the settings config/store                                      | a page must not branch on config                            | provider applies config; page stays declarative                       |
| conditional styling (`style={cond ? a : b}`, `className={cond ? x : y}`) | style must not be decided by page-level conditionals        | `variant` prop, or a named component                                  |

Data/loading/empty/error branching in a page stays legal. The ban is on style and config branching, not on control flow in general.

**Scope: the page layer only.** `src/components/**` is unrestricted. Components are where styling legitimately lives, so no style rule may be applied there - not the rules above, not the existing hex/flex ones. These bans exist so that pages compose the component layer; they are not a constraint on the component layer itself. Concretely, a component file may call `makeStyles`, use the `style` prop, and hold literal px, hex and radius values.

## 5. Enforcement: the debt ledger (ratchet)

Turning the rules on today would produce hundreds of errors and break the pre-push gate, and a rule with no migration path is what produced the current escape hatches. So enforcement is ratcheted:

- `eslint.page-debt.json` maps a page path to the exact rule ids it is currently excused from.
- `eslint.config.js` reads that file and adds per-file ignores **only for those rule ids** - a hand-written exemption becomes a data entry instead.
- A meta test asserts three properties: no stale entries (every entry genuinely violates), no missing entries (every violating file is listed), and the entry count never increases against the committed baseline.
- Converting a page means deleting its entry. The test fails if an entry is re-added.

Baselines are committed numbers, and they move only with a stated reason. The recorded history is: 209 raw mappings at the first commit of the ledger, 187 after the literal rules were narrowed, and 212 after that narrowing was corrected (minus 25 wrongly-dropped px entries, plus 3 genuine conditional-style detections the widened tree walk found). A baseline that rises without such a reason is a loosening and fails review.

This keeps `npx eslint .` at zero findings at every step while guaranteeing the debt only shrinks.

## 6. Theme settings feature (B)

Location: `src/features/settings/**` (feature layer, as requested). Keep it small; this is the template-vendor pattern, not a design tool.

Settings, first cut: brand colour, light/dark, corner radius, density (compact | comfortable), sidebar layout (expanded | collapsed), content width.

Shape:

- a data-only store (`zustand` + persisted to localStorage) holding plain values; no JSX, no branching on styles;
- a provider that converts the values into a Fluent theme object plus CSS custom properties, and wraps the app under `FluentProvider`;
- a resettable panel UI that composes `@/components/common` and `@/components/ui` only and itself obeys every page-layer rule;
- pages never import the store or the config; they get restyled because they read `theme.*` through components.

## 7. The encapsulation proof (D)

One test, two assertions, run as a gate:

1. Render a page matrix (every page with debt, widened later to all pages) under N theme mutations: radius 0, density compact, spacing doubled, dark mode, brand swap. Assert the computed style actually changes per page.
2. Assert that the run touched zero source files, and that no page imports the settings store or config.

A page that does not react to the mutations is not encapsulated, and the test names it. This is the same technique used to mutation-test the wrapper layer earlier in this repo.

## 8. Sequencing

A -> B -> C -> D, with D's first version landing alongside B so the target is visible before the long tail starts.

A first because it is cheap, it makes the rules honest, and it stops new debt while C runs. B before C because B defines the vocabulary (variants, density, surfaces) that C converts pages onto; converting first would mean converting twice. D is written once B exists and then gates C.

### Per-page loop for C

1. Page worker converts exactly one page: remove `makeStyles`/inline styles, compose existing primitives, delete the page's ledger entry.
2. Page worker records evidence: lint, typecheck, unit, browser, computed-style before/after, ledger entry removed.
3. Reviewer independently reproduces the evidence against the rubric in `docs/CODE_REVIEW_RULES.md`.
4. Any finding goes back as a fix, then re-review. A page is only `done` after a clean re-review.
5. Checklist row updated (`Status`, `Owner`, `Review`, `Commit`), one commit per page.

## 9. Delegation model

- Lead coordinates and owns the plan, the checklist and the final acceptance run; the Lead does not write product code.
- Exactly one writer is active at a time (sequential, no parallel writers). Write scopes never overlap.
- Roles: a page worker for conversions, a settings/ESLint implementer, and an independent reviewer. The reviewer never edits product code.
- One shared task per page, with `write_scopes` set to that page file, claimed before work and completed after review.

## 10. Gates

Per page: `npx eslint .` 0 findings, `npx tsc --noEmit` 0, `npm run test:unit` 22 files / 171 tests, `npm run test:browser` 12 files / 80 tests, ledger entry removed, computed-style parity recorded.

Per phase: the above plus `npm run format:check` clean, `npm run check:deps` 0, and the pre-push hook passing without `--no-verify`.

Final: encapsulation test green, ledger empty, and every checklist row `done`.

## 11. Risks

- A ban without primitives creates escape hatches; every new rule in A must ship with the primitive it points at.
- Some layouts are genuinely bespoke. The target is rare, named and justified exceptions in the ledger, not zero exceptions.
- Runtime theming re-renders the tree. Acceptable for a settings panel, but do not use the store for per-page tweaks.
- 64 pages is a long tail. If throughput matters, pages that share an identical conversion pattern may be grouped into one commit, but each page still needs its own checklist row and review verdict.

## 12. Decisions

Settled; do not relitigate without a new reason.

1. **The panel is an end-user feature, kept simple.** It follows the template-vendor pattern: a small, fixed setting set that a user changes at runtime. i18n, keyboard access, labels and persistence are therefore hard requirements, but the setting set stays small - six settings, not a design tool.
2. **The component layer is unrestricted.** All style bans are scoped to the page layer (`src/features/**/*Page.tsx`). No style rule may be applied to `src/components/**`.
3. **The `#FAFAFA` card-surface rule stays as it is**, applying to all of `src/**` including components. Rationale: it is a value-duplication rule (one canonical surface colour), not a style-encapsulation ban. It does not restrict how a component styles; it forbids re-declaring one canonical value that already exists in `src/styles/shared.ts`. Removing it would be exactly the kind of arbitrary loosening that produced the current escape hatches.
4. **Import boundaries stay.** `@fluentui/react-components` only inside `@/components/ui`; raw `tokens` only in `src/components/ui/**` and `src/styles/theme.ts`; no i18n inside components. These are what make the wrapper layer a closed API, and they are not style bans.
5. **Design-system carve-outs are recorded, never implicit.** `src/styles/theme.ts`, `src/styles/shared.ts`, `src/components/ui/**`, `src/theme/**` and the barrel files are design-system infrastructure and stay free of the page-layer rules. Where one of them genuinely needs relief from a global rule, the config must express it narrowly (exclude that file from that specific selector) and this list must name it. A blanket rule-level `"off"` with no record is not acceptable.

## 13. Progress

| Workstream                   | State                        | Evidence                                                                                                                                                                                 |
| ---------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A - honest and strict ESLint | done, independently reviewed | commits d5a36a1, dd86d7b, cfb2a0a; ledger 67 files / 212 raw mappings; 8 page-layer rules; 7 regression tests; effective config compared across 893 files with zero unplanned weakenings |
| B - theme settings feature   | not started                  |                                                                                                                                                                                          |
| C - page conversions         | not started                  | 64 of 158 pages carry styling debt                                                                                                                                                       |
| D - encapsulation proof      | not started                  |                                                                                                                                                                                          |

Operational notes:

- The browser gate needs `PLAYWRIGHT_BROWSERS_PATH=/root/fluent-enterprise-ui/node_modules/.cache/ms-playwright` on this host. The system browser cache at `/root/.cache/ms-playwright` does not hold the revision Playwright 1.64.1 expects, and that directory is outside the writable workspace.
- Known and accepted limitation: a px literal assigned to a const and passed to a prop later is not detected, because that needs dataflow analysis. Measured at zero occurrences across all 156 page files today.
- Review history for A: task-22 PASS with three minors; task-25 FAIL with one blocker (narrowing the literal rules to style containers dropped 25 files of real px debt from the ledger); task-27 PASS with zero blockers and zero majors.
