import { useState } from "react";
import { useDataSiloDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Database20Regular } from "@/components/icons";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useBooleanLabel } from "../propertyLabels";

const tk = (key: string) => key as TranslationKey;

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "references", labelKey: "detailShell.tabs.references" },
];

const LEFT_ITEMS: TranslationKey[] = [
  tk("businessData.dataSilo.sections.details"),
  tk("businessData.dataSilo.sections.attachments"),
];

export function DataSiloDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>(tk("businessData.dataSilo.sections.details"));
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
          <Text>{t(tk("businessData.dataSilo.sections.emptyBody"))}</Text>
        </Empty>
      </DetailShell>
    );
  }

  const detailsContent =
    left === tk("businessData.dataSilo.sections.attachments") ? (
      <Empty>
        <Text>{t(tk("businessData.dataSilo.sections.empty"))}</Text>
      </Empty>
    ) : (
      <CardGrid>
        <Card title={t(tk("businessData.dataSilo.details.generalData"))}>
          <KV
            rows={[
              [t(tk("businessData.dataSilo.details.name")), data.name],
              [t(tk("businessData.dataSilo.details.description")), data.description],
              [t(tk("businessData.dataSilo.details.type")), data.type],
              [t(tk("businessData.dataSilo.details.state")), data.state],
            ]}
          />
        </Card>
        <Card title={t(tk("businessData.dataSilo.details.properties"))}>
          <KV
            rows={[
              [t(tk("businessData.dataSilo.details.dataVersion")), data.dataVersion],
              [t(tk("businessData.dataSilo.details.enterpriseName")), data.enterpriseName],
              [t(tk("businessData.dataSilo.details.facilityName")), data.facilityName],
              [t(tk("businessData.dataSilo.details.isExternal")), booleanLabel(data.isExternal)],
              [t(tk("businessData.dataSilo.details.isObsolete")), booleanLabel(data.isObsolete)],
              [t(tk("businessData.dataSilo.details.isSystem")), booleanLabel(data.isSystem)],
              [t(tk("businessData.dataSilo.details.isTemplate")), booleanLabel(data.isTemplate)],
              [t(tk("businessData.dataSilo.details.keywords")), data.keywords],
              [t(tk("businessData.dataSilo.details.ownerInstance")), data.ownerInstance],
              [t(tk("businessData.dataSilo.details.siteName")), data.siteName],
              [t(tk("businessData.dataSilo.details.user")), data.user],
            ]}
          />
        </Card>
      </CardGrid>
    );

  const content =
    top === "references" ? (
      <CardGrid>
        <Card title={t(tk("businessData.dataSilo.sections.relations"))}>
          <Empty>
            <Text>{t(tk("businessData.dataSilo.sections.empty"))}</Text>
          </Empty>
        </Card>
        <Card title={t(tk("businessData.dataSilo.sections.whereUsed"))}>
          <Empty>
            <Text>{t(tk("businessData.dataSilo.sections.empty"))}</Text>
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
