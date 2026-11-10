import { IconButton } from "@/components/common";
import { ChatMultiple20Regular, Compose20Regular, PanelLeft20Regular } from "@/components/icons";
import { makeStyles, Tooltip } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

const useStyles = makeStyles({
  tools: {
    width: "56px",
    flexShrink: 0,
    backgroundColor: theme.color.surfaceSecondary,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: theme.spacing.md,
    rowGap: "6px",
  },
  railDivider: {
    width: "28px",
    borderTop: `1px solid ${theme.color.borderSubtle}`,
    margin: "2px 0",
  },
});

interface ChatToolRailProps {
  showHistory: boolean;
  onToggleHistory: () => void;
  onNewChat: () => void;
}

export function ChatToolRail({ showHistory, onToggleHistory, onNewChat }: ChatToolRailProps) {
  const styles = useStyles();
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
