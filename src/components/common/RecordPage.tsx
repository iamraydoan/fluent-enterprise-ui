import type { ReactNode } from "react";
import { makeStyles } from "@/components/ui";
import { cardSurface } from "@/styles/shared";
import { theme } from "@/styles/theme";
import { VStack } from "./Stack";

const useRecordPageStyles = makeStyles({
  page: { height: "100%", minHeight: 0 },
  tabBar: {
    display: "flex",
    columnGap: "4px",
    alignItems: "center",
    padding: "0 16px",
    backgroundColor: theme.color.surface,
    borderBottom: "1px solid " + theme.color.borderSubtle,
  },
  titleStrip: {
    display: "flex",
    columnGap: "8px",
    alignItems: "center",
    padding: "10px 16px",
    backgroundColor: theme.color.surface,
    borderBottom: "1px solid " + theme.color.borderSubtle,
  },
  content: {
    flexGrow: 1,
    minHeight: 0,
    overflow: "auto",
    padding: theme.spacing.md,
    ...cardSurface,
    margin: theme.spacing.md,
  },
});

interface RecordPageProps {
  tabs: ReactNode;
  title: ReactNode;
  children: ReactNode;
}

export function RecordPage({ tabs, title, children }: RecordPageProps) {
  const styles = useRecordPageStyles();
  return (
    <VStack className={styles.page}>
      <div className={styles.tabBar}>{tabs}</div>
      <div className={styles.titleStrip}>{title}</div>
      <div className={styles.content}>{children}</div>
    </VStack>
  );
}
