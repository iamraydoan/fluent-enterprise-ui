import { useState } from "react";
import { useSamplingPatternDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailShellMoreAction, DetailTab } from "@/components/common";
import { Wrench20Regular } from "@/components/icons";
import { Body1Strong, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { RecordState } from "@/lib/recordState";
import { ConfirmOperationDialog } from "../qualification/dialogs/ConfirmOperationDialog";
import { CloneSamplingPatternDialog } from "./dialogs/CloneSamplingPatternDialog";
import { SamplingPatternFormDialog } from "./dialogs/SamplingPatternFormDialog";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.samplingPattern.tabs.details" },
  { value: "references", labelKey: "businessData.samplingPattern.tabs.references" },
  { value: "history", labelKey: "businessData.samplingPattern.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.samplingPattern.sections.details",
  "businessData.samplingPattern.sections.attributes",
  "businessData.samplingPattern.sections.attachments",
];

const DLG = {
  edit: "edit",
  clone: "clone",
  terminate: "terminate",
  unterminate: "unterminate",
} as const;

interface SamplingPatternDetailPageProps {
  name: string;
}

export function SamplingPatternDetailPage({ name }: SamplingPatternDetailPageProps) {
  const { t } = useAppTranslation();
  const { data, isLoading } = useSamplingPatternDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.samplingPattern.sections.details");
  const handleLeft = (value: TranslationKey) => setLeft(value);
  const [dialog, setDialog] = useState<string | null>(null);
  const close = () => setDialog(null);
  const open = (key: string) => () => setDialog(key);
  const dlg = (key: string) => dialog === key;

  const isTerminated = data?.state === RecordState.Terminated;
  const mk = "businessData.samplingPattern.more";

  const moreActions: DetailShellMoreAction[] = [
    { label: t(`${mk}.clone`), onClick: open(DLG.clone) },
    ...(isTerminated
      ? [{ label: t(`${mk}.unterminate`), onClick: open(DLG.unterminate) }]
      : [{ label: t(`${mk}.terminate`), onClick: open(DLG.terminate) }]),
  ];

  if (isLoading || data === undefined) {
    return null;
  }

  const stateLabel =
    data.state === RecordState.Active ? t("common.active") : t("common.terminated");

  let content;
  if (top !== "details" || left !== "businessData.samplingPattern.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.samplingPattern.sections.empty")}</Body1Strong>
          <Caption1>{t("businessData.samplingPattern.sections.emptyBody")}</Caption1>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <CardGrid>
        <Card title={t("businessData.samplingPattern.cards.samplingPattern")}>
          <KV
            rows={[
              [t("businessData.samplingPattern.details.name"), data.name],
              [t("businessData.samplingPattern.details.description"), data.description],
              [t("businessData.samplingPattern.details.type"), data.type],
              [t("businessData.samplingPattern.details.mode"), data.mode],
              [t("businessData.samplingPattern.details.state"), stateLabel],
              [t("businessData.samplingPattern.details.dataGroup"), data.dataGroup],
            ]}
          />
        </Card>
        <Card title={t("businessData.samplingPattern.cards.configuration")}>
          <KV
            rows={[
              [t("businessData.samplingPattern.details.samplingSelection"), data.samplingSelection],
              [t("businessData.samplingPattern.details.rule"), data.rule],
              [t("businessData.samplingPattern.details.sourceForm"), data.sourceForm],
              [t("businessData.samplingPattern.details.materialCount"), String(data.materialCount)],
              [t("businessData.samplingPattern.details.selectionMethod"), data.selectionMethod],
              [t("businessData.samplingPattern.details.sequencingMethod"), data.sequencingMethod],
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
      <SamplingPatternFormDialog
        open={dlg(DLG.edit)}
        onClose={close}
        title={t("businessData.samplingPattern.dialogs.form.editTitle")}
        initial={data}
        nameReadOnly
        submitLabel={t("common.save")}
      />
      <CloneSamplingPatternDialog open={dlg(DLG.clone)} onClose={close} sourceName={data.name} />
      <ConfirmOperationDialog
        open={dlg(DLG.terminate)}
        onClose={close}
        title={t("businessData.samplingPattern.dialogs.terminate.title")}
        message={t("businessData.samplingPattern.dialogs.terminate.message", { name: data.name })}
        confirmLabel={t("businessData.samplingPattern.dialogs.terminate.confirm")}
      />
      <ConfirmOperationDialog
        open={dlg(DLG.unterminate)}
        onClose={close}
        title={t("businessData.samplingPattern.dialogs.unterminate.title")}
        message={t("businessData.samplingPattern.dialogs.unterminate.message", { name: data.name })}
        confirmLabel={t("businessData.samplingPattern.dialogs.unterminate.confirm")}
      />
    </>
  );
}
