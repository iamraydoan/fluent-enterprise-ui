import { useState } from "react";
import { useQualificationDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Trophy20Regular } from "@/components/icons";
import { Body1Strong, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { RecordState } from "@/lib/recordState";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.qualification.tabs.details" },
  { value: "references", labelKey: "businessData.qualification.tabs.references" },
  { value: "history", labelKey: "businessData.qualification.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.qualification.sections.details",
  "businessData.qualification.sections.employees",
  "businessData.qualification.sections.certifications",
  "businessData.qualification.sections.attachments",
];

interface QualificationDetailPageProps {
  name: string;
}

export function QualificationDetailPage({ name }: QualificationDetailPageProps) {
  const { t } = useAppTranslation();
  const { data, isLoading } = useQualificationDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.qualification.sections.details");
  const handleLeft = (value: string) => setLeft(value as TranslationKey);

  if (isLoading || data === undefined) {
    return null;
  }

  const yesNo = (value: boolean) => (value ? t("common.yes") : t("common.no"));
  const stateLabel =
    data.state === RecordState.Active ? t("common.active") : t("common.terminated");

  let content;
  if (top !== "details" || left !== "businessData.qualification.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.qualification.sections.empty")}</Body1Strong>
          <Caption1>{t("businessData.qualification.sections.emptyBody")}</Caption1>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <CardGrid>
        <Card title={t("businessData.qualification.cards.qualification")}>
          <KV
            rows={[
              [t("businessData.qualification.details.name"), data.name],
              [t("businessData.qualification.details.description"), data.description],
              [t("businessData.qualification.details.type"), data.type],
              [t("businessData.qualification.details.state"), stateLabel],
              [t("businessData.qualification.details.dataGroup"), data.dataGroup],
            ]}
          />
        </Card>
        <Card title={t("businessData.qualification.cards.information")}>
          <KV
            rows={[
              [t("businessData.qualification.details.ownerRole"), data.ownerRole],
              [t("businessData.qualification.details.defaultReason"), data.defaultReason],
              [t("businessData.qualification.details.informationUrl"), data.informationUrl],
            ]}
          />
        </Card>
        <Card title={t("businessData.qualification.cards.permissions")}>
          <KV
            rows={[
              [
                t("businessData.qualification.details.allowSelfAssignment"),
                yesNo(data.allowSelfAssignment),
              ],
              [
                t("businessData.qualification.details.allowAssignmentByManager"),
                yesNo(data.allowAssignmentByManager),
              ],
            ]}
          />
        </Card>
        <Card title={t("businessData.qualification.cards.validityPeriod")}>
          <KV
            rows={[
              [t("businessData.qualification.details.validFor"), data.validFor],
              [t("businessData.qualification.details.allowOverride"), yesNo(data.allowOverride)],
            ]}
          />
        </Card>
        <Card title={t("businessData.qualification.cards.gracePeriod")}>
          <KV
            rows={[[t("businessData.qualification.details.duration"), data.gracePeriodDuration]]}
          />
        </Card>
      </CardGrid>
    );
  }

  return (
    <DetailShell
      title={data.name}
      icon={<Trophy20Regular />}
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
