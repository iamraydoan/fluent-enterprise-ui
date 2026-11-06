# Code Cleanup Checklist

**Created**: 2024-11-04  
**Purpose**: Refactor current codebase for consistency (NO library upgrades)  
**Estimated Effort**: 2-3 weeks (1 developer) or 1 week (3 developers parallel)

---

## 🎯 Scope: Internal Refactoring Only

- ✅ Fix inconsistencies in current code
- ✅ Improve type safety
- ✅ Complete theme abstraction
- ✅ Add documentation
- ❌ NO library version upgrades
- ❌ NO new features
- ❌ NO breaking API changes

---

## 🔴 HIGH PRIORITY - Fix Consistency Issues

### Task Group 1: Theme Token Consistency (Days 1-3)

**Goal**: All components use semantic theme layer, no direct token imports outside UI layer

#### 1.1 Audit Current Token Usage

- [ ] Search for direct `tokens.*` imports outside `/components/ui/` and `/theme/`
- [ ] Create list of files violating the pattern
- [ ] Document current usage patterns

**Commands**:

```bash
# Find files importing tokens outside UI layer
grep -r "from \"@fluentui/react-components\"" src/components/common/ --include="*.tsx" --include="*.ts" | grep -v "__tests__"

# Find direct token usage
grep -r "tokens\." src/components/common/ --include="*.tsx" --include="*.ts" -n

# Find in features (should be none)
grep -r "tokens\." src/features/ --include="*.tsx" --include="*.ts" -n
```

**Expected violations**: ~25 files

#### 1.2 Complete the Theme Layer

- [ ] Open `src/styles/theme.ts`
- [ ] Replace hardcoded spacing values with Fluent tokens
- [ ] Add missing token categories (shadows, borders, animations)
- [ ] Add JSDoc comments explaining each token's purpose

**File**: `src/styles/theme.ts`

**Implementation**:

```typescript
import { tokens } from "@/components/ui";

export const theme = {
  color: {
    // Keep existing color tokens...
    textPrimary: tokens.colorNeutralForeground1,
    textSecondary: tokens.colorNeutralForeground2,
    // ... rest of existing colors
  },

  // ✅ FIX: Replace hardcoded spacing
  spacing: {
    xs: tokens.spacingHorizontalXS, // 4px
    sm: tokens.spacingHorizontalS, // 8px
    md: tokens.spacingHorizontalM, // 12px
    lg: tokens.spacingHorizontalL, // 16px
    xl: tokens.spacingHorizontalXL, // 20px
    xxl: tokens.spacingHorizontalXXL, // 24px
    xxxl: tokens.spacingHorizontalXXXL, // 32px
  },

  // ✅ ADD: Complete radius tokens
  radius: {
    none: tokens.borderRadiusNone,
    sm: tokens.borderRadiusSmall,
    md: tokens.borderRadiusMedium,
    lg: tokens.borderRadiusLarge,
    xl: tokens.borderRadiusXLarge,
    circular: tokens.borderRadiusCircular,
  },

  // ✅ EXPAND: Complete font tokens
  font: {
    weightRegular: tokens.fontWeightRegular,
    weightMedium: tokens.fontWeightMedium,
    weightSemibold: tokens.fontWeightSemibold,
    weightBold: tokens.fontWeightBold,
    sizeXs: tokens.fontSizeBase100,
    sizeSm: tokens.fontSizeBase200,
    sizeMd: tokens.fontSizeBase300,
    sizeLg: tokens.fontSizeBase400,
    sizeXl: tokens.fontSizeBase500,
    sizeXxl: tokens.fontSizeBase600,
  },

  // ✅ ADD: Shadow tokens for elevation
  shadow: {
    sm: tokens.shadow2,
    md: tokens.shadow4,
    lg: tokens.shadow8,
    xl: tokens.shadow16,
    xxl: tokens.shadow28,
  },

  // ✅ ADD: Duration tokens for animations
  duration: {
    fast: tokens.durationFast,
    normal: tokens.durationNormal,
    slow: tokens.durationSlow,
  },
} as const;
```

