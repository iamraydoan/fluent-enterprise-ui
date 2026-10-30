import { useState } from "react";
import { useNotificationDetail } from "@/api";
import type { DetailMoreMenuItem } from "@/components/common";
import { DetailShell, KV } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import {
  ClearNotificationDialog,
  CloneNotificationDialog,
  EditNotificationDialog,
  TerminateNotificationDialog,
} from "./NotificationOperations";

const useStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
  sectionTitle: { marginBottom: "8px" },
});

const TOP_TABS: { value: string; labelKey: TranslationKey }[] = [
  { value: "details", labelKey: "businessData.notification.tabs.details" },
  { value: "references", labelKey: "businessData.notification.tabs.references" },
  { value: "history", labelKey: "businessData.notification.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  "businessData.notification.left.details",
  "businessData.notification.left.clearHistory",
  "businessData.notification.left.attributes",
  "businessData.notification.left.attachments",
];

export function NotificationDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const shared = useSharedStyles();
  const { data: detail } = useNotificationDetail(name);

  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>(LEFT_ITEMS[0]);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);

  if (!detail) {
    return <Text>{t("businessData.notification.pageLabel")}</Text>;
  }

  const moreMenuItems: DetailMoreMenuItem[] = [
    {
      key: "clear",
      labelKey: "businessData.notification.operations.clear.title",
      onClick: () => setClearOpen(true),
    },
    {
      key: "clone",
      labelKey: "businessData.notification.operations.clone.title",
      onClick: () => setCloneOpen(true),
    },
    {
      key: "terminate",
      labelKey: "businessData.notification.operations.terminate.title",
      onClick: () => setTerminateOpen(true),
    },
  ];

  return (
    <>
      <DetailShell
        title={detail.name}
        icon={<Box24Regular />}
        topTabs={TOP_TABS}
        top={top}
        onTop={setTop}
        leftItems={LEFT_ITEMS}
        left={left}
        onLeft={setLeft}
        onEdit={() => setEditOpen(true)}
        onAskAi={() => undefined}
        showState={false}
        moreMenuItems={moreMenuItems}
      >
        {top === "details" && left === LEFT_ITEMS[0] && (
          <div className={styles.cards}>
            <div className={shared.contentCard} style={{ padding: "14px 16px" }}>
              <Text weight="semibold" size={400} className={styles.sectionTitle}>
                {t("businessData.notification.detail.generalData")}
              </Text>
              <KV
                rows={[
                  [t("businessData.notification.detail.fields.name"), detail.name],
                  [t("businessData.notification.detail.fields.description"), detail.description],
                  [t("businessData.notification.detail.fields.severity"), detail.severity],
                  [t("businessData.notification.detail.fields.type"), detail.type],
                  [t("businessData.notification.detail.fields.state"), detail.state],
                  [t("businessData.notification.detail.fields.validTo"), detail.validTo],
                  [t("businessData.notification.detail.fields.tracking"), detail.tracking],
                ]}
              />
            </div>
          </div>
        )}
        {top === "details" && left === LEFT_ITEMS[1] && (
          <div className={shared.contentCard} style={{ padding: "14px 16px" }}>
            <Text weight="semibold" size={400} className={styles.sectionTitle}>
              {t("businessData.notification.left.clearHistory")}
            </Text>
          </div>
        )}
        {top === "references" && (
          <div className={shared.contentCard} style={{ padding: "14px 16px" }}>
            <Text weight="semibold" size={400} className={styles.sectionTitle}>
              {t("businessData.notification.tabs.references")}
            </Text>
          </div>
        )}
        {top === "history" && (
          <div className={shared.contentCard} style={{ padding: "14px 16px" }}>
            <Text weight="semibold" size={400} className={styles.sectionTitle}>
              {t("businessData.notification.tabs.history")}
            </Text>
          </div>
        )}
      </DetailShell>

      <EditNotificationDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialName={detail.name}
      />
      <CloneNotificationDialog open={cloneOpen} onClose={() => setCloneOpen(false)} />
      <TerminateNotificationDialog open={terminateOpen} onClose={() => setTerminateOpen(false)} />
      <ClearNotificationDialog open={clearOpen} onClose={() => setClearOpen(false)} />
    </>
  );
}
