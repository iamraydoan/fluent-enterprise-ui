# Design System

This document describes the design system as it exists in the repository at HEAD. It covers the layer architecture, the semantic theme, the wrapper component API, the enforced lint boundaries and the testing strategy.

See also:

- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - upgrading Fluent UI, swapping the table library, testing and rollback.
- [ARCHITECTURE_REVIEW.md](ARCHITECTURE_REVIEW.md) - the recorded review of the design-system work.

## 1. Architecture overview

Product code never talks to Fluent UI directly. Every primitive is wrapped, and every design value comes from a semantic theme.

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

Cross-cutting layers:

| Layer        | Path                                         | Purpose                                                     |
| ------------ | -------------------------------------------- | ----------------------------------------------------------- |
| Theme        | `src/styles/theme.ts`                        | Semantic token facade (`theme.color`, `theme.spacing`, ...) |
| Fluent theme | `src/theme/index.ts`                         | The Fluent `Theme` object passed to `FluentProvider`        |
| Wrapper UI   | `src/components/ui/**`                       | Closed wrapper API over Fluent UI                           |
| Icons        | `src/components/icons/**`                    | Re-exported Fluent icons                                    |
| Common       | `src/components/common/**`                   | DetailShell, HubPage, data-table, HStack/VStack/TileGrid    |
| i18n         | `src/i18n/**`                                | The only place that imports i18next                         |
| Shared       | `src/lib/**`, `src/data/**`, `src/stores/**` | Helpers, navigation data, Zustand stores                    |

### The five rules

1. `src/components/ui/**` is the only application layer that imports `@fluentui/react-components`; `src/theme/index.ts` is the only other file that does, and only for `webLightTheme`.
2. `src/components/icons/**` is the only layer that imports `@fluentui/react-icons`; the wrapper layer explicitly rejects it. Everyone else imports icons from `@/components/icons`.
3. Design values always come from `theme` (`@/styles/theme`). Raw `tokens.*` is read only by `src/styles/theme.ts`.
4. There are no comments anywhere under `src/**`; the `local/no-comments` ESLint rule is an error.
5. The wrapper layer is a closed API: each wrapper declares its own props interface, never `any`, and never leaks Fluent props it did not declare.

## 2. Theme system

The theme is split in two files:

- `src/theme/index.ts` defines the Fluent `Theme` passed to `FluentProvider`: `webLightTheme` with three overrides - `fontFamilyBase` = `"Noto Sans","Segoe UI",system-ui,sans-serif`, `colorBrandForeground1` = `#1a6fc4` and `colorBrandForegroundLink` = `#1a6fc4`.
- `src/styles/theme.ts` exposes the semantic facade used by application code: `theme.color`, `theme.font`, `theme.radius`, `theme.spacing`, `theme.shadow`, `theme.duration` and `theme.borderWidth`, 69 keys in total. Every key forwards to a Fluent token.

Fluent tokens are CSS custom properties (for example `var(--colorNeutralForeground1)`), so the concrete value is resolved at runtime by the active `FluentProvider` theme. The "Resolved (light)" column below is the value under the application theme (light) at HEAD.

`src/styles/theme.ts` is deliberately exempt from the token-import ban: it is the single place allowed to read raw `tokens`. Every other layer imports `theme` from `@/styles/theme`.

### 2.1 Color - `theme.color`

