import { useState } from "react";
import { useQualificationDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailTab, DetailShellMoreAction } from "@/components/common";
import { Trophy20Regular } from "@/components/icons";
import { Body1Strong, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { RecordState } from "@/lib/recordState";
import { AssignEmployeesDialog } from "./dialogs/AssignEmployeesDialog";
import { CloneQualificationDialog } from "./dialogs/CloneQualificationDialog";
import { ConfirmOperationDialog } from "./dialogs/ConfirmOperationDialog";
import { QualificationFormDialog } from "./dialogs/QualificationFormDialog";
import { UnassignEmployeesDialog } from "./dialogs/UnassignEmployeesDialog";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.qualification.tabs.details" },
  { value: "references", labelKey: "businessData.qualification.tabs.references" },
  { value: "history", labelKey: "businessData.qualification.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.qualification.sections.details",
  "businessData.qualification.sections.employees",
  "businessData.qualification.sections.certifications",
  "businessData.qualification.sections.attachments",
];

interface QualificationDetailPageProps {
  name: string;
}

export function QualificationDetailPage({ name }: QualificationDetailPageProps) {
  const { t } = useAppTranslation();
  const { data, isLoading } = useQualificationDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.qualification.sections.details");
  const handleLeft = (value: TranslationKey) => setLeft(value);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [unassignOpen, setUnassignOpen] = useState(false);

  const isTerminated = data?.state === RecordState.Terminated;
  const mk = "businessData.qualification.more";

  const moreActions: DetailShellMoreAction[] = [
    { label: t(`${mk}.clone`), onClick: () => setCloneOpen(true) },
    ...(isTerminated
      ? [{ label: t(`${mk}.unterminate`), onClick: () => setUnterminateOpen(true) }]
      : [{ label: t(`${mk}.terminate`), onClick: () => setTerminateOpen(true) }]),
    { label: t(`${mk}.assignEmployees`), onClick: () => setAssignOpen(true) },
    { label: t(`${mk}.unassignEmployees`), onClick: () => setUnassignOpen(true) },
  ];

  if (isLoading || data === undefined) {
    return null;
  }

  const yesNo = (value: boolean) => (value ? t("common.yes") : t("common.no"));
  const stateLabel =
    data.state === RecordState.Active ? t("common.active") : t("common.terminated");

  let content;
  if (top !== "details" || left !== "businessData.qualification.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.qualification.sections.empty")}</Body1Strong>
          <Caption1>{t("businessData.qualification.sections.emptyBody")}</Caption1>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <CardGrid>
        <Card title={t("businessData.qualification.cards.qualification")}>
          <KV
            rows={[
              [t("businessData.qualification.details.name"), data.name],
              [t("businessData.qualification.details.description"), data.description],
              [t("businessData.qualification.details.type"), data.type],
              [t("businessData.qualification.details.state"), stateLabel],
              [t("businessData.qualification.details.dataGroup"), data.dataGroup],
            ]}
          />
        </Card>
        <Card title={t("businessData.qualification.cards.information")}>
          <KV
            rows={[
              [t("businessData.qualification.details.ownerRole"), data.ownerRole],
              [t("businessData.qualification.details.defaultReason"), data.defaultReason],
              [t("businessData.qualification.details.informationUrl"), data.informationUrl],
            ]}
          />
        </Card>
        <Card title={t("businessData.qualification.cards.permissions")}>
          <KV
            rows={[
              [
                t("businessData.qualification.details.allowSelfAssignment"),
                yesNo(data.allowSelfAssignment),
              ],
              [
                t("businessData.qualification.details.allowAssignmentByManager"),
                yesNo(data.allowAssignmentByManager),
              ],
            ]}
          />
        </Card>
        <Card title={t("businessData.qualification.cards.validityPeriod")}>
          <KV
            rows={[
              [t("businessData.qualification.details.validFor"), data.validFor],
              [t("businessData.qualification.details.allowOverride"), yesNo(data.allowOverride)],
            ]}
          />
        </Card>
        <Card title={t("businessData.qualification.cards.gracePeriod")}>
          <KV
            rows={[[t("businessData.qualification.details.duration"), data.gracePeriodDuration]]}
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
      <QualificationFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={t("businessData.qualification.dialogs.form.editTitle")}
        initial={data}
        nameReadOnly
        submitLabel={t("common.save")}
      />
      <CloneQualificationDialog
        open={cloneOpen}
        onClose={() => setCloneOpen(false)}
        sourceName={data.name}
        sourceType={data.type}
        sourceOwnerRole={data.ownerRole}
      />
      <ConfirmOperationDialog
        open={terminateOpen}
        onClose={() => setTerminateOpen(false)}
        title={t("businessData.qualification.dialogs.terminate.title")}
        message={t("businessData.qualification.dialogs.terminate.message", { name: data.name })}
        confirmLabel={t("businessData.qualification.dialogs.terminate.confirm")}
      />
      <ConfirmOperationDialog
        open={unterminateOpen}
        onClose={() => setUnterminateOpen(false)}
        title={t("businessData.qualification.dialogs.unterminate.title")}
        message={t("businessData.qualification.dialogs.unterminate.message", { name: data.name })}
        confirmLabel={t("businessData.qualification.dialogs.unterminate.confirm")}
      />
      <AssignEmployeesDialog
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        qualificationName={data.name}
      />
      <UnassignEmployeesDialog
        open={unassignOpen}
        onClose={() => setUnassignOpen(false)}
        qualificationName={data.name}
      />
    </>
  );
}
