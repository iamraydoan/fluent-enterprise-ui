import { useEffect, useRef } from "react";
import { Bot20Regular, Wrench16Regular } from "@/components/icons";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { ChatStyles } from "./AiChatPage";
import type { ChatMessage } from "./data";

interface ChatMessageListProps {
  styles: ChatStyles;
  messages: ChatMessage[];
  busy: boolean;
  agentName: string;
}

export function ChatMessageList({ styles, messages, busy, agentName }: ChatMessageListProps) {
  const { t } = useAppTranslation();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, busy]);

  return (
    <div className={styles.scroll}>
      <div className={styles.col}>
        {messages.map((message, index) =>
          message.role === "user" ? (
            <div key={index} className={styles.userMsg}>
              {message.text}
            </div>
          ) : (
            <div key={index} className={styles.botRow}>
              <span className={styles.botIcon}>
                <Bot20Regular />
              </span>
              <div className={styles.botText}>
                {message.text}
                {message.tools && (
                  <div className={styles.chips}>
                    {message.tools.map((tool) => (
                      <span key={tool} className={styles.chip}>
                        <Wrench16Regular />
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ),
        )}
        {busy && (
          <div className={styles.botRow}>
            <span className={styles.botIcon}>
              <Bot20Regular />
            </span>
            <Text size={200} className={styles.thinkingLine}>
              {t("aiChat.thinking", { agent: agentName })}
            </Text>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
