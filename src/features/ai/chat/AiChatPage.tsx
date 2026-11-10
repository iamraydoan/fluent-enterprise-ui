import { useState } from "react";
import { useAiAgents, useSendChat } from "@/api";
import { MenuTriggerButton } from "@/components/common";
import { Bot20Regular, ChevronDown16Regular } from "@/components/icons";
import {
  makeStyles,
  Menu,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { cardSurface } from "@/styles/shared";
import { theme } from "@/styles/theme";
import { ChatComposer } from "./ChatComposer";
import { ChatEmptyState } from "./ChatEmptyState";
import { ChatHistoryPanel } from "./ChatHistoryPanel";
import { ChatMessageList } from "./ChatMessageList";
import { ChatToolRail } from "./ChatToolRail";
import { SEED_CHATS } from "./data";
import type { ChatSession } from "./data";

const useChatStyles = makeStyles({
  bar: {
    ...cardSurface,
    borderRadius: "0 0 12px 12px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    padding: `0 ${theme.spacing.md}`,
    flexShrink: 0,
  },
  body: {
    flexGrow: 1,
    minHeight: 0,
    marginTop: "10px",
    display: "flex",
    backgroundColor: theme.color.surface,
    borderRadius: "12px",
    overflow: "hidden",
  },
  main: {
    flexGrow: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
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
  composerWrap: {
    width: "100%",
    maxWidth: "820px",
    padding: `0 ${theme.spacing.xl} ${theme.spacing.xl}`,
    boxSizing: "border-box",
  },
  composer: {
    border: `1px solid ${theme.color.borderSubtle}`,
    borderRadius: "24px",
    padding: "14px 16px 10px 20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    backgroundColor: theme.color.surface,
    display: "flex",
    flexDirection: "column",
    rowGap: theme.spacing.sm,
    ":focus-within": { border: `1px solid ${theme.color.borderBrand}` },
  },
  textarea: {
    border: "none",
    outline: "none",
    resize: "none",
    width: "100%",
    fontFamily: "inherit",
    fontSize: theme.font.sizeMd,
    lineHeight: "22px",
    background: "transparent",
    maxHeight: "150px",
    color: "#222",
  },
  composerRow: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  micRow: { display: "inline-flex", alignItems: "center", columnGap: theme.spacing.xs },
  botText: { fontSize: theme.font.sizeMd, lineHeight: "22px" },
  thinkingLine: { lineHeight: "28px" },
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

export type ChatStyles = ReturnType<typeof useChatStyles>;

export function AiChatPage() {
  const chatStyles = useChatStyles();
  const { t } = useAppTranslation();
  const [chats, setChats] = useState<ChatSession[]>(SEED_CHATS);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [agentName, setAgentName] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const { mutate: sendChat } = useSendChat();
  const { data: agentsData } = useAiAgents({ page: 1, limit: 200 });
  const agents = agentsData?.data ?? [];
  const agent = agents.find((candidate) => candidate.name === agentName) ?? agents[0];
  const chat = chats.find((candidate) => candidate.id === currentChatId);
  const messages = chat?.messages ?? [];

  if (agent === undefined) return null;

  const newChat = () => {
    setCurrentChatId(null);
    setText("");
  };
  const send = (raw?: string) => {
    const messageText = (raw ?? text).trim();
    if (!messageText || busy) return;
    const id = currentChatId ?? `c${Date.now()}`;
    const sendingAgent = agent;
    setChats((previous) =>
      previous.some((candidate) => candidate.id === id)
        ? previous.map((candidate) =>
            candidate.id === id
              ? {
                  ...candidate,
                  messages: [...candidate.messages, { role: "user", text: messageText }],
                }
              : candidate,
          )
        : [
            {
              id,
              title: messageText.length > 44 ? `${messageText.slice(0, 44)}…` : messageText,
              agent: agent.name,
              messages: [{ role: "user", text: messageText }],
            },
            ...previous,
          ],
    );
    setCurrentChatId(id);
    setText("");
    setBusy(true);
    sendChat(
      { message: messageText, agentId: sendingAgent.name },
      {
        onSuccess: (data) => {
          setChats((previous) =>
            previous.map((candidate) =>
              candidate.id === id
                ? {
                    ...candidate,
                    messages: [
                      ...candidate.messages,
                      {
                        role: "bot",
                        tools: data.tools,
                        text: t("aiChat.demoReply", {
                          text: messageText,
                          agent: sendingAgent.name,
                        }),
                      },
                    ],
                  }
                : candidate,
            ),
          );
          setBusy(false);
        },
        onError: () => {
          setBusy(false);
        },
      },
    );
  };
  const toggleHistory = () => setShowHistory((value) => !value);

  const composer = (
    <ChatComposer
      styles={chatStyles}
      agentName={agent.name}
      value={text}
      busy={busy}
      onChange={setText}
      onSend={() => send()}
    />
  );

  return (
    <>
      <div className={chatStyles.bar}>
        <Menu
          checkedValues={{ agent: [agent.name] }}
          onCheckedValueChange={(checkedItems) => {
            const next = checkedItems[0];
            if (next) setAgentName(next);
          }}
        >
          <MenuTrigger disableButtonEnhancement>
            <MenuTriggerButton>
              <Bot20Regular />
              {agent.name}
              <ChevronDown16Regular style={{ color: theme.color.textBrand }} />
            </MenuTriggerButton>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {agents.map((candidate) => (
                <MenuItemRadio key={candidate.name} name="agent" value={candidate.name}>
                  {candidate.name}
                </MenuItemRadio>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>

      <div className={chatStyles.body}>
        <ChatToolRail
          showHistory={showHistory}
          onToggleHistory={toggleHistory}
          onNewChat={newChat}
        />

        {showHistory && (
          <ChatHistoryPanel
            chats={chats}
            currentChatId={currentChatId}
            onSelect={(candidate) => {
              setCurrentChatId(candidate.id);
              setAgentName(candidate.agent);
            }}
          />
        )}

        <div className={chatStyles.main}>
          {messages.length === 0 ? (
            <ChatEmptyState
              name={agent.name}
              description={agent.description}
              composer={composer}
              onPick={send}
            />
          ) : (
            <>
              <ChatMessageList
                styles={chatStyles}
                messages={messages}
                busy={busy}
                agentName={agent.name}
              />
              {composer}
            </>
          )}
        </div>
      </div>
    </>
  );
}
