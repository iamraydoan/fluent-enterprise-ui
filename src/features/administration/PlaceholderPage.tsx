import { cloneElement } from "react";
import type { ReactElement } from "react";
import { Wrench24Regular } from "@/components/icons";
import { Caption1, makeStyles, Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { cardSurface } from "@/styles/shared";
import { theme } from "@/styles/theme";

const usePlaceholderStyles = makeStyles({
  stub: {
    flexGrow: 1,
    minHeight: 0,
    ...cardSurface,
    borderRadius: "0 0 12px 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    rowGap: theme.spacing.sm,
    color: theme.color.textTertiary,
    textAlign: "center",
    padding: theme.spacing.xl,
  },
});

interface PlaceholderPageProps {
  title: string;
  icon?: ReactElement;
  body?: string;
}

export function PlaceholderPage({ title, icon, body }: PlaceholderPageProps) {
  const placeholderStyles = usePlaceholderStyles();
  const { t } = useAppTranslation();
  const renderedIcon = cloneElement(icon ?? <Wrench24Regular />, {
    style: { width: 40, height: 40 },
  });
  return (
    <section className={placeholderStyles.stub} aria-label={title}>
      <div style={{ fontSize: 40 }}>{renderedIcon}</div>
      <Text weight="semibold" size={500} style={{ color: theme.color.textPrimary }}>
        {title}
      </Text>
      <Caption1>{body ?? t("placeholder.defaultBody")}</Caption1>
    </section>
  );
}
