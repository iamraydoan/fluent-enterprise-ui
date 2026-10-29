import { useState } from "react";
import { useConfigurations } from "@/api";
import type { ConfigurationRecord } from "@/api";
import { ListPageHeader } from "@/components/common";
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
import { useAppTranslation } from "@/i18n";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useSharedStyles } from "@/styles/shared";

export function ConfigurationListPage() {
  const sharedStyles = useSharedStyles();
  const { t } = useAppTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const { data } = useConfigurations({
    page: 1,
    limit: 100,
    q: debouncedSearch === "" ? undefined : debouncedSearch,
  });
  const rows = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const getValueLabel = (row: ConfigurationRecord) => row.value;
  return (
    <>
      <ListPageHeader
        icon={<Wrench20Regular />}
        title={t("configuration.pageLabel")}
        actions={[
          { icon: <Add24Regular />, label: t("actionBar.create") },
          { icon: <ArrowSync24Regular />, label: t("actionBar.refresh") },
        ]}
      />

      <section className={sharedStyles.contentCard} aria-label={t("configuration.pageLabel")}>
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
            {t("configuration.listTitle", { count: total })}
          </Text>
        </div>
        <div className={sharedStyles.tableScroll} style={{ flexGrow: 0 }}>
          <Table
            aria-label={t("configuration.pageLabel")}
            style={{ tableLayout: "fixed", width: "100%", minWidth: 640 }}
          >
            <TableHeader>
              <TableRow>
                {[
                  t("configuration.columns.setting"),
                  t("configuration.columns.value"),
                  t("configuration.columns.scope"),
                  t("configuration.columns.modified"),
                ].map((header) => (
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
                  <TableCell className={sharedStyles.tableCell}>{getValueLabel(row)}</TableCell>
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
              {t("common.noRecordsFound")}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
