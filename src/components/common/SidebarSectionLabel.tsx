import type { ReactNode } from "react";
import { makeStyles } from "@/components/ui";
import { theme } from "@/styles/theme";

const useSectionLabelStyles = makeStyles({
  label: {
    fontSize: "11px",
    color: theme.color.textTertiary,
    textTransform: "uppercase",
    padding: theme.spacing.md + " " + theme.spacing.md + " " + theme.spacing.xs,
    letterSpacing: "0.5px",
  },
});

export function SidebarSectionLabel({ children }: { children: ReactNode }) {
  const styles = useSectionLabelStyles();
  return <div className={styles.label}>{children}</div>;
}
