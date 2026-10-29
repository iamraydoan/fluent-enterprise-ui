import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardGrid, DetailShell, Empty, KV, MiniBar, Panel } from "@/components/common";
import type { DetailTab, MiniBarGroup } from "@/components/common";
import {
  ArrowSync20Regular,
  Attach20Regular,
  Attach24Regular,
  Checkmark16Filled,
  ChevronLeft20Regular,
  ChevronRight20Regular,
  ColumnTriple20Regular,
  Info20Regular,
  MoreVertical20Regular,
} from "@/components/icons";
import {
  Body1Strong,
  Button,
  Caption1,
  makeStyles,
  Menu,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  tokens,
} from "@/components/ui";
import { useTabsStore } from "@/stores/tabs-store";
import { MCP_SERVER_SECTIONS, mcpDetail } from "./data";

const useMcpDetailStyles = makeStyles({
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
  link: { color: "#1a6fc4", wordBreak: "break-all" },
  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0 8px",
  },
  scroll: {
    overflow: "auto",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderBottom: "none",
  },
  th: {
    backgroundColor: "#EFEFEF",
    height: "36px",
    fontSize: "12px",
    fontWeight: 400,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  td: { height: "34.5px", fontSize: "13px" },
  foot: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    columnGap: "28px",
    padding: "8px 4px 12px",
    fontSize: "13px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  menuBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    color: "#222",
    display: "inline-flex",
    alignItems: "center",
    columnGap: "6px",
  },
});

const TOP_TABS: DetailTab[] = [
  { value: "details", label: "Details" },
  { value: "references", label: "References" },
];

interface McpServerDetailPageProps {
  name: string;
}

