import { useNotificationDetail } from "@/api";
import { DetailShell, KV } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const useStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
  sectionTitle: { marginBottom: "8px" },
});

export function NotificationDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const shared = useSharedStyles();
  const { data: detail } = useNotificationDetail(name);

  if (!detail) {
    return <Text>{t("businessData.notification.pageLabel")}</Text>;
  }

  return (
    <DetailShell
      title={detail.name}
      icon={<Box24Regular />}
      topTabs={[]}
      top=""
      onTop={() => undefined}
      leftItems={[]}
      left=""
      onLeft={() => undefined}
      onEdit={() => undefined}
      onAskAi={() => undefined}
      showState={false}
    >
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
    </DetailShell>
  );
}
