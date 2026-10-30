import { useState } from "react";
import { useReasonDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailShellMoreAction, DetailTab } from "@/components/common";
import { Trophy20Regular } from "@/components/icons";
import { Body1Strong, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { RecordState } from "@/lib/recordState";
import { ConfirmOperationDialog } from "../qualification/dialogs/ConfirmOperationDialog";
import { AddImagesDialog } from "./dialogs/AddImagesDialog";
import { CloneReasonDialog } from "./dialogs/CloneReasonDialog";
import { ManageRepairActionsDialog } from "./dialogs/ManageRepairActionsDialog";
import { ReasonFormDialog } from "./dialogs/ReasonFormDialog";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.reason.tabs.details" },
  { value: "contexts", labelKey: "businessData.reason.tabs.contexts" },
  { value: "references", labelKey: "businessData.reason.tabs.references" },
  { value: "history", labelKey: "businessData.reason.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.reason.sections.details",
  "businessData.reason.sections.images",
  "businessData.reason.sections.attributes",
  "businessData.reason.sections.attachments",
];

interface ReasonDetailPageProps {
  name: string;
}

export function ReasonDetailPage({ name }: ReasonDetailPageProps) {
  const { t } = useAppTranslation();
  const { data, isLoading } = useReasonDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.reason.sections.details");
  const handleLeft = (value: TranslationKey) => setLeft(value);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [addImagesOpen, setAddImagesOpen] = useState(false);
  const [repairActionsOpen, setRepairActionsOpen] = useState(false);

  const isTerminated = data?.state === RecordState.Terminated;
  const isDefect = data?.type === "Defect";
  const mk = "businessData.reason.more";

  const moreActions: DetailShellMoreAction[] = [
    { label: t(`${mk}.clone`), onClick: () => setCloneOpen(true) },
    ...(isTerminated
      ? [{ label: t(`${mk}.unterminate`), onClick: () => setUnterminateOpen(true) }]
      : [{ label: t(`${mk}.terminate`), onClick: () => setTerminateOpen(true) }]),
    { label: t(`${mk}.addImages`), onClick: () => setAddImagesOpen(true) },
    ...(isDefect
      ? [{ label: t(`${mk}.manageRepairActions`), onClick: () => setRepairActionsOpen(true) }]
      : []),
  ];

  if (isLoading || data === undefined) {
    return null;
  }

  const yesNo = (value: boolean) => (value ? t("common.yes") : t("common.no"));
  const stateLabel =
    data.state === RecordState.Active ? t("common.active") : t("common.terminated");

  let content;
  if (top !== "details" || left !== "businessData.reason.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.reason.sections.empty")}</Body1Strong>
          <Caption1>{t("businessData.reason.sections.emptyBody")}</Caption1>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <CardGrid>
        <Card title={t("businessData.reason.cards.reason")}>
          <KV
            rows={[
              [t("businessData.reason.details.name"), data.name],
              [t("businessData.reason.details.description"), data.description],
              [t("businessData.reason.details.state"), stateLabel],
              [t("businessData.reason.details.dataGroup"), data.dataGroup],
            ]}
          />
        </Card>
        <Card title={t("businessData.reason.cards.information")}>
          <KV
            rows={[
              [t("businessData.reason.details.type"), data.type],
              [
                t("businessData.reason.details.excludeFromStepYield"),
                yesNo(data.excludeFromStepYield),
              ],
              [
                t("businessData.reason.details.excludeFromResourceYield"),
                yesNo(data.excludeFromResourceYield),
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
        icon={<Trophy20Regular />}
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
      <ReasonFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={t("businessData.reason.dialogs.form.editTitle")}
        initial={data}
        nameReadOnly
        submitLabel={t("common.save")}
      />
      <CloneReasonDialog
        open={cloneOpen}
        onClose={() => setCloneOpen(false)}
        sourceName={data.name}
        sourceType={data.type}
      />
      <ConfirmOperationDialog
        open={terminateOpen}
        onClose={() => setTerminateOpen(false)}
        title={t("businessData.reason.dialogs.terminate.title")}
        message={t("businessData.reason.dialogs.terminate.message", { name: data.name })}
        confirmLabel={t("businessData.reason.dialogs.terminate.confirm")}
      />
      <ConfirmOperationDialog
        open={unterminateOpen}
        onClose={() => setUnterminateOpen(false)}
        title={t("businessData.reason.dialogs.unterminate.title")}
        message={t("businessData.reason.dialogs.unterminate.message", { name: data.name })}
        confirmLabel={t("businessData.reason.dialogs.unterminate.confirm")}
      />
      <AddImagesDialog
        open={addImagesOpen}
        onClose={() => setAddImagesOpen(false)}
        reasonName={data.name}
      />
      <ManageRepairActionsDialog
        open={repairActionsOpen}
        onClose={() => setRepairActionsOpen(false)}
        reasonName={data.name}
        reasonType={data.type}
      />
    </>
  );
}
