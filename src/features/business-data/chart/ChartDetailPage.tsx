import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useChartDetail } from "@/api";
import type { LogicalChartDetail } from "@/api";
import type { HeaderAction } from "@/components/common";
import {
  cloneAction,
  DetailShell,
  DetailTabs,
  editAction,
  Empty,
  ListPage,
  refreshAction,
  terminateAction,
  unterminateAction,
  SectionHeader,
  Grid,
  HStack,
  VStack,
} from "@/components/common";
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
  makeStyles,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { theme } from "@/styles/theme";
import { useChartDialogs } from "./useChartDialogs";

const useDetailStyles = makeStyles({
  card: { padding: theme.spacing.lg },
  cardTitle: {
    fontSize: "14px",
    fontWeight: theme.font.weightSemibold,
    paddingBottom: theme.spacing.sm,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  row: {
    fontSize: "13px",
  },
  label: { color: theme.color.textTertiary, minWidth: "200px" },
  toolbar: {
    marginBottom: theme.spacing.md,
  },
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
        <Empty>{t("businessData.chart.detail.loading")}</Empty>
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
                <VStack gap="md" className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <SectionHeader
                    title={t("businessData.chart.detail.rulesTitle", { count: chart.rules.length })}
                  />
                  <HStack gap="8px" className={styles.toolbar}>
                    <Button variant="secondary" onClick={openManageRules}>
                      {t("businessData.chart.operations.manageRules")}
                    </Button>
                  </HStack>
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
                </VStack>
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
                <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="12px">
                  <VStack gap="md" className={`${sharedStyles.contentCard} ${styles.card}`}>
                    <SectionHeader title={t("businessData.chart.detail.chart")} />
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
                  </VStack>
                  <VStack gap="md" className={`${sharedStyles.contentCard} ${styles.card}`}>
                    <SectionHeader title={t("businessData.chart.detail.properties")} />
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
                  </VStack>
                  <VStack gap="md" className={`${sharedStyles.contentCard} ${styles.card}`}>
                    <SectionHeader title={t("businessData.chart.detail.display")} />
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
                  </VStack>
                  <VStack gap="md" className={`${sharedStyles.contentCard} ${styles.card}`}>
                    <SectionHeader title={t("businessData.chart.detail.retention")} />
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
                  </VStack>
                </Grid>
              )}
            </DetailShell>
          )}
          {tab !== "details" && <Empty>{t("businessData.chart.detail.historyEmpty")}</Empty>}
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
    <VStack gap="md" className={`${sharedStyles.contentCard} ${styles.card}`}>
      <SectionHeader
        title={t("businessData.chart.detail.logicalChartsTitle", {
          count: chart.logicalCharts.length,
        })}
      />
      <HStack gap="8px" className={styles.toolbar}>
        <Button variant="secondary" onClick={onAdd}>
          {t("businessData.chart.operations.addLogicalChart")}
        </Button>
      </HStack>
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
                <HStack gap="4px" wrap>
                  <Button variant="secondary" size="sm" onClick={() => onDataPoints(l)}>
                    {t("businessData.chart.operations.dataPoints")}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => onEdit(l)}>
                    {t("actionBar.edit")}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => onRecalculate(l)}>
                    {t("businessData.chart.operations.recalculate")}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => onRemove(l)}>
                    {t("common.remove")}
                  </Button>
                </HStack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </VStack>
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
    <VStack gap="md" className={`${sharedStyles.contentCard} ${styles.card}`}>
      <SectionHeader title={title} />
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
    </VStack>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <HStack gap="12px" className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>{value === "" ? t("businessData.chart.detail.emptyValue") : value}</span>
    </HStack>
  );
}

function Bool({ label, value }: { label: string; value: boolean }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <HStack gap="12px" className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>{value ? t("businessData.chart.detail.yes") : t("businessData.chart.detail.no")}</span>
    </HStack>
  );
}
