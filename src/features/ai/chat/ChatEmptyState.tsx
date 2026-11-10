import type { ReactNode } from "react";
import { Bot24Regular } from "@/components/icons";
import { makeStyles, Text } from "@/components/ui";
import { theme } from "@/styles/theme";
import { SuggestionChips } from "./SuggestionChips";

const useStyles = makeStyles({
  hero: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    rowGap: "14px",
    textAlign: "center",
    padding: `0 ${theme.spacing.xl}`,
    width: "100%",
    maxWidth: "820px",
    marginBottom: "40px",
  },
  heroTitle: {
    display: "flex",
    alignItems: "center",
    columnGap: "14px",
    fontSize: "34px",
    fontWeight: 300,
    lineHeight: "40px",
    color: "#1E2330",
  },
  heroIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "999px",
    border: `1px solid ${theme.color.borderSubtle}`,
    display: "grid",
    placeItems: "center",
    backgroundColor: theme.color.surface,
    fontSize: theme.font.sizeXxl,
  },
  heroText: { maxWidth: "460px", lineHeight: "21px" },
  composerSlot: { width: "100%" },
});

interface ChatEmptyStateProps {
  name: string;
  description: string;
  composer: ReactNode;
  onPick: (text: string) => void;
}

export function ChatEmptyState({ name, description, composer, onPick }: ChatEmptyStateProps) {
  const styles = useStyles();
  return (
    <div className={styles.hero}>
      <div className={styles.heroTitle}>
        <span className={styles.heroIcon}>
          <Bot24Regular />
        </span>
        {name}
      </div>
      <Text size={300} className={styles.heroText}>
        {description}
      </Text>
      <div className={styles.composerSlot}>{composer}</div>
      <SuggestionChips onPick={onPick} />
    </div>
  );
}
