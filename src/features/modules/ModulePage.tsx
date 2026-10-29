import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ActionBar } from "@/components/common/ActionBar";
import { PageHeader } from "@/components/common/PageHeader";
import { RibbonButton } from "@/components/common/RibbonButton";
import {
  Add24Regular,
  ArrowSync24Regular,
  Badge,
  Input,
  Search20Regular,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
} from "@/components/ui";
import { NAVIGATION_ITEMS } from "@/data/navigation";
import { containsIgnoreCase } from "@/lib/utils";
import { useTabsStore } from "@/stores/tabs-store";
import { useSharedStyles } from "@/styles/shared";

type BadgeColor = "success" | "informative" | "danger";
const STATE: Record<string, BadgeColor> = {
  Active: "success",
  Draft: "informative",
  Terminated: "danger",
};

interface ModulePageProps {
  id: string;
}

export function ModulePage({ id }: ModulePageProps) {
  const sharedStyles = useSharedStyles();
  const openDetail = useTabsStore((state) => state.openDetail);
  const navigate = useNavigate();
  const navigationItem = NAVIGATION_ITEMS.find((r) => r.id === id);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionBarCollapsed, setActionBarCollapsed] = useState(false);
  if (!navigationItem || !navigationItem.columns || !navigationItem.tableRows) return null;
  const filteredRows = navigationItem.tableRows.filter((r) =>
    containsIgnoreCase(r.join(" "), searchQuery),
  );
  const openDetailPage = (name: string) => {
    openDetail(name);
    navigate({ to: "/detail/$name", params: { name } });
  };
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
            {navigationItem.icon}
            <Text size={300}>{navigationItem.label}</Text>
          </span>
        </PageHeader>
      </div>

      <section className={sharedStyles.contentCard} aria-label={navigationItem.label}>
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
            {navigationItem.label} ({filteredRows.length})
          </Text>
        </div>
        <div className={sharedStyles.tableScroll} style={{ flexGrow: 0 }}>
          <Table
            aria-label={navigationItem.label}
            style={{ tableLayout: "fixed", width: "100%", minWidth: 640 }}
          >
            <TableHeader>
              <TableRow>
                {navigationItem.columns.map((c) => (
                  <TableHeaderCell key={c} className={sharedStyles.tableHeaderCell}>
                    {c}
                  </TableHeaderCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.map((r) => (
                <TableRow key={r[0]} onClick={() => navigationItem.opens && openDetailPage(r[0])}>
                  {r.map((c, i) => (
                    <TableCell key={i} className={sharedStyles.tableCell}>
                      {i === 0 ? (
                        <a
                          className={sharedStyles.tableLink}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (navigationItem.opens) openDetailPage(r[0]);
                          }}
                        >
                          {r[0]}
                        </a>
                      ) : navigationItem.columns?.[i] === "STATE" ? (
                        <Badge
                          appearance="tint"
                          shape="rounded"
                          size="small"
                          color={STATE[c] ?? "informative"}
                        >
                          {c}
                        </Badge>
                      ) : (
                        c
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredRows.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#777" }}>No records found</div>
          )}
        </div>
      </section>
    </>
  );
}
