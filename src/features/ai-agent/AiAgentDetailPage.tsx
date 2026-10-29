import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardGrid, DetailShell, Empty, KV, MiniBar, Panel } from "@/components/common";
import type { DetailTab, MiniBarButton, MiniBarGroup } from "@/components/common";
import {
  ArrowSync20Regular,
  Attach20Regular,
  Bot20Regular,
  BotSparkle24Regular,
  Checkmark16Filled,
  Checkmark20Filled,
  ChevronDown20Regular,
  ChevronRight20Regular,
  ColumnTriple20Regular,
  Dismiss20Filled,
  Edit20Regular,
  Eye20Filled,
  Info20Regular,
  MoreVertical20Regular,
  PlugConnected20Regular,
} from "@/components/icons";
import {
  Body1Strong,
  Button,
  Caption1,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  tokens,
  Tooltip,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useTabsStore } from "@/stores/tabs-store";
import { EditInstructionsDialog } from "./EditInstructionsDialog";
import { ManageMcpDialog } from "./ManageMcpDialog";
import { ToolDescriptionDialog } from "./ToolDescriptionDialog";
import type { ToolSelection } from "./data";
import {
  AI_AGENT_HISTORY,
  AI_AGENT_SECTIONS,
  agentData,
  countSelectedTools,
  INITIAL_TOOL_SELECTION,
  toolDescription,
} from "./data";

const useDetailStyles = makeStyles({
  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 0 8px",
  },
  scroll: {
    flexGrow: 1,
    minHeight: 0,
    overflow: "auto",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderBottom: "none",
  },
  th: {
    position: "sticky",
    top: 0,
    zIndex: 1,
    backgroundColor: "#EFEFEF",
    height: "36px",
    fontSize: "12px",
    fontWeight: 400,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    textTransform: "uppercase",
  },
  groupRow: { backgroundColor: "#EFEFEF", cursor: "pointer" },
  td: { height: "34.5px", fontSize: "13px" },
  tile: {
    width: "72px",
    height: "72px",
    flexShrink: 0,
    backgroundColor: "#C9E0EC",
    color: "#0F5C93",
    display: "grid",
    placeItems: "center",
    fontSize: "44px",
  },
  instr: {
    padding: "14px 4px",
    fontSize: "13px",
    lineHeight: "20px",
    whiteSpace: "pre-wrap",
    overflow: "auto",
    flexGrow: 1,
  },
});

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

interface AiAgentDetailPageProps {
  name: string;
}

function ToolsGrid({
  selection,
  onView,
}: {
  selection: ToolSelection;
  onView: (server: string, tool: string) => void;
}) {
  const { t } = useAppTranslation();
  const detailStyles = useDetailStyles();
  const [closed, setClosed] = useState(new Set<string>());
  const groups = Object.entries(selection);
  const toggle = (serverName: string) =>
    setClosed((previous) => {
      const next = new Set(previous);
      if (next.has(serverName)) next.delete(serverName);
      else next.add(serverName);
      return next;
    });
  return (
    <>
      <div className={detailStyles.titleRow}>
        <Text size={400}>{t("aiAgent.toolsTitle", { count: countSelectedTools(selection) })}</Text>
        <div>
          <Button
            appearance="subtle"
            icon={<ColumnTriple20Regular />}
            aria-label={t("common.chooseColumns")}
          />
          <Button
            appearance="subtle"
            icon={<MoreVertical20Regular />}
            aria-label={t("common.moreOptions")}
          />
        </div>
      </div>
      <div className={detailStyles.scroll}>
        <Table
          aria-label={t("aiAgent.toolsTitle", { count: countSelectedTools(selection) })}
          style={{ tableLayout: "fixed", width: "100%", minWidth: 640 }}
        >
          <TableHeader>
            <TableRow>
              <TableHeaderCell className={detailStyles.th} style={{ width: 30 }} />
              <TableHeaderCell className={detailStyles.th} style={{ width: "40%" }}>
                {t("aiAgent.toolsColumns.tool")}
              </TableHeaderCell>
              <TableHeaderCell className={detailStyles.th}>
                <div style={{ textAlign: "center" }}>{t("aiAgent.toolsColumns.description")}</div>
              </TableHeaderCell>
              <TableHeaderCell className={detailStyles.th}>
                <div style={{ textAlign: "center" }}>{t("aiAgent.toolsColumns.deferred")}</div>
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map(([serverName, tools]) => {
              const open = !closed.has(serverName);
              return [
                <TableRow
                  key={serverName}
                  className={detailStyles.groupRow}
                  onClick={() => toggle(serverName)}
                  aria-expanded={open}
                >
                  <TableCell colSpan={4}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        columnGap: 10,
                        color: "#1a6fc4",
                        fontSize: 13,
                      }}
                    >
                      {open ? <ChevronDown20Regular /> : <ChevronRight20Regular />}
                      <PlugConnected20Regular />
                      <span>
                        {serverName}{" "}
                        <span style={{ color: "#444" }}>
                          {t("aiAgent.toolsGroupCount", { count: Object.keys(tools).length })}
                        </span>
                      </span>
                    </span>
                  </TableCell>
                </TableRow>,
                ...(open
                  ? Object.entries(tools).map(([tool, deferred]) => (
                      <TableRow key={serverName + tool}>
                        <TableCell className={detailStyles.td} />
                        <TableCell className={detailStyles.td}>
                          <span
                            title={tool}
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {tool}
                          </span>
                        </TableCell>
                        <TableCell className={detailStyles.td}>
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <Button
                              size="small"
                              appearance="transparent"
                              icon={<Eye20Filled />}
                              aria-label={t("aiAgent.viewDescription", { tool })}
                              onClick={() => onView(serverName, tool)}
                            />
                          </div>
                        </TableCell>
                        <TableCell className={detailStyles.td}>
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            {deferred ? (
                              <Checkmark20Filled aria-label={t("aiAgent.deferred")} />
                            ) : (
                              <Dismiss20Filled
                                style={{ color: "#8A8A8A" }}
                                aria-label={t("aiAgent.notDeferred")}
                              />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  : []),
              ];
            })}
          </TableBody>
        </Table>
        {groups.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "#777" }}>
            {t("aiAgent.noToolsSelected")}
          </div>
        )}
      </div>
    </>
  );
}

