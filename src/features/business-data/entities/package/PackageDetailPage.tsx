import { usePackageDetail } from "@/api";
import { DetailShell, KV } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const useStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
  sectionTitle: { marginBottom: "8px" },
});

export function PackageDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const shared = useSharedStyles();
  const { data: detail } = usePackageDetail(name);

  if (!detail) {
    return <Text>{t("businessData.package.pageLabel")}</Text>;
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
            {t("businessData.package.detail.generalData")}
          </Text>
          <KV
            rows={[
              [t("businessData.package.detail.fields.name"), detail.name],
              [t("businessData.package.detail.fields.description"), detail.description],
              [t("businessData.package.detail.fields.product"), detail.product],
              [t("businessData.package.detail.fields.level"), detail.level],
              [t("businessData.package.detail.fields.state"), detail.state],
              [t("businessData.package.detail.fields.packedQuantity"), detail.packedQuantity],
              [t("businessData.package.detail.fields.contentType"), detail.contentType],
            ]}
          />
        </div>
      </div>
    </DetailShell>
  );
}
