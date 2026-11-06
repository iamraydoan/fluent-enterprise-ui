# Architecture Review & Code Cleanup Plan

**Review Date**: 2024-11-04  
**Overall Assessment**: Senior-level code with excellent foundation  
**Current State**: 8/10 - Strong architecture, needs consistency refinements

## Executive Summary

This codebase demonstrates strong architectural patterns with proper abstraction layers for UI libraries and design systems. The wrapper pattern and enforced boundaries make it well-positioned for future changes (like Fluent v9→v12 or table library swaps in the future).

**This review focuses on cleaning up inconsistencies in the current codebase** - no library upgrades or new features, just refactoring for consistency and maintainability.

## Current Architecture Strengths

### ✅ 1. UI Library Isolation

- All `@fluentui/react-components` imports restricted to `/src/components/ui/`
- ESLint rules enforce boundaries (no direct Fluent imports in features)
- Wrapper components provide consistent API layer
- **Files**: [button.tsx](../src/components/ui/button.tsx), [input.tsx](../src/components/ui/input.tsx), [table.tsx](../src/components/ui/table.tsx)

### ✅ 2. Table Library Isolation

- TanStack Table isolated to `/src/components/common/data-table/`
- Declarative column configuration for pages
- Adapter pattern converts configs to table library specifics
- **Files**: [tableAdapter.tsx](../src/components/common/data-table/tableAdapter.tsx)

### ✅ 3. Feature-Based Organization

- Clear separation: `/features/`, `/components/`, `/api/`
- Enforced import boundaries via ESLint
- Path aliases (@/) instead of relative imports

### ✅ 4. Code Quality Standards

- Strict TypeScript (no `any` allowed)
- No comments policy (self-documenting code)
- Comprehensive tooling (Knip, dependency-cruiser, Husky)

## Issues Found & Cleanup Plan

---

## 🔴 HIGH PRIORITY - Consistency Issues

### Issue #1: Inconsistent Theme Token Usage

**Problem**: Components bypass the semantic theme layer by directly importing `tokens` from Fluent UI.

**Why it matters**:

- Makes design system changes harder (need to update many files)
- Loses semantic meaning (`tokens.colorNeutralStroke2` vs `theme.color.border`)
- Defeats the purpose of the theme abstraction layer

**Found in**:

```
src/components/common/DetailShell.tsx:32, 64
src/components/common/data-table/DataTableCard.tsx
src/components/common/data-table/tableAdapter.tsx:44-49
src/components/common/ToastHost.tsx
src/components/common/WizardSteps.tsx
```

**Fix**: Replace direct `tokens.*` usage with `theme.color.*` / `theme.spacing.*`

**Example**:

```typescript
// ❌ BEFORE - bypasses theme layer
import { tokens } from "@fluentui/react-components";
borderBottom: `1px solid ${tokens.colorNeutralStroke2}`;

// ✅ AFTER - uses semantic theme
import { theme } from "@/styles/theme";
borderBottom: `1px solid ${theme.color.borderSubtle}`;
```

**Estimated effort**: 2 days

---

### Issue #2: Hardcoded Design Values

**Problem**: Spacing, sizing, and other design values are hardcoded instead of using tokens.

**Found in**: `src/styles/theme.ts:50-57`

```typescript
spacing: {
  xs: "4px",    // ❌ Hardcoded!
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px"
}
```

**Why it matters**:

- Can't adjust spacing system globally
- Inconsistent with Fluent's spacing tokens
- Creates drift between theme layer and source tokens

**Fix**: Map to Fluent spacing tokens

```typescript
spacing: {
  xs: tokens.spacingHorizontalXS,      // 4px - from Fluent
  sm: tokens.spacingHorizontalS,       // 8px
  md: tokens.spacingHorizontalM,       // 12px
  lg: tokens.spacingHorizontalL,       // 16px
  xl: tokens.spacingHorizontalXL,      // 20px
  xxl: tokens.spacingHorizontalXXL,    // 24px
}
```

**Estimated effort**: 1 day

---

