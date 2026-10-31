import { useState } from "react";
import { useProductionOrderDetail } from "@/api";
import type { DetailMoreMenuItem, DetailTab } from "@/components/common";
import { DetailShell, KV } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import {
  AssignMaterialsDialog,
  CancelProductionOrderDialog,
  ChangeProductQuantityDialog,
  CloneProductionOrderDialog,
  CloseProductionOrderDialog,
  CreateMaterialForOrderDialog,
  CreateProductionOrderDialog,
  EditProductionOrderDialog,
  ManageStepsDialog,
  ReassignMaterialsDialog,
  ReleaseProductionOrderDialog,
  ReopenProductionOrderDialog,
  RestrictProductionOrderDialog,
  StartProductionOrderDialog,
  SynchronizeStepsDialog,
  TerminateProductionOrderDialog,
  UnreleaseProductionOrderDialog,
  UnrestrictProductionOrderDialog,
  UnterminateProductionOrderDialog,
} from "./ProductionOrderDialogs";

const useStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
  sectionTitle: { marginBottom: "8px" },
});

export function ProductionOrderDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const shared = useSharedStyles();
  const { data: detail } = useProductionOrderDetail(name);

  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.productionOrder.left.details");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [unreleaseOpen, setUnreleaseOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [reopenOpen, setReopenOpen] = useState(false);
  const [restrictOpen, setRestrictOpen] = useState(false);
  const [unrestrictOpen, setUnrestrictOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [createMaterialOpen, setCreateMaterialOpen] = useState(false);
  const [changePQOpen, setChangePQOpen] = useState(false);
  const [manageStepsOpen, setManageStepsOpen] = useState(false);
  const [syncStepsOpen, setSyncStepsOpen] = useState(false);

  if (!detail) {
    return <Text>{t("businessData.productionOrder.pageLabel")}</Text>;
  }

  const isTerminated = detail.state === "Terminated";

  const topTabs: DetailTab[] = [
    { value: "details", labelKey: "businessData.productionOrder.tabs.details" },
    { value: "references", labelKey: "businessData.productionOrder.tabs.references" },
    { value: "history", labelKey: "businessData.productionOrder.tabs.history" },
  ];

  const leftItems: TranslationKey[] = [
    "businessData.productionOrder.left.details",
    "businessData.productionOrder.left.materials",
    "businessData.productionOrder.left.steps",
    "businessData.productionOrder.left.attachments",
  ];

  const terminateItem: DetailMoreMenuItem = isTerminated
    ? {
        key: "unterminate",
        labelKey: "businessData.productionOrder.operations.unterminate.title",
        onClick: () => setUnterminateOpen(true),
      }
    : {
        key: "terminate",
        labelKey: "businessData.productionOrder.operations.terminate.title",
        onClick: () => setTerminateOpen(true),
      };

  const moreMenuItems: DetailMoreMenuItem[] = [
    {
      key: "release",
      labelKey: "businessData.productionOrder.operations.release.title",
      onClick: () => setReleaseOpen(true),
    },
    {
      key: "start",
      labelKey: "businessData.productionOrder.operations.start.title",
      onClick: () => setStartOpen(true),
    },
    {
      key: "close",
      labelKey: "businessData.productionOrder.operations.close.title",
      onClick: () => setCloseOpen(true),
    },
    {
      key: "reopen",
      labelKey: "businessData.productionOrder.operations.reopen.title",
      onClick: () => setReopenOpen(true),
    },
    {
      key: "cancel",
      labelKey: "businessData.productionOrder.operations.cancel.title",
      onClick: () => setCancelOpen(true),
    },
    {
      key: "assignMaterials",
      labelKey: "businessData.productionOrder.operations.assignMaterials.title",
      onClick: () => setAssignOpen(true),
    },
    {
      key: "createMaterial",
      labelKey: "businessData.productionOrder.operations.createMaterial.title",
      onClick: () => setCreateMaterialOpen(true),
    },
    {
      key: "manageSteps",
      labelKey: "businessData.productionOrder.operations.manageSteps.title",
      onClick: () => setManageStepsOpen(true),
    },
    {
      key: "clone",
      labelKey: "businessData.productionOrder.operations.clone.title",
      onClick: () => setCloneOpen(true),
    },
    terminateItem,
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
        moreMenuItems={moreMenuItems}
      >
        <div className={styles.cards}>
          <div className={shared.contentCard} style={{ padding: "14px 16px" }}>
            <Text weight="semibold" size={400} className={styles.sectionTitle}>
              {t("businessData.productionOrder.detail.generalData")}
            </Text>
            <KV
              rows={[
                [t("businessData.productionOrder.detail.fields.name"), detail.name],
                [t("businessData.productionOrder.detail.fields.description"), detail.description],
                [t("businessData.productionOrder.detail.fields.product"), detail.product],
                [t("businessData.productionOrder.detail.fields.quantity"), detail.quantity],
                [t("businessData.productionOrder.detail.fields.state"), detail.state],
                [t("businessData.productionOrder.detail.fields.priority"), detail.priority],
              ]}
            />
          </div>
        </div>
      </DetailShell>
      <CreateProductionOrderDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditProductionOrderDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialName={detail.name}
      />
      <CloneProductionOrderDialog open={cloneOpen} onClose={() => setCloneOpen(false)} />
      <TerminateProductionOrderDialog
        open={terminateOpen}
        onClose={() => setTerminateOpen(false)}
      />
      <UnterminateProductionOrderDialog
        open={unterminateOpen}
        onClose={() => setUnterminateOpen(false)}
      />
      <ReleaseProductionOrderDialog open={releaseOpen} onClose={() => setReleaseOpen(false)} />
      <UnreleaseProductionOrderDialog
        open={unreleaseOpen}
        onClose={() => setUnreleaseOpen(false)}
      />
      <StartProductionOrderDialog open={startOpen} onClose={() => setStartOpen(false)} />
      <CancelProductionOrderDialog open={cancelOpen} onClose={() => setCancelOpen(false)} />
      <CloseProductionOrderDialog open={closeOpen} onClose={() => setCloseOpen(false)} />
      <ReopenProductionOrderDialog open={reopenOpen} onClose={() => setReopenOpen(false)} />
      <RestrictProductionOrderDialog open={restrictOpen} onClose={() => setRestrictOpen(false)} />
      <UnrestrictProductionOrderDialog
        open={unrestrictOpen}
        onClose={() => setUnrestrictOpen(false)}
      />
      <AssignMaterialsDialog open={assignOpen} onClose={() => setAssignOpen(false)} />
      <ReassignMaterialsDialog open={reassignOpen} onClose={() => setReassignOpen(false)} />
      <CreateMaterialForOrderDialog
        open={createMaterialOpen}
        onClose={() => setCreateMaterialOpen(false)}
      />
      <ChangeProductQuantityDialog open={changePQOpen} onClose={() => setChangePQOpen(false)} />
      <ManageStepsDialog open={manageStepsOpen} onClose={() => setManageStepsOpen(false)} />
      <SynchronizeStepsDialog open={syncStepsOpen} onClose={() => setSyncStepsOpen(false)} />
    </>
  );
}
