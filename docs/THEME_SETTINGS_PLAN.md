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

| Workstream                   | State                        | Evidence                                                                                                                                                                                                                                                                                                                       |
| ---------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A - honest and strict ESLint | done, independently reviewed | commits d5a36a1, dd86d7b, cfb2a0a; ledger 67 files / 212 raw mappings; 8 page-layer rules; 7 regression tests; effective config compared across 893 files with zero unplanned weakenings                                                                                                                                       |
| B - theme settings feature   | done, independently reviewed | commits 7bc02a2, b2366e5, 9e60ddc, 73cc792; the provider is the single mapping point; defaults are token-identical to the base in both schemes (459/459 keys); six settings measured reaching rendered output; the panel page carries no ledger entry; review history task-30 FAIL (2 blockers) then task-32 PASS (0 findings) |     |
| C - page conversions         | in progress                  | ledger 62 files / 196 raw mappings: 57 pages plus 5 shared dialog style modules; 6 pages done (pilot plus batch 1), each with its own parity evidence and independent review verdict                                                                                                                                           |
| D - encapsulation proof      | not started                  |                                                                                                                                                                                                                                                                                                                                |

Operational notes:

- The browser gate needs `PLAYWRIGHT_BROWSERS_PATH=/root/fluent-enterprise-ui/node_modules/.cache/ms-playwright` on this host. The system browser cache at `/root/.cache/ms-playwright` does not hold the revision Playwright 1.64.1 expects, and that directory is outside the writable workspace.
- Known and accepted limitation: a px literal assigned to a const and passed to a prop later is not detected, because that needs dataflow analysis. Measured at zero occurrences across all 156 page files today.
- Review history for A: task-22 PASS with three minors; task-25 FAIL with one blocker (narrowing the literal rules to style containers dropped 25 files of real px debt from the ledger); task-27 PASS with zero blockers and zero majors.
- Review history for the C pilot and batch 1: task-34 PASS (one minor: the new primitives had no component test, since fixed); task-38 PASS for all five pages (two minors: five pages shared one commit, and the parity helper measured only the first card per page - both are addressed in section 14 above). The pre-C hardening round task-36 measured the widened literal rules against the old ones and found zero lost detections and 68 gained, so the rules used to judge every remaining page are strictly stricter than the ones used for the pilot.
- Parity subtlety found in batch 3: the base renders some icon+label values inside an inline-flex span. Because that span sits on a text line it picks up the baseline descender, so rebuilding the same value as a block-level flex box makes its container about 6px shorter and parity fails. `Stack` therefore gained an `inline` option. Any page whose value pairs an icon with a label needs it, and a 6px container delta is the symptom to look for.
- Operational: the host SIGTERM-kills a single long `npm run test:browser` run under contention, with no assertion failure. Run the browser project in chunks of about eight test files and report the union; a single killed run is not a test failure, and reporting one as green would be. The lead prunes scratch worktrees once the review that used them has finished.
- The twelve re-pins landed as `b3ea67e` (12 tests plus 12 fixtures captured at each page's own conversion parent). Every base capture matched today's rendering on the first run, so none of the twelve conversions had changed anything the old tests could not see - the gap was in the evidence, not in the work. Falsification: changing the second field label on each page reddened all twelve. The same run also reproduced the fixed-sleep race in two of 53 browser files, independently confirming the diagnosis. The exact-protocol artifact was then produced rather than inferred: each page was re-captured at its own conversion parent with the corrected walk, and all twelve came out JSON-identical to the already-committed fixtures, so no fixture needed replacing and no regression exists. For contrast, `GenericTableDetailPage` was the file whose browser failure started this investigation, and its fixture is genuinely wrong: its walk prefers aside buttons and falls back to `[role=tab]`, and the fixture holds a selected tab's label in the unselected state (rgb(66,66,66), weight 400), which is a pre-commit capture. That explains the direction the flake appeared in - an isolated re-run passed because the sleep landed mid-commit again and matched the bad fixture, while a contended chunk run captured the settled state and failed. The failure was never environmental and the fixture was never right.
- A fixed sleep is not synchronisation, and a computed-colour difference in the browser gate is not environmental. Every `pageFingerprint` test carried its own copy of a walk that did `button.click(); await sleep(300); capture()`. A Fluent tab commits its selected state asynchronously: synchronously after the click it is still `aria-selected=false` and its label text is doubled, because the unselected state renders a reserved-space span holding the same text; the flip lands somewhere between 0 and 60ms. Under contention the commit can exceed the sleep, so the capture lands in a well-defined intermediate state whose only difference from the fixture is the tab label's colour and weight - `#424242`/400 unselected against `#242424`/600 selected, which is `colorNeutralForeground2` against `colorNeutralForeground1`. That is how a browser-gate failure came out as `rgb(66,66,66)` vs `rgb(36,36,36)` and was first written off as environmental; the mechanism is deterministic and the fix is to wait on `aria-selected` before capturing, the same shape as the batch-3 QueriesPage fix. The theme-leak hypothesis was tested and refuted: a `window` global and a `localStorage` key set in one test file were not visible in the next file of the same invocation. Verdict: a MAJOR defect in the test suite, not in the product, because a test that fingerprints a mid-render state will fail intermittently for the rest of the project. The walk was also duplicated into every test file, so it is fixed once in `src/test-utils.tsx` and imported, rather than being patched wherever it was copied.
- A sensitivity audit of parity tests must handle template literals. The first attempt at auditing MaterialTransferDetailPage's rows reported SKIP for every row, because those labels are `t(`${f}.name`)` rather than string literals, so a grep for a quoted label found nothing; with the pattern fixed every row reddened like the others. Recorded because a grep-based audit of this class silently reports false coverage, and false coverage is the exact failure it exists to detect.
- Add `--maxWorkers=1` to the browser gate on this host. Under contention the vite dev server intermittently fails to serve a dynamically imported module, which fails a whole chunk at import with no tests run; serialising the workers removed that failure mode entirely, and chunks then completed cleanly. Keep running in chunks as well.
- Contention changes the browser gate's failure mode. When the writer and the reviewer run the browser project at the same time, chunks can fail environmentally - `Matcher did not succeed in time` or a vite module-fetch error on import - rather than on an assertion. Re-run the affected files in isolation before calling them failures; every file that failed that way passed on an isolated re-run. Only the union of files and tests is meaningful; per-chunk counts depend on how the files were grouped.

## 14. Workstream C execution protocol

C converts the debt pages onto the composition pattern that workstream B proved.

**Batch policy, set from measurement rather than from the original estimate.** This section first said one page is one task. The measurements say otherwise. The pilot cost 22 minutes for a single page. Batch 1, run after the shared primitives and the shared parity helper existed, cost about 23 minutes for five pages, of which roughly 13 minutes was fixed task overhead (recon, probe authoring, base capture in a worktree, ledger, gates, commit) and about 1.5-2 minutes was marginal per page. Paying that fixed cost once per page does not make the work safer, it multiplies it.

So a task carries a batch of up to six pages of the same shape. What does not change, and is not negotiable, is that every page in the batch carries its own commit, its own parity test, its own ledger deletion, its own gates, its own review verdict and its own checklist row. One page per commit is what keeps a bad pattern revertable in isolation: it is the substitute for one page per task, not an omission. A batch whose diff cannot be reviewed page by page is a finding against the batch, not a shortcut.

Per-task shape:

1. **Selection.** Pages are taken one at a time in checklist order, grouped by feature, so a task never spans two features.
2. **Write scope.** The task declares the page file, the ledger and meta-test files, and the component-layer files that will hold any new primitive. A primitive that does not exist yet is added to `src/components/common/**` or `src/components/ui/**` inside the same task, and the task names it up front. A page never works around a missing primitive.
3. **The conversion.** The page is re-expressed with composition primitives. Creating a style module under `src/features/**` in order to satisfy the page rules is not a conversion and is a review blocker on its own: moving a `makeStyles` block from a page file into a sibling file changes nothing about the page's coupling, it only moves the text. Styles that a page genuinely needs belong to a primitive in the component layer, added in the same task. Raw `tokens` stay confined to `src/components/ui/**` and `src/styles/theme.ts`.
4. **Ledger, in the same commit.** The page's entries are deleted from `eslint.page-debt.json`, and the baselines in `src/eslint.page-debt.test.ts` are lowered to the new actual counts. During C the baseline may only move down. An upward move is a finding, not a bump.
5. **Worker gates.** `npx eslint .`, `npx tsc --noEmit`, `npm run test:unit`, `npm run format:check`, `npm run check:deps`, and the browser gate.
6. **Visual parity evidence.** Computed-style values for the converted page's route, before and after, captured at the base commit in a worktree. The assertion covers EVERY card and field row the page renders, not just the first one: batch 1's review measured only the first card of each page, so an anomaly confined to a later card would have been invisible to both the helper and the page test. It also covers the grid's computed layout rather than only the inline template, since a difference that appears after CSS resolution is still a visual difference.
7. **Review.** The reviewer independently confirms that the page has no ledger entry, that the rules really fire on it by injecting a violation and watching it fail, that rendering is unchanged, that no rule was weakened and that no suppression was added. The reviewer specifically confirms that the entry was deleted rather than the rule narrowed to fit, and that the page's styling now lives in the component layer rather than in a new file beside the page. A conversion whose diff is mostly a relocation is rejected, not accepted.
8. **Done.** A page is done only after the review passes. Its checklist row records the commit, the verdict and the reviewer.

Cadence:

The pilot page runs alone, end to end, to measure what a conversion actually costs. The cadence for the remaining pages is set from that measurement rather than estimated in advance. Per-page rigour is not negotiable - every page gets its own gates, its own parity evidence, its own reviewer verdict and its own checklist row. What the measurement decides is only how many pages share a worker task and a review window, never whether a page is verified.

### 14a. Props a page is allowed to pass

These rules exist because the batch that converted the checklist and data-collection pages hit a trap that cost a review cycle, and because the same trap would otherwise catch every remaining page one at a time.

`DetailCard` had grown a `titleVariant?: "section" | "compact"` prop. It renders correctly, it was tested, and no page could use it: `titleVariant="compact"` is an `i18next/no-literal-string` error inside `src/features/**`, and so is `titleVariant={"compact"}`. Only hoisting the string to a const escapes the rule, which is a dodge rather than a design. The prop was therefore dead API that advertised a capability pages could not exercise. It is removed; the compact title survives as `DetailCardTitle`, an exported component used as a card child.

The review that settled this also measured the justification first offered for the child form - that it was needed to keep the title a direct child of the card so the full-width bottom border matched. Both forms render the title as a direct child with byte-identical computed styles; the stated reason was false and the real reason was only the lint rule. Record the real reason, not a plausible one.

The rules, which apply to every remaining page and to any future primitive:

**R1.** A prop a page is expected to pass in JSX must be usable from a page with NO config edit. Either express the variation as a child or a variant component that takes no string-literal enum, which is the `DetailCardTitle` pattern, or - if a shipping page will genuinely pass a literal enum - add that attribute name to the `i18next/no-literal-string` exclusion list **in the same commit**, with a one-line justification that the prop cannot carry user-visible text.

**R2. Necessity test for an exclusion.** An exclusion may only be added for a prop that shipping page or component code already uses. `mb`, `tone` and `headerGap` qualified because pages use them today. An exemption for a prop with zero users is convenience and is rejected.

**R3.** Never hoist a const in a page purely to avoid the i18n rule.

**R4. Dead props.** A prop added for a page that ends up not using it is deleted in the same batch. Deleting an unused prop always beats widening an exclusion.

**R5. Reviewer gate.** Before a batch lands, the reviewer greps every new string-literal prop and every new primitive prop for use under `src/features/**`. Anything that would error there is removed, or exempted with a necessity justification, in the same commit.

**R6. A new generic prop must name its second consumer, in the commit message.** A prop, option or variant added to a shared primitive is justified by the number of call sites it serves, not by the difficulty of the page that prompted it. State the second consumer by name; if there is no second consumer today, the page reuses an existing primitive instead, or the variation is expressed as composition. This rule came out of the review of the `QueryDetailPage` deferral: the writer estimated six to eight new knobs were needed, and the reviewer checked them one by one and found about three to four real (overflow, shrink, chat bubbles - each with named consumers such as AiChatPage, the dialogs, and forty-eight shrink sites), while the rest were already covered by `Stack.p` (which takes raw shorthand such as `6px 0`), `KV`, `DetailCardTitle` with `Stack.mb`, `SidePanel.width` and `Input`. The one claim with no second consumer - a tinted, bordered surface variant - was the one that should reuse an existing component rather than be minted. Overstated primitive needs are the same failure as a dead prop: both spend the shared surface to make one page easy.

A related note on the same class of error: a new string-literal prop that a page _can_ use still needs its attribute name in the exclusion list, otherwise the page cannot compile under lint. Widening that list is a real change to the ruleset, so it is disclosed and reviewed like any other, and R2 decides whether it is allowed.

## 15. What the checklist is for

`docs/PAGE_ENCAPSULATION_CHECKLIST.md` is the task ledger for C, not documentation. It holds one row per page, with per-rule columns showing the debt that must reach zero and Status / Owner / Review / Commit columns recording the outcome. A row is authoritative only when its Commit column holds a sha and its Review column holds a reviewer verdict. The summary counts at the top are recomputed from the rows, and at the end of each wave the file is reconciled against `eslint.page-debt.json`: the two must agree, and any disagreement is a finding about the ledger rather than about the checklist.