| Key                     | Fluent token                           | Resolved (light)         | Semantic meaning               |
| ----------------------- | -------------------------------------- | ------------------------ | ------------------------------ |
| `textPrimary`           | `colorNeutralForeground1`              | `#242424`                | Default body text and headings |
| `textSecondary`         | `colorNeutralForeground2`              | `#424242`                | Supporting text                |
| `textTertiary`          | `colorNeutralForeground3`              | `#616161`                | Tertiary text, metadata        |
| `textQuaternary`        | `colorNeutralForeground4`              | `#707070`                | Lowest-emphasis text and icons |
| `textOnBrand`           | `colorNeutralForegroundOnBrand`        | `#ffffff`                | Text and icons on a brand fill |
| `textDanger`            | `colorPaletteRedForeground1`           | `#bc2f32`                | Error text                     |
| `textSuccess`           | `colorPaletteGreenForeground1`         | `#0e700e`                | Success text                   |
| `textSuccessStrong`     | `colorPaletteGreenForeground3`         | `#107c10`                | High-emphasis success text     |
| `textWarning`           | `colorPaletteYellowForeground2`        | `#817400`                | Warning text                   |
| `textWarningStrong`     | `colorPaletteDarkOrangeForeground1`    | `#c43501`                | High-emphasis warning text     |
| `textBrand`             | `colorBrandForeground1`                | `#1a6fc4` (app override) | Brand and link text            |
| `textBrandSecondary`    | `colorBrandForeground2`                | `#115ea3`                | Brand text hover/pressed       |
| `border`                | `colorNeutralStroke1`                  | `#d1d1d1`                | Default control border         |
| `borderSubtle`          | `colorNeutralStroke2`                  | `#e0e0e0`                | Subtle separators and dividers |
| `borderBrand`           | `colorBrandStroke1`                    | `#0f6cbd`                | Brand border and focus ring    |
| `borderDanger`          | `colorPaletteRedBorder1`               | `#f1bbbc`                | Invalid/danger border          |
| `borderWarning`         | `colorPaletteYellowBorder1`            | `#fef7b2`                | Warning border                 |
| `surface`               | `colorNeutralBackground1`              | `#ffffff`                | Default page and card surface  |
| `surfaceHover`          | `colorNeutralBackground1Hover`         | `#f5f5f5`                | Hovered neutral surface        |
| `surfaceSelected`       | `colorNeutralBackground1Selected`      | `#ebebeb`                | Selected neutral surface       |
| `surfaceSecondary`      | `colorNeutralBackground2`              | `#fafafa`                | Second-level surface           |
| `surfaceTertiary`       | `colorNeutralBackground3`              | `#f5f5f5`                | Third-level surface            |
| `surfaceQuaternary`     | `colorNeutralBackground4`              | `#f0f0f0`                | Fourth-level surface           |
| `surfaceOverlay`        | `colorNeutralBackground5`              | `#ebebeb`                | Overlay and backdrop surface   |
| `brand`                 | `colorBrandBackground`                 | `#0f6cbd`                | Brand fill for primary actions |
| `brandSubtle`           | `colorBrandBackground2`                | `#ebf3fc`                | Subtle brand tint              |
| `brandInvertedSelected` | `colorBrandBackgroundInvertedSelected` | `#cfe4fa`                | Inverted selected brand state  |
| `dangerSubtle`          | `colorPaletteRedBackground3`           | `#d13438`                | Strong danger fill             |
| `dangerEmphasis`        | `colorPaletteRedBackground1`           | `#fdf6f6`                | Subtle danger fill             |
| `successSubtle`         | `colorPaletteGreenBackground3`         | `#107c10`                | Strong success fill            |
| `successEmphasis`       | `colorPaletteGreenBackground1`         | `#f1faf1`                | Subtle success fill            |
| `successTint`           | `colorPaletteGreenBackground2`         | `#9fd89f`                | Mid-tone success tint          |
| `warningSubtle`         | `colorPaletteYellowBackground3`        | `#fde300`                | Strong warning fill            |
| `warningEmphasis`       | `colorPaletteYellowBackground1`        | `#fffef5`                | Subtle warning fill            |
| `infoSubtle`            | `colorPaletteBlueBackground2`          | `#a9d3f2`                | Subtle informational fill      |

### 2.2 Font - `theme.font`

| Key              | Fluent token         | Resolved (light) | Semantic meaning                |
| ---------------- | -------------------- | ---------------- | ------------------------------- |
| `weightRegular`  | `fontWeightRegular`  | `400`            | Normal text                     |
| `weightMedium`   | `fontWeightMedium`   | `500`            | Medium emphasis                 |
| `weightSemibold` | `fontWeightSemibold` | `600`            | Semibold labels and headings    |
| `weightBold`     | `fontWeightBold`     | `700`            | Bold emphasis                   |
| `sizeXs`         | `fontSizeBase100`    | `10px`           | Captions and meta text          |
| `sizeSm`         | `fontSizeBase200`    | `12px`           | Small labels and table metadata |
| `sizeMd`         | `fontSizeBase300`    | `14px`           | Default body size               |
| `sizeLg`         | `fontSizeBase400`    | `16px`           | Emphasised body and subtitles   |
| `sizeXl`         | `fontSizeBase500`    | `20px`           | Section titles                  |
| `sizeXxl`        | `fontSizeBase600`    | `24px`           | Page titles                     |

