import { IconButton } from "@/components/common";
import { ChatMultiple20Regular, Compose20Regular, PanelLeft20Regular } from "@/components/icons";
import { Tooltip } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { ChatStyles } from "./AiChatPage";

interface ChatToolRailProps {
  styles: ChatStyles;
  showHistory: boolean;
  onToggleHistory: () => void;
  onNewChat: () => void;
}

export function ChatToolRail({
  styles,
  showHistory,
  onToggleHistory,
  onNewChat,
}: ChatToolRailProps) {
  const { t } = useAppTranslation();
  return (
    <div className={styles.tools}>
      <Tooltip content={t("aiChat.toggleHistory")} relationship="label" positioning="after">
        <IconButton
          icon={<PanelLeft20Regular />}
          ariaLabel={t("aiChat.toggleHistory")}
          onClick={onToggleHistory}
        />
      </Tooltip>
      <Tooltip content={t("aiChat.newChat")} relationship="label" positioning="after">
        <IconButton
          icon={<Compose20Regular />}
          ariaLabel={t("aiChat.newChat")}
          onClick={onNewChat}
        />
      </Tooltip>
      <div className={styles.railDivider} />
      <Tooltip content={t("aiChat.chats")} relationship="label" positioning="after">
        <IconButton
          icon={<ChatMultiple20Regular />}
          ariaLabel={t("aiChat.chats")}
          active={showHistory}
          onClick={onToggleHistory}
        />
      </Tooltip>
    </div>
  );
}
