import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAiAgents, useDebouncedValue } from "@/api";
import { ActionBar, PageHeader, RibbonButton } from "@/components/common";
import {
  Add24Regular,
  ArrowSync24Regular,
  Bot20Regular,
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
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useTabsStore } from "@/stores/tabs-store";
import { useSharedStyles } from "@/styles/shared";

const STATE_COLORS: Record<string, "success" | "informative" | "danger"> = {
  Active: "success",
  Draft: "informative",
  Terminated: "danger",
};

const STATE_LABELS: Record<string, TranslationKey> = {
  Active: "common.active",
  Draft: "common.draft",
  Terminated: "common.terminated",
};

export function AiAgentListPage() {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const openRoute = useTabsStore((state) => state.openRoute);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const [actionBarCollapsed, setActionBarCollapsed] = useState(false);
  const { data, isLoading } = useAiAgents({
    page: 1,
    limit: 200,
    q: debouncedSearch === "" ? undefined : debouncedSearch,
  });
  const rows = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const headers = [
    t("aiAgent.columns.agent"),
    t("aiAgent.columns.description"),
    t("aiAgent.columns.mcpServers"),
    t("aiAgent.columns.state"),
  ];
  const openDetail = (name: string) => {
    const route = `/administration/ai-agent/${encodeURIComponent(name)}`;
    openRoute(route);
    navigate({ to: "/administration/ai-agent/$name", params: { name } });
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
            <Bot20Regular />
            <Text size={300}>{t("aiAgent.pageLabel")}</Text>
          </span>
        </PageHeader>
      </div>

      <section className={sharedStyles.contentCard} aria-label={t("aiAgent.pageLabel")}>
        <div className={sharedStyles.filterBar}>
          <Input
            className={sharedStyles.searchInput}
            appearance="outline"
            contentBefore={<Search20Regular />}
            placeholder={t("common.search")}
            value={searchQuery}
            onChange={(_, d) => setSearchQuery(d.value)}
            aria-label={t("common.search")}
          />
        </div>
        <div className={sharedStyles.titleRow}>
          <Text weight="semibold" size={400}>
            {t("aiAgent.listTitle", { count: total })}
          </Text>
        </div>
        <div className={sharedStyles.tableScroll} style={{ flexGrow: 0 }}>
          <Table
            aria-label={t("aiAgent.pageLabel")}
            style={{ tableLayout: "fixed", width: "100%", minWidth: 640 }}
          >
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
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
                  <TableCell className={sharedStyles.tableCell}>{row.mcpServers}</TableCell>
                  <TableCell className={sharedStyles.tableCell}>
                    <Badge
                      appearance="tint"
                      shape="rounded"
                      size="small"
                      color={STATE_COLORS[row.state] ?? "informative"}
                    >
                      {t(STATE_LABELS[row.state] ?? "common.active")}
                    </Badge>
                  </TableCell>
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
      </section>
    </>
  );
}
