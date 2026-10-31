import { Bot20Regular, ChevronDown20Regular } from "@/components/icons";
import { makeStyles } from "@/components/ui";
import { cardSurface } from "@/styles/shared";
import { theme } from "@/styles/theme";

const useDialogAgentSubStyles = makeStyles({
  sub: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 16px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    ...cardSurface,
    flexShrink: 0,
    fontSize: "13px",
  },
  link: {
    color: "#1a6fc4",
    display: "inline-flex",
    alignItems: "center",
    columnGap: "6px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    padding: 0,
  },
});

export function DialogAgentSub({
  agentName,
  agentDescription,
}: {
  agentName: string;
  agentDescription?: string;
}) {
  const styles = useDialogAgentSubStyles();
  return (
    <div className={styles.sub}>
      <span style={{ display: "inline-flex", alignItems: "center", columnGap: 10, minWidth: 0 }}>
        <span className={styles.link}>
          <Bot20Regular />
          {agentName}
        </span>
        {agentDescription && <span style={{ color: "#333" }}>{` / ${agentDescription}`}</span>}
      </span>
      <ChevronDown20Regular style={{ color: "#1a6fc4" }} />
    </div>
  );
}
