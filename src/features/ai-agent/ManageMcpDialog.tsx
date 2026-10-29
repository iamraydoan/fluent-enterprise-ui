import { useState } from "react";
import {
  ChevronRight20Regular,
  Delete20Regular,
  Eye20Filled,
  Search20Regular,
  Settings20Regular,
} from "@/components/icons";
import { Button, Checkbox, Input, makeStyles, Text, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { DialogAgentSub, DialogShell } from "./DialogShell";
import { AGENT_MCP_SERVERS, agentServerTools } from "./data";
import type { ToolSelection } from "./data";

const useManageStyles = makeStyles({
  cols: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) 540px",
    columnGap: "48px",
    padding: "20px 32px 20px",
    flexGrow: 1,
    minHeight: 0,
  },
  colBox: { display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0 },
  colHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "40px",
    marginBottom: "10px",
  },
  box: {
    flexGrow: 1,
    minHeight: 0,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    display: "flex",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  list: { flex: 1, minWidth: 0, overflowY: "auto", display: "flex", flexDirection: "column" },
  listHead: {
    height: "44px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    padding: "0 10px",
    backgroundColor: "#E6E6E6",
    fontSize: "13px",
    columnGap: "8px",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  row: {
    minHeight: "45px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 10px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontSize: "13px",
    cursor: "pointer",
    border: "none",
    background: "#EFEFEF",
    fontFamily: "inherit",
    textAlign: "left",
    width: "100%",
    ":hover": { backgroundColor: "#E3EAF3" },
  },
  rowOn: { backgroundColor: "#CFE3F1" },
  trow: {
    minHeight: "45px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 10px 0 4px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontSize: "13px",
    backgroundColor: "#EFEFEF",
  },
  sRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "4px 12px",
    minHeight: "44px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontSize: "13px",
    lineHeight: "17px",
    flexShrink: 0,
  },
  def: {
    border: "none",
    background: "transparent",
    color: "#0F6CBD",
    fontFamily: "inherit",
    fontSize: "10px",
    cursor: "pointer",
    padding: "4px",
  },
});

interface ManageMcpDialogProps {
  agentName: string;
  agentDescription?: string;
  selection: ToolSelection;
  onUpdate: (selection: ToolSelection) => void;
  onClose: () => void;
  onViewTool: (server: string, tool: string) => void;
}

