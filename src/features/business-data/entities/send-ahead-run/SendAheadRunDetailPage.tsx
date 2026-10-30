import { useState } from "react";
import { useSendAheadRunDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailShellMoreAction, DetailTab } from "@/components/common";
import { Wrench20Regular } from "@/components/icons";
import { Body1Strong, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { RecordState } from "@/lib/recordState";
import { ConfirmOperationDialog } from "../qualification/dialogs/ConfirmOperationDialog";
import { RecordSendAheadRunResultDialog } from "./dialogs/RecordSendAheadRunResultDialog";
import { SendAheadRunFormDialog } from "./dialogs/SendAheadRunFormDialog";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.sendAheadRun.tabs.details" },
  { value: "references", labelKey: "businessData.sendAheadRun.tabs.references" },
  { value: "history", labelKey: "businessData.sendAheadRun.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.sendAheadRun.sections.details",
  "businessData.sendAheadRun.sections.materials",
  "businessData.sendAheadRun.sections.attributes",
  "businessData.sendAheadRun.sections.attachments",
];

const DLG = {
  edit: "edit",
  cancel: "cancel",
  extend: "extend",
  release: "release",
  changeMaterials: "changeMaterials",
  clearResult: "clearResult",
  ignoreResult: "ignoreResult",
  createSplit: "createSplit",
  manageMaterials: "manageMaterials",
  recordResult: "recordResult",
} as const;

const MSG = {
  title: "businessData.sendAheadRun.dialogs.generic.title",
  message: "businessData.sendAheadRun.dialogs.generic.message",
} as const;

interface SendAheadRunDetailPageProps {
  name: string;
}

export function SendAheadRunDetailPage({ name }: SendAheadRunDetailPageProps) {
  const { t } = useAppTranslation();
  const { data, isLoading } = useSendAheadRunDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.sendAheadRun.sections.details");
  const handleLeft = (value: string) => setLeft(value as TranslationKey);
  const [dialog, setDialog] = useState<string | null>(null);
  const close = () => setDialog(null);
  const open = (key: string) => () => setDialog(key);
  const dlg = (key: string) => dialog === key;

  const isTerminated = data?.state === RecordState.Terminated;
  const mk = "businessData.sendAheadRun.more";

  const moreActions: DetailShellMoreAction[] = [
    ...(isTerminated ? [] : [{ label: t(`${mk}.cancel`), onClick: open(DLG.cancel) }]),
    { label: t(`${mk}.extend`), onClick: open(DLG.extend) },
    { label: t(`${mk}.release`), onClick: open(DLG.release) },
    { label: t(`${mk}.changeMaterials`), onClick: open(DLG.changeMaterials) },
    { label: t(`${mk}.clearResult`), onClick: open(DLG.clearResult) },
    { label: t(`${mk}.ignoreResult`), onClick: open(DLG.ignoreResult) },
    { label: t(`${mk}.createSplit`), onClick: open(DLG.createSplit) },
    { label: t(`${mk}.manageMaterials`), onClick: open(DLG.manageMaterials) },
    { label: t(`${mk}.recordResult`), onClick: open(DLG.recordResult) },
  ];

  if (isLoading || data === undefined) {
    return null;
  }

  const stateLabel =
    data.state === RecordState.Active ? t("common.active") : t("common.terminated");

  let content;
  if (top !== "details" || left !== "businessData.sendAheadRun.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.sendAheadRun.sections.empty")}</Body1Strong>
          <Caption1>{t("businessData.sendAheadRun.sections.emptyBody")}</Caption1>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <CardGrid>
        <Card title={t("businessData.sendAheadRun.cards.sendAheadRun")}>
          <KV
            rows={[
              [t("businessData.sendAheadRun.details.name"), data.name],
              [t("businessData.sendAheadRun.details.description"), data.description],
              [t("businessData.sendAheadRun.details.state"), stateLabel],
              [t("businessData.sendAheadRun.details.dataGroup"), data.dataGroup],
              [t("businessData.sendAheadRun.details.resultsCaptureMode"), data.resultsCaptureMode],
            ]}
          />
        </Card>
      </CardGrid>
    );
  }

  const opActions = [
    { key: DLG.cancel, label: t(`${mk}.cancel`) },
    { key: DLG.extend, label: t(`${mk}.extend`) },
    { key: DLG.release, label: t(`${mk}.release`) },
    { key: DLG.changeMaterials, label: t(`${mk}.changeMaterials`) },
    { key: DLG.clearResult, label: t(`${mk}.clearResult`) },
    { key: DLG.ignoreResult, label: t(`${mk}.ignoreResult`) },
    { key: DLG.createSplit, label: t(`${mk}.createSplit`) },
    { key: DLG.manageMaterials, label: t(`${mk}.manageMaterials`) },
  ];

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
      <SendAheadRunFormDialog
        open={dlg(DLG.edit)}
        onClose={close}
        title={t("businessData.sendAheadRun.dialogs.form.editTitle")}
        initial={data}
        nameReadOnly
        submitLabel={t("common.save")}
      />
      {opActions.map((op) => (
        <ConfirmOperationDialog
          key={op.key}
          open={dlg(op.key)}
          onClose={close}
          title={t(MSG.title, { name: op.label })}
          message={t(MSG.message, { operation: op.label, name: data.name })}
          confirmLabel={op.label}
        />
      ))}
      <RecordSendAheadRunResultDialog
        open={dlg(DLG.recordResult)}
        onClose={close}
        runName={data.name}
      />
    </>
  );
}
