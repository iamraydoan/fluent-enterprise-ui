import { useState } from "react";
import type { ChartDataPoint } from "@/api";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Textarea,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { MiniSelect } from "../../components/MiniSelect";
import { DATA_POINT_ACTION_KEYS } from "../chartLookups";
import type { DataPointAction } from "../chartLookups";
import { DialogShell } from "./dialogShared";
import { useDialogStyles } from "./dialogStyles";

export function OpenProtocolDialog({
  open,
  dataPoint,
  protocols,
  onClose,
  onConfirm,
}: {
  open: boolean;
  dataPoint: ChartDataPoint | null;
  protocols: string[];
  onClose: () => void;
  onConfirm: (protocol: string, comment: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [protocol, setProtocol] = useState(protocols[0] ?? "");
  const [comment, setComment] = useState("");
  if (!open || !dataPoint) return null;
  return (
    <DialogShell
      open={open}
      title={t("businessData.chart.operations.openProtocolTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            disabled={protocol === ""}
            onClick={() => onConfirm(protocol, comment)}
          >
            {t("businessData.chart.operations.openProtocol")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.chart.operations.openProtocolHint", { id: dataPoint.sampleId })}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.chart.operations.protocol")}</span>
        <MiniSelect
          value={protocol}
          options={protocols.map((p) => ({ value: p, label: p }))}
          onSelect={setProtocol}
        />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.chart.operations.comment")}</span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </DialogShell>
  );
}

export function DataPointsDialog({
  open,
  logicalChartName,
  dataPoints,
  onClose,
  onAction,
  onPost,
}: {
  open: boolean;
  logicalChartName: string;
  dataPoints: ChartDataPoint[];
  onClose: () => void;
  onAction: (action: DataPointAction, dp: ChartDataPoint) => void;
  onPost: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [selected, setSelected] = useState<string | null>(null);
  const dp = dataPoints.find((d) => d.id === selected) ?? null;
  const canAct = dp !== null;
  return (
    <DialogShell
      open={open}
      wide
      title={t("businessData.chart.operations.dataPointsTitle", { name: logicalChartName })}
      onClose={onClose}
      footer={
        <Button appearance="secondary" onClick={onClose}>
          {t("common.close")}
        </Button>
      }
    >
      <div className={styles.toolbar}>
        <Button appearance="secondary" onClick={onPost}>
          {t("businessData.chart.operations.postDataPoint")}
        </Button>
        <Button
          appearance="secondary"
          disabled={!canAct}
          onClick={() => dp && onAction(DATA_POINT_ACTION_KEYS.annotate, dp)}
        >
          {t("businessData.chart.operations.annotate")}
        </Button>
        <Button
          appearance="secondary"
          disabled={!canAct || dp?.aggregated}
          onClick={() => dp && onAction(DATA_POINT_ACTION_KEYS.edit, dp)}
        >
          {t("businessData.chart.operations.editDataPoint")}
        </Button>
        <Button
          appearance="secondary"
          disabled={!canAct || (dp?.status !== "Active" && dp?.status !== "Edited")}
          onClick={() => dp && onAction(DATA_POINT_ACTION_KEYS.exclude, dp)}
        >
          {t("businessData.chart.operations.exclude")}
        </Button>
        <Button
          appearance="secondary"
          disabled={!canAct || dp?.status !== "Excluded"}
          onClick={() => dp && onAction(DATA_POINT_ACTION_KEYS.include, dp)}
        >
          {t("businessData.chart.operations.include")}
        </Button>
        <Button
          appearance="secondary"
          disabled={!canAct}
          onClick={() => dp && onAction(DATA_POINT_ACTION_KEYS.remove, dp)}
        >
          {t("businessData.chart.operations.removeDataPoint")}
        </Button>
        <Button
          appearance="secondary"
          disabled={!canAct}
          onClick={() => dp && onAction(DATA_POINT_ACTION_KEYS.protocol, dp)}
        >
          {t("businessData.chart.operations.openProtocol")}
        </Button>
      </div>
      {dataPoints.length === 0 ? (
        <div className={styles.empty}>{t("businessData.chart.operations.noDataPoints")}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>{t("businessData.chart.operations.sampleId")}</TableHeaderCell>
              <TableHeaderCell>{t("businessData.chart.operations.timestamp")}</TableHeaderCell>
              <TableHeaderCell>{t("businessData.chart.operations.readingsCount")}</TableHeaderCell>
              <TableHeaderCell>
                {t("businessData.chart.operations.dataPointStatus")}
              </TableHeaderCell>
              <TableHeaderCell>{t("businessData.chart.operations.annotation")}</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataPoints.map((d) => (
              <TableRow
                key={d.id}
                className={selected === d.id ? styles.selectedRow : undefined}
                onClick={() => setSelected(d.id)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{d.sampleId}</TableCell>
                <TableCell>{d.timestamp}</TableCell>
                <TableCell>
                  {d.aggregated
                    ? `${d.sampleSize} (${t("businessData.chart.operations.aggregated")})`
                    : String(d.readings.length)}
                </TableCell>
                <TableCell>{d.status}</TableCell>
                <TableCell>{d.annotation ?? ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </DialogShell>
  );
}
