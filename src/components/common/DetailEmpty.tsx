import type { ReactNode } from "react";
import { makeStyles } from "@/components/ui";
import { theme } from "@/styles/theme";

const useStyles = makeStyles({
  empty: { padding: "32px", textAlign: "center", color: theme.color.textTertiary },
});

export function DetailEmpty({ children }: { children: ReactNode }) {
  const styles = useStyles();
  return <div className={styles.empty}>{children}</div>;
}
