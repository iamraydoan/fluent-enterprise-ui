import { useState } from "react";
import { usePlanDetail } from "@/api";
import type { DetailMoreMenuItem, DetailTab } from "@/components/common";
import { DetailShell, KV } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import {
  AdjustPlanTargetsDialog,
  ClonePlanDialog,
  CreatePlanDialog,
  CreatePlanScenarioDialog,
  EditPlanDialog,
  ManageExcludedMaterialTypesDialog,
  ManagePlanItemsDialog,
  ManagePlanStepsDialog,
  ReleasePlanScenarioDialog,
  SynchronizeScenarioDialog,
  TerminatePlanDialog,
} from "./PlanDialogs";

const useStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
  sectionTitle: { marginBottom: "8px" },
});

export function PlanDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const shared = useSharedStyles();
  const { data: detail } = usePlanDetail(name);

  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.plan.left.details");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [adjustTargetsOpen, setAdjustTargetsOpen] = useState(false);
  const [manageItemsOpen, setManageItemsOpen] = useState(false);
  const [manageStepsOpen, setManageStepsOpen] = useState(false);
  const [manageExcludedOpen, setManageExcludedOpen] = useState(false);
  const [createScenarioOpen, setCreateScenarioOpen] = useState(false);
  const [releaseScenarioOpen, setReleaseScenarioOpen] = useState(false);
  const [syncScenarioOpen, setSyncScenarioOpen] = useState(false);

  if (!detail) {
    return <Text>{t("businessData.plan.pageLabel")}</Text>;
  }

  const topTabs: DetailTab[] = [
    { value: "details", labelKey: "businessData.plan.tabs.details" },
    { value: "references", labelKey: "businessData.plan.tabs.references" },
    { value: "history", labelKey: "businessData.plan.tabs.history" },
  ];

  const leftItems: TranslationKey[] = [
    "businessData.plan.left.details",
    "businessData.plan.left.items",
    "businessData.plan.left.steps",
    "businessData.plan.left.timeFrames",
    "businessData.plan.left.scenarios",
    "businessData.plan.left.attachments",
  ];

  const moreMenuItems: DetailMoreMenuItem[] = [
    {
      key: "adjustTargets",
      labelKey: "businessData.plan.operations.adjustTargets.title",
      onClick: () => setAdjustTargetsOpen(true),
    },
    {
      key: "manageItems",
      labelKey: "businessData.plan.operations.manageItems.title",
      onClick: () => setManageItemsOpen(true),
    },
    {
      key: "manageSteps",
      labelKey: "businessData.plan.operations.manageSteps.title",
      onClick: () => setManageStepsOpen(true),
    },
    {
      key: "manageExcluded",
      labelKey: "businessData.plan.operations.manageExcludedTypes.title",
      onClick: () => setManageExcludedOpen(true),
    },
    {
      key: "createScenario",
      labelKey: "businessData.plan.operations.createScenario.title",
      onClick: () => setCreateScenarioOpen(true),
    },
    {
      key: "releaseScenario",
      labelKey: "businessData.plan.operations.releaseScenario.title",
      onClick: () => setReleaseScenarioOpen(true),
    },
    {
      key: "syncScenario",
      labelKey: "businessData.plan.operations.synchronizeScenario.title",
      onClick: () => setSyncScenarioOpen(true),
    },
    {
      key: "clone",
      labelKey: "businessData.plan.operations.clone.title",
      onClick: () => setCloneOpen(true),
    },
    {
      key: "terminate",
      labelKey: "businessData.plan.operations.terminate.title",
      onClick: () => setTerminateOpen(true),
    },
  ];

  return (
    <>
      <DetailShell
        title={detail.name}
        icon={<Box24Regular />}
        topTabs={topTabs}
        top={top}
        onTop={setTop}
        leftItems={leftItems}
        left={left}
        onLeft={setLeft}
        onEdit={() => setEditOpen(true)}
        onAskAi={() => undefined}
        showState={false}
        moreActions={moreMenuItems}
      >
        <div className={styles.cards}>
          <div className={shared.contentCard} style={{ padding: "14px 16px" }}>
            <Text weight="semibold" size={400} className={styles.sectionTitle}>
              {t("businessData.plan.detail.generalData")}
            </Text>
            <KV
              rows={[
                [t("businessData.plan.detail.fields.name"), detail.name],
                [t("businessData.plan.detail.fields.description"), detail.description],
                [t("businessData.plan.detail.fields.type"), detail.type],
                [t("businessData.plan.detail.fields.state"), detail.state],
                [t("businessData.plan.detail.fields.startDate"), detail.startDate],
              ]}
            />
          </div>
        </div>
      </DetailShell>
      <CreatePlanDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditPlanDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialName={detail.name}
      />
      <ClonePlanDialog open={cloneOpen} onClose={() => setCloneOpen(false)} />
      <TerminatePlanDialog open={terminateOpen} onClose={() => setTerminateOpen(false)} />
      <AdjustPlanTargetsDialog
        open={adjustTargetsOpen}
        onClose={() => setAdjustTargetsOpen(false)}
      />
      <ManagePlanItemsDialog open={manageItemsOpen} onClose={() => setManageItemsOpen(false)} />
      <ManagePlanStepsDialog open={manageStepsOpen} onClose={() => setManageStepsOpen(false)} />
      <ManageExcludedMaterialTypesDialog
        open={manageExcludedOpen}
        onClose={() => setManageExcludedOpen(false)}
      />
      <CreatePlanScenarioDialog
        open={createScenarioOpen}
        onClose={() => setCreateScenarioOpen(false)}
      />
      <ReleasePlanScenarioDialog
        open={releaseScenarioOpen}
        onClose={() => setReleaseScenarioOpen(false)}
      />
      <SynchronizeScenarioDialog
        open={syncScenarioOpen}
        onClose={() => setSyncScenarioOpen(false)}
      />
    </>
  );
}