export function AiAgentDetailPage({ name }: AiAgentDetailPageProps) {
  const { t } = useAppTranslation();
  const detailStyles = useDetailStyles();
  const openRoute = useTabsStore((state) => state.openRoute);
  const navigate = useNavigate();
  const data = agentData(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState("aiAgent.sections.details");
  const [instructions, setInstructions] = useState(data.instructions);
  const [selection, setSelection] = useState<ToolSelection>(INITIAL_TOOL_SELECTION);
  const [dialog, setDialog] = useState<"instr" | "mcp" | null>(null);
  const [view, setView] = useState<{ server: string; tool: string } | null>(null);

  const editInstructions = () => setDialog("instr");
  const editMcp = () => setDialog("mcp");
  const instructionButtons: MiniBarButton[] = [
    { icon: <ArrowSync20Regular />, label: t("actionBar.refresh") },
    { icon: <Edit20Regular />, label: t("actionBar.edit"), onClick: editInstructions },
  ];
  const instructionBarGroups: MiniBarGroup[] = [{ buttons: instructionButtons }];
  const mcpServerButtons: MiniBarButton[] = [
    { icon: <ArrowSync20Regular />, label: t("actionBar.refresh") },
    { icon: <Edit20Regular />, label: t("actionBar.edit"), onClick: editMcp },
  ];
  const mcpServerBarGroups: MiniBarGroup[] = [
    { buttons: mcpServerButtons },
    {
      label: t("actionBar.groups.actions"),
      buttons: [{ icon: <MoreVertical20Regular />, label: t("actionBar.more") }],
    },
  ];
  const onEdit = left === "aiAgent.sections.mcpServers" ? editMcp : editInstructions;
  const askAi = () => {
    openRoute("/ai");
    navigate({ to: "/ai" });
  };

  const description = data.descriptionKey ? t(data.descriptionKey) : data.description;
  const historyHeaders = [
    t("aiAgent.historyColumns.date"),
    t("aiAgent.historyColumns.user"),
    t("aiAgent.historyColumns.action"),
    t("aiAgent.historyColumns.details"),
  ];

  let content;
  if (top === "references") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("aiAgent.noReferences")}</Body1Strong>
          <Caption1>{t("aiAgent.noReferencesBody")}</Caption1>
        </Empty>
      </Panel>
    );
  } else if (top === "history") {
    content = (
      <Panel>
        <div className={detailStyles.titleRow}>
          <Text size={400}>{t("aiAgent.historyTitle", { count: AI_AGENT_HISTORY.length })}</Text>
        </div>
        <div className={detailStyles.scroll}>
          <Table
            aria-label={t("aiAgent.historyTitle", { count: AI_AGENT_HISTORY.length })}
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <TableHeader>
              <TableRow>
                {historyHeaders.map((header) => (
                  <TableHeaderCell key={header} className={detailStyles.th}>
                    {header}
                  </TableHeaderCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {AI_AGENT_HISTORY.map((row) => (
                <TableRow key={row[0]}>
                  {row.map((cell, index) => (
                    <TableCell key={index} className={detailStyles.td}>
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>
    );
  } else if (left === "aiAgent.sections.details") {
    content = (
      <CardGrid>
        <Card title={t("aiAgent.cards.agent")}>
          <div style={{ display: "flex", columnGap: 18, alignItems: "flex-start" }}>
            <div className={detailStyles.tile}>
              <BotSparkle24Regular />
            </div>
            <div style={{ flexGrow: 1, minWidth: 0 }}>
              <KV
                rows={[
                  [t("aiAgent.fields.name"), name],
                  [t("aiAgent.fields.description"), description],
                  [t("aiAgent.fields.universalState"), t("common.active")],
                  [t("aiAgent.fields.dataGroup"), ""],
                ]}
              />
            </div>
            <Tooltip content={t("aiAgent.createdBy")} relationship="description">
              <Button
                appearance="transparent"
                icon={<Info20Regular style={{ color: "#0F6CBD" }} />}
                aria-label={t("common.information")}
              />
            </Tooltip>
          </div>
        </Card>
        <Card title={t("aiAgent.cards.information")}>
          <KV
            rows={[
              [t("aiAgent.fields.provider"), data.provider],
              [t("aiAgent.fields.model"), data.model],
              [t("aiAgent.fields.runtime"), data.runtime],
              [
                t("aiAgent.fields.publishToRuntime"),
                data.publish ? (
                  <span style={{ display: "inline-flex", alignItems: "center", columnGap: 6 }}>
                    <Checkmark16Filled />
                    {t("common.yes")}
                  </span>
                ) : (
                  t("common.no")
                ),
              ],
              [
                t("aiAgent.fields.synchronizationStatus"),
                t(data.sync === "Completed" ? "common.syncCompleted" : "common.syncPending"),
              ],
            ]}
          />
        </Card>
      </CardGrid>
    );
  } else if (left === "aiAgent.sections.instructions") {
    content = (
      <Panel>
        <MiniBar groups={instructionBarGroups} />
        <div className={detailStyles.instr}>{instructions}</div>
      </Panel>
    );
  } else if (left === "aiAgent.sections.mcpServers") {
    content = (
      <Panel>
        <MiniBar groups={mcpServerBarGroups} />
        <ToolsGrid selection={selection} onView={(server, tool) => setView({ server, tool })} />
      </Panel>
    );
  } else {
    content = (
      <Panel>
        <Empty>
          <Attach20Regular />
          <Body1Strong>{t("aiAgent.noAttachments")}</Body1Strong>
          <Caption1>{t("aiAgent.noAttachmentsBody")}</Caption1>
        </Empty>
      </Panel>
    );
  }

  return (
    <>
      <DetailShell
        title={name}
        icon={<Bot20Regular />}
        topTabs={TOP_TABS}
        top={top}
        onTop={setTop}
        leftItems={AI_AGENT_SECTIONS}
        left={left}
        onLeft={setLeft}
        onEdit={onEdit}
        onAskAi={askAi}
      >
        {content}
      </DetailShell>

      {dialog === "instr" && (
        <EditInstructionsDialog
          agentName={name}
          value={instructions}
          onClose={() => setDialog(null)}
          onSave={(next) => {
            setInstructions(next);
            setDialog(null);
          }}
        />
      )}
      {dialog === "mcp" && (
        <ManageMcpDialog
          agentName={name}
          agentDescription={description || undefined}
          selection={selection}
          onClose={() => setDialog(null)}
          onUpdate={(next) => {
            setSelection(next);
            setDialog(null);
          }}
          onViewTool={(server, tool) => setView({ server, tool })}
        />
      )}
      {view && (
        <ToolDescriptionDialog
          server={view.server}
          tool={view.tool}
          text={toolDescription(view.server, view.tool)}
          onClose={() => setView(null)}
        />
      )}
    </>
  );
}
