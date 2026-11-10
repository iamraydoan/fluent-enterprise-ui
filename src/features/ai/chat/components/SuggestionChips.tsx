import { Button, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";
import { CHAT_EXAMPLES } from "../data";

const useStyles = makeStyles({
  examples: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    justifyContent: "center",
    marginTop: "6px",
  },
});

interface SuggestionChipsProps {
  onPick: (text: string) => void;
}

export function SuggestionChips({ onPick }: SuggestionChipsProps) {
  const styles = useStyles();
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
