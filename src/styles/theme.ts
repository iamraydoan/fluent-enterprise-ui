import { tokens } from "@/components/ui";

export const theme = {
  color: {
    textPrimary: tokens.colorNeutralForeground1,
    textSecondary: tokens.colorNeutralForeground2,
    textTertiary: tokens.colorNeutralForeground3,
    textOnBrand: tokens.colorNeutralForegroundOnBrand,
    textDanger: tokens.colorPaletteRedForeground1,
    textBrand: tokens.colorBrandForeground1,
    border: tokens.colorNeutralStroke1,
    borderSubtle: tokens.colorNeutralStroke2,
    borderBrand: tokens.colorBrandStroke1,
    surface: tokens.colorNeutralBackground1,
    surfaceHover: tokens.colorNeutralBackground1Hover,
    surfaceSelected: tokens.colorNeutralBackground1Selected,
    surfaceSecondary: tokens.colorNeutralBackground2,
    surfaceTertiary: tokens.colorNeutralBackground3,
    brand: tokens.colorBrandBackground,
    brandSubtle: tokens.colorBrandBackground2,
    dangerSubtle: tokens.colorPaletteRedBackground3,
  },
  font: {
    weightSemibold: tokens.fontWeightSemibold,
    sizeSm: tokens.fontSizeBase200,
    sizeMd: tokens.fontSizeBase300,
  },
  radius: {
    md: tokens.borderRadiusMedium,
  },
} as const;