### Issue #3: Incomplete Wrapper Component APIs

**Problem**: Some wrapper components lose type safety with `as object` casts.

**Found in**: `src/components/ui/button.tsx:39`

```typescript
<FluentButton
  ref={ref}
  appearance={variant}
  size={size ? SIZE_MAP[size] : undefined}
  {...(rest as object)}  // 🚨 Type safety lost!
/>
```

**Why it matters**:

- TypeScript can't catch invalid props at compile time
- Weakens the wrapper abstraction
- Props from underlying library leak through

**Fix**: Define explicit prop interfaces, remove casts

```typescript
export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  icon?: ReactNode;
  // ... all props explicitly typed
}
```

**Also found in**:

- `src/components/ui/input.tsx`
- `src/components/ui/dropdown.tsx`
- `src/components/ui/combobox.tsx`

**Estimated effort**: 2 days

---

### Issue #4: Duplicate Size/Variant Mappings

**Problem**: Each component has its own copy of size mapping logic.

**Found in**:

```typescript
// button.tsx - line 26-30
const SIZE_MAP: Record<ButtonSize, "small" | "medium" | "large"> = {
  sm: "small",
  md: "medium",
  lg: "large",
};

// input.tsx - line 43-47
const INPUT_SIZE_MAP: Record<InputSize, "small" | "medium" | "large"> = {
  sm: "small",
  md: "medium",
  lg: "large",
};

// field.tsx - line 105-109
const FIELD_SIZE_MAP: Record<FieldSize, "small" | "medium" | "large"> = {
  sm: "small",
  md: "medium",
  lg: "large",
};
```

**Why it matters**:

- Duplication (DRY violation)
- Harder to maintain consistency
- More work to update size system

**Fix**: Create shared type definitions and constants

```typescript
// src/components/ui/types.ts (new file)
export type ComponentSize = "sm" | "md" | "lg";
export type FluentSize = "small" | "medium" | "large";

export const SIZE_MAP: Record<ComponentSize, FluentSize> = {
  sm: "small",
  md: "medium",
  lg: "large",
} as const;
```

**Estimated effort**: 1 day

---

## 🟡 MEDIUM PRIORITY - Quality Improvements

### Issue #5: Missing Design System Documentation

**Problem**: No centralized documentation explaining the design system architecture.

**Impact**:

- Developers might bypass abstractions unknowingly
- Inconsistent usage patterns
- Onboarding friction

**Fix**: Create comprehensive documentation explaining:

- Why wrapper components exist
- When to use `theme.*` vs direct tokens
- How to add new components
- Design token reference

**Deliverable**: `docs/DESIGN_SYSTEM.md`

**Estimated effort**: 2 days

---

### Issue #6: Incomplete Theme Layer

**Problem**: Theme layer doesn't cover all design tokens that components need.

**Missing**:

- Shadow/elevation tokens
- Border width tokens
- Animation/transition tokens
- Z-index scale
- Extended font weight options

**Example need**: Components use `tokens.fontWeightBold` directly because `theme.font` doesn't include it.

**Fix**: Extend `src/styles/theme.ts` with complete token coverage

**Estimated effort**: 1 day

---

### Issue #7: No ESLint Rule for Token Usage

**Problem**: Nothing prevents developers from importing tokens directly in feature code.

**Current state**: ESLint only prevents direct Fluent UI component imports, not token imports.

**Fix**: Add rule to ban `tokens` imports outside `/components/ui/` and `/theme/`

```javascript
// eslint.config.js - add to fluentBan
{
  name: "@fluentui/react-components",
  importNames: ["tokens"],
  message: "Import tokens only in @/components/ui or @/theme. Use theme from @/styles/theme instead.",
}
```

**Estimated effort**: 0.5 days

---

## 🟢 LOW PRIORITY - Nice to Have

### Issue #8: Component Tests Need Expansion

**Current**: Some browser tests exist but coverage is incomplete.

**Fix**: Add unit tests for all wrapper components testing:

- Prop forwarding
- Size/variant mapping
- Event handler transformation
- Ref forwarding