export function McpServerDetailPage({ name }: McpServerDetailPageProps) {
  const mcpDetailStyles = useMcpDetailStyles();
  const openRoute = useTabsStore((state) => state.openRoute);
  const navigate = useNavigate();
  const detail = mcpDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState("Details");
  const [pageSize, setPageSize] = useState(100);
  const [lastSync, setLastSync] = useState(detail.lastSync);
  const synchronize = () => {
    const now = new Date();
    const pad = (value: number) => String(value).padStart(2, "0");
    const hour = now.getHours() % 12 || 12;
    setLastSync(
      `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(hour)}:${pad(now.getMinutes())} ${now.getHours() >= 12 ? "PM" : "AM"}`,
    );
  };
  const askAi = () => {
    openRoute("/ai");
    navigate({ to: "/ai" });
  };
  const toolsBarGroups: MiniBarGroup[] = [
    { buttons: [{ icon: <ArrowSync20Regular />, label: "Synchronize", onClick: synchronize }] },
  ];
  const detailLink = (label: string) => (
    <a className={mcpDetailStyles.link} href="#" onClick={(event) => event.preventDefault()}>
      {label}
    </a>
  );

  let content;
  if (top === "references") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>No references</Body1Strong>
          <Caption1>This server is not referenced by other objects.</Caption1>
        </Empty>
      </Panel>
    );
  } else if (left === "Details") {
    content = (
      <CardGrid>
        <Card title="AI MCP Server">
          <div style={{ display: "flex", columnGap: 18, alignItems: "flex-start" }}>
            <div className={mcpDetailStyles.tile}>
              <Attach24Regular />
            </div>
            <div style={{ flexGrow: 1, minWidth: 0 }}>
              <KV
                rows={[
                  ["Name", name],
                  ["Description", detail.description],
                  ["Universal State", "Active"],
                  ["Data Group", ""],
                ]}
              />
            </div>
            <Info20Regular
              style={{ color: "#0F6CBD", margin: "6px 4px" }}
              aria-label="Information"
            />
          </div>
        </Card>
        <Card title="Information">
          <KV
            rows={[
              ["Initialization Timeout", String(detail.init)],
              ["Instructions", ""],
              ["Request Timeout", String(detail.req)],
              ["URL", detailLink(detail.url)],
              ["Synchronization Status", detail.sync],
              ["Protocol Version", detail.protocol],
              [
                "Is System",
                detail.isSystem ? (
                  <span style={{ display: "inline-flex", alignItems: "center", columnGap: 6 }}>
                    <Checkmark16Filled />
                    Yes
                  </span>
                ) : (
                  "No"
                ),
              ],
            ]}
          />
        </Card>
        <Card title="Authentication">
          <KV
            rows={[
              ["Authentication Mode", detail.auth.mode],
              ["Client ID", detail.auth.clientId],
              ["Authorization URL", detailLink(detail.auth.authUrl)],
              ["Token URL", detailLink(detail.auth.tokenUrl)],
              ["Scope", detail.auth.scope],
            ]}
          />
        </Card>
      </CardGrid>
    );
  } else if (left === "Tools") {
    content = (
      <Panel>
        <MiniBar groups={toolsBarGroups} />
        <div style={{ padding: "12px 12px 0", fontSize: 13, color: "#444" }}>
          Last Tool Synchronization:{" "}
          <span style={{ color: "#222", marginLeft: 6 }}>{lastSync}</span>
        </div>
        <div className={mcpDetailStyles.titleRow}>
          <Text size={400}>Tools ({detail.tools.length})</Text>
          <div>
            <Button
              appearance="subtle"
              icon={<ColumnTriple20Regular />}
              aria-label="Choose columns"
            />
            <Button
              appearance="subtle"
              icon={<MoreVertical20Regular />}
              aria-label="More options"
            />
          </div>
        </div>
        <div className={mcpDetailStyles.scroll}>
          <Table aria-label="Tools" style={{ tableLayout: "fixed", width: "100%", minWidth: 560 }}>
            <TableHeader>
              <TableRow>
                <TableHeaderCell className={mcpDetailStyles.th} style={{ width: "30%" }}>
                  NAME
                </TableHeaderCell>
                <TableHeaderCell className={mcpDetailStyles.th}>DESCRIPTION</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detail.tools.slice(0, pageSize).map(([toolName, toolDescription]) => (
                <TableRow key={toolName}>
                  <TableCell className={mcpDetailStyles.td}>{toolName}</TableCell>
                  <TableCell className={mcpDetailStyles.td}>
                    <span title={toolDescription}>{toolDescription}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className={mcpDetailStyles.foot}>
          <span style={{ display: "inline-flex", alignItems: "center", columnGap: 6 }}>
            Rows per Page:
            <Menu
              checkedValues={{ size: [String(pageSize)] }}
              onCheckedValueChange={(_, d) => setPageSize(Number(d.checkedItems[0]))}
            >
              <MenuTrigger disableButtonEnhancement>
                <button className={mcpDetailStyles.menuBtn}>
                  {pageSize}
                  <span style={{ fontSize: 8, color: "#1a6fc4" }}>▼</span>
                </button>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  {[10, 25, 50, 100].map((size) => (
                    <MenuItemRadio key={size} name="size" value={String(size)}>
                      {size}
                    </MenuItemRadio>
                  ))}
                </MenuList>
              </MenuPopover>
            </Menu>
          </span>
          <div style={{ lineHeight: "17px" }}>
            Page 1 of 1
            <br />({detail.tools.length} Records)
          </div>
          <div>
            <Button
              appearance="subtle"
              icon={<ChevronLeft20Regular />}
              disabled
              aria-label="Previous page"
            />
            <Button
              appearance="subtle"
              icon={<ChevronRight20Regular />}
              disabled
              aria-label="Next page"
            />
          </div>
        </div>
      </Panel>
    );
  } else {
    content = (
      <Panel>
        <Empty>
          <Attach20Regular />
          <Body1Strong>No attachments</Body1Strong>
          <Caption1>Files added to this server will appear here.</Caption1>
        </Empty>
      </Panel>
    );
  }

  return (
    <DetailShell
      title={name}
      icon={<Attach20Regular />}
      topTabs={TOP_TABS}
      top={top}
      onTop={setTop}
      leftItems={MCP_SERVER_SECTIONS}
      left={left}
      onLeft={setLeft}
      onEdit={() => {}}
      onAskAi={askAi}
    >
      {content}
    </DetailShell>
  );
}