#### 1.3 Refactor Common Components

**Priority files** (most violations):

- [ ] **File**: `src/components/common/DetailShell.tsx`
  - Lines: 32, 49, 64, 67, 100
  - Replace: `tokens.colorNeutralStroke2` → `theme.color.borderSubtle`
  - Replace: `tokens.colorNeutralForeground1` → `theme.color.textPrimary`
  - Replace: `tokens.colorNeutralBackground1Hover` → `theme.color.surfaceHover`

- [ ] **File**: `src/components/common/data-table/DataTableCard.tsx`
  - Replace `tokens.*` with `theme.*` throughout
  - Import `theme` from `@/styles/theme`

- [ ] **File**: `src/components/common/data-table/tableAdapter.tsx`
  - Lines: 44-49 (color mapping)
  - Replace Fluent token colors with theme colors
  - Keep color mapping logic, just use theme layer

- [ ] **File**: `src/components/common/Stack.tsx`
  - Replace any direct token usage

- [ ] **File**: `src/components/common/Section.tsx`
  - Replace any direct token usage

- [ ] **File**: `src/components/common/SidePanel.tsx`
  - Replace any direct token usage

- [ ] **File**: `src/components/common/ToastHost.tsx`
  - Replace any direct token usage

- [ ] **File**: `src/components/common/WizardSteps.tsx`
  - Replace any direct token usage

- [ ] **File**: `src/components/common/FormParts.tsx`
  - Replace any direct token usage

**Pattern to follow**:

```typescript
// ❌ BEFORE
import { makeStyles, tokens } from "@fluentui/react-components";

const useStyles = makeStyles({
  container: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground1,
    backgroundColor: tokens.colorNeutralBackground1Hover,
  },
});

// ✅ AFTER
import { makeStyles } from "@/components/ui";
import { theme } from "@/styles/theme";

const useStyles = makeStyles({
  container: {
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    color: theme.color.textPrimary,
    backgroundColor: theme.color.surfaceHover,
  },
});
```

#### 1.4 Add ESLint Rule

- [ ] Open `eslint.config.js`
- [ ] Add rule to ban `tokens` imports outside UI/theme layer
- [ ] Test the rule catches violations
- [ ] Run `npm run lint:fix`

**File**: `eslint.config.js`

**Add to fluentBan** (around line 11-25):

```javascript
const fluentBan = {
  paths: [
    {
      name: "@fluentui/react-components",
      message: "Import UI only from @/components/ui (theme from @/theme).",
    },
    {
      name: "@fluentui/react-components",
      importNames: ["tokens"],
      message: "Import tokens only in @/components/ui or @/theme. Use theme from @/styles/theme.",
    },
    { name: "@fluentui/react-icons", message: "Import icons only from @/components/icons." },
  ],
  // ... rest
};
```

**Then add restriction rule**:

```javascript
{
  files: ["src/components/common/**", "src/features/**", "src/layouts/**"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@fluentui/react-components"],
            importNames: ["tokens"],
            message: "Use theme from @/styles/theme instead of direct token imports.",
          },
        ],
      },
    ],
  },
},
```

#### 1.5 Verify Task Group 1

- [ ] Run: `grep -r "tokens\." src/components/common/ | wc -l` → Should be 0
- [ ] Run: `npm run lint` → Should pass
- [ ] Run: `npm run typecheck` → Should pass
- [ ] Run: `npm run build` → Should succeed
- [ ] Visually test app → No visual changes

---

### Task Group 2: Fix Wrapper Component Types (Days 4-5)

**Goal**: Remove type casts, create shared type definitions

#### 2.1 Create Shared Types Module

- [ ] Create new file: `src/components/ui/types.ts`
- [ ] Define common types and mappings
- [ ] Export for use by all wrappers
- [ ] Add JSDoc documentation

