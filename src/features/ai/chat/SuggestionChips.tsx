import { Button } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { ChatStyles } from "./AiChatPage";
import { CHAT_EXAMPLES } from "./data";

interface SuggestionChipsProps {
  styles: ChatStyles;
  onPick: (text: string) => void;
}

export function SuggestionChips({ styles, onPick }: SuggestionChipsProps) {
  const { t } = useAppTranslation();
  return (
    <div className={styles.examples}>
      {CHAT_EXAMPLES.map((key) => (
        <Button key={key} variant="outline" size="sm" onClick={() => onPick(t(key))}>
          {t(key)}
        </Button>
      ))}
    </div>
  );
}
