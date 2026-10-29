import { useState } from "react";
import { useDebouncedValue, useEntityTypes } from "@/api";
import type { EntityTypeRecord } from "@/api";
import {
  ActionBar,
  ColumnChooser,
  PageHeader,
  RibbonButton,
  TablePagination,
} from "@/components/common";
import type { ChooserColumnDefinition } from "@/components/common";
import {
  Add24Regular,
  ArrowDown16Regular,
  ArrowUp16Regular,
  ArrowDownload24Regular,
  ArrowExportUp24Regular,
  ArrowSync24Regular,
  Checkmark20Filled,
  ChevronDown20Regular,
  Dismiss20Filled,
  DocumentBulletList20Regular,
  MoreVertical20Regular,
} from "@/components/icons";
import {
  Button,
  Input,
  Menu,
  MenuDivider,
  MenuItem,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { ENTITY_COLUMN_BY_KEY, DEFAULT_VISIBLE_COLUMNS } from "./data";
import type { EntityColumnKey, SortState, VisibleColumn } from "./types";

const booleanCellValue = (record: EntityTypeRecord, key: EntityColumnKey): boolean => {
  switch (key) {
    case "relation":
      return record.isRelation;
    case "system":
      return record.system;
    case "versioned":
      return record.versioned;
    default:
      return false;
  }
};

export function EntityTypesPage() {
  const sharedStyles = useSharedStyles();
  const { t } = useAppTranslation();
  const [stateFilter, setStateFilter] = useState<{ state: string[] }>({ state: ["all"] });
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const [columns, setColumns] = useState<VisibleColumn[]>(DEFAULT_VISIBLE_COLUMNS);
  const [sort, setSort] = useState<SortState | null>(null);
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [actionBarCollapsed, setActionBarCollapsed] = useState(false);

  const stateParam = stateFilter.state[0] === "all" ? undefined : stateFilter.state[0];
  const { data, isLoading } = useEntityTypes({
    page,
    limit: pageSize,
    sort: sort ? `${sort.dir === "desc" ? "-" : ""}${sort.key}` : undefined,
    q: debouncedSearch === "" ? undefined : debouncedSearch,
    state: stateParam,
  });
  const rows = data?.data ?? [];
  const total = data?.meta.total ?? 0;

  const pages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = columns.filter((c) => c.visible).map((c) => ENTITY_COLUMN_BY_KEY[c.key]);
  const chooserDefinitions: Record<EntityColumnKey, ChooserColumnDefinition> = Object.fromEntries(
    Object.entries(ENTITY_COLUMN_BY_KEY).map(([key, column]) => [
      key,
      { labelKey: column.chooserLabelKey, locked: column.locked },
    ]),
  ) as Record<EntityColumnKey, ChooserColumnDefinition>;
  const stateLabels: Record<string, string> = {
    all: t("entityTypes.stateOptions.all"),
    active: t("entityTypes.stateOptions.active"),
    terminated: t("entityTypes.stateOptions.terminated"),
  };
  const stateLabel = stateLabels[stateFilter.state[0]] ?? t("entityTypes.stateOptions.all");
  const columnStateLabels: Record<string, string> = {
    Active: t("common.active"),
    Terminated: t("common.terminated"),
  };
  const reset = () => {
    setPage(1);
  };
  const renderCell = (record: EntityTypeRecord, key: EntityColumnKey) => {
    switch (key) {
      case "name":
        return <TableCellLayout truncate>{record.name}</TableCellLayout>;
      case "description":
        return (
          <TableCellLayout truncate title={record.description}>
            {record.description}
          </TableCellLayout>
        );
      case "state":
        return columnStateLabels[record.state] ?? record.state;
      case "system":
      case "relation":
      case "versioned":
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {booleanCellValue(record, key) ? (
              <Checkmark20Filled aria-label={t("common.yes")} />
            ) : (
              <Dismiss20Filled aria-label={t("common.no")} style={{ color: "#8A8A8A" }} />
            )}
          </div>
        );
    }
  };
  const onSort = (key: EntityColumnKey) => {
    setSort((p) =>
      !p || p.key !== key ? { key, dir: "asc" } : p.dir === "asc" ? { key, dir: "desc" } : null,
    );
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
                <RibbonButton
                  sharedStyles={sharedStyles}
                  icon={<ArrowExportUp24Regular style={{ transform: "rotate(180deg)" }} />}
                  label={t("actionBar.export")}
                />
                <RibbonButton
                  sharedStyles={sharedStyles}
                  icon={<ArrowDownload24Regular />}
                  label={t("actionBar.downloadLbos")}
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
            <DocumentBulletList20Regular />
            <Text size={300}>{t("entityTypes.pageLabel")}</Text>
          </span>
        </PageHeader>
      </div>

      <section className={sharedStyles.contentCard} aria-label={t("entityTypes.pageLabel")}>
        <div className={sharedStyles.filterBar}>
          <Menu
            checkedValues={stateFilter}
            onCheckedValueChange={(_, d) => {
              setStateFilter({ state: d.checkedItems });
              reset();
            }}
          >
            <MenuTrigger disableButtonEnhancement>
              <button className={sharedStyles.dropdownButton}>
                {t("entityTypes.stateFilterLabel")} {stateLabel}
                <ChevronDown20Regular />
              </button>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItemRadio name="state" value="all">
                  {t("common.all")}
                </MenuItemRadio>
                <MenuItemRadio name="state" value="active">
                  {t("common.active")}
                </MenuItemRadio>
                <MenuItemRadio name="state" value="terminated">
                  {t("common.terminated")}
                </MenuItemRadio>
              </MenuList>
            </MenuPopover>
          </Menu>
          <Input
            className={sharedStyles.searchInput}
            appearance="outline"
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
            {t("entityTypes.title", { count: total })}
          </Text>
          <div>
            <ColumnChooser
              columns={columns}
              definitions={chooserDefinitions}
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
                  <MenuItem onClick={() => setColumns(DEFAULT_VISIBLE_COLUMNS)}>
                    {t("entityTypes.resetColumns")}
                  </MenuItem>
                  <MenuItem onClick={() => setSort(null)}>{t("entityTypes.clearSorting")}</MenuItem>
                  <MenuDivider />
                  <MenuItem
                    onClick={() => {
                      setSearchQuery("");
                      setStateFilter({ state: ["all"] });
                      setSort(null);
                      setColumns(DEFAULT_VISIBLE_COLUMNS);
                      setPage(1);
                    }}
                  >
                    {t("entityTypes.resetAll")}
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        </div>

        <div className={sharedStyles.tableScroll}>
          <Table
            aria-label={t("entityTypes.pageLabel")}
            style={{ tableLayout: "fixed", width: "100%", minWidth: 760 }}
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
                      <div
                        style={{
                          display: "flex",
                          justifyContent: c.isCentered ? "center" : "flex-start",
                        }}
                      >
                        <button
                          className={sharedStyles.tableHeaderButton}
                          onClick={() => onSort(c.key)}
                        >
                          {t(c.labelKey)}
                          {dir === "asc" && <ArrowUp16Regular />}
                          {dir === "desc" && <ArrowDown16Regular />}
                        </button>
                      </div>
                    </TableHeaderCell>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  {visible.map((c) => (
                    <TableCell key={c.key} className={sharedStyles.tableCell}>
                      {renderCell(r, c.key)}
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