**New File**: `src/components/ui/types.ts`

```typescript
/**
 * Shared type definitions for UI component wrappers
 *
 * These types provide a consistent API across all wrapper components,
 * abstracting away the underlying library's API surface.
 */

import type { ComponentPropsWithRef, ElementType } from "react";

/**
 * Standard size scale used across all components
 */
export type ComponentSize = "sm" | "md" | "lg";

/**
 * Standard variant/appearance options
 */
export type ComponentVariant = "primary" | "secondary" | "subtle" | "outline" | "transparent";

/**
 * Fluent UI's size nomenclature (internal mapping)
 */
export type FluentSize = "small" | "medium" | "large";

/**
 * Fluent UI's appearance nomenclature (internal mapping)
 */
export type FluentAppearance = "primary" | "secondary" | "subtle" | "outline" | "transparent";

/**
 * Maps our size API to Fluent UI's size API
 */
export const SIZE_MAP: Record<ComponentSize, FluentSize> = {
  sm: "small",
  md: "medium",
  lg: "large",
} as const;

/**
 * Maps our variant API to Fluent UI's appearance API
 */
export const APPEARANCE_MAP: Record<ComponentVariant, FluentAppearance> = {
  primary: "primary",
  secondary: "secondary",
  subtle: "subtle",
  outline: "outline",
  transparent: "transparent",
} as const;

/**
 * Helper type for polymorphic components (as prop support)
 */
export type PolymorphicComponentProps<T extends ElementType, Props = object> = Props &
  Omit<ComponentPropsWithRef<T>, keyof Props | "as"> & {
    as?: T;
  };
```

- [ ] Export from `src/components/ui/index.ts`:

```typescript
export type { ComponentSize, ComponentVariant } from "./types";
```

#### 2.2 Refactor Button Component

- [ ] Open `src/components/ui/button.tsx`
- [ ] Import shared `SIZE_MAP` from `./types`
- [ ] Remove local `SIZE_MAP` constant (line 26-30)
- [ ] Remove `as object` cast (line 39)
- [ ] Explicitly type all props that get forwarded

**File**: `src/components/ui/button.tsx`

```typescript
import { Button as FluentButton } from "@fluentui/react-components";
import { forwardRef } from "react";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { SIZE_MAP } from "./types";
import type { ComponentSize } from "./types";

export type ButtonVariant = "primary" | "secondary" | "subtle" | "transparent" | "outline";
export type ButtonSize = ComponentSize; // Use shared type

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: "before" | "after";
  shape?: "rounded" | "circular" | "square";
  type?: "button" | "submit" | "reset";
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  onMouseDown?: (e: MouseEvent<HTMLElement>) => void;
  className?: string;
  style?: CSSProperties;
  title?: string;
  autoFocus?: boolean;
  "aria-label"?: string;
  children?: ReactNode;
}

// ✅ Remove local SIZE_MAP - use shared one

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button({ variant, size, icon, iconPosition, ...rest }, ref) {
    return (
      <FluentButton
        ref={ref}
        appearance={variant}
        size={size ? SIZE_MAP[size] : undefined}
        icon={icon}
        iconPosition={iconPosition}
        {...rest} // ✅ Now properly typed - no cast needed
      />
    );
  },
);
```

#### 2.3 Refactor Input Component

- [ ] Open `src/components/ui/input.tsx`
- [ ] Remove local size mappings (lines 37-47, 105-109)
- [ ] Import shared `SIZE_MAP`
- [ ] Properly type all props

**File**: `src/components/ui/input.tsx`

