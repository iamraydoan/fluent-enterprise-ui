import { OptionItem } from "@/components/common";
import { makeStyles, Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";
import type { ChatSession } from "../data";

const useStyles = makeStyles({
  history: {
    width: "250px",
    flexShrink: 0,
    borderRight: `1px solid ${theme.color.borderSubtle}`,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    padding: `${theme.spacing.md} ${theme.spacing.sm}`,
    rowGap: "2px",
    backgroundColor: theme.color.surfaceSecondary,
  },
  historyTitle: { padding: "4px 10px 8px" },
  historyTitleText: { maxWidth: "210px" },
  historyAgent: { color: theme.color.textTertiary },
});

interface ChatHistoryPanelProps {
  chats: ChatSession[];
  currentChatId: string | null;
  onSelect: (chat: ChatSession) => void;
}

export function ChatHistoryPanel({ chats, currentChatId, onSelect }: ChatHistoryPanelProps) {
  const styles = useStyles();
  const { t } = useAppTranslation();
  return (
    <aside className={styles.history} aria-label={t("aiChat.chatHistory")}>
      <Text weight="semibold" className={styles.historyTitle}>
        {t("aiChat.chats")}
      </Text>
      {chats.map((candidate) => (
        <OptionItem
          key={candidate.id}
          selected={currentChatId === candidate.id}
          onClick={() => onSelect(candidate)}
        >
          <Text size={300} truncate wrap={false} className={styles.historyTitleText}>
            {candidate.title}
          </Text>
          <Text size={200} className={styles.historyAgent}>
            {candidate.agent}
          </Text>
        </OptionItem>
      ))}
    </aside>
  );
}
