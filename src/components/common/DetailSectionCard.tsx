import type { ReactNode } from "react";
import { makeStyles, mergeClasses, Text } from "@/components/ui";
import { useSharedStyles } from "@/styles/shared";
import { theme } from "@/styles/theme";

const useStyles = makeStyles({
  card: { padding: "14px 16px" },
  heading: { marginBottom: theme.spacing.sm },
});

export function DetailSectionCard({ title, children }: { title: ReactNode; children: ReactNode }) {
  const sharedStyles = useSharedStyles();
  const styles = useStyles();
  return (
    <div className={mergeClasses(sharedStyles.contentCard, styles.card)}>
      <Text size={400} weight="semibold" className={styles.heading}>
        {title}
      </Text>
      {children}
    </div>
  );
}
