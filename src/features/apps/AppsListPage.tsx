import { useState } from "react";
import { useApps } from "@/api";
import { ListPageHeader, RECORD_STATE_LABELS } from "@/components/common";
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
import { useAppTranslation } from "@/i18n";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useSharedStyles } from "@/styles/shared";

const STATE_COLORS: Record<string, "success" | "informative" | "danger"> = {
  Active: "success",
  Draft: "informative",
  Terminated: "danger",
};

export function AppsListPage() {
  const sharedStyles = useSharedStyles();
  const { t } = useAppTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const { data, isLoading } = useApps({
    page: 1,
    limit: 100,
    q: debouncedSearch === "" ? undefined : debouncedSearch,
  });
  const rows = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const typeLabel = (type: string) =>
    t(type === "System" ? "apps.types.system" : "apps.types.userDefined");
  return (
    <>
      <ListPageHeader
        icon={<Window20Regular />}
        title={t("apps.pageLabel")}
        actions={[
          { icon: <Add24Regular />, label: t("actionBar.create") },
          { icon: <ArrowSync24Regular />, label: t("actionBar.refresh") },
        ]}
      />

      <section className={sharedStyles.contentCard} aria-label={t("apps.pageLabel")}>
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
            {t("apps.listTitle", { count: total })}
          </Text>
        </div>
        <div className={sharedStyles.tableScroll} style={{ flexGrow: 0 }}>
          <Table
            aria-label={t("apps.pageLabel")}
            style={{ tableLayout: "fixed", width: "100%", minWidth: 640 }}
          >
            <TableHeader>
              <TableRow>
                {[
                  t("apps.columns.app"),
                  t("apps.columns.description"),
                  t("apps.columns.type"),
                  t("apps.columns.state"),
                ].map((header) => (
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
                  <TableCell className={sharedStyles.tableCell}>{typeLabel(row.type)}</TableCell>
                  <TableCell className={sharedStyles.tableCell}>
                    <Badge
                      appearance="tint"
                      shape="rounded"
                      size="small"
                      color={STATE_COLORS[row.state] ?? "informative"}
                    >
                      {t(RECORD_STATE_LABELS[row.state] ?? "common.active")}
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
