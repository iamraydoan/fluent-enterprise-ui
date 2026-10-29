import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ActionBar, PageHeader, RibbonButton, TablePagination } from "@/components/common";
import {
  Add24Regular,
  ArrowExportUp24Regular,
  ArrowSync24Regular,
  Bot20Regular,
  ChevronDown20Regular,
  MoreVertical20Regular,
} from "@/components/icons";
import {
  Button,
  Input,
  Menu,
  MenuItem,
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
import { containsIgnoreCase } from "@/lib/utils";
import { useTabsStore } from "@/stores/tabs-store";
import { useSharedStyles } from "@/styles/shared";
import { AI_AGENT_ROWS } from "./data";

export function AiAgentListPage() {
  const sharedStyles = useSharedStyles();
  const openRoute = useTabsStore((state) => state.openRoute);
  const navigate = useNavigate();
  const [stateFilter, setStateFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [actionBarCollapsed, setActionBarCollapsed] = useState(false);

  const rows = useMemo(
    () =>
      AI_AGENT_ROWS.filter(
        (row) =>
          (stateFilter === "all" || row.state.toLowerCase() === stateFilter) &&
          containsIgnoreCase(`${row.name} ${row.description}`, searchQuery),
      ),
    [stateFilter, searchQuery],
  );
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pages);
  const slice = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const stateLabel = { all: "ALL", active: "ACTIVE", draft: "DRAFT" }[stateFilter];
  const reset = () => setPage(1);

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
            <Bot20Regular />
            <Text size={300}>AI Agent</Text>
          </span>
        </PageHeader>
      </div>

      <section className={sharedStyles.contentCard} aria-label="AI Agent">
        <div className={sharedStyles.filterBar}>
          <Menu
            checkedValues={{ state: [stateFilter] }}
            onCheckedValueChange={(_, d) => {
              setStateFilter(d.checkedItems[0]);
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
                <MenuItemRadio name="state" value="draft">
                  Draft
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
            AI Agent ({rows.length})
          </Text>
          <div>
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
                  <MenuItem
                    onClick={() => {
                      setSearchQuery("");
                      setStateFilter("all");
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
            aria-label="AI Agent"
            style={{ tableLayout: "fixed", width: "100%", minWidth: 640 }}
          >
            <TableHeader>
              <TableRow>
                {["AGENT", "DESCRIPTION", "MCP SERVERS", "STATE"].map((header) => (
                  <TableHeaderCell key={header} className={sharedStyles.tableHeaderCell}>
                    {header}
                  </TableHeaderCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {slice.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className={sharedStyles.tableCell}>
                    <a
                      className={sharedStyles.tableLink}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        const route = `/administration/ai-agent/${encodeURIComponent(row.name)}`;
                        openRoute(route);
                        navigate({
                          to: "/administration/ai-agent/$name",
                          params: { name: row.name },
                        });
                      }}
                    >
                      {row.name}
                    </a>
                  </TableCell>
                  <TableCell className={sharedStyles.tableCell}>{row.description}</TableCell>
                  <TableCell className={sharedStyles.tableCell}>{row.mcpServers}</TableCell>
                  <TableCell className={sharedStyles.tableCell}>{row.state}</TableCell>
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