### 2.3 Radius - `theme.radius`

| Key        | Fluent token           | Resolved (light) | Semantic meaning                  |
| ---------- | ---------------------- | ---------------- | --------------------------------- |
| `none`     | `borderRadiusNone`     | `0`              | Square corners                    |
| `sm`       | `borderRadiusSmall`    | `2px`            | Subtle rounding, chips and badges |
| `md`       | `borderRadiusMedium`   | `4px`            | Default controls: buttons, inputs |
| `lg`       | `borderRadiusLarge`    | `6px`            | Cards and panels                  |
| `xl`       | `borderRadiusXLarge`   | `8px`            | Large surfaces                    |
| `circular` | `borderRadiusCircular` | `10000px`        | Pills and avatars                 |

### 2.4 Spacing - `theme.spacing`

| Key   | Fluent token            | Resolved (light) | Semantic meaning        |
| ----- | ----------------------- | ---------------- | ----------------------- |
| `xs`  | `spacingHorizontalXS`   | `4px`            | Tight gaps              |
| `sm`  | `spacingHorizontalS`    | `8px`            | Compact padding         |
| `md`  | `spacingHorizontalM`    | `12px`           | Default gap and padding |
| `lg`  | `spacingHorizontalL`    | `16px`           | Comfortable padding     |
| `xl`  | `spacingHorizontalXXL`  | `24px`           | Section separation      |
| `2xl` | `spacingHorizontalXXXL` | `32px`           | Page-level separation   |

Important: `spacing.xl` maps to `spacingHorizontalXXL` (24px) and `spacing["2xl"]` maps to `spacingHorizontalXXXL` (32px). The scale deliberately skips `spacingHorizontalXL` (20px) so that the pre-refactor pixel values (4/8/12/16/24/32) are preserved exactly. Do not "fix" `xl` back to 20px; the regression test `src/styles/theme.browser.test.tsx` asserts the values above.

### 2.5 Shadow - `theme.shadow`

| Key   | Fluent token | Resolved (light)                                         | Semantic meaning        |
| ----- | ------------ | -------------------------------------------------------- | ----------------------- |
| `sm`  | `shadow2`    | `0 0 2px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)`   | Subtle elevation, cards |
| `md`  | `shadow4`    | `0 0 2px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.14)`   | Raised surfaces         |
| `lg`  | `shadow8`    | `0 0 2px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.14)`   | Menus and popovers      |
| `xl`  | `shadow16`   | `0 0 2px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.14)`  | Dialogs                 |
| `xxl` | `shadow28`   | `0 0 8px rgba(0,0,0,0.12), 0 14px 28px rgba(0,0,0,0.14)` | Flyouts and overlays    |

### 2.6 Duration - `theme.duration`

| Key      | Fluent token     | Resolved (light) | Semantic meaning           |
| -------- | ---------------- | ---------------- | -------------------------- |
| `fast`   | `durationFast`   | `150ms`          | Micro-interactions         |
| `normal` | `durationNormal` | `200ms`          | Default transitions        |
| `slow`   | `durationSlow`   | `300ms`          | Larger surface transitions |

### 2.7 Border width - `theme.borderWidth`

| Key        | Fluent token          | Resolved (light) | Semantic meaning         |
| ---------- | --------------------- | ---------------- | ------------------------ |
| `thin`     | `strokeWidthThin`     | `1px`            | Default hairline borders |
| `thick`    | `strokeWidthThick`    | `2px`            | Emphasised borders       |
| `thicker`  | `strokeWidthThicker`  | `3px`            | Heavy borders            |
| `thickest` | `strokeWidthThickest` | `4px`            | Maximum emphasis         |

## 3. Component API reference

All wrappers are exported from `@/components/ui` ([index.ts](../src/components/ui/index.ts)). Import them only from there.

### 3.1 Conventions

