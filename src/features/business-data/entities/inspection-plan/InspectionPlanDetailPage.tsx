import { useState } from "react";
import { useInspectionPlanDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { TableSimple24Regular } from "@/components/icons";
import { Text, Button } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useBooleanLabel } from "../propertyLabels";
import { InspectionPlanDialog } from "./InspectionPlanDialog";
import { InspectionPlanTerminateDialog } from "./InspectionPlanTerminateDialog";
import { ManageConfigurationsDialog, ManageStepsDialog } from "./ManageInspectionPlanDialogs";
import { MODE_CLONE, MODE_EDIT, TERMINATE, UNTERMINATE } from "./wizardMode";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "compare", labelKey: "businessData.inspectionPlan.tabs.compare" },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  "businessData.inspectionPlan.sections.details",
  "businessData.inspectionPlan.sections.steps",
  "businessData.inspectionPlan.sections.configurations",
  "businessData.inspectionPlan.sections.instances",
  "businessData.inspectionPlan.sections.attachments",
];

export function InspectionPlanDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.inspectionPlan.sections.details");
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [manageConfigurationsOpen, setManageConfigurationsOpen] = useState(false);
  const [manageStepsOpen, setManageStepsOpen] = useState(false);
  const { data, isLoading } = useInspectionPlanDetail(name);
  const booleanLabel = useBooleanLabel();

  const shell = (content: React.ReactNode) => (
    <>
      <DetailShell
        title={name}
        icon={<TableSimple24Regular />}
        topTabs={TOP_TABS}
        top={top}
        onTop={setTop}
        leftItems={LEFT_ITEMS}
        left={left}
        onLeft={setLeft}
        onEdit={() => setEditOpen(true)}
        onClone={() => setCloneOpen(true)}
        onTerminate={() => setTerminateOpen(true)}
        onUnterminate={() => setUnterminateOpen(true)}
        onAskAi={() => undefined}
      >
        {content}
      </DetailShell>
      {editOpen && (
        <InspectionPlanDialog
          mode={MODE_EDIT}
          initialName={name}
          onClose={() => setEditOpen(false)}
        />
      )}
      {cloneOpen && (
        <InspectionPlanDialog
          mode={MODE_CLONE}
          initialName={`${name} (Copy)`}
          onClose={() => setCloneOpen(false)}
        />
      )}
      {terminateOpen && (
        <InspectionPlanTerminateDialog
          name={name}
          mode={TERMINATE}
          onClose={() => setTerminateOpen(false)}
        />
      )}
      {unterminateOpen && (
        <InspectionPlanTerminateDialog
          name={name}
          mode={UNTERMINATE}
          onClose={() => setUnterminateOpen(false)}
        />
      )}
      {manageConfigurationsOpen && (
        <ManageConfigurationsDialog
          name={name}
          onClose={() => setManageConfigurationsOpen(false)}
        />
      )}
      {manageStepsOpen && (
        <ManageStepsDialog name={name} onClose={() => setManageStepsOpen(false)} />
      )}
    </>
  );

  if (isLoading || !data) {
    return shell(
      <Empty>
        <Text>{t("businessData.inspectionPlan.sections.emptyBody")}</Text>
      </Empty>,
    );
  }

  if (top !== "details" || left !== "businessData.inspectionPlan.sections.details") {
    return shell(
      <Empty>
        <Text>{t("businessData.inspectionPlan.sections.empty")}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t("businessData.inspectionPlan.sections.inspectionPlan")}>
        <KV
          rows={[
            [t("businessData.inspectionPlan.details.name"), data.name],
            [t("businessData.inspectionPlan.details.description"), data.description],
            [t("businessData.inspectionPlan.details.type"), data.type],
            [t("businessData.inspectionPlan.details.state"), data.state],
            [t("businessData.inspectionPlan.details.dataGroup"), data.dataGroup],
          ]}
        />
      </Card>
      <Card title={t("businessData.inspectionPlan.sections.defaultInspection")}>
        <KV
          rows={[
            [
              t("businessData.inspectionPlan.details.resultsRequiredBeforeTrackOut"),
              booleanLabel(data.resultsRequiredBeforeTrackOut),
            ],
            [
              t("businessData.inspectionPlan.details.enableMultipleSamples"),
              booleanLabel(data.enableMultipleSamples),
            ],
            [
              t("businessData.inspectionPlan.details.containsSeparateInspectionSteps"),
              booleanLabel(data.containsSeparateInspectionSteps),
            ],
          ]}
        />
      </Card>
      <Card title={t("businessData.inspectionPlan.sections.inspectionSettings")}>
        <KV
          rows={[
            [
              t("businessData.inspectionPlan.details.closeAutomaticallyOnPass"),
              booleanLabel(data.closeAutomaticallyOnPass),
            ],
            [
              t("businessData.inspectionPlan.details.closeAutomaticallyOnFail"),
              booleanLabel(data.closeAutomaticallyOnFail),
            ],
            [
              t("businessData.inspectionPlan.details.openProtocolOnFail"),
              booleanLabel(data.openProtocolOnFail),
            ],
            [t("businessData.inspectionPlan.details.protocol"), data.protocol],
            [
              t("businessData.inspectionPlan.details.futureHoldCreationMode"),
              data.futureHoldCreationMode,
            ],
            [
              t("businessData.inspectionPlan.details.setHoldOnFail"),
              booleanLabel(data.setHoldOnFail),
            ],
          ]}
        />
        <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
          <Button onClick={() => setManageConfigurationsOpen(true)}>
            {t("businessData.inspectionPlan.manageConfigurations.manage")}
          </Button>
          <Button onClick={() => setManageStepsOpen(true)}>
            {t("businessData.inspectionPlan.manageSteps.manage")}
          </Button>
        </div>
      </Card>
      <Card title={t("businessData.inspectionPlan.sections.futureHoldInformation")}>
        <KV
          rows={[
            [t("businessData.inspectionPlan.details.step"), data.futureHoldStep],
            [t("businessData.inspectionPlan.details.reason"), data.futureHoldReason],
            [t("businessData.inspectionPlan.details.releaseRole"), data.futureHoldReleaseRole],
            [t("businessData.inspectionPlan.details.comment"), data.futureHoldComment],
            [
              t("businessData.inspectionPlan.details.distributionList"),
              data.futureHoldDistributionList,
            ],
          ]}
        />
      </Card>
      <Card title={t("businessData.inspectionPlan.sections.holdInformation")}>
        <KV
          rows={[
            [t("businessData.inspectionPlan.details.reason"), data.holdReason],
            [t("businessData.inspectionPlan.details.releaseRole"), data.holdReleaseRole],
            [t("businessData.inspectionPlan.details.comment"), data.holdComment],
          ]}
        />
      </Card>
    </CardGrid>,
  );
}
