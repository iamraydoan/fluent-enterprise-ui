import type { ReactNode } from "react";
import { makeStyles, Text } from "@/components/ui";
import { useSharedStyles } from "@/styles/shared";
import { theme } from "@/styles/theme";

const useStyles = makeStyles({
  heading: { marginBottom: theme.spacing.sm },
});

export function DetailSectionCard({ title, children }: { title: ReactNode; children: ReactNode }) {
  const sharedStyles = useSharedStyles();
  const styles = useStyles();
  return (
    <div className={sharedStyles.contentCard} style={{ padding: "14px 16px" }}>
      <Text size={400} weight="semibold" className={styles.heading}>
        {title}
      </Text>
      {children}
    </div>
  );
}
