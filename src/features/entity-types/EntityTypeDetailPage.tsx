import { useState } from "react";
import { useEntityType } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { DocumentBulletList20Regular } from "@/components/icons";
import { Body1Strong, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { EntityTypePropertiesSection } from "./EntityTypePropertiesSection";

const TOP_TABS: DetailTab[] = [{ value: "details", labelKey: "detailShell.tabs.details" }];

const LEFT_SECTIONS: TranslationKey[] = [
  "entityTypes.sections.details",
  "entityTypes.sections.stateModels",
  "entityTypes.sections.properties",
  "entityTypes.sections.attributes",
  "entityTypes.sections.operations",
  "entityTypes.sections.operationAttributes",
  "entityTypes.sections.odsRetention",
];

interface EntityTypeDetailPageProps {
  name: string;
}

export function EntityTypeDetailPage({ name }: EntityTypeDetailPageProps) {
  const { t } = useAppTranslation();
  const { data, isLoading } = useEntityType(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("entityTypes.sections.properties");
  const handleLeft = (value: TranslationKey) => setLeft(value);

  if (isLoading || data === undefined) {
    return null;
  }

  let content;
  if (left === "entityTypes.sections.properties") {
    content = <EntityTypePropertiesSection entityName={name} />;
  } else if (left === "entityTypes.sections.details") {
    content = (
      <CardGrid>
        <Card title={t("entityTypes.details.generalData")}>
          <KV
            rows={[
              [t("entityTypes.details.name"), data.name],
              [t("entityTypes.details.description"), data.description],
              [t("entityTypes.details.system"), data.system ? t("common.yes") : t("common.no")],
              [t("entityTypes.details.lockType"), data.lockType],
            ]}
          />
        </Card>
      </CardGrid>
    );
  } else {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("entityTypes.sections.empty")}</Body1Strong>
          <Caption1>{t("entityTypes.sections.emptyBody")}</Caption1>
        </Empty>
      </Panel>
    );
  }

  return (
    <DetailShell
      title={data.name}
      icon={<DocumentBulletList20Regular />}
      topTabs={TOP_TABS}
      top={top}
      onTop={setTop}
      leftItems={LEFT_SECTIONS}
      left={left}
      onLeft={handleLeft}
      onEdit={() => {}}
      onAskAi={() => {}}
    >
      {content}
    </DetailShell>
  );
}
