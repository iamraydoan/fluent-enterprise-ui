import type { ReactNode } from "react";
import { makeStyles } from "@/components/ui";
import { theme } from "@/styles/theme";
import { HStack } from "./Stack";

const useStyles = makeStyles({
  row: {
    fontSize: "13px",
    padding: "8px 0",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  plain: { fontSize: "13px" },
  body: { flexGrow: 1 },
  title: { fontWeight: 600 },
  subtitle: { fontSize: "12px", color: theme.color.textTertiary },
});

export function ListRow({
  title,
  subtitle,
  actions,
  variant = "divided",
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  variant?: "divided" | "plain";
}) {
  const styles = useStyles();
  return (
    <HStack gap="12px" align="center" className={variant === "plain" ? styles.plain : styles.row}>
      <div className={styles.body}>
        <div className={variant === "plain" ? undefined : styles.title}>{title}</div>
        {subtitle !== undefined && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      {actions !== undefined && (
        <HStack gap="xs" wrap>
          {actions}
        </HStack>
      )}
    </HStack>
  );
}
