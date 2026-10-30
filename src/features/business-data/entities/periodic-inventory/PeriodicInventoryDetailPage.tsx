import { useState } from "react";
import { usePeriodicInventoryDetail } from "@/api";
import type { DetailMoreMenuItem } from "@/components/common";
import { DetailShell, KV } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import {
  BeginPeriodicInventoryDialog,
  CancelPeriodicInventoryDialog,
  ClonePeriodicInventoryDialog,
  CompletePeriodicInventoryDialog,
  EditPeriodicInventoryDialog,
  PerformPeriodicInventoryDialog,
  PeriodicInventoryReportDialog,
  TakeOwnershipPeriodicInventoryDialog,
  TerminatePeriodicInventoryDialog,
  UnterminatePeriodicInventoryDialog,
} from "./PeriodicInventoryOperations";

const useStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
  sectionTitle: { marginBottom: "8px" },
});

export function PeriodicInventoryDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const shared = useSharedStyles();
  const { data: detail } = usePeriodicInventoryDetail(name);

  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.periodicInventory.left.details");
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [beginOpen, setBeginOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [performOpen, setPerformOpen] = useState(false);
  const [takeOwnershipOpen, setTakeOwnershipOpen] = useState(false);
  const [viewReportOpen, setViewReportOpen] = useState(false);

  if (!detail) {
    return <Text>{t("businessData.periodicInventory.pageLabel")}</Text>;
  }

  const isTerminated = detail.state === "Terminated";

  const topTabs = [
    { value: "details", labelKey: "businessData.periodicInventory.tabs.details" as TranslationKey },
    { value: "references", labelKey: "businessData.periodicInventory.tabs.references" as TranslationKey },
    { value: "history", labelKey: "businessData.periodicInventory.tabs.history" as TranslationKey },
  ];

  const leftItems: TranslationKey[] = [
    "businessData.periodicInventory.left.details",
    "businessData.periodicInventory.left.resources",
    "businessData.periodicInventory.left.materials",
    "businessData.periodicInventory.left.attachments",
  ];

  const moreMenuItems: DetailMoreMenuItem[] = [
    {
      key: "begin",
      labelKey: "businessData.periodicInventory.operations.begin.title" as TranslationKey,
      onClick: () => setBeginOpen(true),
    },
    {
      key: "perform",
      labelKey: "businessData.periodicInventory.operations.perform.title" as TranslationKey,
      onClick: () => setPerformOpen(true),
    },
    {
      key: "complete",
      labelKey: "businessData.periodicInventory.operations.complete.title" as TranslationKey,
      onClick: () => setCompleteOpen(true),
    },
    {
      key: "cancel",
      labelKey: "businessData.periodicInventory.operations.cancel.title" as TranslationKey,
      onClick: () => setCancelOpen(true),
    },
    {
      key: "takeOwnership",
      labelKey: "businessData.periodicInventory.operations.takeOwnership.title" as TranslationKey,
      onClick: () => setTakeOwnershipOpen(true),
    },
    {
      key: "viewReport",
      labelKey: "businessData.periodicInventory.operations.viewReport.title" as TranslationKey,
      onClick: () => setViewReportOpen(true),
    },
    {
      key: "clone",
      labelKey: "businessData.periodicInventory.operations.clone.title" as TranslationKey,
      onClick: () => setCloneOpen(true),
    },
    ...(isTerminated
      ? [
          {
            key: "unterminate",
            labelKey: "businessData.periodicInventory.operations.unterminate.title" as TranslationKey,
            onClick: () => setUnterminateOpen(true),
          },
        ]
      : [
          {
            key: "terminate",
            labelKey: "businessData.periodicInventory.operations.terminate.title" as TranslationKey,
            onClick: () => setTerminateOpen(true),
          },
        ]),
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
            {t("businessData.periodicInventory.detail.generalData")}
          </Text>
          <KV
            rows={[
              [t("businessData.periodicInventory.detail.fields.name"), detail.name],
              [t("businessData.periodicInventory.detail.fields.description"), detail.description],
              [t("businessData.periodicInventory.detail.fields.facility"), detail.facility],
              [t("businessData.periodicInventory.detail.fields.state"), detail.state],
              [t("businessData.periodicInventory.detail.fields.scheduledOn"), detail.scheduledOn],
            ]}
          />
        </div>
      </div>
    </DetailShell>

      <EditPeriodicInventoryDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialName={detail.name}
      />
      <ClonePeriodicInventoryDialog open={cloneOpen} onClose={() => setCloneOpen(false)} />
      <TerminatePeriodicInventoryDialog
        open={terminateOpen}
        onClose={() => setTerminateOpen(false)}
      />
      <UnterminatePeriodicInventoryDialog
        open={unterminateOpen}
        onClose={() => setUnterminateOpen(false)}
      />
      <BeginPeriodicInventoryDialog open={beginOpen} onClose={() => setBeginOpen(false)} />
      <CancelPeriodicInventoryDialog open={cancelOpen} onClose={() => setCancelOpen(false)} />
      <CompletePeriodicInventoryDialog
        open={completeOpen}
        onClose={() => setCompleteOpen(false)}
      />
      <PerformPeriodicInventoryDialog
        open={performOpen}
        onClose={() => setPerformOpen(false)}
      />
      <TakeOwnershipPeriodicInventoryDialog
        open={takeOwnershipOpen}
        onClose={() => setTakeOwnershipOpen(false)}
      />
      <PeriodicInventoryReportDialog
        open={viewReportOpen}
        onClose={() => setViewReportOpen(false)}
      />
    </>
  );
}
