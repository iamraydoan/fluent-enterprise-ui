import type { KeyboardEvent } from "react";
import { IconButton } from "@/components/common";
import { ArrowUp20Regular, Attach20Regular, Mic20Regular } from "@/components/icons";
import { Button, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

const useStyles = makeStyles({
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
});

interface ChatComposerProps {
  agentName: string;
  value: string;
  busy: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function ChatComposer({ agentName, value, busy, onChange, onSend }: ChatComposerProps) {
  const styles = useStyles();
  const { t } = useAppTranslation();
  const placeholder = t("aiChat.messageAgent", { agent: agentName });
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };
  return (
    <div className={styles.composerWrap}>
      <div className={styles.composer}>
        <textarea
          className={styles.textarea}
          rows={Math.min(6, value.split("\n").length)}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          aria-label={placeholder}
        />
        <div className={styles.composerRow}>
          <Button
            variant="subtle"
            shape="circular"
            icon={<Attach20Regular />}
            aria-label={t("aiChat.attachFile")}
          />
          <span className={styles.micRow}>
            <Button
              variant="subtle"
              shape="circular"
              icon={<Mic20Regular />}
              aria-label={t("aiChat.dictate")}
            />
            <IconButton
              variant="primary"
              shape="circular"
              icon={<ArrowUp20Regular />}
              onClick={onSend}
              disabled={!value.trim() || busy}
              ariaLabel={t("aiChat.send")}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
