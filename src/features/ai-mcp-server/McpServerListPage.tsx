import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ActionBar, RibbonButton } from "@/components/common";
import {
  Add24Regular,
  ArrowSync24Regular,
  PlugConnected20Regular,
  Search20Regular,
} from "@/components/icons";
import {
  Badge,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  tokens,
} from "@/components/ui";
import { containsIgnoreCase } from "@/lib/utils";
import { useTabsStore } from "@/stores/tabs-store";
import { useSharedStyles } from "@/styles/shared";
import { MCP_SERVER_ROWS } from "./data";

const STATE_COLORS: Record<string, "success" | "informative" | "danger"> = {
  Active: "success",
  Draft: "informative",
  Terminated: "danger",
};

export function McpServerListPage() {
  const sharedStyles = useSharedStyles();
  const openRoute = useTabsStore((state) => state.openRoute);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const rows = MCP_SERVER_ROWS.filter((row) =>
    containsIgnoreCase(`${row.name} ${row.description} ${row.url} ${row.state}`, searchQuery),
  );
  const openDetail = (name: string) => {
    const route = `/administration/ai-mcp-server/${encodeURIComponent(name)}`;
    openRoute(route);
    navigate({ to: "/administration/ai-mcp-server/$name", params: { name } });
  };
  return (
    <>
      <div className={sharedStyles.headerBlock}>
        <ActionBar>
          <div className={sharedStyles.actionBarGroup}>
            <div className={sharedStyles.actionBarGroupButtons}>
              <RibbonButton sharedStyles={sharedStyles} icon={<Add24Regular />} label="Create" />
              <RibbonButton
                sharedStyles={sharedStyles}
                icon={<ArrowSync24Regular />}
                label="Refresh"
              />
            </div>
            <div className={sharedStyles.actionBarGroupLabel}>General</div>
          </div>
        </ActionBar>
        <div className={sharedStyles.pageHeader}>
          <span style={{ display: "inline-flex", alignItems: "center", columnGap: 12 }}>
            <PlugConnected20Regular />
            <Text size={300}>AI MCP Servers</Text>
          </span>
        </div>
      </div>

      <section className={sharedStyles.contentCard} aria-label="AI MCP Servers">
        <div className={sharedStyles.filterBar}>
          <Input
            className={sharedStyles.searchInput}
            appearance="outline"
            contentBefore={<Search20Regular />}
            placeholder="Search"
            value={searchQuery}
            onChange={(_, d) => setSearchQuery(d.value)}
            aria-label="Search"
          />
        </div>
        <div className={sharedStyles.titleRow}>
          <Text weight="semibold" size={400}>
            AI MCP Servers ({rows.length})
          </Text>
        </div>
        <div className={sharedStyles.tableScroll} style={{ flexGrow: 0 }}>
          <Table
            aria-label="AI MCP Servers"
            style={{ tableLayout: "fixed", width: "100%", minWidth: 640 }}
          >
            <TableHeader>
              <TableRow>
                {["NAME", "DESCRIPTION", "URL", "STATE"].map((header) => (
                  <TableHeaderCell key={header} className={sharedStyles.tableHeaderCell}>
                    {header}
                  </TableHeaderCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name} onClick={() => openDetail(row.name)}>
                  <TableCell className={sharedStyles.tableCell}>
                    <a
                      className={sharedStyles.tableLink}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        openDetail(row.name);
                      }}
                    >
                      {row.name}
                    </a>
                  </TableCell>
                  <TableCell className={sharedStyles.tableCell}>{row.description}</TableCell>
                  <TableCell className={sharedStyles.tableCell}>{row.url}</TableCell>
                  <TableCell className={sharedStyles.tableCell}>
                    <Badge
                      appearance="tint"
                      shape="rounded"
                      size="small"
                      color={STATE_COLORS[row.state] ?? "informative"}
                    >
                      {row.state}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {rows.length === 0 && (
            <div
              style={{ padding: 40, textAlign: "center", color: tokens.colorNeutralForeground3 }}
            >
              No records found
            </div>
          )}
        </div>
      </section>
    </>
  );
}
