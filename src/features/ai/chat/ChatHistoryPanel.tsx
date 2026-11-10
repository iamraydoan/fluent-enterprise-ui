import { OptionItem } from "@/components/common";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { ChatStyles } from "./AiChatPage";
import type { ChatSession } from "./data";

interface ChatHistoryPanelProps {
  styles: ChatStyles;
  chats: ChatSession[];
  currentChatId: string | null;
  onSelect: (chat: ChatSession) => void;
}

export function ChatHistoryPanel({
  styles,
  chats,
  currentChatId,
  onSelect,
}: ChatHistoryPanelProps) {
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
