import { useState } from "react";
import { useSamplingPlanDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailShellMoreAction, DetailTab } from "@/components/common";
import { Wrench20Regular } from "@/components/icons";
import { Body1Strong, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { RecordState } from "@/lib/recordState";
import { ConfirmOperationDialog } from "../qualification/dialogs/ConfirmOperationDialog";
import { ManageSamplingPlanInstanceDialog } from "./dialogs/ManageSamplingPlanInstanceDialog";
import { SamplingPlanFormDialog } from "./dialogs/SamplingPlanFormDialog";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.samplingPlan.tabs.details" },
  { value: "references", labelKey: "businessData.samplingPlan.tabs.references" },
  { value: "history", labelKey: "businessData.samplingPlan.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.samplingPlan.sections.details",
  "businessData.samplingPlan.sections.context",
  "businessData.samplingPlan.sections.instances",
  "businessData.samplingPlan.sections.steps",
  "businessData.samplingPlan.sections.attributes",
  "businessData.samplingPlan.sections.attachments",
];

const DLG = {
  edit: "edit",
  clone: "clone",
  terminate: "terminate",
  unterminate: "unterminate",
  manageInstance: "manageInstance",
} as const;

const CLONE_TITLE: TranslationKey = "businessData.samplingPlan.dialogs.clone.title";
const CLONE: TranslationKey = "businessData.samplingPlan.dialogs.clone.clone";

interface SamplingPlanDetailPageProps {
  name: string;
}

export function SamplingPlanDetailPage({ name }: SamplingPlanDetailPageProps) {
  const { t } = useAppTranslation();
  const { data, isLoading } = useSamplingPlanDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.samplingPlan.sections.details");
  const handleLeft = (value: TranslationKey) => setLeft(value);
  const [dialog, setDialog] = useState<string | null>(null);
  const close = () => setDialog(null);
  const open = (key: string) => () => setDialog(key);
  const dlg = (key: string) => dialog === key;

  const isTerminated = data?.state === RecordState.Terminated;
  const mk = "businessData.samplingPlan.more";

  const moreActions: DetailShellMoreAction[] = [
    { label: t(`${mk}.clone`), onClick: open(DLG.clone) },
    ...(isTerminated
      ? [{ label: t(`${mk}.unterminate`), onClick: open(DLG.unterminate) }]
      : [{ label: t(`${mk}.terminate`), onClick: open(DLG.terminate) }]),
    { label: t(`${mk}.manageInstance`), onClick: open(DLG.manageInstance) },
  ];

  if (isLoading || data === undefined) {
    return null;
  }

  const stateLabel =
    data.state === RecordState.Active ? t("common.active") : t("common.terminated");

  let content;
  if (top !== "details" || left !== "businessData.samplingPlan.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.samplingPlan.sections.empty")}</Body1Strong>
          <Caption1>{t("businessData.samplingPlan.sections.emptyBody")}</Caption1>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <CardGrid>
        <Card title={t("businessData.samplingPlan.cards.samplingPlan")}>
          <KV
            rows={[
              [t("businessData.samplingPlan.details.name"), data.name],
              [t("businessData.samplingPlan.details.description"), data.description],
              [t("businessData.samplingPlan.details.type"), data.type],
              [t("businessData.samplingPlan.details.state"), stateLabel],
              [t("businessData.samplingPlan.details.dataGroup"), data.dataGroup],
            ]}
          />
        </Card>
        <Card title={t("businessData.samplingPlan.cards.defaultSampling")}>
          <KV
            rows={[
              [
                t("businessData.samplingPlan.details.defaultSamplingType"),
                data.defaultSamplingType,
              ],
              [
                t("businessData.samplingPlan.details.counterFrequency"),
                String(data.counterFrequency),
              ],
              [t("businessData.samplingPlan.details.timeFrequency"), `${data.timeFrequency} h`],
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
      <SamplingPlanFormDialog
        open={dlg(DLG.edit)}
        onClose={close}
        title={t("businessData.samplingPlan.dialogs.form.editTitle")}
        initial={data}
        nameReadOnly
        submitLabel={t("common.save")}
      />
      <ConfirmOperationDialog
        open={dlg(DLG.clone)}
        onClose={close}
        title={t(CLONE_TITLE)}
        message={t("businessData.samplingPlan.dialogs.clone.message", { name: data.name })}
        confirmLabel={t(CLONE)}
      />
      <ConfirmOperationDialog
        open={dlg(DLG.terminate)}
        onClose={close}
        title={t("businessData.samplingPlan.dialogs.terminate.title")}
        message={t("businessData.samplingPlan.dialogs.terminate.message", { name: data.name })}
        confirmLabel={t("businessData.samplingPlan.dialogs.terminate.confirm")}
      />
      <ConfirmOperationDialog
        open={dlg(DLG.unterminate)}
        onClose={close}
        title={t("businessData.samplingPlan.dialogs.unterminate.title")}
        message={t("businessData.samplingPlan.dialogs.unterminate.message", { name: data.name })}
        confirmLabel={t("businessData.samplingPlan.dialogs.unterminate.confirm")}
      />
      <ManageSamplingPlanInstanceDialog
        open={dlg(DLG.manageInstance)}
        onClose={close}
        planName={data.name}
      />
    </>
  );
}
