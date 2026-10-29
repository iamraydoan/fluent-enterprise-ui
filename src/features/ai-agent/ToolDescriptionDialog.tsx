import { Eye20Regular } from "@/components/icons";
import { Button, makeStyles } from "@/components/ui";
import { DialogShell } from "./DialogShell";
import { toolDescription } from "./data";

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
  const descriptionStyles = useDescriptionStyles();
  return (
    <DialogShell
      title="View Tool Description"
      icon={<Eye20Regular />}
      onClose={onClose}
      showComments={false}
      footer={<Button onClick={onClose}>Close</Button>}
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