- `Button`, `Input`, `Field`, `Badge` and `TabList` use the shared `ComponentSize` (`"sm" | "md" | "lg"`), never Fluent's `"small" | "medium" | "large"`. Other components have their own unions: `Spinner` uses `"tiny" | "small" | "medium" | "large" | "extra-large"`, `Text` uses `100`-`1000`, and `Avatar` uses `"xs" | "sm" | "md" | "lg" | "xl"` or a number.
- Variant props are named `variant`, not Fluent's `appearance`.
- Callbacks receive plain values, not Fluent's `(event, data)` pair.
- Refs are forwarded with the correct DOM or component type where Fluent supports one.
- Prop interfaces are declared per wrapper; Fluent-only props that are not declared are not part of the API.

### 3.2 Where our API differs from Fluent

| Fluent UI                                                        | This design system                                               |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| `appearance`                                                     | `variant` (Button, Badge, Input)                                 |
| `size="small" / "medium" / "large"`                              | `size="sm" / "md" / "lg"` (Button, Input, Field, Badge, TabList) |
| `Input onChange(event, data)`                                    | `onChange(value: string)`                                        |
| `Textarea onChange(event, data)`                                 | `onChange(value: string)`                                        |
| `Checkbox onChange(event, data.checked)`                         | `onChange(checked: boolean)`                                     |
| `Switch onChange(event, data.checked)`                           | `onChange(checked: boolean)`                                     |
| `RadioGroup onChange(event, data.value)`                         | `onChange(value: string)`                                        |
| `Dropdown onOptionSelect(event, data.optionValue)`               | `onOptionSelect(value: string)`                                  |
| `Combobox onOptionSelect(event, data.optionValue)`               | `onOptionSelect(value: string)`                                  |
| `Combobox onChange(event)`                                       | `onTextChange(text: string)`                                     |
| `Combobox onOpenChange(event, data.open)`                        | `onOpenChange(open: boolean)`                                    |
| `Dialog onOpenChange(event, data.open)`                          | `onOpenChange(open: boolean)`                                    |
| `Popover onOpenChange(event, data.open)`                         | `onOpenChange(open: boolean)`                                    |
| `Menu / MenuList onCheckedValueChange(event, data.checkedItems)` | `onCheckedValueChange(checkedItems: string[])`                   |
| `TabList onTabSelect(event, data.value)`                         | `onTabSelect(value: string)`                                     |
| `Avatar size={number}`                                           | `size="xs" / "sm" / "md" / "lg" / "xl"` or a number              |

### 3.3 Actions

- **Button** - `variant` (`primary | secondary | subtle | transparent | outline`), `size` (`sm | md | lg`), `disabled`, `icon`, `iconPosition`, `shape`, `type`, `onClick`, `onMouseDown`, `className`, `style`, `title`, `autoFocus`, `aria-label`, `children`. Maps to Fluent `Button` with `variant -> appearance` and `size -> SIZE_MAP`. Forwards `HTMLButtonElement | HTMLAnchorElement`.
- **Divider** - `vertical`, `className`, `style`. Maps to Fluent `Divider` and exposes `role="separator"`.
- **Spinner** - `size` (`tiny | small | medium | large | extra-large`, default `medium`), `label`, `className`, `style`, `aria-label`. Maps to Fluent `Spinner`; renders `role="progressbar"`.
- **Badge** - `variant` (`filled | outline | tint | ghost`), `size`, `shape`, `color`, `className`, `style`, `children`. Maps to Fluent `Badge`; `variant -> appearance`.

### 3.4 Typography

- **Text** - `size` (100-1000), `weight` (`regular | medium | semibold | bold`), `italic`, `underline`, `strikethrough`, `block`, `truncate`, `wrap`, `onClick`, `className`, `style`, `title`, `children`. Maps to Fluent `Text`; forwards `HTMLElement`.
- **Body1Strong** - `children`, `style`. Maps to Fluent `Body1Strong`.
- **Caption1** - `children`, `style`. Maps to Fluent `Caption1`.

### 3.5 Form inputs

