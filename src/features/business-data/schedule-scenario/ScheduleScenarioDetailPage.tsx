import { useState } from "react";
import { useScheduleScenarioDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailShellMoreAction, DetailTab } from "@/components/common";
import { Wrench20Regular } from "@/components/icons";
import { Body1Strong, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { RecordState } from "@/lib/recordState";
import { ConfirmOperationDialog } from "../qualification/dialogs/ConfirmOperationDialog";
import { GenerateScheduleScenarioDialog } from "./dialogs/GenerateScheduleScenarioDialog";
import { ScheduleScenarioFormDialog } from "./dialogs/ScheduleScenarioFormDialog";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.scheduleScenario.tabs.details" },
  { value: "schedule", labelKey: "businessData.scheduleScenario.tabs.schedule" },
  { value: "orderFulfillment", labelKey: "businessData.scheduleScenario.tabs.orderFulfillment" },
  { value: "references", labelKey: "businessData.scheduleScenario.tabs.references" },
  { value: "history", labelKey: "businessData.scheduleScenario.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.scheduleScenario.sections.details",
  "businessData.scheduleScenario.sections.statistics",
  "businessData.scheduleScenario.sections.messages",
  "businessData.scheduleScenario.sections.attributes",
  "businessData.scheduleScenario.sections.attachments",
];

const DLG = {
  edit: "edit",
  terminate: "terminate",
  generate: "generate",
  release: "release",
  synchronize: "synchronize",
  lockJob: "lockJob",
  unlockJob: "unlockJob",
  adjustJob: "adjustJob",
} as const;

const MSG = {
  title: "businessData.scheduleScenario.dialogs.generic.title",
  message: "businessData.scheduleScenario.dialogs.generic.message",
} as const;

interface ScheduleScenarioDetailPageProps {
  name: string;
}

export function ScheduleScenarioDetailPage({ name }: ScheduleScenarioDetailPageProps) {
  const { t } = useAppTranslation();
  const { data, isLoading } = useScheduleScenarioDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>(
    "businessData.scheduleScenario.sections.details",
  );
  const handleLeft = (value: TranslationKey) => setLeft(value);
  const [dialog, setDialog] = useState<string | null>(null);
  const close = () => setDialog(null);
  const open = (key: string) => () => setDialog(key);
  const dlg = (key: string) => dialog === key;

  const isTerminated = data?.state === RecordState.Terminated;
  const mk = "businessData.scheduleScenario.more";

  const moreActions: DetailShellMoreAction[] = [
    ...(isTerminated ? [] : [{ label: t(`${mk}.terminate`), onClick: open(DLG.terminate) }]),
    { label: t(`${mk}.generate`), onClick: open(DLG.generate) },
    { label: t(`${mk}.release`), onClick: open(DLG.release) },
    { label: t(`${mk}.synchronize`), onClick: open(DLG.synchronize) },
    { label: t(`${mk}.lockJob`), onClick: open(DLG.lockJob) },
    { label: t(`${mk}.unlockJob`), onClick: open(DLG.unlockJob) },
    { label: t(`${mk}.adjustJob`), onClick: open(DLG.adjustJob) },
  ];

  if (isLoading || data === undefined) {
    return null;
  }

  const stateLabel =
    data.state === RecordState.Active ? t("common.active") : t("common.terminated");

  let content;
  if (top !== "details" || left !== "businessData.scheduleScenario.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.scheduleScenario.sections.empty")}</Body1Strong>
          <Caption1>{t("businessData.scheduleScenario.sections.emptyBody")}</Caption1>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <CardGrid>
        <Card title={t("businessData.scheduleScenario.cards.scenario")}>
          <KV
            rows={[
              [t("businessData.scheduleScenario.details.name"), data.name],
              [t("businessData.scheduleScenario.details.description"), data.description],
              [t("businessData.scheduleScenario.details.schedule"), data.schedule],
              [t("businessData.scheduleScenario.details.state"), stateLabel],
              [t("businessData.scheduleScenario.details.generationType"), data.generationType],
              [t("businessData.scheduleScenario.details.scenarioState"), data.scenarioState],
            ]}
          />
        </Card>
      </CardGrid>
    );
  }

  const opActions = [
    { key: DLG.terminate, label: t(`${mk}.terminate`) },
    { key: DLG.release, label: t(`${mk}.release`) },
    { key: DLG.synchronize, label: t(`${mk}.synchronize`) },
    { key: DLG.lockJob, label: t(`${mk}.lockJob`) },
    { key: DLG.unlockJob, label: t(`${mk}.unlockJob`) },
    { key: DLG.adjustJob, label: t(`${mk}.adjustJob`) },
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
      <ScheduleScenarioFormDialog
        open={dlg(DLG.edit)}
        onClose={close}
        title={t("businessData.scheduleScenario.dialogs.form.editTitle")}
        initialName={data.name}
        nameReadOnly
        submitLabel={t("common.save")}
      />
      <GenerateScheduleScenarioDialog
        open={dlg(DLG.generate)}
        onClose={close}
        scenarioName={data.name}
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
    </>
  );
}
