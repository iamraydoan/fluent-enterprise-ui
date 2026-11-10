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
import { ChatComposer } from "./components/ChatComposer";
import { ChatEmptyState } from "./components/ChatEmptyState";
import { ChatHistoryPanel } from "./components/ChatHistoryPanel";
import { ChatMessageList } from "./components/ChatMessageList";
import { ChatToolRail } from "./components/ChatToolRail";
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
              <ChatMessageList messages={messages} busy={busy} agentName={agent.name} />
              {composer}
            </>
          )}
        </div>
      </div>
    </>
  );
}
