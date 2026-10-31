import { useState } from "react";
import type { DataCollectionInstance } from "@/api";
import { BaseDialog } from "@/components/common";
import { Button, Input, Textarea } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { MiniSelect } from "../../components/MiniSelect";
import { useDialogStyles } from "./dialogStyles";

export function OpenDataCollectionInstanceDialog({
  open,
  dataCollectionName,
  limitSets,
  onClose,
  onConfirm,
}: {
  open: boolean;
  dataCollectionName: string;
  limitSets: string[];
  onClose: () => void;
  onConfirm: (input: {
    instanceName: string;
    description: string;
    limitSet: string;
    material: string;
    comment: string;
  }) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [instanceName, setInstanceName] = useState("");
  const [description, setDescription] = useState("");
  const [limitSet, setLimitSet] = useState("");
  const [material, setMaterial] = useState("");
  const [comment, setComment] = useState("");
  return (
    <BaseDialog
      open={open}
      size="md"
      title={t("businessData.dataCollection.operations.openInstanceTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            onClick={() => onConfirm({ instanceName, description, limitSet, material, comment })}
          >
            {t("businessData.dataCollection.operations.open")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.dataCollection.operations.openInstanceHint", { name: dataCollectionName })}
      </div>
      <div className={styles.sectionTitle}>
        {t("businessData.dataCollection.operations.generalData")}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.dataCollection.operations.instanceName")}
        </span>
        <Input
          placeholder={t("businessData.dataCollection.operations.instanceNamePlaceholder")}
          value={instanceName}
          onChange={(_, d) => setInstanceName(d.value)}
        />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.dataCollection.detail.description")}
        </span>
        <Textarea value={description} onChange={(_, d) => setDescription(d.value)} />
      </div>
      <div className={styles.sectionTitle}>
        {t("businessData.dataCollection.operations.context")}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.dataCollection.operations.limitSet")}
        </span>
        <MiniSelect
          value={limitSet}
          options={[{ value: "", label: t("businessData.dataCollection.operations.none") }].concat(
            limitSets.map((v) => ({ value: v, label: v })),
          )}
          onSelect={setLimitSet}
        />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.dataCollection.operations.material")}
        </span>
        <Input value={material} onChange={(_, d) => setMaterial(d.value)} />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.dataCollection.operations.comment")}
        </span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </BaseDialog>
  );
}

export function ViewDataCollectionInstanceDialog({
  open,
  instance,
  onClose,
}: {
  open: boolean;
  instance: DataCollectionInstance | null;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [tab, setTab] = useState<"data" | "context">("data");
  if (!instance) return null;
  return (
    <BaseDialog
      open={open}
      size="xl"
      title={t("businessData.dataCollection.operations.viewInstanceTitle")}
      onClose={onClose}
      footer={
        <Button appearance="secondary" onClick={onClose}>
          {t("common.close")}
        </Button>
      }
    >
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === "data" ? styles.tabActive : ""}`}
          onClick={() => setTab("data")}
        >
          {t("businessData.dataCollection.operations.dataTab")}
        </button>
        <button
          className={`${styles.tab} ${tab === "context" ? styles.tabActive : ""}`}
          onClick={() => setTab("context")}
        >
          {t("businessData.dataCollection.operations.contextTab")}
        </button>
      </div>
      {tab === "data" ? (
        instance.postedData.length === 0 ? (
          <div className={styles.empty}>{t("businessData.dataCollection.operations.noData")}</div>
        ) : (
          instance.postedData.map((d) => (
            <div key={d.parameter} className={styles.kvRow}>
              <span className={styles.kvLabel}>{d.parameter}:</span>
              <span>{d.value}</span>
            </div>
          ))
        )
      ) : (
        <>
          <div className={styles.kvRow}>
            <span className={styles.kvLabel}>
              {t("businessData.dataCollection.operations.instanceName")}:
            </span>
            <span>{instance.name}</span>
          </div>
          <div className={styles.kvRow}>
            <span className={styles.kvLabel}>
              {t("businessData.dataCollection.detail.description")}:
            </span>
            <span>
              {instance.description === ""
                ? t("businessData.dataCollection.detail.emptyValue")
                : instance.description}
            </span>
          </div>
          <div className={styles.kvRow}>
            <span className={styles.kvLabel}>
              {t("businessData.dataCollection.operations.limitSet")}:
            </span>
            <span>
              {instance.limitSet === ""
                ? t("businessData.dataCollection.detail.emptyValue")
                : instance.limitSet}
            </span>
          </div>
          <div className={styles.kvRow}>
            <span className={styles.kvLabel}>
              {t("businessData.dataCollection.operations.material")}:
            </span>
            <span>
              {instance.material === ""
                ? t("businessData.dataCollection.detail.emptyValue")
                : instance.material}
            </span>
          </div>
          <div className={styles.kvRow}>
            <span className={styles.kvLabel}>{t("businessData.dataCollection.detail.state")}:</span>
            <span>{instance.state}</span>
          </div>
        </>
      )}
    </BaseDialog>
  );
}