- **Input** - `value`, `defaultValue`, `onChange(value: string)`, `onKeyDown`, `type` (`text | password | number | date | datetime-local | email | search | tel | url`), `variant` (`outline | underline | filled`), `size`, `placeholder`, `disabled`, `readOnly`, `contentBefore`, `contentAfter`, `className`, `style`, `autoFocus`, `maxLength`, `name`, `id`, `aria-label`. `variant` maps `outline -> outline`, `underline -> underline`, `filled -> filled-darker`. Forwards `HTMLInputElement`.
- **Textarea** - `value`, `defaultValue`, `onChange(value: string)`, `placeholder`, `disabled`, `readOnly`, `rows`, `className`, `style`, `autoFocus`, `maxLength`, `name`, `id`. Forwards `HTMLTextAreaElement`.
- **Field** - `label`, `hint`, `required`, `size`, `className`, `style`, `children`. Maps to Fluent `Field`; `size -> SIZE_MAP` and the label is bound to the control via the generated id.
- **Checkbox** - `checked` (`boolean | "mixed"`), `defaultChecked`, `onChange(checked: boolean)`, `label`, `disabled`, `required`, `onClick`, `className`, `style`, `name`, `id`, `aria-label`.
- **Switch** - `checked`, `defaultChecked`, `onChange(checked: boolean)`, `label`, `disabled`, `className`, `style`, `name`, `id`.
- **Radio** - `value`, `label`, `disabled`, `className`, `style`. Maps to Fluent `Radio`.
- **RadioGroup** - `value`, `defaultValue`, `onChange(value: string)`, `disabled`, `className`, `style`, `aria-label`, `children`.
- **Dropdown** - `value`, `selectedOptions`, `clearable`, `placeholder`, `disabled`, `invalid`, `buttonStyle`, `onOptionSelect(value: string)`, `className`, `style`, `aria-label`, `children`. `invalid` adds a danger border.
- **Option** - `value`, `disabled`, `text`, `children`. Used inside `Dropdown` and `Combobox`; `text` falls back to string children.
- **Combobox** - `value`, `selectedOptions`, `clearable`, `placeholder`, `disabled`, `invalid`, `onOptionSelect(value: string)`, `onTextChange(text: string)`, `onOpenChange(open: boolean)`, `className`, `style`, `aria-label`, `children`.

### 3.6 Overlays

- **Menu** - `positioning`, `checkedValues`, `onCheckedValueChange(checkedItems: string[])`, `children`. Maps to Fluent `Menu`.
- **MenuTrigger** - `disableButtonEnhancement`, `children`. Wraps the trigger element.
- **MenuPopover** - `className`, `style`, `children`. Maps to Fluent `MenuPopover`.
- **MenuList** - `checkedValues`, `onCheckedValueChange(checkedItems: string[])`, `className`, `style`, `children`. The list-level callback is independent of the `Menu`-level one.
- **MenuItem** - `disabled`, `icon`, `onClick`, `className`, `style`, `children`.
- **MenuItemRadio** - `name`, `value`, `className`, `style`, `children`. Selection is reported through `onCheckedValueChange`.
- **MenuDivider** - `className`, `style`.
- **Popover** - `positioning` (`above | below | before | after | below-end | above-end`), `withArrow`, `open`, `onOpenChange(open: boolean)`, `children`.
- **PopoverTrigger** - `disableButtonEnhancement`, `children`.
- **PopoverSurface** - `className`, `style`, `children`.
- **Tooltip** - `content`, `relationship` (`label | description | inaccessible`), `positioning` (`above | below | before | after`), `visible`, `className`, `style`, `aria-label`, `children` (required).
- **Dialog** - `open`, `defaultOpen`, `onOpenChange(open: boolean)`, `children`.
- **DialogTrigger** - `disableButtonEnhancement`, `children`.
- **DialogSurface** - `className`, `style`, `children`. Renders `role="dialog"`.
- **DialogBody**, **DialogTitle**, **DialogContent** - `className`, `style`, `children`.
- **DialogActions** - `position` (`start | end`), `className`, `style`, `children`.

### 3.7 Data display