**Estimated effort**: 3 days

---

### Issue #9: No Migration/Upgrade Documentation

**Current**: No guide for when library upgrades are needed in the future.

**Fix**: Create `docs/MIGRATION_GUIDE.md` documenting:

- How to update Fluent UI versions
- How to swap table libraries
- Testing strategy for breaking changes

**Estimated effort**: 1 day

---

## Implementation Plan

### Phase 1: Foundation Consistency (Week 1)

**Goal**: Fix theme token usage across the codebase

1. ✅ Complete theme layer (Issue #2, #6)
   - Replace hardcoded spacing with Fluent tokens
   - Add missing token categories

2. ✅ Audit and refactor token usage (Issue #1)
   - Find all direct `tokens.*` usage outside UI layer
   - Replace with semantic `theme.*` references
   - Update common components

3. ✅ Add ESLint enforcement (Issue #7)
   - Ban direct token imports in features
   - Run lint fix

**Deliverables**:

- Updated `src/styles/theme.ts`
- Refactored components using theme layer
- Updated `eslint.config.js`

**Success criteria**:

- `grep -r "tokens\." src/components/common` returns 0 results
- ESLint catches new violations

---

### Phase 2: Type Safety (Week 2)

**Goal**: Eliminate type casts, consolidate shared code

4. ✅ Create shared types (Issue #4)
   - Create `src/components/ui/types.ts`
   - Extract size/variant mappings

5. ✅ Fix wrapper component types (Issue #3)
   - Remove `as object` casts
   - Update Button, Input, Dropdown, Combobox
   - Use shared mappings

**Deliverables**:

- New `src/components/ui/types.ts`
- Refactored wrapper components with explicit types

**Success criteria**:

- TypeScript compiles with `--strict`
- No `as object` or `as any` in `/components/ui/`

---

### Phase 3: Documentation & Testing (Week 3)

**Goal**: Document the architecture, expand test coverage

6. ✅ Create design system docs (Issue #5)
   - Write `docs/DESIGN_SYSTEM.md`
   - Document all theme tokens
   - Add usage guidelines

7. ✅ Expand test coverage (Issue #8)
   - Add wrapper component tests
   - Test size/variant mappings

8. ✅ Create migration guide (Issue #9)
   - Write `docs/MIGRATION_GUIDE.md`
   - Document upgrade procedures

**Deliverables**:

- `docs/DESIGN_SYSTEM.md`
- `docs/MIGRATION_GUIDE.md`
- Expanded test suite

**Success criteria**:

- New developers can onboard from documentation
- 90%+ test coverage for wrapper layer

---

## File Impact Summary

### Files to Modify

**Theme Layer** (2 files):

- `src/styles/theme.ts` - complete token coverage
- `src/theme/index.ts` - verify consistency

**Component Wrappers** (8 files):

- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/dropdown.tsx`
- `src/components/ui/combobox.tsx`
- `src/components/ui/checkbox.tsx`
- `src/components/ui/switch.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/field.tsx`

**Common Components** (~10 files):

- `src/components/common/DetailShell.tsx`
- `src/components/common/Stack.tsx`
- `src/components/common/Section.tsx`
- `src/components/common/SidePanel.tsx`
- `src/components/common/ToastHost.tsx`
- `src/components/common/WizardSteps.tsx`
- `src/components/common/FormParts.tsx`
- `src/components/common/data-table/DataTableCard.tsx`
- `src/components/common/data-table/tableAdapter.tsx`

**Configuration** (1 file):

- `eslint.config.js` - add token import rule

### Files to Create

**New Files** (4 files):

- `src/components/ui/types.ts` - shared type definitions
- `docs/DESIGN_SYSTEM.md` - design system guide
- `docs/MIGRATION_GUIDE.md` - future upgrade guide
- `src/components/ui/__tests__/*.test.tsx` - wrapper tests

### Total Impact

- **Modify**: ~21 files
- **Create**: ~6 files (docs + tests)
- **Delete**: 0 files
- **No breaking changes**: All changes are internal refactoring

---

## Verification Checklist

After completing all phases:

### Automated Checks

- [ ] `npm run typecheck` - passes
- [ ] `npm run lint` - passes
- [ ] `npm run test` - all pass
- [ ] `npm run build` - successful
- [ ] `npm run knip` - no unused exports
- [ ] `npm run check:deps` - no violations

### Manual Verification

- [ ] Search codebase for `@fluentui/react-components` imports
  - Should only appear in `/components/ui/` and `/theme/`
- [ ] Search for `tokens.` usage outside UI layer
  - Should return 0 results in `/components/common/` and `/features/`
- [ ] Search for hardcoded spacing (`"4px"`, `"8px"`, etc.)
  - Should only appear in test files or mocks
- [ ] Search for `as object` or `as any` casts
  - Should not appear in wrapper components
- [ ] Review all wrapper components
  - Each should have explicit TypeScript interface
  - No props should leak from underlying library

### Code Quality Metrics

- [ ] All wrapper components have unit tests
- [ ] Test coverage ≥ 90% for UI component layer
- [ ] Design system documentation is complete
- [ ] Migration guide is comprehensive

---

## Success Metrics

### Before Cleanup

- Direct token usage: ~25 files
- Hardcoded values: Multiple locations
- Type safety: Good (some `as object` casts)
- Documentation: Minimal
- Test coverage: ~60% (estimated)

### After Cleanup

- Direct token usage: 0 files (outside UI layer)
- Hardcoded values: 0 (all use theme tokens)
- Type safety: Excellent (no type casts)
- Documentation: Comprehensive
- Test coverage: 90%+ for wrapper layer

### Maintainability Impact

- Design changes cascade automatically via theme
- Type safety prevents accidental API misuse
- Clear documentation reduces onboarding time
- Future library upgrades are isolated to wrapper layer

---

## Risk Assessment

### Low Risk Changes

- Theme token mapping (same pixel values, just sourced differently)
- Adding shared type definitions (doesn't change runtime)
- ESLint rule additions (catches issues, doesn't change code)
- Documentation (no code changes)

### Medium Risk Changes

- Refactoring common components to use theme layer
  - **Mitigation**: Visual regression tests, careful review
- Removing type casts from wrappers
  - **Mitigation**: Comprehensive prop typing, test coverage

### Zero Risk

- No library version changes
- No breaking API changes
- No feature additions
- All changes are internal refactoring

---

## Notes for Implementation

### Best Practices

1. **Work in small PRs**: One issue at a time for easier review
2. **Test before and after**: Ensure no visual regressions
3. **Update docs as you go**: Don't leave documentation for the end
4. **Run verification after each PR**: Catch issues early

### Branch Strategy

```
main
  ├─ refactor/theme-consistency (Issue #1, #2, #6, #7)
  ├─ refactor/type-safety (Issue #3, #4)
  └─ docs/design-system (Issue #5, #8, #9)
```

### Review Checklist for PRs

- [ ] No functional changes (same visual output)
- [ ] TypeScript compiles without errors
- [ ] All tests pass
- [ ] ESLint passes
- [ ] Documentation updated if applicable
- [ ] No console warnings in dev mode

---

## Additional Context

### Why These Changes Matter

**For current development**:

- More consistent codebase
- Better type safety catches bugs earlier
- Clearer patterns for new developers

**For future maintenance**:

- Design changes are easier (one place to update)
- Library upgrades are isolated (change wrappers, not pages)
- Onboarding is faster (clear documentation)

### Architecture Philosophy

This codebase already follows good architectural patterns:

1. **Abstraction layers** - UI libs wrapped, not used directly
2. **Declarative APIs** - Pages describe what, not how
3. **Enforced boundaries** - ESLint prevents violations
4. **Type safety** - TypeScript catches errors early

These refactoring tasks just **complete what was started** - making the abstractions consistent and comprehensive.

---

**Last Updated**: 2024-11-04  
**Next Review**: After Phase 3 completion  
**Estimated Total Effort**: 2-3 weeks (one developer) or 1 week (three developers in parallel)
