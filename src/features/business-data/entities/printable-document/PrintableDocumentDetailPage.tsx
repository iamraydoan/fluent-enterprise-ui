import { usePrintableDocumentDetail } from "@/api";
import { DetailShell, KV } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const useStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
  sectionTitle: { marginBottom: "8px" },
});

export function PrintableDocumentDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const shared = useSharedStyles();
  const { data: detail } = usePrintableDocumentDetail(name);

  if (!detail) {
    return <Text>{t("businessData.printableDocument.pageLabel")}</Text>;
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
            {t("businessData.printableDocument.detail.generalData")}
          </Text>
          <KV
            rows={[
              [t("businessData.printableDocument.detail.fields.name"), detail.name],
              [t("businessData.printableDocument.detail.fields.description"), detail.description],
              [t("businessData.printableDocument.detail.fields.documentType"), detail.documentType],
              [t("businessData.printableDocument.detail.fields.state"), detail.state],
              [t("businessData.printableDocument.detail.fields.version"), detail.version],
            ]}
          />
        </div>
      </div>
    </DetailShell>
  );
}
