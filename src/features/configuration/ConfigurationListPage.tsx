import { useState } from "react";
import { ActionBar, PageHeader, RibbonButton } from "@/components/common";
import {
  Add24Regular,
  ArrowSync24Regular,
  Search20Regular,
  Wrench20Regular,
} from "@/components/icons";
import {
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
import { CONFIGURATION_ROWS } from "./data";

export function ConfigurationListPage() {
  const sharedStyles = useSharedStyles();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionBarCollapsed, setActionBarCollapsed] = useState(false);
  const rows = CONFIGURATION_ROWS.filter((row) =>
    containsIgnoreCase(`${row.setting} ${row.value} ${row.scope} ${row.modified}`, searchQuery),
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
            <Wrench20Regular />
            <Text size={300}>Configuration</Text>
          </span>
        </PageHeader>
      </div>

      <section className={sharedStyles.contentCard} aria-label="Configuration">
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
            Configuration ({rows.length})
          </Text>
        </div>
        <div className={sharedStyles.tableScroll} style={{ flexGrow: 0 }}>
          <Table
            aria-label="Configuration"
            style={{ tableLayout: "fixed", width: "100%", minWidth: 640 }}
          >
            <TableHeader>
              <TableRow>
                {["SETTING", "VALUE", "SCOPE", "MODIFIED"].map((header) => (
                  <TableHeaderCell key={header} className={sharedStyles.tableHeaderCell}>
                    {header}
                  </TableHeaderCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.setting}>
                  <TableCell className={sharedStyles.tableCell}>{row.setting}</TableCell>
                  <TableCell className={sharedStyles.tableCell}>{row.value}</TableCell>
                  <TableCell className={sharedStyles.tableCell}>{row.scope}</TableCell>
                  <TableCell className={sharedStyles.tableCell}>{row.modified}</TableCell>
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