```typescript
import {
  Input as FluentInput,
  Textarea as FluentTextarea,
  Field as FluentField,
} from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentRef, CSSProperties, KeyboardEvent, ReactElement, ReactNode } from "react";
import { SIZE_MAP } from "./types";
import type { ComponentSize } from "./types";

export type InputType =
  | "text" | "password" | "number" | "date" | "datetime-local" | "email" | "search" | "tel" | "url";

export type InputVariant = "outline" | "underline" | "filled";
export type InputSize = ComponentSize; // Use shared type

export interface InputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  type?: InputType;
  variant?: InputVariant;
  size?: InputSize;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  contentBefore?: ReactElement;
  contentAfter?: ReactElement;
  className?: string;
  style?: CSSProperties;
  autoFocus?: boolean;
  maxLength?: number;
  name?: string;
  id?: string;
  "aria-label"?: string;
}

const INPUT_VARIANT_MAP: Record<InputVariant, "outline" | "underline" | "filled-darker"> = {
  outline: "outline",
  underline: "underline",
  filled: "filled-darker",
};

// ✅ Remove INPUT_SIZE_MAP - use shared SIZE_MAP

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { onChange, variant, size, ...rest },
  ref,
) {
  return (
    <FluentInput
      ref={ref}
      onChange={onChange ? (_, data) => onChange(data.value) : undefined}
      appearance={variant ? INPUT_VARIANT_MAP[variant] : undefined}
      size={size ? SIZE_MAP[size] : undefined}
      {...rest}
    />
  );
});

// ... Similar fixes for Textarea and Field
```

#### 2.4 Refactor Other Components

- [ ] Update `src/components/ui/dropdown.tsx` - use shared types
- [ ] Update `src/components/ui/combobox.tsx` - use shared types
- [ ] Update `src/components/ui/checkbox.tsx` - properly type props
- [ ] Update `src/components/ui/switch.tsx` - properly type props
- [ ] Update `src/components/ui/dialog.tsx` - remove type casts

**Apply same pattern to each**:

1. Import `SIZE_MAP` from `./types`
2. Remove local size mapping constants
3. Remove any `as object` or `as any` casts
4. Ensure all props are explicitly typed

#### 2.5 Verify Task Group 2

- [ ] Run: `grep -r "as object" src/components/ui/ | wc -l` → Should be 0
- [ ] Run: `grep -r "as any" src/components/ui/ | wc -l` → Should be 0
- [ ] Run: `npm run typecheck` → Should pass with strict mode
- [ ] Run: `npm run test` → All tests pass
- [ ] Test component props in IDE → Autocomplete works correctly

---

## 🟡 MEDIUM PRIORITY - Quality & Documentation

### Task Group 3: Design System Documentation (Days 6-8)

**Goal**: Comprehensive documentation for developers

#### 3.1 Create Main Design System Guide

- [ ] Create file: `docs/DESIGN_SYSTEM.md`
- [ ] Document architecture and philosophy
- [ ] Explain abstraction layers
- [ ] Add usage guidelines

**New File**: `docs/DESIGN_SYSTEM.md`

**Template**:

```markdown
# Design System Guide

## Architecture Overview

### Abstraction Layers

This project uses a layered architecture to abstract UI library dependencies:
```

Features/Pages
↓ (import from @/components/ui)
Wrapper Components (our API)
↓ (import from @fluentui)
Fluent UI Components

```

**Why?** This allows us to:
- Change UI libraries without updating every page
- Maintain consistent API across the app
- Customize component behavior centrally
- Ensure type safety at the wrapper boundary

### Theme System

All design tokens are centralized in `src/styles/theme.ts`.

**Rule**: Always use `theme.*` tokens, never direct `tokens.*` from Fluent UI.

... (continue with full guide)
```

**Sections to include**:

1. Architecture overview
2. Theme system usage
3. Component API reference
4. Adding new components
5. Common patterns
6. Troubleshooting

#### 3.2 Document Theme Tokens

- [ ] Create reference table of all theme tokens
- [ ] Explain semantic meaning of each category
- [ ] Show usage examples
- [ ] Add visual reference (colors, spacing scale)

**Add to `docs/DESIGN_SYSTEM.md`**:

