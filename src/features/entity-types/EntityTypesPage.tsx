import { useMemo, useState } from "react";
import { ActionBar, PageHeader, RibbonButton, TablePagination } from "@/components/common";
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
import { containsIgnoreCase } from "@/lib/utils";
import { useSharedStyles } from "@/styles/shared";
import { ColumnChooser } from "./components/ColumnChooser";
import { ENTITY_COLUMN_BY_KEY, ENTITY_TYPES, DEFAULT_VISIBLE_COLUMNS } from "./data";
import type { EntityColumnKey, SortState, VisibleColumn } from "./types";

export function EntityTypesPage() {
  const sharedStyles = useSharedStyles();
  const [stateFilter, setStateFilter] = useState<{ state: string[] }>({ state: ["all"] });
  const [searchQuery, setSearchQuery] = useState("");
  const [columns, setColumns] = useState<VisibleColumn[]>(DEFAULT_VISIBLE_COLUMNS);
  const [sort, setSort] = useState<SortState | null>(null);
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [actionBarCollapsed, setActionBarCollapsed] = useState(false);

  const rows = useMemo(() => {
    const st = stateFilter.state[0];
    const r = ENTITY_TYPES.filter(
      (d) =>
        (st === "all" || d.state.toLowerCase() === st) &&
        containsIgnoreCase(`${d.name} ${d.description}`, searchQuery),
    );
    if (sort) {
      return [...r].sort((a, b) => {
        const x = a[sort.key];
        const y = b[sort.key];
        const c =
          typeof x === "boolean" && typeof y === "boolean"
            ? Number(x) - Number(y)
            : String(x).localeCompare(String(y), "en", { sensitivity: "base" });
        return sort.dir === "asc" ? c : -c;
      });
    }
    return r;
  }, [stateFilter, searchQuery, sort]);

  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pages);
  const slice = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const visible = columns.filter((c) => c.visible).map((c) => ENTITY_COLUMN_BY_KEY[c.key]);
  const stateLabel = { all: "ALL", active: "ACTIVE", terminated: "TERMINATED" }[
    stateFilter.state[0]
  ];
  const reset = () => {
    setPage(1);
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
                <RibbonButton sharedStyles={sharedStyles} icon={<Add24Regular />} label="Create" />
                <RibbonButton
                  sharedStyles={sharedStyles}
                  icon={<ArrowSync24Regular />}
                  label="Refresh"
                />
                <RibbonButton
                  sharedStyles={sharedStyles}
                  icon={<ArrowExportUp24Regular style={{ transform: "rotate(180deg)" }} />}
                  label="Export"
                />
                <RibbonButton
                  sharedStyles={sharedStyles}
                  icon={<ArrowDownload24Regular />}
                  label="Download LBOs"
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
            <DocumentBulletList20Regular />
            <Text size={300}>Entity Types</Text>
          </span>
        </PageHeader>
      </div>

      <section className={sharedStyles.contentCard} aria-label="Entity Types">
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
                STATE: {stateLabel}
                <ChevronDown20Regular />
              </button>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItemRadio name="state" value="all">
                  All
                </MenuItemRadio>
                <MenuItemRadio name="state" value="active">
                  Active
                </MenuItemRadio>
                <MenuItemRadio name="state" value="terminated">
                  Terminated
                </MenuItemRadio>
              </MenuList>
            </MenuPopover>
          </Menu>
          <Input
            className={sharedStyles.searchInput}
            appearance="outline"
            placeholder="Search"
            value={searchQuery}
            onChange={(_, d) => {
              setSearchQuery(d.value);
              reset();
            }}
            aria-label="Search"
          />
        </div>

        <div className={sharedStyles.titleRow}>
          <Text weight="semibold" size={400}>
            Entity Types ({rows.length})
          </Text>
          <div>
            <ColumnChooser columns={columns} setColumns={setColumns} />
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Button
                  appearance="subtle"
                  icon={<MoreVertical20Regular />}
                  aria-label="More options"
                />
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem onClick={() => setColumns(DEFAULT_VISIBLE_COLUMNS)}>
                    Reset columns
                  </MenuItem>
                  <MenuItem onClick={() => setSort(null)}>Clear sorting</MenuItem>
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
                    Reset all
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        </div>

        <div className={sharedStyles.tableScroll}>
          <Table
            aria-label="Entity types"
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
                          {c.label}
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
              {slice.map((r) => (
                <TableRow key={r.id}>
                  {visible.map((c) => (
                    <TableCell key={c.key} className={sharedStyles.tableCell}>
                      {c.key === "name" ? (
                        <TableCellLayout truncate>{r.name}</TableCellLayout>
                      ) : c.key === "description" ? (
                        <TableCellLayout truncate title={r.description}>
                          {r.description}
                        </TableCellLayout>
                      ) : c.isBoolean ? (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          {r[c.key] ? (
                            <Checkmark20Filled aria-label="Yes" />
                          ) : (
                            <Dismiss20Filled aria-label="No" style={{ color: "#8A8A8A" }} />
                          )}
                        </div>
                      ) : (
                        r[c.key]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {slice.length === 0 && (
            <div
              style={{ padding: 40, textAlign: "center", color: tokens.colorNeutralForeground3 }}
            >
              No records found
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
          total={rows.length}
          onPageChange={setPage}
        />
      </section>
    </>
  );
}
