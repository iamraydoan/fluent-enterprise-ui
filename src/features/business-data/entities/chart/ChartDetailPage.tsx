import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useChartDetail } from "@/api";
import { DetailShell, ListPage, editAction, refreshAction } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  makeStyles,
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const useDetailStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "12px" },
  card: { padding: "16px", display: "flex", flexDirection: "column", rowGap: "12px" },
  cardTitle: { fontSize: "14px", fontWeight: tokens.fontWeightSemibold, paddingBottom: "8px", borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  row: { display: "flex", columnGap: "12px", fontSize: "13px" },
  label: { color: tokens.colorNeutralForeground3, minWidth: "200px" },
  tabs: { display: "flex", columnGap: "4px", padding: "0 16px" },
  tab: { padding: "10px 16px", border: "none", backgroundColor: "transparent", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", borderBottom: "2px solid transparent", ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover } },
  tabActive: { fontWeight: tokens.fontWeightSemibold, borderBottom: `2px solid ${tokens.colorBrandStroke1}` },
  tabContent: { padding: "16px", flexGrow: 1, minHeight: 0, overflowY: "auto" },
  empty: { padding: "32px", textAlign: "center", color: tokens.colorNeutralForeground3 },
});

const TABS = ["details", "references", "history"] as const;
const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.chart.detail.sections.details",
  "businessData.chart.detail.sections.limits",
  "businessData.chart.detail.sections.contexts",
  "businessData.chart.detail.sections.rules",
  "businessData.chart.detail.sections.logicalCharts",
  "businessData.chart.detail.sections.attachments",
];

export function ChartDetailPage() {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
  const [tab, setTab] = useState<string>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const { name } = useParams({ strict: false }) as { name: string };
  const displayName = decodeURIComponent(name);
  const { data: chart, isLoading } = useChartDetail(displayName);

  if (isLoading || !chart) {
    return (
      <ListPage header={{ icon: <Box24Regular />, title: displayName, actions: [refreshAction, editAction] }}>
        <div className={styles.empty}>{t("businessData.chart.detail.loading")}</div>
      </ListPage>
    );
  }

  return (
    <ListPage header={{ icon: <Box24Regular />, title: `${chart.name} (${chart.state})`, actions: [refreshAction, editAction] }}>
      <div className={styles.tabs} role="tablist">
        {TABS.map((value) => (
          <button key={value} role="tab" aria-selected={tab === value}
            className={`${styles.tab} ${tab === value ? styles.tabActive : ""}`} onClick={() => setTab(value)}>
            {t(`businessData.chart.detail.tabs.${value}`)}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {tab === "details" && (
          <DetailShell title={chart.name} icon={<Box24Regular />} topTabs={[]} top="details" onTop={() => undefined}
            leftItems={LEFT_SECTIONS} left={left} onLeft={setLeft} onEdit={() => undefined} onAskAi={() => undefined} showState={false}>
            {left === "businessData.chart.detail.sections.limits" ? (
              <TableCard title={t("businessData.chart.detail.limitsTitle", { count: chart.limits.length })}
                headers={[t("businessData.chart.detail.limitColumns.limit"), t("businessData.chart.detail.limitColumns.value")]}
                rows={chart.limits.map((l) => [l.limit, String(l.value)])} />
            ) : left === "businessData.chart.detail.sections.contexts" ? (
              <TableCard title={t("businessData.chart.detail.contextsTitle", { count: chart.contexts.length })}
                headers={[t("businessData.chart.detail.contextColumns.contextKey"), t("businessData.chart.detail.contextColumns.mandatory")]}
                rows={chart.contexts.map((c) => [c.contextKey, c.mandatory ? t("businessData.chart.detail.yes") : t("businessData.chart.detail.no")])} />
            ) : left === "businessData.chart.detail.sections.rules" ? (
              <TableCard title={t("businessData.chart.detail.rulesTitle", { count: chart.rules.length })}
                headers={[t("businessData.chart.detail.ruleColumns.rule"), t("businessData.chart.detail.ruleColumns.enabled")]}
                rows={chart.rules.map((r) => [r.rule, r.enabled ? t("businessData.chart.detail.yes") : t("businessData.chart.detail.no")])} />
            ) : left === "businessData.chart.detail.sections.logicalCharts" ? (
              <TableCard title={t("businessData.chart.detail.logicalChartsTitle", { count: chart.logicalCharts.length })}
                headers={[t("businessData.chart.detail.logicalColumns.name"), t("businessData.chart.detail.logicalColumns.dataPoints")]}
                rows={chart.logicalCharts.map((l) => [l.name, String(l.dataPoints)])} />
            ) : (
              <div className={styles.cards}>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>{t("businessData.chart.detail.chart")}</Text>
                  <KV label={t("businessData.chart.detail.name")} value={chart.name} />
                  <KV label={t("businessData.chart.detail.description")} value={chart.description} />
                  <KV label={t("businessData.chart.detail.type")} value={chart.type} />
                  <KV label={t("businessData.chart.detail.universalState")} value={chart.universalState} />
                  <Bool label={t("businessData.chart.detail.enabled")} value={chart.enabled} />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>{t("businessData.chart.detail.properties")}</Text>
                  <KV label={t("businessData.chart.detail.parameter")} value={chart.parameter} />
                  <KV label={t("businessData.chart.detail.chartType")} value={chart.chartType} />
                  <KV label={t("businessData.chart.detail.minimumSampleReadings")} value={String(chart.minimumSampleReadings)} />
                  <KV label={t("businessData.chart.detail.maximumSampleReadings")} value={String(chart.maximumSampleReadings)} />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>{t("businessData.chart.detail.retention")}</Text>
                  <KV label={t("businessData.chart.detail.dataPoints")} value={String(chart.dataPoints)} />
                </div>
              </div>
            )}
          </DetailShell>
        )}
        {tab !== "details" && <div className={styles.empty}>{t("businessData.chart.detail.historyEmpty")}</div>}
      </div>
    </ListPage>
  );
}

function TableCard({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
  return (
    <div className={`${sharedStyles.contentCard} ${styles.card}`}>
      <Text className={styles.cardTitle}>{title}</Text>
      <Table>
        <TableHeader><TableRow>{headers.map((h) => <TableHeaderCell key={h}>{h}</TableHeaderCell>)}</TableRow></TableHeader>
        <TableBody>{rows.map((r, i) => <TableRow key={i}>{r.map((c, j) => <TableCell key={j}>{c}</TableCell>)}</TableRow>)}</TableBody>
      </Table>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>{value === "" ? t("businessData.chart.detail.emptyValue") : value}</span>
    </div>
  );
}

function Bool({ label, value }: { label: string; value: boolean }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>{value ? t("businessData.chart.detail.yes") : t("businessData.chart.detail.no")}</span>
    </div>
  );
}