```markdown
## Theme Token Reference

### Colors

| Token                       | Semantic Meaning     | Use For              | Example                                             |
| --------------------------- | -------------------- | -------------------- | --------------------------------------------------- |
| `theme.color.textPrimary`   | Primary text color   | Body text, headings  | `<Text style={{ color: theme.color.textPrimary }}>` |
| `theme.color.textSecondary` | Secondary text color | Labels, captions     | ...                                                 |
| `theme.color.border`        | Standard border      | Dividers, containers | ...                                                 |
| `theme.color.borderSubtle`  | Subtle border        | Nested containers    | ...                                                 |

### Spacing

| Token               | Value | Use For                          |
| ------------------- | ----- | -------------------------------- |
| `theme.spacing.xs`  | 4px   | Tight spacing, icon margins      |
| `theme.spacing.sm`  | 8px   | Small gaps, compact layouts      |
| `theme.spacing.md`  | 12px  | Default spacing between elements |
| `theme.spacing.lg`  | 16px  | Section spacing                  |
| `theme.spacing.xl`  | 20px  | Large spacing                    |
| `theme.spacing.xxl` | 24px  | Extra large spacing              |

... (continue for all categories)
```

#### 3.3 Document Component APIs

- [ ] List all wrapper components
- [ ] Document props for each
- [ ] Show usage examples
- [ ] Document differences from Fluent UI

**Example section**:

````markdown
## Component API

### Button

**Props**:

- `variant`: "primary" | "secondary" | "subtle" | "outline" | "transparent"
- `size`: "sm" | "md" | "lg"
- `icon`: ReactNode
- ... (all props)

**Usage**:

```tsx
import { Button } from "@/components/ui";

<Button variant="primary" size="md" icon={<AddIcon />}>
  Click me
</Button>;
```
````

**Notes**:

- We use `variant` instead of Fluent's `appearance`
- Size uses our scale: sm/md/lg instead of small/medium/large

````

#### 3.4 Create Quick Reference
- [ ] Add "Do's and Don'ts" section
- [ ] Common mistakes to avoid
- [ ] Quick lookup table

**Example**:
```markdown
## Quick Reference

### ✅ DO
- Import from `@/components/ui`
- Use `theme.*` tokens
- Use shared types from `@/components/ui/types`
- Add new components to wrapper layer

### ❌ DON'T
- Import directly from `@fluentui/react-components`
- Use `tokens.*` outside `/components/ui/`
- Use hardcoded colors or spacing
- Bypass the wrapper layer
````

#### 3.5 Update Main README

- [ ] Add link to design system docs
- [ ] Add architecture overview diagram
- [ ] Update contributing guidelines

**File**: `README.md`

Add section:

```markdown
## Architecture

This project uses a layered architecture with abstracted UI components. See [Design System Guide](docs/DESIGN_SYSTEM.md) for details.

### Key Principles

- UI library dependencies are isolated to `/src/components/ui/`
- All design tokens centralized in `/src/styles/theme.ts`
- Features use declarative, library-agnostic APIs
```

#### 3.6 Verify Task Group 3

- [ ] Documentation is complete and accurate
- [ ] All examples compile and run
- [ ] Links work correctly
- [ ] New developers can understand the architecture

---

### Task Group 4: Testing & Validation (Days 9-10)

**Goal**: Ensure wrapper components work correctly

#### 4.1 Create Test Template

- [ ] Create `src/components/ui/__tests__/test-utils.tsx`
- [ ] Set up test helpers
- [ ] Create reusable test patterns

**New File**: `src/components/ui/__tests__/test-utils.tsx`

```typescript
import { render } from "@testing-library/react";
import { FluentProvider } from "@/components/ui";
import { theme } from "@/theme";

