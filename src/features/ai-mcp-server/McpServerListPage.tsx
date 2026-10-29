import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useDebouncedValue, useMcpServers } from "@/api";
import type { McpServerRecord } from "@/api";
import {
  ActionBar,
  ColumnChooser,
  PageHeader,
  RibbonButton,
  StateFilter,
  TablePagination,
} from "@/components/common";
import type { ChooserColumnDefinition, ColumnVisibility } from "@/components/common";
import {
  Add24Regular,
  ArrowDown16Regular,
  ArrowSync24Regular,
  ArrowUp16Regular,
  MoreVertical20Regular,
  PlugConnected20Regular,
  Search20Regular,
} from "@/components/icons";
import {
  Button,
  Input,
  Menu,
  MenuDivider,
  MenuItem,
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
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useTabsStore } from "@/stores/tabs-store";
import { useSharedStyles } from "@/styles/shared";

const STATE_LABELS: Record<string, TranslationKey> = {
  Active: "common.active",
  Draft: "common.draft",
  Terminated: "common.terminated",
};

const STATE_OPTIONS = ["all", "active", "draft", "terminated"];

type McpColumnKey = "name" | "description" | "url" | "state";

interface McpColumn {
  key: McpColumnKey;
  labelKey: TranslationKey;
  width: string;
  locked?: boolean;
}

const MCP_COLUMNS: McpColumn[] = [
  { key: "name", labelKey: "mcpServer.columns.name", width: "25%", locked: true },
  { key: "description", labelKey: "mcpServer.columns.description", width: "30%" },
  { key: "url", labelKey: "mcpServer.columns.url", width: "30%" },
  { key: "state", labelKey: "mcpServer.columns.state", width: "15%" },
];

const DEFAULT_MCP_COLUMNS: ColumnVisibility<McpColumnKey>[] = MCP_COLUMNS.map((c) => ({
  key: c.key,
  visible: true,
}));

const MCP_COLUMN_BY_KEY = Object.fromEntries(MCP_COLUMNS.map((c) => [c.key, c])) as Record<
  McpColumnKey,
  McpColumn
>;

const MCP_CHOOSER_DEFINITIONS: Record<McpColumnKey, ChooserColumnDefinition> = Object.fromEntries(
  MCP_COLUMNS.map((c) => [c.key, { labelKey: c.labelKey, locked: c.locked }]),
) as Record<McpColumnKey, ChooserColumnDefinition>;

interface SortState {
  key: McpColumnKey;
  dir: "asc" | "desc";
}