export function ManageMcpDialog({
  agentName,
  agentDescription,
  selection,
  onUpdate,
  onClose,
  onViewTool,
}: ManageMcpDialogProps) {
  const manageStyles = useManageStyles();
  const { t } = useAppTranslation();
  const [draft, setDraft] = useState<ToolSelection>(
    () => JSON.parse(JSON.stringify(selection)) as ToolSelection,
  );
  const [activeServer, setActiveServer] = useState(AGENT_MCP_SERVERS[0].name);
  const [searchQuery, setSearchQuery] = useState("");
  const tools = agentServerTools(activeServer).filter((tool) =>
    tool.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const isOn = (server: string, tool: string) => tool in (draft[server] ?? {});
  const patch = (
    server: string,
    mutate: (toolsForServer: Record<string, boolean>) => Record<string, boolean>,
  ) =>
    setDraft((previous) => {
      const updated = mutate({ ...(previous[server] ?? {}) });
      const next = { ...previous, [server]: updated };
      if (Object.keys(updated).length === 0) delete next[server];
      return next;
    });
  const toggle = (server: string, tool: string) =>
    patch(server, (current) => {
      if (tool in current) delete current[tool];
      else current[tool] = false;
      return current;
    });
  const allOn = tools.length > 0 && tools.every((tool) => isOn(activeServer, tool));
  const toggleAll = () =>
    patch(activeServer, (current) => {
      tools.forEach((tool) => {
        if (allOn) delete current[tool];
        else if (!(tool in current)) current[tool] = false;
      });
      return current;
    });
  const selectedList = Object.entries(draft).flatMap(([server, toolsForServer]) =>
    Object.entries(toolsForServer).map(([tool, deferred]) => ({ server, tool, deferred })),
  );
  return (
    <DialogShell
      title={t("dialogs.manageMcp.title")}
      icon={<Settings20Regular />}
      onClose={onClose}
      sub={<DialogAgentSub agentName={agentName} agentDescription={agentDescription} />}
      footer={
        <>
          <Button onClick={onClose}>{t("common.cancel")}</Button>
          <Button appearance="primary" onClick={() => onUpdate(draft)}>
            {t("common.update")}
          </Button>
        </>
      }
    >
      <div className={manageStyles.cols}>
        <div className={manageStyles.colBox}>
          <div className={manageStyles.colHead}>
            <Text size={400}>{t("dialogs.manageMcp.selectTools")}</Text>
            <Input
              appearance="outline"
              contentBefore={<Search20Regular />}
              placeholder={t("common.search")}
              value={searchQuery}
              onChange={(_, d) => setSearchQuery(d.value)}
              aria-label={t("dialogs.manageMcp.searchTools")}
              style={{ width: 204 }}
            />
          </div>
          <div className={manageStyles.box}>
            <div className={manageStyles.list} style={{ borderRight: "1px solid #BDBDBD" }}>
              <div className={manageStyles.listHead}>{t("dialogs.manageMcp.mcpServers")}</div>
              {AGENT_MCP_SERVERS.map((server) => {
                const count = Object.keys(draft[server.name] ?? {}).length;
                return (
                  <button
                    key={server.name}
                    className={`${manageStyles.row} ${activeServer === server.name ? manageStyles.rowOn : ""}`}
                    onClick={() => setActiveServer(server.name)}
                    aria-current={activeServer === server.name}
                  >
                    <span>{server.name}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", columnGap: 8 }}>
                      {t("dialogs.manageMcp.serverCount", {
                        selected: count,
                        total: server.tools.length,
                      })}
                      <ChevronRight20Regular />
                    </span>
                  </button>
                );
              })}
            </div>
            <div className={manageStyles.list}>
              <div className={manageStyles.listHead} style={{ paddingLeft: 4 }}>
                <Checkbox
                  checked={
                    allOn ? true : tools.some((tool) => isOn(activeServer, tool)) ? "mixed" : false
                  }
                  onChange={toggleAll}
                  aria-label={t("dialogs.manageMcp.selectAllTools")}
                />
                {t("dialogs.manageMcp.tools")}
              </div>
              {tools.map((tool) => (
                <div
                  key={tool}
                  className={manageStyles.trow}
                  style={isOn(activeServer, tool) ? { backgroundColor: "#CFE3F1" } : undefined}
                >
                  <Checkbox
                    label={tool}
                    checked={isOn(activeServer, tool)}
                    onChange={() => toggle(activeServer, tool)}
                  />
                  <Button
                    size="small"
                    appearance="transparent"
                    icon={<Eye20Filled />}
                    aria-label={t("dialogs.manageMcp.viewTool", { tool })}
                    onClick={() => onViewTool(activeServer, tool)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={manageStyles.colBox}>
          <div className={manageStyles.colHead}>
            <Text size={400}>
              {t("dialogs.manageMcp.selectedTools", { count: selectedList.length })}
            </Text>
            <Button
              appearance="subtle"
              icon={<Delete20Regular />}
              aria-label={t("dialogs.manageMcp.clearSelected")}
              disabled={selectedList.length === 0}
              onClick={() => setDraft({})}
            />
          </div>
          <div className={manageStyles.box} style={{ flexDirection: "column", overflowY: "auto" }}>
            {selectedList.map(({ server, tool, deferred }) => (
              <div key={server + tool} className={manageStyles.sRow}>
                <span>
                  <div>{tool}</div>
                  <div>{server}</div>
                </span>
                <button
                  className={manageStyles.def}
                  onClick={() =>
                    setDraft((previous) => ({
                      ...previous,
                      [server]: { ...previous[server], [tool]: !deferred },
                    }))
                  }
                >
                  {deferred ? t("aiAgent.deferred") : t("aiAgent.notDeferred")}
                </button>
              </div>
            ))}
            {selectedList.length === 0 && (
              <div style={{ padding: 20, color: "#777", fontSize: 13 }}>
                {t("dialogs.manageMcp.noTools")}
              </div>
            )}
          </div>
        </div>
      </div>
    </DialogShell>
  );
}