- **Table** - `className`, `style`, `children`.
- **TableHeader**, **TableBody** - `className`, `style`, `children`.
- **TableRow** - `onClick`, `className`, `style`, `title`, `children`.
- **TableHeaderCell** - `sortDirection` (`ascending | descending`), `className`, `style`, `children`.
- **TableCell** - `colSpan`, `className`, `style`, `children`.
- **TableCellLayout** - `truncate`, `title`, `className`, `style`, `children`.
- **Tab** - `value`, `className`, `style`, `children`.
- **TabList** - `selectedValue`, `onTabSelect(value: string)`, `size`, `vertical`, `className`, `style`, `aria-label`, `children`.
- **Tree** - `defaultOpenItems`, `className`, `style`, `aria-label`, `children`.
- **TreeItem** - `itemType` (`branch | leaf`), `value`, `className`, `style`, `children`.
- **TreeItemLayout** - `iconBefore`, `onClick`, `className`, `style`, `children`.
- **Avatar** - `name`, `initials`, `size`, `shape` (`circular | square`), `color` (`neutral | brand | colorful` or a Fluent named colour), `className`, `style`, `aria-label`, `children`. Named sizes map to Fluent numbers: `xs -> 24`, `sm -> 32`, `md -> 48`, `lg -> 72`, `xl -> 96`; a numeric `size` is passed through.

### 3.8 Feedback

- **MessageBar** - `intent` (`error | warning | success | info`, default `info`), `className`, `style`, `children`. Maps to Fluent `MessageBar`; renders `role="group"` with intent-specific styling.
- **MessageBarBody** - `className`, `style`, `children`. Maps to Fluent `MessageBarBody` and holds the message text.

### 3.9 Theming and utilities

- **FluentProvider** - `theme`, `className`, `style`, `children`. Wraps Fluent `FluentProvider`; pass the app theme from `@/theme`.
- **makeStyles**, **mergeClasses** - thin re-exports of the Fluent functions for use in the layers allowed to style.
- **tokens** - re-export of the Fluent token object. Application code must not import it; use `theme` from `@/styles/theme`.

## 4. Shared size types

`src/components/ui/types.ts` is the single source of truth for the wrapper size scale:

- `ComponentSize = "sm" | "md" | "lg"` - exported publicly through `@/components/ui`.
- `FluentSize = "small" | "medium" | "large"` - file-private; not exported.
- `SIZE_MAP: Record<ComponentSize, FluentSize>` - `sm -> small`, `md -> medium`, `lg -> large`.

`SIZE_MAP` is consumed by:

| File                           | Used for                      |
| ------------------------------ | ----------------------------- |
| `src/components/ui/button.tsx` | `Button` size                 |
| `src/components/ui/input.tsx`  | `Input` size and `Field` size |
| `src/components/ui/badge.tsx`  | `Badge` size                  |
| `src/components/ui/tabs.tsx`   | `TabList` size                |

`Avatar` has its own numeric map because Fluent avatars take pixel sizes, not size names.

## 5. Adding a new wrapper

1. Create `src/components/ui/<name>.tsx`. Import the Fluent primitive from `@fluentui/react-components` (allowed here and nowhere else).
2. Declare an explicit `<Name>Props` interface with only the props you want to support. Do not re-export Fluent's prop type and do not use `any`.
3. If Fluent forwards a ref, wrap the component in `forwardRef` and type the ref with `ComponentRef<typeof FluentName>` (or the DOM element for inputs and buttons).
4. Translate the public API to Fluent: rename `appearance` to `variant`, map size through `SIZE_MAP` from `./types`, and convert Fluent callbacks such as `(event, data) => ...` into the plain value your prop promises.
5. Export the component from `src/components/ui/index.ts`. Export a prop type only if application code genuinely needs it.
6. Add `src/components/ui/__tests__/<name>.browser.test.tsx`. Wrapper tests must use the browser project and be named `*.browser.test.tsx`; the unit project only collects `src/**/*.test.ts`.
7. In the test, render inside `FluentProvider` and assert observable behaviour: roles, text, attributes and callback arguments. For pure prop mapping with no behaviour (size, variant, appearance), compare the rendered markup against a directly rendered Fluent component with the target prop.
8. Run the gates: `npx tsc --noEmit`, `npx eslint . -f json`, `npm run test:unit`, `npm run test:browser`, `npm run test:coverage`. Do not add comments anywhere under `src/**`.

