import { useEffect, useRef } from "react";
import { Bot20Regular, Wrench16Regular } from "@/components/icons";
import { makeStyles, Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";
import type { ChatMessage } from "./data";

const useStyles = makeStyles({
  scroll: {
    flexGrow: 1,
    width: "100%",
    overflowY: "auto",
    display: "flex",
    justifyContent: "center",
  },
  col: {
    width: "100%",
    maxWidth: "820px",
    padding: `${theme.spacing.xl} ${theme.spacing.xl} ${theme.spacing.sm}`,
    display: "flex",
    flexDirection: "column",
    rowGap: "18px",
  },
  userMsg: {
    alignSelf: "flex-end",
    maxWidth: "75%",
    backgroundColor: theme.color.brandSubtle,
    borderRadius: "18px 18px 4px 18px",
    padding: "10px 14px",
    fontSize: theme.font.sizeMd,
    lineHeight: "21px",
    whiteSpace: "pre-wrap",
  },
  botText: { fontSize: theme.font.sizeMd, lineHeight: "22px" },
  thinkingLine: { lineHeight: "28px" },
  botRow: { display: "flex", columnGap: theme.spacing.md, alignItems: "flex-start" },
  botIcon: {
    width: "28px",
    height: "28px",
    flexShrink: 0,
    borderRadius: "999px",
    border: `1px solid ${theme.color.borderSubtle}`,
    display: "grid",
    placeItems: "center",
    backgroundColor: theme.color.surface,
  },
  chips: { display: "flex", flexWrap: "wrap", gap: "6px", marginTop: theme.spacing.sm },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    columnGap: theme.spacing.xs,
    fontSize: theme.font.sizeSm,
    color: "#444",
    backgroundColor: theme.color.surfaceSecondary,
    borderRadius: "999px",
    padding: "2px 10px 2px 8px",
  },
});

interface ChatMessageListProps {
  messages: ChatMessage[];
  busy: boolean;
  agentName: string;
}

export function ChatMessageList({ messages, busy, agentName }: ChatMessageListProps) {
  const styles = useStyles();
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
