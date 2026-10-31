import { useState } from "react";
import { useProtocolDetail } from "@/api";
import type { DetailMoreMenuItem, DetailTab } from "@/components/common";
import { DetailShell, KV } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import {
  ChangeInstanceStateDialog,
  CloneProtocolDialog,
  CloseProtocolInstanceDialog,
  CreateProtocolDialog,
  EditProtocolDialog,
  ExceptionManagementRulesDialog,
  ManageInstanceMaterialsDialog,
  OpenProtocolInstanceDialog,
  PerformProtocolInstanceDialog,
  TakeInstanceOwnershipDialog,
  TerminateInstanceDialog,
  TerminateProtocolDialog,
  UnterminateProtocolDialog,
  ViewInstanceReportsDialog,
} from "./ProtocolDialogs";

const useStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
  sectionTitle: { marginBottom: "8px" },
});

export function ProtocolDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const shared = useSharedStyles();
  const { data: detail } = useProtocolDetail(name);

  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.protocol.left.details");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [exceptionRulesOpen, setExceptionRulesOpen] = useState(false);
  const [openInstanceOpen, setOpenInstanceOpen] = useState(false);
  const [closeInstanceOpen, setCloseInstanceOpen] = useState(false);
  const [performInstanceOpen, setPerformInstanceOpen] = useState(false);
  const [takeOwnershipOpen, setTakeOwnershipOpen] = useState(false);
  const [terminateInstanceOpen, setTerminateInstanceOpen] = useState(false);
  const [changeStateOpen, setChangeStateOpen] = useState(false);
  const [manageMaterialsOpen, setManageMaterialsOpen] = useState(false);
  const [viewReportsOpen, setViewReportsOpen] = useState(false);

  if (!detail) {
    return <Text>{t("businessData.protocol.pageLabel")}</Text>;
  }

  const isTerminated = detail.state === "Terminated";

  const topTabs: DetailTab[] = [
    { value: "details", labelKey: "businessData.protocol.tabs.details" },
    { value: "references", labelKey: "businessData.protocol.tabs.references" },
    { value: "history", labelKey: "businessData.protocol.tabs.history" },
  ];

  const leftItems: TranslationKey[] = [
    "businessData.protocol.left.details",
    "businessData.protocol.left.parameters",
    "businessData.protocol.left.instances",
    "businessData.protocol.left.attachments",
  ];

  const terminateItem: DetailMoreMenuItem = isTerminated
    ? {
        key: "unterminate",
        labelKey: "businessData.protocol.operations.unterminate.title",
        onClick: () => setUnterminateOpen(true),
      }
    : {
        key: "terminate",
        labelKey: "businessData.protocol.operations.terminate.title",
        onClick: () => setTerminateOpen(true),
      };

  const moreMenuItems: DetailMoreMenuItem[] = [
    {
      key: "exceptionRules",
      labelKey: "businessData.protocol.operations.exceptionRules.title",
      onClick: () => setExceptionRulesOpen(true),
    },
    {
      key: "openInstance",
      labelKey: "businessData.protocol.operations.openInstance.title",
      onClick: () => setOpenInstanceOpen(true),
    },
    {
      key: "performInstance",
      labelKey: "businessData.protocol.operations.performInstance.title",
      onClick: () => setPerformInstanceOpen(true),
    },
    {
      key: "closeInstance",
      labelKey: "businessData.protocol.operations.closeInstance.title",
      onClick: () => setCloseInstanceOpen(true),
    },
    {
      key: "manageMaterials",
      labelKey: "businessData.protocol.operations.manageInstanceMaterials.title",
      onClick: () => setManageMaterialsOpen(true),
    },
    {
      key: "viewReports",
      labelKey: "businessData.protocol.operations.viewInstanceReports.title",
      onClick: () => setViewReportsOpen(true),
    },
    {
      key: "clone",
      labelKey: "businessData.protocol.operations.clone.title",
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
              {t("businessData.protocol.detail.generalData")}
            </Text>
            <KV
              rows={[
                [t("businessData.protocol.detail.fields.name"), detail.name],
                [t("businessData.protocol.detail.fields.description"), detail.description],
                [t("businessData.protocol.detail.fields.type"), detail.type],
                [t("businessData.protocol.detail.fields.state"), detail.state],
                [t("businessData.protocol.detail.fields.version"), detail.version],
              ]}
            />
          </div>
        </div>
      </DetailShell>
      <CreateProtocolDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditProtocolDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialName={detail.name}
      />
      <CloneProtocolDialog open={cloneOpen} onClose={() => setCloneOpen(false)} />
      <TerminateProtocolDialog open={terminateOpen} onClose={() => setTerminateOpen(false)} />
      <UnterminateProtocolDialog open={unterminateOpen} onClose={() => setUnterminateOpen(false)} />
      <ExceptionManagementRulesDialog
        open={exceptionRulesOpen}
        onClose={() => setExceptionRulesOpen(false)}
      />
      <OpenProtocolInstanceDialog
        open={openInstanceOpen}
        onClose={() => setOpenInstanceOpen(false)}
      />
      <CloseProtocolInstanceDialog
        open={closeInstanceOpen}
        onClose={() => setCloseInstanceOpen(false)}
      />
      <PerformProtocolInstanceDialog
        open={performInstanceOpen}
        onClose={() => setPerformInstanceOpen(false)}
      />
      <TakeInstanceOwnershipDialog
        open={takeOwnershipOpen}
        onClose={() => setTakeOwnershipOpen(false)}
      />
      <TerminateInstanceDialog
        open={terminateInstanceOpen}
        onClose={() => setTerminateInstanceOpen(false)}
      />
      <ChangeInstanceStateDialog open={changeStateOpen} onClose={() => setChangeStateOpen(false)} />
      <ManageInstanceMaterialsDialog
        open={manageMaterialsOpen}
        onClose={() => setManageMaterialsOpen(false)}
      />
      <ViewInstanceReportsDialog open={viewReportsOpen} onClose={() => setViewReportsOpen(false)} />
    </>
  );
}
