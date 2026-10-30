import { useState } from "react";
import { useDataSiloDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Database20Regular } from "@/components/icons";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useBooleanLabel } from "../propertyLabels";


const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "references", labelKey: "detailShell.tabs.references" },
];

const LEFT_ITEMS: TranslationKey[] = [
  "businessData.dataSilo.sections.details",
  "businessData.dataSilo.sections.attachments",
];

export function DataSiloDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.dataSilo.sections.details");
  const { data, isLoading } = useDataSiloDetail(name);
  const booleanLabel = useBooleanLabel();

  if (isLoading || !data) {
    return (
      <DetailShell
        title={name}
        icon={<Database20Regular />}
        topTabs={TOP_TABS}
        top={top}
        onTop={setTop}
        leftItems={LEFT_ITEMS}
        left={left}
        onLeft={setLeft}
        onEdit={() => undefined}
        onAskAi={() => undefined}
      >
        <Empty>
          <Text>{t("businessData.dataSilo.sections.emptyBody")}</Text>
        </Empty>
      </DetailShell>
    );
  }

  const detailsContent =
    left === "businessData.dataSilo.sections.attachments" ? (
      <Empty>
        <Text>{t("businessData.dataSilo.sections.empty")}</Text>
      </Empty>
    ) : (
      <CardGrid>
        <Card title={t("businessData.dataSilo.details.generalData")}>
          <KV
            rows={[
              [t("businessData.dataSilo.details.name"), data.name],
              [t("businessData.dataSilo.details.description"), data.description],
              [t("businessData.dataSilo.details.type"), data.type],
              [t("businessData.dataSilo.details.state"), data.state],
            ]}
          />
        </Card>
        <Card title={t("businessData.dataSilo.details.properties")}>
          <KV
            rows={[
              [t("businessData.dataSilo.details.dataVersion"), data.dataVersion],
              [t("businessData.dataSilo.details.enterpriseName"), data.enterpriseName],
              [t("businessData.dataSilo.details.facilityName"), data.facilityName],
              [t("businessData.dataSilo.details.isExternal"), booleanLabel(data.isExternal)],
              [t("businessData.dataSilo.details.isObsolete"), booleanLabel(data.isObsolete)],
              [t("businessData.dataSilo.details.isSystem"), booleanLabel(data.isSystem)],
              [t("businessData.dataSilo.details.isTemplate"), booleanLabel(data.isTemplate)],
              [t("businessData.dataSilo.details.keywords"), data.keywords],
              [t("businessData.dataSilo.details.ownerInstance"), data.ownerInstance],
              [t("businessData.dataSilo.details.siteName"), data.siteName],
              [t("businessData.dataSilo.details.user"), data.user],
            ]}
          />
        </Card>
      </CardGrid>
    );

  const content =
    top === "references" ? (
      <CardGrid>
        <Card title={t("businessData.dataSilo.sections.relations")}>
          <Empty>
            <Text>{t("businessData.dataSilo.sections.empty")}</Text>
          </Empty>
        </Card>
        <Card title={t("businessData.dataSilo.sections.whereUsed")}>
          <Empty>
            <Text>{t("businessData.dataSilo.sections.empty")}</Text>
          </Empty>
        </Card>
      </CardGrid>
    ) : (
      detailsContent
    );

  return (
    <DetailShell
      title={data.name}
      icon={<Database20Regular />}
      topTabs={TOP_TABS}
      top={top}
      onTop={setTop}
      leftItems={LEFT_ITEMS}
      left={left}
      onLeft={setLeft}
      onEdit={() => undefined}
      onAskAi={() => undefined}
    >
      {content}
    </DetailShell>
  );
}
