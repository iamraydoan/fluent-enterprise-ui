import { useState } from "react";
import { useMaterialDetail } from "@/api";
import { DetailShell, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const useStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" },
  sectionTitle: { marginBottom: "8px" },
});

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.material.tabs.details" },
  { value: "traceability", labelKey: "businessData.material.tabs.traceability" },
  { value: "container", labelKey: "businessData.material.tabs.container" },
  { value: "defects", labelKey: "businessData.material.tabs.defects" },
  { value: "genealogy", labelKey: "businessData.material.tabs.genealogy" },
  { value: "history", labelKey: "businessData.material.tabs.history" },
  { value: "compare", labelKey: "businessData.material.tabs.compare" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.material.sideSections.details",
  "businessData.material.sideSections.holds",
  "businessData.material.sideSections.defects",
  "businessData.material.sideSections.timeConstraints",
  "businessData.material.sideSections.dependencies",
  "businessData.material.sideSections.subMaterials",
  "businessData.material.sideSections.collectedData",
  "businessData.material.sideSections.attributes",
  "businessData.material.sideSections.attachments",
];

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

export function MaterialDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState("businessData.material.sideSections.details");
  const { data: detail } = useMaterialDetail(name);

  if (!detail) {
    return <Text>{t("businessData.material.detailsView")}</Text>;
  }

  return (
    <DetailShell
      title={detail.name}
      icon={<Box24Regular />}
      topTabs={TOP_TABS}
      top={top}
      onTop={setTop}
      leftItems={LEFT_SECTIONS}
      left={left}
      onLeft={setLeft}
      onEdit={() => undefined}
      onAskAi={() => undefined}
      showState={false}
    >
      {top === "details" && (
        <div className={styles.cards}>
          <Card
            titleKey="businessData.material.sections.material"
            rows={[
              [t("businessData.material.fields.name"), detail.name],
              [t("businessData.material.fields.description"), detail.description],
              [t("businessData.material.fields.type"), detail.type],
              [t("businessData.material.fields.universalState"), detail.universalState],
              [t("businessData.material.fields.systemState"), detail.systemState],
            ]}
          />
          <Card
            titleKey="businessData.material.sections.basicInformation"
            rows={[
              [t("businessData.material.fields.form"), detail.form],
              [t("businessData.material.fields.facility"), detail.facility],
              [t("businessData.material.fields.product"), detail.product],
              [t("businessData.material.fields.productDescription"), detail.productDescription],
            ]}
          />
          <Card
            titleKey="businessData.material.sections.flowAndStep"
            rows={[
              [t("businessData.material.fields.flow"), detail.flow],
              [t("businessData.material.fields.step"), detail.step],
              [t("businessData.material.fields.flowPath"), detail.flowPath],
            ]}
          />
          <Card
            titleKey="businessData.material.sections.quantities"
            rows={[
              [t("businessData.material.fields.primaryQuantity"), detail.primaryQuantity],
              [t("businessData.material.fields.secondaryQuantity"), detail.secondaryQuantity],
            ]}
          />
          <Card
            titleKey="businessData.material.sections.subMaterials"
            rows={[
              [t("businessData.material.fields.subMaterialCount"), String(detail.subMaterialCount)],
            ]}
          />
          <Card
            titleKey="businessData.material.sections.resourceAndContainer"
            rows={[
              [t("businessData.material.fields.resource"), ""],
              [t("businessData.material.fields.container"), ""],
            ]}
          />
        </div>
      )}
      {top !== "details" && (
        <div className={styles.cards}>
          <Text>{t("businessData.material.emptyTab")}</Text>
        </div>
      )}
    </DetailShell>
  );
}
