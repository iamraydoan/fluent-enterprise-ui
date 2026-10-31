import { useState } from "react";
import type { ChartRuleRow } from "@/api";
import { Button, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { MiniSelect } from "../../components/MiniSelect";
import { RULE_SCOPE_OPTIONS, SPC_RULES } from "../chartLookups";
import { DialogShell } from "./dialogShared";
import { useDialogStyles } from "./dialogStyles";

export interface ManageRuleRow {
  id: number;
  scope: string;
  rule: string;
  protocol: string;
  actionRule: string;
  comment: string;
}

export function ManageChartRulesDialog({
  open,
  chartName,
  initialRules,
  onClose,
  onSave,
}: {
  open: boolean;
  chartName: string;
  initialRules: ChartRuleRow[];
  onClose: () => void;
  onSave: (rules: ChartRuleRow[]) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [rows, setRows] = useState<ManageRuleRow[]>(() =>
    initialRules.map((r, i) => ({
      id: Date.now() + i,
      scope: r.scope,
      rule: r.rule,
      protocol: r.protocol,
      actionRule: r.actionRule,
      comment: r.comment,
    })),
  );
  const descriptionOf = (rule: string) =>
    SPC_RULES.find((r) => r.value === rule)?.description ?? "";
  const addRow = () =>
    setRows([
      ...rows,
      {
        id: Date.now() + rows.length,
        scope: "Chart",
        rule: "Nelson 1",
        protocol: "",
        actionRule: "",
        comment: "",
      },
    ]);
  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));
  const update = (id: number, patch: Partial<ManageRuleRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <DialogShell
      open={open}
      wide
      title={t("businessData.chart.operations.manageRules")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            onClick={() =>
              onSave(
                rows.map((r) => ({
                  scope: r.scope,
                  rule: r.rule,
                  description: descriptionOf(r.rule),
                  protocol: r.protocol,
                  actionRule: r.actionRule,
                  comment: r.comment,
                  enabled: true,
                })),
              )
            }
          >
            {t("common.update")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.chart.operations.manageRulesHint", { name: chartName })}
      </div>
      {rows.length === 0 && (
        <div className={styles.empty}>{t("businessData.chart.operations.noRules")}</div>
      )}
      {rows.map((row) => (
        <div key={row.id}>
          <div className={styles.ruleRow}>
            <MiniSelect
              value={row.scope}
              options={RULE_SCOPE_OPTIONS}
              onSelect={(v) => update(row.id, { scope: v })}
              ariaLabel={t("businessData.chart.operations.scope")}
            />
            <MiniSelect
              value={row.rule}
              options={SPC_RULES.map((r) => ({ value: r.value, label: r.value }))}
              onSelect={(v) => update(row.id, { rule: v })}
              ariaLabel={t("businessData.chart.operations.rule")}
            />
            <Input
              placeholder={t("businessData.chart.operations.protocol")}
              value={row.protocol}
              onChange={(_, d) => update(row.id, { protocol: d.value })}
            />
            <Input
              placeholder={t("businessData.chart.operations.actionRule")}
              value={row.actionRule}
              onChange={(_, d) => update(row.id, { actionRule: d.value })}
            />
            <Input
              placeholder={t("businessData.chart.operations.comment")}
              value={row.comment}
              onChange={(_, d) => update(row.id, { comment: d.value })}
            />
            <Button appearance="secondary" onClick={() => removeRow(row.id)}>
              {t("common.remove")}
            </Button>
          </div>
          <div className={styles.hint}>{descriptionOf(row.rule)}</div>
        </div>
      ))}
      <Button appearance="secondary" onClick={addRow}>
        {t("common.add")}
      </Button>
    </DialogShell>
  );
}
