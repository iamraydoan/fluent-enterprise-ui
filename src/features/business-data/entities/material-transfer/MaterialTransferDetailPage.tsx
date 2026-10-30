import { useMaterialTransferDetail } from "@/api";
import { DetailShell, KV } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const useStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
  sectionTitle: { marginBottom: "8px" },
});

function Card({ titleKey, rows }: { titleKey: TranslationKey; rows: [string, React.ReactNode][] }) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useStyles();
  return (
    <div className={shared.contentCard} style={{ padding: "14px 16px" }}>
      <Text weight="semibold" size={400} className={styles.sectionTitle}>
        {t(titleKey)}
      </Text>
      <KV rows={rows} />
    </div>
  );
}

export function MaterialTransferDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const { data: detail } = useMaterialTransferDetail(name);

  if (!detail) {
    return <Text>{t("businessData.materialTransfer.pageLabel")}</Text>;
  }

  const f = "businessData.materialTransfer.detail.fields" as const;
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
        <Card
          titleKey="businessData.materialTransfer.detail.generalData"
          rows={[
            [t(`${f}.name`), detail.name],
            [t(`${f}.type`), detail.type],
            [t(`${f}.state`), detail.state],
            [t(`${f}.material`), detail.material],
            [t(`${f}.quantity`), detail.quantity],
          ]}
        />
        <Card
          titleKey="businessData.materialTransfer.detail.generalData"
          rows={[
            [t(`${f}.fromFacility`), detail.fromFacility],
            [t(`${f}.toFacility`), detail.toFacility],
            [t(`${f}.requester`), detail.requester],
            [t(`${f}.urgency`), detail.urgency],
            [t(`${f}.quantity`), detail.quantity],
          ]}
        />
      </div>
    </DetailShell>
  );
}