export function McpServerListPage() {
  const sharedStyles = useSharedStyles();
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const navigate = useNavigate();
  const [stateFilter, setStateFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const [columns, setColumns] = useState<ColumnVisibility<McpColumnKey>[]>(DEFAULT_MCP_COLUMNS);
  const [sort, setSort] = useState<SortState | null>(null);
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [actionBarCollapsed, setActionBarCollapsed] = useState(false);
  const { data, isLoading } = useMcpServers({
    page,
    limit: pageSize,
    sort: sort ? `${sort.dir === "desc" ? "-" : ""}${sort.key}` : undefined,
    q: debouncedSearch === "" ? undefined : debouncedSearch,
    state: stateFilter === "all" ? undefined : stateFilter,
  });
  const rows: McpServerRecord[] = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = columns.filter((c) => c.visible).map((c) => MCP_COLUMN_BY_KEY[c.key]);
  const reset = () => {
    setPage(1);
  };
  const resetAll = () => {
    setSearchQuery("");
    setStateFilter("all");
    setSort(null);
    setColumns(DEFAULT_MCP_COLUMNS);
    setPage(1);
  };
  const openDetail = (name: string) => {
    const route = `/administration/ai-mcp-server/${encodeURIComponent(name)}`;
    openRoute(route);
    navigate({ to: "/administration/ai-mcp-server/$name", params: { name } });
  };
  const onSort = (key: McpColumnKey) => {
    setSort((p) =>
      !p || p.key !== key ? { key, dir: "asc" } : p.dir === "asc" ? { key, dir: "desc" } : null,
    );
    reset();
  };
  const renderCell = (row: McpServerRecord, key: McpColumnKey) => {
    switch (key) {
      case "name":
        return (
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
        );
      case "description":
        return row.description;
      case "url":
        return row.url;
      case "state":
        return t(STATE_LABELS[row.state] ?? "common.active");
    }
  };
  return (
    <>
      <div className={sharedStyles.headerBlock}>
        {!actionBarCollapsed && (
          <ActionBar>
            <div className={sharedStyles.actionBarGroup}>
              <div className={sharedStyles.actionBarGroupButtons}>
                <RibbonButton
                  sharedStyles={sharedStyles}
                  icon={<Add24Regular />}
                  label={t("actionBar.create")}
                />
                <RibbonButton
                  sharedStyles={sharedStyles}
                  icon={<ArrowSync24Regular />}
                  label={t("actionBar.refresh")}
                />
              </div>
              <div className={sharedStyles.actionBarGroupLabel}>
                {t("actionBar.groups.general")}
              </div>
            </div>
          </ActionBar>
        )}
        <PageHeader
          collapsed={actionBarCollapsed}
          onToggle={() => setActionBarCollapsed((v) => !v)}
        >
          <span style={{ display: "inline-flex", alignItems: "center", columnGap: 12 }}>
            <PlugConnected20Regular />
            <Text size={300}>{t("mcpServer.pageLabel")}</Text>
          </span>
        </PageHeader>
      </div>

      <section className={sharedStyles.contentCard} aria-label={t("mcpServer.pageLabel")}>
        <div className={sharedStyles.filterBar}>
          <StateFilter
            value={stateFilter}
            options={STATE_OPTIONS}
            onChange={(value) => {
              setStateFilter(value);
              reset();
            }}
          />
          <Input
            className={sharedStyles.searchInput}
            appearance="outline"
            contentBefore={<Search20Regular />}
            placeholder={t("common.search")}
            value={searchQuery}
            onChange={(_, d) => {
              setSearchQuery(d.value);
              reset();
            }}
            aria-label={t("common.search")}
          />
        </div>
        <div className={sharedStyles.titleRow}>
          <Text weight="semibold" size={400}>
            {t("mcpServer.listTitle", { count: total })}
          </Text>
          <div>
            <ColumnChooser
              columns={columns}
              definitions={MCP_CHOOSER_DEFINITIONS}
              setColumns={setColumns}
            />
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Button
                  appearance="subtle"
                  icon={<MoreVertical20Regular />}
                  aria-label={t("common.moreOptions")}
                />
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem onClick={() => setColumns(DEFAULT_MCP_COLUMNS)}>
                    {t("common.resetColumns")}
                  </MenuItem>
                  <MenuItem onClick={() => setSort(null)}>{t("common.clearSorting")}</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={resetAll}>{t("common.resetAll")}</MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        </div>
        <div className={sharedStyles.tableScroll}>
          <Table
            aria-label={t("mcpServer.pageLabel")}
            style={{ tableLayout: "fixed", width: "100%", minWidth: 640 }}
          >
            <TableHeader>
              <TableRow>
                {visible.map((c) => {
                  const dir = sort?.key === c.key ? sort.dir : null;
                  return (
                    <TableHeaderCell
                      key={c.key}
                      className={sharedStyles.tableHeaderCell}
                      style={{ width: c.width }}
                      sortDirection={
                        dir === "asc" ? "ascending" : dir === "desc" ? "descending" : undefined
                      }
                    >
                      <button
                        className={sharedStyles.tableHeaderButton}
                        onClick={() => onSort(c.key)}
                      >
                        {t(c.labelKey)}
                        {dir === "asc" && <ArrowUp16Regular />}
                        {dir === "desc" && <ArrowDown16Regular />}
                      </button>
                    </TableHeaderCell>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name} onClick={() => openDetail(row.name)}>
                  {visible.map((c) => (
                    <TableCell key={c.key} className={sharedStyles.tableCell}>
                      {renderCell(row, c.key)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!isLoading && rows.length === 0 && (
            <div
              style={{ padding: 40, textAlign: "center", color: tokens.colorNeutralForeground3 }}
            >
              {t("common.noRecordsFound")}
            </div>
          )}
        </div>
        <TablePagination
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          currentPage={currentPage}
          pages={pages}
          total={total}
          onPageChange={setPage}
        />
      </section>
    </>
  );
}
