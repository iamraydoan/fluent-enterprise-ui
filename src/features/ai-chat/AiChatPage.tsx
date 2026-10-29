import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowUp20Regular,
  Attach20Regular,
  Bot20Regular,
  Bot24Regular,
  ChatMultiple20Regular,
  ChevronDown16Regular,
  Compose20Regular,
  Mic20Regular,
  PanelLeft20Regular,
  Wrench16Regular,
} from "@/components/icons";
import {
  Body1Strong,
  Button,
  Caption1,
  makeStyles,
  Menu,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  mergeClasses,
  Text,
  tokens,
  Tooltip,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { CHAT_AGENTS, CHAT_EXAMPLES, pickTools, SEED_CHATS } from "./data";
import type { ChatSession } from "./data";

const useChatStyles = makeStyles({
  bar: {
    backgroundColor: "#FAFAFA",
    borderRadius: "0 0 12px 12px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    flexShrink: 0,
  },
  agentBtn: {
    display: "inline-flex",
    alignItems: "center",
    columnGap: "8px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    color: "#222",
    padding: "4px 6px",
    borderRadius: "4px",
    ":hover": { backgroundColor: "#EEF0F3" },
  },
  body: {
    flexGrow: 1,
    minHeight: 0,
    marginTop: "10px",
    display: "flex",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    overflow: "hidden",
  },
  tools: {
    width: "56px",
    flexShrink: 0,
    backgroundColor: "#F3F4F6",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "12px",
    rowGap: "6px",
  },
  toolBtn: {
    width: "38px",
    height: "38px",
    display: "grid",
    placeItems: "center",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    borderRadius: "8px",
    color: "#222",
    ":hover": { backgroundColor: "#E4E7EC" },
  },
  toolOn: { backgroundColor: "#E2E5EA" },
  history: {
    width: "250px",
    flexShrink: 0,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    padding: "12px 8px",
    rowGap: "2px",
    backgroundColor: "#FBFBFC",
  },
  histItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: "2px",
    padding: "8px 10px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    borderRadius: "8px",
    fontFamily: "inherit",
    textAlign: "left",
    width: "100%",
    ":hover": { backgroundColor: "#EEF1F6" },
  },
  histOn: { backgroundColor: "#E3EAF8" },
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
    padding: "24px 24px 8px",
    display: "flex",
    flexDirection: "column",
    rowGap: "18px",
  },
  hero: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    rowGap: "14px",
    textAlign: "center",
    padding: "0 24px",
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
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    display: "grid",
    placeItems: "center",
    backgroundColor: "#fff",
    fontSize: "24px",
  },
  composerWrap: {
    width: "100%",
    maxWidth: "820px",
    padding: "0 24px 24px",
    boxSizing: "border-box",
  },
  composer: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: "24px",
    padding: "14px 16px 10px 20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
    ":focus-within": { border: `1px solid ${tokens.colorBrandStroke1}` },
  },
  textarea: {
    border: "none",
    outline: "none",
    resize: "none",
    width: "100%",
    fontFamily: "inherit",
    fontSize: "14px",
    lineHeight: "22px",
    background: "transparent",
    maxHeight: "150px",
    color: "#222",
  },
  composerRow: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  send: {
    width: "38px",
    height: "38px",
    borderRadius: "999px",
    border: "none",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    backgroundColor: "#E4E6EA",
    color: "#fff",
  },
  sendOn: { backgroundColor: "#1E2330" },
  userMsg: {
    alignSelf: "flex-end",
    maxWidth: "75%",
    backgroundColor: "#E8EEFB",
    borderRadius: "18px 18px 4px 18px",
    padding: "10px 14px",
    fontSize: "14px",
    lineHeight: "21px",
    whiteSpace: "pre-wrap",
  },
  botRow: { display: "flex", columnGap: "12px", alignItems: "flex-start" },
  botIcon: {
    width: "28px",
    height: "28px",
    flexShrink: 0,
    borderRadius: "999px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    display: "grid",
    placeItems: "center",
    backgroundColor: "#fff",
  },
  chips: { display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    columnGap: "4px",
    fontSize: "12px",
    color: "#444",
    backgroundColor: "#F1F2F4",
    borderRadius: "999px",
    padding: "2px 10px 2px 8px",
  },
  examples: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: "center",
    marginTop: "6px",
  },
  example: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: "999px",
    padding: "6px 14px",
    background: "#fff",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    color: "#333",
    ":hover": { backgroundColor: "#F1F4FA", border: "1px solid #B7C7EE" },
  },
});

