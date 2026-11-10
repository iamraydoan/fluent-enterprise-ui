import type { ReactNode } from "react";
import { Bot24Regular } from "@/components/icons";
import { Text } from "@/components/ui";
import type { ChatStyles } from "./AiChatPage";
import { SuggestionChips } from "./SuggestionChips";

interface ChatEmptyStateProps {
  styles: ChatStyles;
  name: string;
  description: string;
  composer: ReactNode;
  onPick: (text: string) => void;
}

export function ChatEmptyState({
  styles,
  name,
  description,
  composer,
  onPick,
}: ChatEmptyStateProps) {
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
      <SuggestionChips styles={styles} onPick={onPick} />
    </div>
  );
}
