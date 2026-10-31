import { useState } from "react";
import type { ChecklistInstance } from "@/api";
import { Button, Input, Textarea } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { MiniSelect } from "../../components/MiniSelect";
import {
  DEVIATION_TYPES,
  ITEM_STATE_COMPLETED,
  ITEM_STATE_NOT_STARTED,
  ITEM_STATE_SKIPPED,
  ITEM_STATE_STARTED,
  SHOW_MANDATORY,
  SHOW_OPTIONAL,
  type InstanceItemState,
} from "../checklistLookups";
import { DialogShell } from "./dialogShared";
import { useDialogStyles } from "./dialogStyles";

export function OpenChecklistInstanceDialog({
  open,
  checklistName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  checklistName: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  return (
    <DialogShell
      open={open}
      title={t("businessData.checklist.operations.openInstanceTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={onConfirm}>
            {t("businessData.checklist.operations.open")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.checklist.operations.openInstanceMessage", { name: checklistName })}
      </div>
    </DialogShell>
  );
}

export function OpenForMaterialDialog({
  open,
  checklistName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  checklistName: string;
  onClose: () => void;
  onConfirm: (material: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [material, setMaterial] = useState("");
  return (
    <DialogShell
      open={open}
      title={t("businessData.checklist.operations.openForMaterialTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            disabled={material.trim() === ""}
            onClick={() => onConfirm(material)}
          >
            {t("businessData.checklist.operations.open")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.checklist.operations.openForMaterialHint", { name: checklistName })}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.checklist.operations.material")}</span>
        <Input value={material} onChange={(_, d) => setMaterial(d.value)} />
      </div>
    </DialogShell>
  );
}

export function PauseChecklistInstanceDialog({
  open,
  instanceName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  instanceName: string;
  onClose: () => void;
  onConfirm: (reason: string, comment: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  return (
    <DialogShell
      open={open}
      title={t("businessData.checklist.operations.pauseTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            disabled={reason.trim() === ""}
            onClick={() => onConfirm(reason, comment)}
          >
            {t("businessData.checklist.operations.pause")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.checklist.operations.pauseMessage", { name: instanceName })}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.checklist.operations.pauseReason")} *
        </span>
        <Input
          placeholder={t("businessData.checklist.operations.pauseReasonPlaceholder")}
          value={reason}
          onChange={(_, d) => setReason(d.value)}
        />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.checklist.operations.comment")}</span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </DialogShell>
  );
}

function SignItemDialog({
  open,
  itemName,
  onClose,
  onSign,
}: {
  open: boolean;
  itemName: string;
  onClose: () => void;
  onSign: (username: string, password: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <DialogShell
      open={open}
      title={t("businessData.checklist.operations.signTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            disabled={username.trim() === "" || password === ""}
            onClick={() => onSign(username, password)}
          >
            {t("businessData.checklist.operations.sign")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.checklist.operations.signHint", { name: itemName })}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.checklist.operations.username")}</span>
        <Input value={username} onChange={(_, d) => setUsername(d.value)} />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.checklist.operations.password")}</span>
        <Input type="password" value={password} onChange={(_, d) => setPassword(d.value)} />
      </div>
    </DialogShell>
  );
}

export function PerformChecklistDialog({
  open,
  instance,
  immediate,
  onClose,
  onPerform,
}: {
  open: boolean;
  instance: ChecklistInstance | null;
  immediate: boolean;
  onClose: () => void;
  onPerform: (items: { name: string; state: InstanceItemState }[], close: boolean) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [states, setStates] = useState<Record<string, InstanceItemState>>({});
  const [show, setShow] = useState<string>(SHOW_MANDATORY);
  const [signItem, setSignItem] = useState<string | null>(null);
  if (!open || !instance) return null;

  const stateOf = (name: string): InstanceItemState =>
    states[name] ?? instance.items.find((i) => i.name === name)?.state ?? ITEM_STATE_NOT_STARTED;
  const setState = (name: string, state: InstanceItemState) =>
    setStates((s) => ({ ...s, [name]: state }));

  const visibleItems = instance.items.filter((i) =>
    show === SHOW_MANDATORY ? !i.optional : i.optional,
  );
  const allDone = instance.items.every((i) => {
    const s = stateOf(i.name);
    return s === ITEM_STATE_COMPLETED || s === ITEM_STATE_SKIPPED;
  });

  const completeItem = (name: string) => {
    const item = instance.items.find((i) => i.name === name);
    if (item?.activityType === "Signature") {
      setSignItem(name);
    } else {
      setState(name, ITEM_STATE_COMPLETED);
    }
  };

  const snapshot = () => instance.items.map((i) => ({ name: i.name, state: stateOf(i.name) }));

  return (
    <DialogShell
      open={open}
      wide
      title={t(
        immediate
          ? "businessData.checklist.operations.performImmediateTitle"
          : "businessData.checklist.operations.performTitle",
      )}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          {!immediate && (
            <Button appearance="secondary" onClick={() => onPerform(snapshot(), false)}>
              {t("businessData.checklist.operations.saveAndClose")}
            </Button>
          )}
          <Button
            appearance="primary"
            disabled={!allDone}
            onClick={() => onPerform(snapshot(), true)}
          >
            {t(immediate ? "businessData.checklist.operations.perform" : "common.close")}
          </Button>
        </>
      }
    >
      <div className={styles.toolbar}>
        <Button
          appearance={show === SHOW_MANDATORY ? "primary" : "secondary"}
          onClick={() => setShow(SHOW_MANDATORY)}
        >
          {t("businessData.checklist.operations.mandatory")}
        </Button>
        <Button
          appearance={show === SHOW_OPTIONAL ? "primary" : "secondary"}
          onClick={() => setShow(SHOW_OPTIONAL)}
        >
          {t("businessData.checklist.operations.optionalList")}
        </Button>
      </div>
      {visibleItems.length === 0 && (
        <div className={styles.empty}>{t("businessData.checklist.operations.noItems")}</div>
      )}
      {visibleItems.map((item) => {
        const s = stateOf(item.name);
        return (
          <div key={item.name} className={styles.performRow}>
            <div>
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div className={styles.hint} style={{ margin: 0 }}>
                {item.activityType}
                {item.floating ? ` · ${t("businessData.checklist.operations.floating")}` : ""}
              </div>
            </div>
            <span className={styles.stateBadge}>{s}</span>
            <div style={{ display: "flex", columnGap: "4px" }}>
              {s === ITEM_STATE_NOT_STARTED && (
                <Button
                  appearance="secondary"
                  size="small"
                  onClick={() => setState(item.name, ITEM_STATE_STARTED)}
                >
                  {t("businessData.checklist.operations.start")}
                </Button>
              )}
              {(s === ITEM_STATE_STARTED || s === ITEM_STATE_NOT_STARTED) && (
                <Button appearance="secondary" size="small" onClick={() => completeItem(item.name)}>
                  {t("businessData.checklist.operations.complete")}
                </Button>
              )}
              {item.optional && (s === ITEM_STATE_NOT_STARTED || s === ITEM_STATE_STARTED) && (
                <Button
                  appearance="secondary"
                  size="small"
                  onClick={() => setState(item.name, ITEM_STATE_SKIPPED)}
                >
                  {t("businessData.checklist.operations.skip")}
                </Button>
              )}
            </div>
          </div>
        );
      })}
      <SignItemDialog
        open={signItem !== null}
        itemName={signItem ?? ""}
        onClose={() => setSignItem(null)}
        onSign={() => {
          if (signItem) setState(signItem, ITEM_STATE_COMPLETED);
          setSignItem(null);
        }}
      />
    </DialogShell>
  );
}

export function OpenMaterialDeviationDialog({
  open,
  instance,
  onClose,
  onConfirm,
}: {
  open: boolean;
  instance: ChecklistInstance | null;
  onClose: () => void;
  onConfirm: (input: {
    itemName: string;
    deviationType: string;
    product: string;
    quantity?: number;
    units: string;
    color: string;
    comment: string;
  }) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [itemName, setItemName] = useState(instance?.items[0]?.name ?? "");
  const [deviationType, setDeviationType] = useState(DEVIATION_TYPES[0]);
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [units, setUnits] = useState("");
  const [color, setColor] = useState("");
  const [comment, setComment] = useState("");
  if (!open || !instance) return null;
  const isBom = deviationType.includes("BOM");

  return (
    <DialogShell
      open={open}
      wide
      title={t("businessData.checklist.operations.openDeviationTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            disabled={itemName === ""}
            onClick={() =>
              onConfirm({
                itemName,
                deviationType,
                product,
                quantity: quantity === "" ? undefined : Number(quantity),
                units,
                color,
                comment,
              })
            }
          >
            {t("businessData.checklist.operations.openDeviation")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.checklist.operations.openDeviationHint", { name: instance.name })}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.checklist.operations.checklistItem")}
        </span>
        <MiniSelect
          value={itemName}
          options={instance.items.map((i) => ({ value: i.name, label: i.name }))}
          onSelect={setItemName}
        />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.checklist.operations.deviationType")}
        </span>
        <MiniSelect
          value={deviationType}
          options={DEVIATION_TYPES.map((v) => ({ value: v, label: v }))}
          onSelect={setDeviationType}
        />
      </div>
      {isBom && (
        <>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>
              {t("businessData.checklist.operations.product")}
            </span>
            <Input value={product} onChange={(_, d) => setProduct(d.value)} />
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>
              {t("businessData.checklist.operations.quantity")}
            </span>
            <Input type="number" value={quantity} onChange={(_, d) => setQuantity(d.value)} />
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>
              {t("businessData.checklist.operations.units")}
            </span>
            <Input value={units} onChange={(_, d) => setUnits(d.value)} />
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>
              {t("businessData.checklist.operations.color")}
            </span>
            <Input value={color} onChange={(_, d) => setColor(d.value)} />
          </div>
        </>
      )}
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.checklist.operations.comment")}</span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </DialogShell>
  );
}