## 6. Enforced ESLint boundaries

The rules below are configured in `eslint.config.js` and fail the build.

| Concern                      | Rule                                                                 | Where it is allowed                                                                                                                                                                                                                                                                                                                                     |
| ---------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fluent components            | `no-restricted-imports` (path + pattern ban)                         | `@fluentui/react-components` is allowed only in `src/components/ui/**` and `src/theme/index.ts` (`webLightTheme`); the wrapper layer also rejects `@fluentui/react-icons`                                                                                                                                                                               |
| Fluent icons                 | `no-restricted-imports`                                              | `src/components/icons/**` (including `src/components/icons/index.ts`); every other layer, including `src/components/ui/**`, rejects it and imports `@/components/icons`                                                                                                                                                                                 |
| Raw tokens                   | `no-restricted-imports` with `importNames: ["tokens"]`               | `src/components/ui/**` and `src/styles/theme.ts`; everywhere else use `theme` from `@/styles/theme`                                                                                                                                                                                                                                                     |
| i18next / react-i18next      | `no-restricted-imports`                                              | `src/i18n/**`; everywhere else import `@/i18n`                                                                                                                                                                                                                                                                                                          |
| `@tanstack/react-table`      | `no-restricted-imports`                                              | `src/components/common/data-table/**`; pages use `DataColumn`/`DataFilter` from `@/components/common`                                                                                                                                                                                                                                                   |
| Relative internal imports    | `no-restricted-imports` pattern `./*`, `../*`                        | **Rejected** in `src/layouts/**`, `src/routes/**`, `src/stores/**`, `src/lib/**`, `src/theme/**`, `src/styles/**`, `src/components/icons/**` and `src/components/common/data-table/**`. **Allowed** (the `@/` alias is still the convention) in `src/components/ui/**`, `src/components/common/**` sibling imports, `src/i18n/**` and `src/features/**` |
| Layer graph                  | `boundaries/dependencies`                                            | features, routes and layouts may reach `ui`, `icons`, `i18n` and `common` only through their `index.ts` entry files; `shared` and `stores` are importable in full                                                                                                                                                                                       |
| Comments                     | `local/no-comments`                                                  | nowhere under `src/**`, including tests                                                                                                                                                                                                                                                                                                                 |
| Literal JSX strings          | `i18next/no-literal-string`                                          | translated strings only; `*.test.tsx` and `src/i18n/**` are exempt                                                                                                                                                                                                                                                                                      |
| Raw `<button>` in features   | `no-restricted-syntax`                                               | use `Button`/`IconButton`/`MenuTriggerButton` and friends                                                                                                                                                                                                                                                                                               |
| Hand-rolled flex/grid        | `no-restricted-syntax`                                               | use `HStack`/`VStack`/`TileGrid` from `@/components/common`                                                                                                                                                                                                                                                                                             |
| Hardcoded hex colours        | `no-restricted-syntax`                                               | use `theme.*` from `@/styles/theme`                                                                                                                                                                                                                                                                                                                     |
| `any`, `@ts-ignore`, console | `@typescript-eslint/no-explicit-any`, `ban-ts-comment`, `no-console` | never                                                                                                                                                                                                                                                                                                                                                   |

The repository currently reports exactly 22 pre-existing severity-2 findings: 17 hand-rolled flex/grid, 1 hardcoded hex in `makeStyles`, 3 hardcoded hex in style props and 1 literal JSX string. New code must not increase that number.

## 7. Testing strategy

Two Vitest projects are configured in `vite.config.ts`:

| Project   | Include                     | Environment                                                       | Command                |
| --------- | --------------------------- | ----------------------------------------------------------------- | ---------------------- |
| `unit`    | `src/**/*.test.ts`          | Node, no DOM                                                      | `npm run test:unit`    |
| `browser` | `src/**/*.browser.test.tsx` | Headless Chromium via Playwright, setup `src/test-setup.ts` (MSW) | `npm run test:browser` |

Key points:

