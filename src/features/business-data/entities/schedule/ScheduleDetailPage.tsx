import { useState } from "react";
import { useScheduleDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailShellMoreAction, DetailTab } from "@/components/common";
import { Wrench20Regular } from "@/components/icons";
import { Body1Strong, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { RecordState } from "@/lib/recordState";
import { ConfirmOperationDialog } from "../qualification/dialogs/ConfirmOperationDialog";
import { AdjustScheduleJobDialog } from "./dialogs/AdjustScheduleJobDialog";
import { ManageFeedStepsDialog } from "./dialogs/ManageFeedStepsDialog";
import { ScheduleFormDialog } from "./dialogs/ScheduleFormDialog";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.schedule.tabs.details" },
  { value: "schedule", labelKey: "businessData.schedule.tabs.schedule" },
  { value: "scenarios", labelKey: "businessData.schedule.tabs.scenarios" },
  { value: "references", labelKey: "businessData.schedule.tabs.references" },
  { value: "history", labelKey: "businessData.schedule.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.schedule.sections.details",
  "businessData.schedule.sections.areas",
  "businessData.schedule.sections.feedSteps",
  "businessData.schedule.sections.attributes",
  "businessData.schedule.sections.attachments",
];

const DLG = {
  edit: "edit",
  clone: "clone",
  terminate: "terminate",
  unterminate: "unterminate",
  createScenario: "createScenario",
  adjustJob: "adjustJob",
  manageFeedSteps: "manageFeedSteps",
} as const;

const CLONE_TITLE: TranslationKey = "businessData.schedule.dialogs.clone.title";
const CLONE: TranslationKey = "businessData.schedule.dialogs.clone.clone";

interface ScheduleDetailPageProps {
  name: string;
}

export function ScheduleDetailPage({ name }: ScheduleDetailPageProps) {
  const { t } = useAppTranslation();
  const { data, isLoading } = useScheduleDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.schedule.sections.details");
  const handleLeft = (value: TranslationKey) => setLeft(value);
  const [dialog, setDialog] = useState<string | null>(null);
  const close = () => setDialog(null);
  const open = (key: string) => () => setDialog(key);
  const dlg = (key: string) => dialog === key;

  const isTerminated = data?.state === RecordState.Terminated;
  const mk = "businessData.schedule.more";

  const moreActions: DetailShellMoreAction[] = [
    { label: t(`${mk}.clone`), onClick: open(DLG.clone) },
    ...(isTerminated
      ? [{ label: t(`${mk}.unterminate`), onClick: open(DLG.unterminate) }]
      : [{ label: t(`${mk}.terminate`), onClick: open(DLG.terminate) }]),
    { label: t(`${mk}.createScenario`), onClick: open(DLG.createScenario) },
    { label: t(`${mk}.adjustJob`), onClick: open(DLG.adjustJob) },
    { label: t(`${mk}.manageFeedSteps`), onClick: open(DLG.manageFeedSteps) },
  ];

  if (isLoading || data === undefined) {
    return null;
  }

  const stateLabel =
    data.state === RecordState.Active ? t("common.active") : t("common.terminated");

  let content;
  if (top !== "details" || left !== "businessData.schedule.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.schedule.sections.empty")}</Body1Strong>
          <Caption1>{t("businessData.schedule.sections.emptyBody")}</Caption1>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <CardGrid>
        <Card title={t("businessData.schedule.cards.schedule")}>
          <KV
            rows={[
              [t("businessData.schedule.details.name"), data.name],
              [t("businessData.schedule.details.description"), data.description],
              [t("businessData.schedule.details.state"), stateLabel],
              [t("businessData.schedule.details.defaultView"), data.defaultView],
              [t("businessData.schedule.details.defaultFrozenPeriod"), `${data.defaultFrozenPeriod} h`],
              [t("businessData.schedule.details.timeQuantum"), `${data.timeQuantum} min`],
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
      <ScheduleFormDialog
        open={dlg(DLG.edit)}
        onClose={close}
        title={t("businessData.schedule.dialogs.form.editTitle")}
        initial={data}
        nameReadOnly
        submitLabel={t("common.save")}
      />
      <ConfirmOperationDialog
        open={dlg(DLG.clone)}
        onClose={close}
        title={t(CLONE_TITLE)}
        message={t("businessData.schedule.dialogs.clone.message", { name: data.name })}
        confirmLabel={t(CLONE)}
      />
      <ConfirmOperationDialog
        open={dlg(DLG.terminate)}
        onClose={close}
        title={t("businessData.schedule.dialogs.terminate.title")}
        message={t("businessData.schedule.dialogs.terminate.message", { name: data.name })}
        confirmLabel={t("businessData.schedule.dialogs.terminate.confirm")}
      />
      <ConfirmOperationDialog
        open={dlg(DLG.unterminate)}
        onClose={close}
        title={t("businessData.schedule.dialogs.unterminate.title")}
        message={t("businessData.schedule.dialogs.unterminate.message", { name: data.name })}
        confirmLabel={t("businessData.schedule.dialogs.unterminate.confirm")}
      />
      <ConfirmOperationDialog
        open={dlg(DLG.createScenario)}
        onClose={close}
        title={t("businessData.schedule.dialogs.createScenario.title")}
        message={t("businessData.schedule.dialogs.createScenario.message", { name: data.name })}
        confirmLabel={t("businessData.schedule.dialogs.createScenario.create")}
      />
      <AdjustScheduleJobDialog
        open={dlg(DLG.adjustJob)}
        onClose={close}
        scheduleName={data.name}
      />
      <ManageFeedStepsDialog
        open={dlg(DLG.manageFeedSteps)}
        onClose={close}
        scheduleName={data.name}
      />
    </>
  );
}