export function AiChatPage() {
  const chatStyles = useChatStyles();
  const { t } = useAppTranslation();
  const [chats, setChats] = useState<ChatSession[]>(SEED_CHATS);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [agentId, setAgentId] = useState("cm");
  const [showHistory, setShowHistory] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const agent = CHAT_AGENTS.find((candidate) => candidate.id === agentId) ?? CHAT_AGENTS[0];
  const chat = chats.find((candidate) => candidate.id === currentChatId);
  const messages = chat?.messages ?? [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, busy]);

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
              agent: agentId,
              messages: [{ role: "user", text: messageText }],
            },
            ...previous,
          ],
    );
    setCurrentChatId(id);
    setText("");
    setBusy(true);
    window.setTimeout(() => {
      setChats((previous) =>
        previous.map((candidate) =>
          candidate.id === id
            ? {
                ...candidate,
                messages: [
                  ...candidate.messages,
                  {
                    role: "bot",
                    tools: pickTools(messageText),
                    text: t("aiChat.demoReply", { text: messageText, agent: sendingAgent.name }),
                  },
                ],
              }
            : candidate,
        ),
      );
      setBusy(false);
    }, 900);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  const composer = (
    <div className={chatStyles.composerWrap}>
      <div className={chatStyles.composer}>
        <textarea
          className={chatStyles.textarea}
          rows={Math.min(6, text.split("\n").length)}
          value={text}
          placeholder={t("aiChat.messageAgent", { agent: t(agent.titleKey) })}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={onKeyDown}
          aria-label={t("aiChat.messageAgent", { agent: t(agent.titleKey) })}
        />
        <div className={chatStyles.composerRow}>
          <Button
            appearance="subtle"
            shape="circular"
            icon={<Attach20Regular />}
            aria-label={t("aiChat.attachFile")}
          />
          <span style={{ display: "inline-flex", alignItems: "center", columnGap: 4 }}>
            <Button
              appearance="subtle"
              shape="circular"
              icon={<Mic20Regular />}
              aria-label={t("aiChat.dictate")}
            />
            <button
              className={mergeClasses(chatStyles.send, text.trim() && !busy && chatStyles.sendOn)}
              onClick={() => send()}
              disabled={!text.trim() || busy}
              aria-label={t("aiChat.send")}
            >
              <ArrowUp20Regular />
            </button>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={chatStyles.bar}>
        <Menu
          checkedValues={{ agent: [agentId] }}
          onCheckedValueChange={(_, d) => {
            const next = d.checkedItems[0];
            if (next) setAgentId(next);
          }}
        >
          <MenuTrigger disableButtonEnhancement>
            <button className={chatStyles.agentBtn}>
              <Bot20Regular />
              {agent.name}
              <ChevronDown16Regular style={{ color: "#1a6fc4" }} />
            </button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {CHAT_AGENTS.map((candidate) => (
                <MenuItemRadio key={candidate.id} name="agent" value={candidate.id}>
                  {candidate.name}
                </MenuItemRadio>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>

      <div className={chatStyles.body}>
        <div className={chatStyles.tools}>
          <Tooltip content={t("aiChat.toggleHistory")} relationship="label" positioning="after">
            <button
              className={chatStyles.toolBtn}
              aria-label={t("aiChat.toggleHistory")}
              onClick={() => setShowHistory((value) => !value)}
            >
              <PanelLeft20Regular />
            </button>
          </Tooltip>
          <Tooltip content={t("aiChat.newChat")} relationship="label" positioning="after">
            <button
              className={chatStyles.toolBtn}
              aria-label={t("aiChat.newChat")}
              onClick={newChat}
            >
              <Compose20Regular />
            </button>
          </Tooltip>
          <div
            style={{
              width: 28,
              borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
              margin: "2px 0",
            }}
          />
          <Tooltip content={t("aiChat.chats")} relationship="label" positioning="after">
            <button
              className={mergeClasses(chatStyles.toolBtn, showHistory && chatStyles.toolOn)}
              aria-label={t("aiChat.chats")}
              aria-pressed={showHistory}
              onClick={() => setShowHistory((value) => !value)}
            >
              <ChatMultiple20Regular />
            </button>
          </Tooltip>
        </div>

        {showHistory && (
          <aside className={chatStyles.history} aria-label={t("aiChat.chatHistory")}>
            <Body1Strong style={{ padding: "4px 10px 8px" }}>{t("aiChat.chats")}</Body1Strong>
            {chats.map((candidate) => (
              <button
                key={candidate.id}
                className={mergeClasses(
                  chatStyles.histItem,
                  currentChatId === candidate.id && chatStyles.histOn,
                )}
                onClick={() => {
                  setCurrentChatId(candidate.id);
                  setAgentId(candidate.agent);
                }}
              >
                <Text size={300} truncate wrap={false} style={{ maxWidth: 210 }}>
                  {candidate.titleKey ? t(candidate.titleKey) : candidate.title}
                </Text>
                <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
                  {CHAT_AGENTS.find((item) => item.id === candidate.agent)?.name}
                </Caption1>
              </button>
            ))}
          </aside>
        )}

        <div className={chatStyles.main}>
          {messages.length === 0 ? (
            <div className={chatStyles.hero}>
              <div className={chatStyles.heroTitle}>
                <span className={chatStyles.heroIcon}>
                  <Bot24Regular />
                </span>
                {t(agent.titleKey)}
              </div>
              <Text size={300} style={{ maxWidth: 460, lineHeight: "21px" }}>
                {t(agent.descriptionKey)}
              </Text>
              <div style={{ width: "100%" }}>{composer}</div>
              <div className={chatStyles.examples}>
                {CHAT_EXAMPLES.map((key) => (
                  <button key={key} className={chatStyles.example} onClick={() => send(t(key))}>
                    {t(key)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className={chatStyles.scroll}>
                <div className={chatStyles.col}>
                  {messages.map((message, index) =>
                    message.role === "user" ? (
                      <div key={index} className={chatStyles.userMsg}>
                        {message.textKey ? t(message.textKey) : message.text}
                      </div>
                    ) : (
                      <div key={index} className={chatStyles.botRow}>
                        <span className={chatStyles.botIcon}>
                          <Bot20Regular />
                        </span>
                        <div style={{ fontSize: 14, lineHeight: "22px" }}>
                          {message.textKey ? t(message.textKey) : message.text}
                          {message.tools && (
                            <div className={chatStyles.chips}>
                              {message.tools.map((tool) => (
                                <span key={tool} className={chatStyles.chip}>
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
                    <div className={chatStyles.botRow}>
                      <span className={chatStyles.botIcon}>
                        <Bot20Regular />
                      </span>
                      <Caption1 style={{ lineHeight: "28px" }}>
                        {t("aiChat.thinking", { agent: t(agent.titleKey) })}
                      </Caption1>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>
              </div>
              {composer}
            </>
          )}
        </div>
      </div>
    </>
  );
}
