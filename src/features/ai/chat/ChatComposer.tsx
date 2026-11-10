import type { KeyboardEvent } from "react";
import { IconButton } from "@/components/common";
import { ArrowUp20Regular, Attach20Regular, Mic20Regular } from "@/components/icons";
import { Button } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { ChatStyles } from "./AiChatPage";

interface ChatComposerProps {
  styles: ChatStyles;
  agentName: string;
  value: string;
  busy: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function ChatComposer({
  styles,
  agentName,
  value,
  busy,
  onChange,
  onSend,
}: ChatComposerProps) {
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
