import { useState } from "react";
import {
  Add24Regular,
  ArrowUp20Regular,
  Attach20Regular,
  Bot20Regular,
  Chat20Regular,
  ChevronDown20Regular,
  Mic20Regular,
} from "@/components/icons";
import { Button, Input, makeStyles, Text, tokens } from "@/components/ui";
import { useSharedStyles } from "@/styles/shared";

const useChatStyles = makeStyles({
  agentRow: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
    height: "34px",
    padding: "0 12px",
  },
  chatBody: {
    display: "flex",
    flexGrow: 1,
    minHeight: 0,
    marginTop: "10px",
    backgroundColor: "#FAFAFA",
    borderRadius: "12px",
    overflow: "hidden",
  },
  chatRail: {
    display: "flex",
    flexDirection: "column",
    rowGap: "4px",
    padding: "12px 8px",
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  chatCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    rowGap: "12px",
    flexGrow: 1,
    minWidth: 0,
    padding: "24px",
    textAlign: "center",
  },
  chatTitle: {
    display: "flex",
    alignItems: "center",
    columnGap: "10px",
  },
  chatInputBox: {
    width: "100%",
    maxWidth: "640px",
    textAlign: "left",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: "16px",
    backgroundColor: "#FFFFFF",
    padding: "12px",
    boxSizing: "border-box",
  },
  chatInputActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: "8px",
  },
});

export function AiChatPage() {
  const sharedStyles = useSharedStyles();
  const chatStyles = useChatStyles();
  const [message, setMessage] = useState("");
  return (
    <>
      <div className={sharedStyles.headerBlock}>
        <div className={chatStyles.agentRow}>
          <Bot20Regular />
          <Text size={300}>CM MES Agent</Text>
          <ChevronDown20Regular />
        </div>
      </div>
      <div className={chatStyles.chatBody}>
        <div className={chatStyles.chatRail}>
          <Button appearance="subtle" icon={<Chat20Regular />} aria-label="Chat history" />
          <Button appearance="subtle" icon={<Add24Regular />} aria-label="New chat" />
          <Button appearance="subtle" icon={<Bot20Regular />} aria-label="Agent" />
        </div>
        <div className={chatStyles.chatCenter}>
          <div className={chatStyles.chatTitle}>
            <Bot20Regular />
            <Text weight="semibold" size={600}>
              MES Agent
            </Text>
          </div>
          <Text size={400} style={{ maxWidth: 560 }}>
            Acts as a general MES assistant, a starting point for questions about products,
            resources or documents, guiding to the right answer.
          </Text>
          <div className={chatStyles.chatInputBox}>
            <Input
              appearance="outline"
              placeholder="Message MES Agent"
              value={message}
              onChange={(_, d) => setMessage(d.value)}
              aria-label="Message MES Agent"
              style={{ border: "none", boxShadow: "none", padding: 0 }}
            />
            <div className={chatStyles.chatInputActions}>
              <Button appearance="subtle" icon={<Attach20Regular />} aria-label="Attach" />
              <div style={{ display: "flex", columnGap: 4 }}>
                <Button appearance="subtle" icon={<Mic20Regular />} aria-label="Voice input" />
                <Button
                  appearance="subtle"
                  icon={<ArrowUp20Regular />}
                  aria-label="Send"
                  disabled={message.length === 0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