- Wrapper tests live in `src/components/ui/__tests__/` and must be named `*.browser.test.tsx`. A wrapper test named `*.test.tsx` is collected by neither project and silently never runs.
- Wrapper tests may import `@fluentui/react-components` directly: the `src/components/ui/**` rule allows `@fluentui/react-components`, `tokens` and `@/components/ui` while rejecting `@fluentui/react-icons`. Tests should still assert behaviour (roles, text, attributes, callback arguments) and use direct Fluent rendering only as a reference for pure prop mapping.
- Current totals: 12 browser files / 80 tests overall, of which 34 tests cover the wrapper layer. Unit: 22 files / 171 tests.
- Coverage: `npm run test:coverage` runs both projects. The old `src/components/ui/**` coverage exclusion has been removed, so the wrapper layer is measured. Wrapper coverage at HEAD across the 24 files of `src/components/ui/**`: 135/135 statements (100%), 39/60 branches (65%), 67/67 functions (100%) and 129/129 lines (100%). The line total is the sum of the per-file lines fractions in `coverage/components/ui/`; `src/components/ui/index.ts` is re-exports only and contributes 0 statements. Remaining branch gaps are the "prop not provided" arms of optional props and are not behavioural.
- The theme regression test `src/styles/theme.browser.test.tsx` asserts the resolved spacing, radius, border and weight values described in section 2.

## 8. DO / DON'T quick reference

### DO

- Import UI from `@/components/ui` and icons from `@/components/icons`.
- Use `theme.*` from `@/styles/theme` for every colour, spacing, radius, shadow, duration and border width.
- Use `size="sm" | "md" | "lg"` and `variant` in the wrapper props that declare them.
- Handle plain callback values: `onChange={(value) => ...}`, `onCheckedValueChange={(items) => ...}`.
- Keep wrapper props explicit and forward refs with the right type.
- Name wrapper tests `*.browser.test.tsx` and put them in `src/components/ui/__tests__/`.
- Wrap tests and app roots in `FluentProvider`.

### DON'T

- Do not import `@fluentui/react-components` or `@fluentui/react-icons` outside the UI and icons layers.
- Do not import `tokens` outside `src/components/ui/**` and `src/styles/theme.ts`.
- Do not pass Fluent's `appearance`, `small`/`medium`/`large` sizes or `(event, data)` callbacks through the wrapper API.
- Do not import `i18next` outside `src/i18n/**`, or `@tanstack/react-table` outside `src/components/common/data-table/**`.
- Do not add comments under `src/**`, and do not use `any`, `@ts-ignore` or `console`.
- Do not hand-roll hex colours or flex/grid display in `makeStyles` or style props in features.
- Do not "restore" `spacing.xl` to 20px.

## 9. Troubleshooting

| Symptom                                                               | Cause                                          | Fix                                                                                                                    |
| --------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `Cannot find module '@/...'`                                          | Missing alias import                           | Use the `@/` alias; relative imports are rejected in layouts, routes, stores, lib, theme, styles, icons and data-table |
| ESLint: "Import UI only from @/components/ui"                         | Imported `@fluentui/*` in app code             | Import from `@/components/ui`                                                                                          |
| ESLint: "Import tokens only in src/components/ui or src/styles/theme" | Imported `tokens` in app code                  | Use `theme` from `@/styles/theme`                                                                                      |
| ESLint: "Comments are not allowed"                                    | Comment under `src/**`                         | Delete it and make the code self-explanatory                                                                           |
| A wrapper test never runs                                             | File is not named `*.browser.test.tsx`         | Rename it; the unit project only collects `*.test.ts`                                                                  |
| Component renders unstyled or without theme                           | Missing `FluentProvider`                       | Wrap the tree in `FluentProvider` with the app theme from `@/theme`                                                    |
| Spacing is 4px larger than expected                                   | Expected Fluent's `spacingHorizontalXL` (20px) | `theme.spacing.xl` is intentionally 24px; see section 2.4                                                              |
| TypeError: size "small" is not assignable                             | Passed a Fluent size name                      | Use `sm`/`md`/`lg`                                                                                                     |
| Callback receives an object instead of a string                       | Used the Fluent component directly             | Use the wrapper; see section 3.2                                                                                       |
| New flex/grid or hex error appears in lint                            | Hand-rolled layout/colour in a feature         | Use `HStack`/`VStack`/`TileGrid` and `theme.*`                                                                         |
