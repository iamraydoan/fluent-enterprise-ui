import { useState } from "react";
import { useResourceJobDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailShellMoreAction, DetailTab } from "@/components/common";
import { Wrench20Regular } from "@/components/icons";
import { Body1Strong, Button, Caption1, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { RecordState } from "@/lib/recordState";
import { ResourceJobFormDialog } from "./dialogs/ResourceJobFormDialog";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.resourceJob.tabs.details" },
  { value: "references", labelKey: "businessData.resourceJob.tabs.references" },
  { value: "history", labelKey: "businessData.resourceJob.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.resourceJob.sections.details",
  "businessData.resourceJob.sections.materials",
  "businessData.resourceJob.sections.containers",
  "businessData.resourceJob.sections.attachments",
];

const DLG = {
  edit: "edit",
  clone: "clone",
  abort: "abort",
  cancel: "cancel",
  complete: "complete",
  dequeue: "dequeue",
  enqueue: "enqueue",
  requeue: "requeue",
  start: "start",
} as const;

const LC_CLONE_TITLE: TranslationKey = "businessData.resourceJob.dialogs.lifecycle.cloneTitle";
const LC_CLONE: TranslationKey = "businessData.resourceJob.dialogs.lifecycle.clone";
const LC_ABORT_TITLE: TranslationKey = "businessData.resourceJob.dialogs.lifecycle.abortTitle";
const LC_ABORT: TranslationKey = "businessData.resourceJob.dialogs.lifecycle.abort";
const LC_CANCEL_TITLE: TranslationKey = "businessData.resourceJob.dialogs.lifecycle.cancelTitle";
const LC_CANCEL: TranslationKey = "businessData.resourceJob.dialogs.lifecycle.cancel";
const LC_COMPLETE_TITLE: TranslationKey = "businessData.resourceJob.dialogs.lifecycle.completeTitle";
const LC_COMPLETE: TranslationKey = "businessData.resourceJob.dialogs.lifecycle.complete";
const LC_DEQUEUE_TITLE: TranslationKey = "businessData.resourceJob.dialogs.lifecycle.dequeueTitle";
const LC_DEQUEUE: TranslationKey = "businessData.resourceJob.dialogs.lifecycle.dequeue";
const LC_ENQUEUE_TITLE: TranslationKey = "businessData.resourceJob.dialogs.lifecycle.enqueueTitle";
const LC_ENQUEUE: TranslationKey = "businessData.resourceJob.dialogs.lifecycle.enqueue";
const LC_REQUEUE_TITLE: TranslationKey = "businessData.resourceJob.dialogs.lifecycle.requeueTitle";
const LC_REQUEUE: TranslationKey = "businessData.resourceJob.dialogs.lifecycle.requeue";
const LC_START_TITLE: TranslationKey = "businessData.resourceJob.dialogs.lifecycle.startTitle";
const LC_START: TranslationKey = "businessData.resourceJob.dialogs.lifecycle.start";

interface ResourceJobDetailPageProps {
  name: string;
}

function LifecycleDialog({
  open,
  onClose,
  titleKey,
  actionKey,
  jobName,
}: {
  open: boolean;
  onClose: () => void;
  titleKey: TranslationKey;
  actionKey: TranslationKey;
  jobName: string;
}) {
  const { t } = useAppTranslation();
  const [comment, setComment] = useState("");

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 700, width: "85vw" }}>
        <DialogBody>
          <DialogTitle>{t(titleKey)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>📋 {jobName}</div>
            <Field label={t("businessData.resourceJob.dialogs.lifecycle.comment")}>
              <Input value={comment} onChange={(_, d) => setComment(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>{t("common.cancel")}</Button>
            <Button appearance="primary" onClick={onClose}>{t(actionKey)}</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export function ResourceJobDetailPage({ name }: ResourceJobDetailPageProps) {
  const { t } = useAppTranslation();
  const { data, isLoading } = useResourceJobDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.resourceJob.sections.details");
  const handleLeft = (value: string) => setLeft(value as TranslationKey);
  const [dialog, setDialog] = useState<string | null>(null);
  const close = () => setDialog(null);
  const open = (key: string) => () => setDialog(key);
  const dlg = (key: string) => dialog === key;

  const mk = "businessData.resourceJob.more";

  const moreActions: DetailShellMoreAction[] = [
    { label: t(`${mk}.clone`), onClick: open(DLG.clone) },
    { label: t(`${mk}.abort`), onClick: open(DLG.abort) },
    { label: t(`${mk}.cancel`), onClick: open(DLG.cancel) },
    { label: t(`${mk}.complete`), onClick: open(DLG.complete) },
    { label: t(`${mk}.dequeue`), onClick: open(DLG.dequeue) },
    { label: t(`${mk}.enqueue`), onClick: open(DLG.enqueue) },
    { label: t(`${mk}.requeue`), onClick: open(DLG.requeue) },
    { label: t(`${mk}.start`), onClick: open(DLG.start) },
  ];

  if (isLoading || data === undefined) {
    return null;
  }

  const stateLabel =
    data.state === RecordState.Active ? t("common.active") : t("common.terminated");

  let content;
  if (top !== "details" || left !== "businessData.resourceJob.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.resourceJob.sections.empty")}</Body1Strong>
          <Caption1>{t("businessData.resourceJob.sections.emptyBody")}</Caption1>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <CardGrid>
        <Card title={t("businessData.resourceJob.cards.resourceJob")}>
          <KV
            rows={[
              [t("businessData.resourceJob.details.name"), data.name],
              [t("businessData.resourceJob.details.description"), data.description],
              [t("businessData.resourceJob.details.resource"), data.resource],
              [t("businessData.resourceJob.details.type"), data.type],
              [t("businessData.resourceJob.details.systemState"), data.systemState],
              [t("businessData.resourceJob.details.state"), stateLabel],
              [t("businessData.resourceJob.details.dataGroup"), data.dataGroup],
            ]}
          />
        </Card>
        <Card title={t("businessData.resourceJob.cards.information")}>
          <KV
            rows={[
              [t("businessData.resourceJob.details.subType"), data.subType],
              [t("businessData.resourceJob.details.selectionMode"), data.selectionMode],
              [t("businessData.resourceJob.details.priority"), String(data.priority)],
              [t("businessData.resourceJob.details.progress"), `${data.progress}%`],
              [t("businessData.resourceJob.details.equipmentJobId"), data.equipmentJobId],
              [t("businessData.resourceJob.details.jobInformation"), data.jobInformation],
            ]}
          />
        </Card>
      </CardGrid>
    );
  }

  return (
    <>
      <DetailShell
        title={data.name}
        icon={<Wrench20Regular />}
        topTabs={TOP_TABS}
        top={top}
        onTop={setTop}
        leftItems={LEFT_SECTIONS}
        left={left}
        onLeft={handleLeft}
        onEdit={open(DLG.edit)}
        onAskAi={() => {}}
        moreActions={moreActions}
      >
        {content}
      </DetailShell>
      <ResourceJobFormDialog
        open={dlg(DLG.edit)}
        onClose={close}
        title={t("businessData.resourceJob.dialogs.form.editTitle")}
        initial={data}
        nameReadOnly
        submitLabel={t("common.save")}
      />
      <LifecycleDialog open={dlg(DLG.clone)} onClose={close} titleKey={LC_CLONE_TITLE} actionKey={LC_CLONE} jobName={data.name} />
      <LifecycleDialog open={dlg(DLG.abort)} onClose={close} titleKey={LC_ABORT_TITLE} actionKey={LC_ABORT} jobName={data.name} />
      <LifecycleDialog open={dlg(DLG.cancel)} onClose={close} titleKey={LC_CANCEL_TITLE} actionKey={LC_CANCEL} jobName={data.name} />
      <LifecycleDialog open={dlg(DLG.complete)} onClose={close} titleKey={LC_COMPLETE_TITLE} actionKey={LC_COMPLETE} jobName={data.name} />
      <LifecycleDialog open={dlg(DLG.dequeue)} onClose={close} titleKey={LC_DEQUEUE_TITLE} actionKey={LC_DEQUEUE} jobName={data.name} />
      <LifecycleDialog open={dlg(DLG.enqueue)} onClose={close} titleKey={LC_ENQUEUE_TITLE} actionKey={LC_ENQUEUE} jobName={data.name} />
      <LifecycleDialog open={dlg(DLG.requeue)} onClose={close} titleKey={LC_REQUEUE_TITLE} actionKey={LC_REQUEUE} jobName={data.name} />
      <LifecycleDialog open={dlg(DLG.start)} onClose={close} titleKey={LC_START_TITLE} actionKey={LC_START} jobName={data.name} />
    </>
  );
}
