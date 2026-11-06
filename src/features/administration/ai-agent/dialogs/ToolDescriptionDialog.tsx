import { BaseDialog } from "@/components/common";
import { Eye20Regular } from "@/components/icons";
import { Button, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";
import { toolDescription } from "../data";

const useDescriptionStyles = makeStyles({
  desc: {
    padding: `28px ${theme.spacing["2xl"]}`,
    fontSize: "13px",
    lineHeight: "20px",
    whiteSpace: "pre-wrap",
  },
});

interface ToolDescriptionDialogProps {
  server: string;
  tool: string;
  text?: string;
  onClose: () => void;
}

export function ToolDescriptionDialog({ server, tool, text, onClose }: ToolDescriptionDialogProps) {
  const { t } = useAppTranslation();
  const descriptionStyles = useDescriptionStyles();
  return (
    <BaseDialog
      open
      title={t("dialogs.toolDescription.title")}
      icon={<Eye20Regular />}
      size="fullscreen"
      onClose={onClose}
      footer={<Button onClick={onClose}>{t("common.close")}</Button>}
    >
      <div className={descriptionStyles.desc}>
        <div style={{ marginBottom: theme.spacing.xl }}>
          {server} - {tool}
        </div>
        {text ?? toolDescription(server, tool)}
      </div>
    </BaseDialog>
  );
}
