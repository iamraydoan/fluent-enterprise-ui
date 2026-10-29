import { useState } from "react";
import { ActionBar, PageHeader, RibbonButton } from "@/components/common";
import {
  Add24Regular,
  ArrowSync24Regular,
  Search20Regular,
  Window20Regular,
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
import { useSharedStyles } from "@/styles/shared";
import { APP_ROWS } from "./data";

const STATE_COLORS: Record<string, "success" | "informative" | "danger"> = {
  Active: "success",
  Draft: "informative",
  Terminated: "danger",
};

export function AppsListPage() {
  const sharedStyles = useSharedStyles();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionBarCollapsed, setActionBarCollapsed] = useState(false);
  const rows = APP_ROWS.filter((row) =>
    containsIgnoreCase(`${row.name} ${row.description} ${row.type} ${row.state}`, searchQuery),
  );
  return (
    <>
      <div className={sharedStyles.headerBlock}>
        {!actionBarCollapsed && (
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
        )}
        <PageHeader
          collapsed={actionBarCollapsed}
          onToggle={() => setActionBarCollapsed((v) => !v)}
        >
          <span style={{ display: "inline-flex", alignItems: "center", columnGap: 12 }}>
            <Window20Regular />
            <Text size={300}>Apps</Text>
          </span>
        </PageHeader>
      </div>

      <section className={sharedStyles.contentCard} aria-label="Apps">
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
            Apps ({rows.length})
          </Text>
        </div>
        <div className={sharedStyles.tableScroll} style={{ flexGrow: 0 }}>
          <Table aria-label="Apps" style={{ tableLayout: "fixed", width: "100%", minWidth: 640 }}>
            <TableHeader>
              <TableRow>
                {["APP", "DESCRIPTION", "TYPE", "STATE"].map((header) => (
                  <TableHeaderCell key={header} className={sharedStyles.tableHeaderCell}>
                    {header}
                  </TableHeaderCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className={sharedStyles.tableCell}>{row.name}</TableCell>
                  <TableCell className={sharedStyles.tableCell}>{row.description}</TableCell>
                  <TableCell className={sharedStyles.tableCell}>{row.type}</TableCell>
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
