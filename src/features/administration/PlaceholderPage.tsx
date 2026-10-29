import { cloneElement } from "react";
import type { ReactElement } from "react";
import { Wrench24Regular } from "@/components/icons";
import { Caption1, makeStyles, Text, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

const usePlaceholderStyles = makeStyles({
  stub: {
    flexGrow: 1,
    minHeight: 0,
    backgroundColor: "#FAFAFA",
    borderRadius: "0 0 12px 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    rowGap: "8px",
    color: tokens.colorNeutralForeground3,
    textAlign: "center",
    padding: "24px",
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
      <Text weight="semibold" size={500} style={{ color: "#222" }}>
        {title}
      </Text>
      <Caption1>{body ?? t("placeholder.defaultBody")}</Caption1>
    </section>
  );
}