export function renderWithTheme(ui: React.ReactElement) {
  return render(
    <FluentProvider theme={theme}>
      {ui}
    </FluentProvider>
  );
}
```

#### 4.2 Add Wrapper Component Tests

- [ ] Test `Button` component
- [ ] Test `Input` component
- [ ] Test size/variant mapping
- [ ] Test ref forwarding
- [ ] Test event handlers

**Example**: `src/components/ui/__tests__/button.test.tsx`

```typescript
import { describe, it, expect, vi } from "vitest";
import { renderWithTheme } from "./test-utils";
import { Button } from "../button";

describe("Button", () => {
  it("renders children", () => {
    const { getByText } = renderWithTheme(<Button>Click me</Button>);
    expect(getByText("Click me")).toBeInTheDocument();
  });

  it("maps size correctly", () => {
    const { container } = renderWithTheme(<Button size="sm">Small</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("fui-Button--small");
  });

  it("forwards onClick handler", () => {
    const onClick = vi.fn();
    const { getByText } = renderWithTheme(<Button onClick={onClick}>Click</Button>);
    getByText("Click").click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards ref", () => {
    const ref = { current: null };
    renderWithTheme(<Button ref={ref}>Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
```

- [ ] Create similar tests for all wrapper components
- [ ] Aim for 90%+ coverage

#### 4.3 Add Visual Smoke Tests

- [ ] Create browser test for common components
- [ ] Verify no visual regressions
- [ ] Test in light theme

**File**: `src/components/ui/__tests__/visual-smoke.browser.test.tsx`

```typescript
import { test, expect } from "vitest";
import { Button, Input, Checkbox } from "@/components/ui";

test("components render without errors", async () => {
  const { container } = render(
    <>
      <Button>Test Button</Button>
      <Input placeholder="Test input" />
      <Checkbox label="Test checkbox" />
    </>
  );

  expect(container).toMatchSnapshot();
});
```

#### 4.4 Run Coverage Report

- [ ] Run: `npm run test:coverage`
- [ ] Review coverage report
- [ ] Add tests for uncovered lines
- [ ] Aim for 90%+ in wrapper layer

#### 4.5 Verify Task Group 4

- [ ] All tests pass
- [ ] Coverage ≥ 90% for `/components/ui/`
- [ ] No console errors during tests
- [ ] Browser tests pass

---

### Task Group 5: Migration Guide (Day 11)

**Goal**: Document procedures for future library updates

#### 5.1 Create Migration Guide

- [ ] Create file: `docs/MIGRATION_GUIDE.md`
- [ ] Document upgrade procedures
- [ ] Add troubleshooting tips
- [ ] Include rollback procedures

**New File**: `docs/MIGRATION_GUIDE.md`

````markdown
# Migration Guide

## Upgrading UI Libraries

### Fluent UI Version Updates

When a new Fluent UI version is released:

1. **Update dependencies**
   ```bash
   npm update @fluentui/react-components @fluentui/react-icons
   ```
````

2. **Check wrapper components** (`/src/components/ui/`)
   - Review Fluent UI changelog for breaking changes
   - Update size/variant mappings if needed
   - Fix any TypeScript errors

3. **Run tests**

   ```bash
   npm run test
   npm run typecheck
   ```

4. **Visual regression testing**
   - Start dev server: `npm run dev`
   - Manually test key pages
   - Check for visual changes

5. **Deploy to staging** for QA

**Rollback**: `git revert <commit>` and redeploy

... (continue with detailed steps)

````

**Sections**:
1. Upgrading Fluent UI
2. Swapping table libraries
3. Testing strategy
4. Rollback procedures
5. Common issues and fixes

#### 5.2 Document Testing Strategy
- [ ] Add section on testing during upgrades
- [ ] Document what to test
- [ ] Create testing checklist

#### 5.3 Add Troubleshooting
- [ ] Common upgrade issues
- [ ] Type error solutions
- [ ] Visual regression fixes

---

## 🟢 LOW PRIORITY - Polish (Optional)

### Task Group 6: Additional Type Safety

#### 6.1 Add Type Tests (Optional)
- [ ] Install: `npm install -D tsd`
- [ ] Create type tests
- [ ] Verify prop inference

#### 6.2 Strict Mode Check (Optional)
- [ ] Enable all strict TypeScript flags
- [ ] Fix any new errors
- [ ] Document strict mode compliance

---

## Validation Checklist

### After Each Phase

Run these commands:

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Tests
npm run test

# Build
npm run build

# Check for unused exports
npm run knip

# Check dependencies
npm run check:deps
````

### Final Verification

- [ ] **No direct token imports outside UI layer**

  ```bash
  grep -r "import.*tokens.*from.*@fluentui" src/components/common/ src/features/
  # Should return nothing
  ```

- [ ] **No hardcoded spacing values**

  ```bash
  grep -r '"[0-9]\+px"' src/styles/theme.ts
  # Should return nothing in spacing section
  ```

- [ ] **No type casts in wrappers**

  ```bash
  grep -r "as object\|as any" src/components/ui/*.tsx
  # Should return nothing
  ```

- [ ] **All wrapper components tested**

  ```bash
  npm run test:coverage
  # Check coverage report for src/components/ui/
  ```

- [ ] **Documentation complete**
  - [ ] `docs/DESIGN_SYSTEM.md` exists and is comprehensive
  - [ ] `docs/MIGRATION_GUIDE.md` exists
  - [ ] README.md updated

- [ ] **No visual regressions**
  - [ ] Start app: `npm run dev`
  - [ ] Visually test key pages
  - [ ] Test form interactions
  - [ ] Test dialogs and menus

---

## Progress Tracking

### Week 1: Foundation

- **Days 1-3**: Task Group 1 (Theme consistency)
- **Days 4-5**: Task Group 2 (Type safety)

### Week 2: Quality

- **Days 6-8**: Task Group 3 (Documentation)
- **Days 9-10**: Task Group 4 (Testing)
- **Day 11**: Task Group 5 (Migration guide)

### Week 3: Review & Polish (if needed)

- Code review
- Address feedback
- Polish documentation
- Final validation

---

## Success Criteria

### Code Quality

- ✅ Zero direct token imports outside UI layer
- ✅ Zero hardcoded design values
- ✅ Zero type casts in wrapper components
- ✅ 90%+ test coverage for UI layer
- ✅ All TypeScript strict checks pass
- ✅ All ESLint rules pass

### Documentation

- ✅ Comprehensive design system guide
- ✅ Complete theme token reference
- ✅ Component API documentation
- ✅ Migration procedures documented

### Maintainability

- ✅ Consistent patterns throughout
- ✅ Clear separation of concerns
- ✅ Easy to onboard new developers
- ✅ Ready for future library updates

---

## Notes for Implementation

### Working Style

- **Small commits**: One logical change per commit
- **Descriptive messages**: Use conventional commits format
- **Test frequently**: Run tests after each file change
- **Visual check**: Preview changes in browser regularly

### Branch Strategy

```
main
  ├─ refactor/theme-tokens          (Task Group 1)
  ├─ refactor/wrapper-types          (Task Group 2)
  ├─ docs/design-system              (Task Group 3)
  ├─ test/wrapper-components         (Task Group 4)
  └─ docs/migration-guide            (Task Group 5)
```

### PR Checklist

- [ ] All tests pass
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] No visual regressions
- [ ] Documentation updated
- [ ] Commit messages follow conventions

---

## Ready for Agent Assignment

This checklist is ready to be used by agents or developers. Each task group can be worked on independently (except Task Group 2 should wait for Task Group 1 to complete).

**Recommended assignment**:

- **Agent 1**: Task Groups 1 (Theme consistency)
- **Agent 2**: Task Groups 2 (Type safety) - starts after Agent 1
- **Agent 3**: Task Groups 3, 5 (Documentation)
- **Agent 4**: Task Group 4 (Testing)

---

**Last Updated**: 2024-11-04  
**Status**: Ready for implementation
