import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useChartDetail } from "@/api";
import type { LogicalChartDetail } from "@/api";
import type { HeaderAction } from "@/components/common";
import {
  cloneAction,
  DetailCard,
  DetailField,
  DetailShell,
  DetailTabs,
  editAction,
  Empty,
  Grid,
  HStack,
  ListPage,
  refreshAction,
  terminateAction,
  unterminateAction,
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
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useChartDialogs } from "./useChartDialogs";

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

  const displayValue = (value: string) =>
    value === "" ? t("businessData.chart.detail.emptyValue") : value;
  const displayYesNo = (value: boolean) =>
    value ? t("businessData.chart.detail.yes") : t("businessData.chart.detail.no");
  const displayNumber = (value: number | undefined) => (value === undefined ? "" : String(value));

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
                <DetailCard
                  title={t("businessData.chart.detail.rulesTitle", { count: chart.rules.length })}
                >
                  <HStack gap="sm" mb="md">
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
                          <TableCell>{displayYesNo(r.enabled)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </DetailCard>
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
                <Grid columns="auto-fit" gap="md">
                  <DetailCard title={t("businessData.chart.detail.chart")}>
                    <DetailField
                      label={t("businessData.chart.detail.name")}
                      value={displayValue(chart.name)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.description")}
                      value={displayValue(chart.description)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.type")}
                      value={displayValue(chart.type)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.universalState")}
                      value={displayValue(chart.universalState)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.enabled")}
                      value={displayYesNo(chart.enabled)}
                      labelWidth={200}
                    />
                  </DetailCard>
                  <DetailCard title={t("businessData.chart.detail.properties")}>
                    <DetailField
                      label={t("businessData.chart.detail.parameter")}
                      value={displayValue(chart.parameter)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.chartType")}
                      value={displayValue(chart.chartType)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.minimumSampleReadings")}
                      value={String(chart.minimumSampleReadings)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.maximumSampleReadings")}
                      value={String(chart.maximumSampleReadings)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.specLimitsType")}
                      value={displayValue(chart.specLimitsType)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.usl")}
                      value={displayNumber(chart.usl)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.target")}
                      value={displayNumber(chart.target)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.lsl")}
                      value={displayNumber(chart.lsl)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.centerline1")}
                      value={displayNumber(chart.centerline1)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.centerline2")}
                      value={displayNumber(chart.centerline2)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.stdDev")}
                      value={displayNumber(chart.stdDev)}
                      labelWidth={200}
                    />
                  </DetailCard>
                  <DetailCard title={t("businessData.chart.detail.display")}>
                    <DetailField
                      label={t("businessData.chart.detail.filterMode")}
                      value={displayValue(chart.filterMode)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.defaultPanel")}
                      value={displayValue(chart.defaultPanel)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.indicatorDisplay")}
                      value={displayValue(chart.indicatorDisplay)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.yAxisMode")}
                      value={displayValue(chart.yAxisMode)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.showHistogram")}
                      value={displayYesNo(chart.showHistogram)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.showSpecLimits")}
                      value={displayYesNo(chart.showSpecLimits)}
                      labelWidth={200}
                    />
                  </DetailCard>
                  <DetailCard title={t("businessData.chart.detail.retention")}>
                    <DetailField
                      label={t("businessData.chart.detail.dataPoints")}
                      value={String(chart.dataPoints)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.retentionTimeHours")}
                      value={displayNumber(chart.retentionTimeHours)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.retentionSize")}
                      value={displayNumber(chart.retentionSize)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.learningMode")}
                      value={displayYesNo(chart.learningMode)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.autoRecalculateCenterlines")}
                      value={displayYesNo(chart.autoRecalculateCenterlines)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.windowSize")}
                      value={String(chart.windowSize)}
                      labelWidth={200}
                    />
                    <DetailField
                      label={t("businessData.chart.detail.dataPointSize")}
                      value={String(chart.dataPointSize)}
                      labelWidth={200}
                    />
                  </DetailCard>
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
  return (
    <DetailCard
      title={t("businessData.chart.detail.logicalChartsTitle", {
        count: chart.logicalCharts.length,
      })}
    >
      <HStack gap="sm" mb="md">
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
                <HStack gap="xs" wrap>
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
    </DetailCard>
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
  return (
    <DetailCard title={title}>
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
    </DetailCard>
  );
}
