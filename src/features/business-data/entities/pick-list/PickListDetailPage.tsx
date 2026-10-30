import { useState } from "react";
import { usePickListDetail } from "@/api";
import type { DetailMoreMenuItem } from "@/components/common";
import { DetailShell, KV } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import {
  EditPickListDialog,
  ManagePickListItemsDialog,
  PickListReportDialog,
  PickPickListDialog,
  TakePickListOwnershipDialog,
  UnpickPickListItemsDialog,
} from "./PickListOperations";

const useStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
  sectionTitle: { marginBottom: "8px" },
});

export function PickListDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const shared = useSharedStyles();
  const { data: detail } = usePickListDetail(name);

  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.pickList.left.details");
  const [editOpen, setEditOpen] = useState(false);
  const [manageItemsOpen, setManageItemsOpen] = useState(false);
  const [pickOpen, setPickOpen] = useState(false);
  const [takeOwnershipOpen, setTakeOwnershipOpen] = useState(false);
  const [unpickOpen, setUnpickOpen] = useState(false);
  const [viewReportOpen, setViewReportOpen] = useState(false);

  if (!detail) {
    return <Text>{t("businessData.pickList.pageLabel")}</Text>;
  }

  const topTabs = [
    { value: "details", labelKey: "businessData.pickList.tabs.details" as TranslationKey },
    { value: "references", labelKey: "businessData.pickList.tabs.references" as TranslationKey },
    { value: "history", labelKey: "businessData.pickList.tabs.history" as TranslationKey },
  ];

  const leftItems: TranslationKey[] = [
    "businessData.pickList.left.details",
    "businessData.pickList.left.items",
    "businessData.pickList.left.attachments",
  ];

  const moreMenuItems: DetailMoreMenuItem[] = [
    {
      key: "manageItems",
      labelKey: "businessData.pickList.operations.manageItems.title" as TranslationKey,
      onClick: () => setManageItemsOpen(true),
    },
    {
      key: "pick",
      labelKey: "businessData.pickList.operations.pick.title" as TranslationKey,
      onClick: () => setPickOpen(true),
    },
    {
      key: "takeOwnership",
      labelKey: "businessData.pickList.operations.takeOwnership.title" as TranslationKey,
      onClick: () => setTakeOwnershipOpen(true),
    },
    {
      key: "unpick",
      labelKey: "businessData.pickList.operations.unpick.title" as TranslationKey,
      onClick: () => setUnpickOpen(true),
    },
    {
      key: "viewReport",
      labelKey: "businessData.pickList.operations.viewReport.title" as TranslationKey,
      onClick: () => setViewReportOpen(true),
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
      moreMenuItems={moreMenuItems}
    >
      <div className={styles.cards}>
        <div className={shared.contentCard} style={{ padding: "14px 16px" }}>
          <Text weight="semibold" size={400} className={styles.sectionTitle}>
            {t("businessData.pickList.detail.generalData")}
          </Text>
          <KV
            rows={[
              [t("businessData.pickList.detail.fields.name"), detail.name],
              [t("businessData.pickList.detail.fields.description"), detail.description],
              [t("businessData.pickList.detail.fields.state"), detail.state],
              [t("businessData.pickList.detail.fields.itemCount"), detail.itemCount],
              [t("businessData.pickList.detail.fields.createdOn"), detail.createdOn],
            ]}
          />
        </div>
      </div>
    </DetailShell>
      <EditPickListDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialName={detail.name}
      />
      <ManagePickListItemsDialog
        open={manageItemsOpen}
        onClose={() => setManageItemsOpen(false)}
      />
      <PickPickListDialog open={pickOpen} onClose={() => setPickOpen(false)} />
      <TakePickListOwnershipDialog
        open={takeOwnershipOpen}
        onClose={() => setTakeOwnershipOpen(false)}
      />
      <UnpickPickListItemsDialog open={unpickOpen} onClose={() => setUnpickOpen(false)} />
      <PickListReportDialog
        open={viewReportOpen}
        onClose={() => setViewReportOpen(false)}
      />
    </>
  );
}
