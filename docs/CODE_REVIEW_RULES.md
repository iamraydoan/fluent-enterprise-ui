# Code Review Rules

Rubric for this workstream. Applies to every task under `docs/THEME_SETTINGS_PLAN.md`. Companion: `docs/PAGE_ENCAPSULATION_CHECKLIST.md`.

## 1. Roles

| Role        | May write product code           | Responsibility                                              |
| ----------- | -------------------------------- | ----------------------------------------------------------- |
| Lead        | no                               | owns plan, checklist, sequencing; runs final acceptance     |
| Implementer | yes, inside its task write scope | produces the change plus raw evidence                       |
| Reviewer    | no                               | independently reproduces the evidence and returns a verdict |

The reviewer must never be the author of the change under review. A review that only reads the author's summary is not a review.

## 2. Severities

| Level   | Meaning                                                           | Effect                 |
| ------- | ----------------------------------------------------------------- | ---------------------- |
| Blocker | breaks a gate, changes behaviour or rendering, or hides a problem | task cannot complete   |
| Major   | wrong contract, missing evidence, ledger not updated, scope creep | task cannot complete   |
| Minor   | style, naming, wording                                            | may complete; recorded |
| Info    | observation, optional follow-up                                   | recorded only          |

A task completes only with zero blockers and zero majors.

## 3. Never allowed

These fail review on sight:

- `eslint-disable`, `eslint-disable-next-line`, `@ts-ignore`, `@ts-nocheck`, `@ts-expect-error`, `prettier-ignore`.
- Any comment under `src/**` (`local/no-comments` is an error; the repo is comment-free by policy).
- Weakening, deleting or re-scoping an ESLint rule to make a change fit. The config is the contract; the code is what must change.
- Adding an escape hatch: a new `ignores` entry, a new per-file rule override, or a ledger entry that was not there before. The ledger is append-forbidden and may only shrink.
- Running `--no-verify`, `--no-git-hooks`, or any equivalent bypass of a git hook.
- Repo-wide `prettier --write` or `npm run format` outside an explicitly scoped formatting task.
- Editing files outside the task write scope, or touching `docs/*.md` the Lead owns.

## 4. Evidence requirements

Every completion report states raw command output, not paraphrases. Minimum:

| Gate       | Required evidence                                        |
| ---------- | -------------------------------------------------------- |
| Lint       | `npx eslint .` exit code and finding count               |
| Types      | `npx tsc --noEmit` exit code                             |
| Unit       | `npm run test:unit` file and test counts                 |
| Browser    | `npm run test:browser` file and test counts              |
| Format     | `npm run format:check` exit code                         |
| Boundaries | `npm run check:deps` exit code                           |
| Debt       | the page's ledger entry removed, and the meta test green |

If a gate cannot run (host load, flake), say so explicitly and name the blocker. An unrun gate is reported as unrun, never as passing.

## 5. Page conversion review

Verify, on the converted page:

1. **No page-layer styling.** Zero `makeStyles`, zero `style={{...}}`, zero literal px/hex/radius, no `@/styles/theme` import, no settings-store or config import.
2. **No conditional styling.** No `style`/`className` ternary or `&&` whose branches differ only in appearance. Data/loading/empty/error branching is fine and must stay.
3. **Composition only.** Layout comes from `@/components/common` or `@/components/ui` primitives and their documented props.
4. **Behaviour identical.** Same props, same callbacks, same accessible names and roles, same keyboard and click behaviour. Any DOM change is called out explicitly, with the reason.
5. **Visual parity.** Computed-style comparison before and after at the same viewport and same theme: geometry, colour, spacing, typography. Report any intentional delta with its exact numbers - an unreported pixel shift is a blocker.
6. **Ledger updated.** The page's entry is gone; no other entry changed.
7. **Scope.** Exactly one page per commit (or one documented group); no drive-by edits.

## 6. ESLint / config change review

1. `git diff` on `eslint.config.js` contains only the intended rule additions or removals; nothing else moved.
2. Effective-config comparison: for every non-test file under `src/`, the computed rule set after the change must be equal to or stricter than before. Report any file whose effective rules became weaker, with the rule and the reason. There must be zero unplanned weakenings.
3. Every newly banned pattern must have a documented replacement in the same commit. A ban with no migration path is a blocker.
4. The ledger's meta test must fail if an entry is re-added; prove it by temporarily adding one and showing the test go red.
5. `npx eslint .` still exits 0.

## 7. Settings feature review

1. The store holds plain data only: no JSX, no style objects, no branching on appearance.
2. The provider is the single place that maps settings onto the theme/token layer. Pages and components read tokens, never the store.
3. Every setting demonstrably reaches the rendered output; for each setting, name the page and the property that changed.
4. Settings are persisted and resettable; defaults equal today's rendering exactly.
5. The panel itself obeys every page-layer rule and handles keyboard access and labels.
6. No page imports the store or the config. Verified by grep, and by the encapsulation test.

## 8. Verifying visual parity

Preferred method, in order:

1. Render before and after in the browser test environment at the same viewport and theme; capture computed styles for the elements the change touched, and compare maps. Report the raw pairs.
2. Where a computed-style capture is not practical, compare geometry (bounding boxes) and the specific properties changed.
3. A screenshot diff is acceptable as supporting evidence only; it is not a substitute for comparing computed values.

Static equivalence arguments ("the primitive supplies the same declarations") are acceptable for bulk, low-risk conversions only when the reviewer independently confirms the removed declarations are exactly the ones the primitive supplies.

## 9. Verdict format

Every review returns:

- one PASS or FAIL per checklist section, with raw evidence;
- findings by severity, each with a minimal proposed fix (the reviewer proposes, the implementer applies);
- an explicit list of anything not verified and why;
- a final verdict line.

## 10. Completion criteria

A task is complete when: all gates green with evidence, zero blocker and zero major findings, the ledger entry removed, the checklist row updated, and the reviewer's verdict recorded. Anything less stays open.
