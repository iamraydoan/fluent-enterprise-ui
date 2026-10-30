import { useState } from "react";
import { useQualificationCheckDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailShellMoreAction, DetailTab } from "@/components/common";
import { ShieldCheckmark20Regular } from "@/components/icons";
import { Body1Strong, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { RecordState } from "@/lib/recordState";
import { ConfirmOperationDialog } from "../qualification/dialogs/ConfirmOperationDialog";
import { CloneQualificationCheckDialog } from "./dialogs/CloneQualificationCheckDialog";
import { QualificationCheckFormDialog } from "./dialogs/QualificationCheckFormDialog";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.qualificationCheck.tabs.details" },
  { value: "compare", labelKey: "businessData.qualificationCheck.tabs.compare" },
  { value: "references", labelKey: "businessData.qualificationCheck.tabs.references" },
  { value: "history", labelKey: "businessData.qualificationCheck.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.qualificationCheck.sections.details",
  "businessData.qualificationCheck.sections.attachments",
];

interface QualificationCheckDetailPageProps {
  name: string;
}

export function QualificationCheckDetailPage({ name }: QualificationCheckDetailPageProps) {
  const { t } = useAppTranslation();
  const { data, isLoading } = useQualificationCheckDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>(
    "businessData.qualificationCheck.sections.details",
  );
  const handleLeft = (value: TranslationKey) => setLeft(value);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);

  const isTerminated = data?.state === RecordState.Terminated;
  const mk = "businessData.qualificationCheck.more";

  const moreActions: DetailShellMoreAction[] = [
    { label: t(`${mk}.clone`), onClick: () => setCloneOpen(true) },
    ...(isTerminated
      ? [{ label: t(`${mk}.unterminate`), onClick: () => setUnterminateOpen(true) }]
      : [{ label: t(`${mk}.terminate`), onClick: () => setTerminateOpen(true) }]),
  ];

  if (isLoading || data === undefined) {
    return null;
  }

  const stateLabel =
    data.state === RecordState.Active ? t("common.active") : t("common.terminated");

  let content;
  if (top !== "details" || left !== "businessData.qualificationCheck.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.qualificationCheck.sections.empty")}</Body1Strong>
          <Caption1>{t("businessData.qualificationCheck.sections.emptyBody")}</Caption1>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <CardGrid>
        <Card title={t("businessData.qualificationCheck.cards.qualificationCheck")}>
          <KV
            rows={[
              [t("businessData.qualificationCheck.details.name"), data.name],
              [t("businessData.qualificationCheck.details.description"), data.description],
              [t("businessData.qualificationCheck.details.state"), stateLabel],
              [t("businessData.qualificationCheck.details.dataGroup"), data.dataGroup],
            ]}
          />
        </Card>
        <Card title={t("businessData.qualificationCheck.cards.information")}>
          <KV
            rows={[
              [
                t("businessData.qualificationCheck.details.instanceType"),
                data.instanceType,
              ],
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
        icon={<ShieldCheckmark20Regular />}
        topTabs={TOP_TABS}
        top={top}
        onTop={setTop}
        leftItems={LEFT_SECTIONS}
        left={left}
        onLeft={handleLeft}
        onEdit={() => setEditOpen(true)}
        onAskAi={() => {}}
        moreActions={moreActions}
      >
        {content}
      </DetailShell>
      <QualificationCheckFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={t("businessData.qualificationCheck.dialogs.form.editTitle")}
        initial={data}
        nameReadOnly
        submitLabel={t("common.save")}
      />
      <CloneQualificationCheckDialog
        open={cloneOpen}
        onClose={() => setCloneOpen(false)}
        sourceName={data.name}
        sourceInstanceType={data.instanceType}
      />
      <ConfirmOperationDialog
        open={terminateOpen}
        onClose={() => setTerminateOpen(false)}
        title={t("businessData.qualificationCheck.dialogs.terminate.title")}
        message={t("businessData.qualificationCheck.dialogs.terminate.message", {
          name: data.name,
        })}
        confirmLabel={t("businessData.qualificationCheck.dialogs.terminate.confirm")}
      />
      <ConfirmOperationDialog
        open={unterminateOpen}
        onClose={() => setUnterminateOpen(false)}
        title={t("businessData.qualificationCheck.dialogs.unterminate.title")}
        message={t("businessData.qualificationCheck.dialogs.unterminate.message", {
          name: data.name,
        })}
        confirmLabel={t("businessData.qualificationCheck.dialogs.unterminate.confirm")}
      />
    </>
  );
}
