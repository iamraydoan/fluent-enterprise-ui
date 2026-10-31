import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useChartDetail } from "@/api";
import type { LogicalChartDetail } from "@/api";
import {
  DetailShell,
  ListPage,
  cloneAction,
  editAction,
  refreshAction,
  terminateAction,
  unterminateAction,
  DetailTabs,
} from "@/components/common";
import type { HeaderAction } from "@/components/common";
import {
  Box24Regular,
  Checkmark20Filled,
  Dismiss20Filled,
  MoreVertical24Regular,
} from "@/components/icons";
import {
  Button,
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
import { useChartDialogs } from "./useChartDialogs";

const useDetailStyles = makeStyles({
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "12px",
  },
  card: { padding: "16px", display: "flex", flexDirection: "column", rowGap: "12px" },
  cardTitle: {
    fontSize: "14px",
    fontWeight: tokens.fontWeightSemibold,
    paddingBottom: "8px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  row: { display: "flex", columnGap: "12px", fontSize: "13px" },
  label: { color: tokens.colorNeutralForeground3, minWidth: "200px" },
  empty: { padding: "32px", textAlign: "center", color: tokens.colorNeutralForeground3 },
  toolbar: { display: "flex", columnGap: "8px", marginBottom: "12px" },
  actionsCell: { display: "flex", columnGap: "4px", flexWrap: "wrap" },
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
  const {
    dialogs,
    openCreate,
    openEdit,
    openClone,
    openTerminate,
    openUnterminate,
    openEnable,
    openDisable,
    openManageRules,
    openSetLimits,
    openPostDataPoint,
    openPostAggregated,
    openAddLogicalChart,
    openEditLogicalChart,
    openRemoveLogicalChart,
    openRecalculate,
    openDataPoints,
  } = useChartDialogs(chart);
  void openCreate;

  if (isLoading || !chart) {
    return (
      <ListPage
        header={{
          icon: <Box24Regular />,
          title: displayName,
          actions: [refreshAction, editAction],
        }}
      >
        <div className={styles.empty}>{t("businessData.chart.detail.loading")}</div>
      </ListPage>
    );
  }

  const detailActions: HeaderAction[] = [
    refreshAction,
    { ...editAction, onClick: openEdit },
    { ...cloneAction, onClick: openClone },
    chart.state === "Terminated"
      ? { ...unterminateAction, onClick: openUnterminate }
      : { ...terminateAction, onClick: openTerminate },
    chart.enabled
      ? {
          id: "disable",
          icon: <Dismiss20Filled />,
          labelKey: "businessData.chart.operations.disable" as TranslationKey,
          onClick: openDisable,
        }
      : {
          id: "enable",
          icon: <Checkmark20Filled />,
          labelKey: "businessData.chart.operations.enable" as TranslationKey,
          onClick: openEnable,
        },
    {
      id: "more",
      icon: <MoreVertical24Regular />,
      labelKey: "actionBar.more",
      menu: [
        { label: t("businessData.chart.operations.postDataPoint"), onClick: openPostDataPoint },
        { label: t("businessData.chart.operations.postAggregated"), onClick: openPostAggregated },
        { label: t("businessData.chart.operations.manageRules"), onClick: openManageRules },
        { label: t("businessData.chart.operations.setLimits"), onClick: openSetLimits },
        { label: t("businessData.chart.operations.addLogicalChart"), onClick: openAddLogicalChart },
      ],
    },
  ];

  return (
    <>
      <ListPage
        header={{
          icon: <Box24Regular />,
          title: `${chart.name} (${chart.state})`,
          actions: detailActions,
        }}
      >
        <DetailTabs
          tabs={TABS.map((value) => ({
            value,
            label: t(`businessData.chart.detail.tabs.${value}`),
          }))}
          active={tab}
          onChange={(value) => setTab(value as typeof tab)}
        >
          {tab === "details" && (
            <DetailShell
              title={chart.name}
              icon={<Box24Regular />}
              topTabs={[]}
              top="details"
              onTop={() => undefined}
              leftItems={LEFT_SECTIONS}
              left={left}
              onLeft={setLeft}
              onEdit={() => undefined}
              onAskAi={() => undefined}
              showState={false}
            >
              {left === "businessData.chart.detail.sections.limits" ? (
                <TableCard
                  title={t("businessData.chart.detail.limitsTitle", { count: chart.limits.length })}
                  headers={[
                    t("businessData.chart.detail.limitColumns.limit"),
                    t("businessData.chart.detail.limitColumns.value"),
                  ]}
                  rows={chart.limits.map((l) => [l.limit, String(l.value)])}
                />
              ) : left === "businessData.chart.detail.sections.contexts" ? (
                <TableCard
                  title={t("businessData.chart.detail.contextsTitle", {
                    count: chart.contexts.length,
                  })}
                  headers={[
                    t("businessData.chart.detail.contextColumns.keyOrder"),
                    t("businessData.chart.detail.contextColumns.isKey"),
                    t("businessData.chart.detail.contextColumns.name"),
                    t("businessData.chart.detail.contextColumns.elementType"),
                    t("businessData.chart.detail.contextColumns.source"),
                  ]}
                  rows={chart.contexts.map((c) => [
                    String(c.keyOrder),
                    c.isKey
                      ? t("businessData.chart.detail.yes")
                      : t("businessData.chart.detail.no"),
                    c.name,
                    c.elementType,
                    c.source,
                  ])}
                />
              ) : left === "businessData.chart.detail.sections.rules" ? (
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.chart.detail.rulesTitle", { count: chart.rules.length })}
                  </Text>
                  <div className={styles.toolbar}>
                    <Button appearance="secondary" onClick={openManageRules}>
                      {t("businessData.chart.operations.manageRules")}
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderCell>
                          {t("businessData.chart.detail.ruleColumns.scope")}
                        </TableHeaderCell>
                        <TableHeaderCell>
                          {t("businessData.chart.detail.ruleColumns.rule")}
                        </TableHeaderCell>
                        <TableHeaderCell>
                          {t("businessData.chart.detail.ruleColumns.protocol")}
                        </TableHeaderCell>
                        <TableHeaderCell>
                          {t("businessData.chart.detail.ruleColumns.enabled")}
                        </TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chart.rules.map((r, i) => (
                        <TableRow key={i}>
                          <TableCell>{r.scope}</TableCell>
                          <TableCell>{r.rule}</TableCell>
                          <TableCell>{r.protocol}</TableCell>
                          <TableCell>
                            {r.enabled
                              ? t("businessData.chart.detail.yes")
                              : t("businessData.chart.detail.no")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : left === "businessData.chart.detail.sections.logicalCharts" ? (
                <LogicalChartsCard
                  chart={chart}
                  onAdd={openAddLogicalChart}
                  onEdit={openEditLogicalChart}
                  onRemove={openRemoveLogicalChart}
                  onRecalculate={openRecalculate}
                  onDataPoints={openDataPoints}
                />
              ) : (
                <div className={styles.cards}>
                  <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                    <Text className={styles.cardTitle}>{t("businessData.chart.detail.chart")}</Text>
                    <KV label={t("businessData.chart.detail.name")} value={chart.name} />
                    <KV
                      label={t("businessData.chart.detail.description")}
                      value={chart.description}
                    />
                    <KV label={t("businessData.chart.detail.type")} value={chart.type} />
                    <KV
                      label={t("businessData.chart.detail.universalState")}
                      value={chart.universalState}
                    />
                    <Bool label={t("businessData.chart.detail.enabled")} value={chart.enabled} />
                  </div>
                  <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                    <Text className={styles.cardTitle}>
                      {t("businessData.chart.detail.properties")}
                    </Text>
                    <KV label={t("businessData.chart.detail.parameter")} value={chart.parameter} />
                    <KV label={t("businessData.chart.detail.chartType")} value={chart.chartType} />
                    <KV
                      label={t("businessData.chart.detail.minimumSampleReadings")}
                      value={String(chart.minimumSampleReadings)}
                    />
                    <KV
                      label={t("businessData.chart.detail.maximumSampleReadings")}
                      value={String(chart.maximumSampleReadings)}
                    />
                    <KV
                      label={t("businessData.chart.detail.specLimitsType")}
                      value={chart.specLimitsType}
                    />
                    <KV
                      label={t("businessData.chart.detail.usl")}
                      value={chart.usl === undefined ? "" : String(chart.usl)}
                    />
                    <KV
                      label={t("businessData.chart.detail.target")}
                      value={chart.target === undefined ? "" : String(chart.target)}
                    />
                    <KV
                      label={t("businessData.chart.detail.lsl")}
                      value={chart.lsl === undefined ? "" : String(chart.lsl)}
                    />
                    <KV
                      label={t("businessData.chart.detail.centerline1")}
                      value={chart.centerline1 === undefined ? "" : String(chart.centerline1)}
                    />
                    <KV
                      label={t("businessData.chart.detail.centerline2")}
                      value={chart.centerline2 === undefined ? "" : String(chart.centerline2)}
                    />
                    <KV
                      label={t("businessData.chart.detail.stdDev")}
                      value={chart.stdDev === undefined ? "" : String(chart.stdDev)}
                    />
                  </div>
                  <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                    <Text className={styles.cardTitle}>
                      {t("businessData.chart.detail.display")}
                    </Text>
                    <KV
                      label={t("businessData.chart.detail.filterMode")}
                      value={chart.filterMode}
                    />
                    <KV
                      label={t("businessData.chart.detail.defaultPanel")}
                      value={chart.defaultPanel}
                    />
                    <KV
                      label={t("businessData.chart.detail.indicatorDisplay")}
                      value={chart.indicatorDisplay}
                    />
                    <KV label={t("businessData.chart.detail.yAxisMode")} value={chart.yAxisMode} />
                    <Bool
                      label={t("businessData.chart.detail.showHistogram")}
                      value={chart.showHistogram}
                    />
                    <Bool
                      label={t("businessData.chart.detail.showSpecLimits")}
                      value={chart.showSpecLimits}
                    />
                  </div>
                  <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                    <Text className={styles.cardTitle}>
                      {t("businessData.chart.detail.retention")}
                    </Text>
                    <KV
                      label={t("businessData.chart.detail.dataPoints")}
                      value={String(chart.dataPoints)}
                    />
                    <KV
                      label={t("businessData.chart.detail.retentionTimeHours")}
                      value={
                        chart.retentionTimeHours === undefined
                          ? ""
                          : String(chart.retentionTimeHours)
                      }
                    />
                    <KV
                      label={t("businessData.chart.detail.retentionSize")}
                      value={chart.retentionSize === undefined ? "" : String(chart.retentionSize)}
                    />
                    <Bool
                      label={t("businessData.chart.detail.learningMode")}
                      value={chart.learningMode}
                    />
                    <Bool
                      label={t("businessData.chart.detail.autoRecalculateCenterlines")}
                      value={chart.autoRecalculateCenterlines}
                    />
                    <KV
                      label={t("businessData.chart.detail.windowSize")}
                      value={String(chart.windowSize)}
                    />
                    <KV
                      label={t("businessData.chart.detail.dataPointSize")}
                      value={String(chart.dataPointSize)}
                    />
                  </div>
                </div>
              )}
            </DetailShell>
          )}
          {tab !== "details" && (
            <div className={styles.empty}>{t("businessData.chart.detail.historyEmpty")}</div>
          )}
        </DetailTabs>
      </ListPage>
      {dialogs}
    </>
  );
}

function LogicalChartsCard({
  chart,
  onAdd,
  onEdit,
  onRemove,
  onRecalculate,
  onDataPoints,
}: {
  chart: { logicalCharts: LogicalChartDetail[] };
  onAdd: () => void;
  onEdit: (lc: LogicalChartDetail) => void;
  onRemove: (lc: LogicalChartDetail) => void;
  onRecalculate: (lc: LogicalChartDetail) => void;
  onDataPoints: (lc: LogicalChartDetail) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
  return (
    <div className={`${sharedStyles.contentCard} ${styles.card}`}>
      <Text className={styles.cardTitle}>
        {t("businessData.chart.detail.logicalChartsTitle", { count: chart.logicalCharts.length })}
      </Text>
      <div className={styles.toolbar}>
        <Button appearance="secondary" onClick={onAdd}>
          {t("businessData.chart.operations.addLogicalChart")}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>{t("businessData.chart.detail.logicalColumns.name")}</TableHeaderCell>
            <TableHeaderCell>
              {t("businessData.chart.detail.logicalColumns.context")}
            </TableHeaderCell>
            <TableHeaderCell>
              {t("businessData.chart.detail.logicalColumns.dataPoints")}
            </TableHeaderCell>
            <TableHeaderCell>
              {t("businessData.chart.detail.logicalColumns.actions")}
            </TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chart.logicalCharts.map((l) => (
            <TableRow key={l.name}>
              <TableCell>{l.name}</TableCell>
              <TableCell>{l.contextSummary}</TableCell>
              <TableCell>{String(l.dataPoints.length)}</TableCell>
              <TableCell>
                <div className={styles.actionsCell}>
                  <Button appearance="secondary" size="small" onClick={() => onDataPoints(l)}>
                    {t("businessData.chart.operations.dataPoints")}
                  </Button>
                  <Button appearance="secondary" size="small" onClick={() => onEdit(l)}>
                    {t("actionBar.edit")}
                  </Button>
                  <Button appearance="secondary" size="small" onClick={() => onRecalculate(l)}>
                    {t("businessData.chart.operations.recalculate")}
                  </Button>
                  <Button appearance="secondary" size="small" onClick={() => onRemove(l)}>
                    {t("common.remove")}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function TableCard({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: string[][];
}) {
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
  return (
    <div className={`${sharedStyles.contentCard} ${styles.card}`}>
      <Text className={styles.cardTitle}>{title}</Text>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((h) => (
              <TableHeaderCell key={h}>{h}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={i}>
              {r.map((c, j) => (
                <TableCell key={j}>{c}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
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
