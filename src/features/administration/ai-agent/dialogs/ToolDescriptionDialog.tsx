import { Eye20Regular } from "@/components/icons";
import { Button, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { toolDescription } from "../data";
import { DialogShell } from "./DialogShell";

const useDescriptionStyles = makeStyles({
  desc: { padding: "28px 32px", fontSize: "13px", lineHeight: "20px", whiteSpace: "pre-wrap" },
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
    <DialogShell
      title={t("dialogs.toolDescription.title")}
      icon={<Eye20Regular />}
      onClose={onClose}
      showComments={false}
      footer={<Button onClick={onClose}>{t("common.close")}</Button>}
    >
      <div className={descriptionStyles.desc}>
        <div style={{ marginBottom: 24 }}>
          {server} - {tool}
        </div>
        {text ?? toolDescription(server, tool)}
      </div>
    </DialogShell>
  );
}
