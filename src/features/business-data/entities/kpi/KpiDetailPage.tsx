import { useState } from "react";
import { useKpiDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Target24Regular } from "@/components/icons";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const tk = (key: string) => key as TranslationKey;

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  tk("businessData.kpi.sections.details"),
  tk("businessData.kpi.sections.dimensionsAndTimeFrames"),
  tk("businessData.kpi.sections.attachments"),
];

export function KpiDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>(tk("businessData.kpi.sections.details"));
  const { data, isLoading } = useKpiDetail(name);

  const shell = (content: React.ReactNode) => (
    <DetailShell
      title={name}
      icon={<Target24Regular />}
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

  if (isLoading || !data) {
    return shell(
      <Empty>
        <Text>{t(tk("businessData.kpi.sections.emptyBody"))}</Text>
      </Empty>,
    );
  }

  if (top !== "details" || left !== tk("businessData.kpi.sections.details")) {
    return shell(
      <Empty>
        <Text>{t(tk("businessData.kpi.sections.empty"))}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t(tk("businessData.kpi.sections.kpi"))}>
        <KV
          rows={[
            [t(tk("businessData.kpi.details.name")), data.name],
            [t(tk("businessData.kpi.details.description")), data.description],
            [t(tk("businessData.kpi.details.type")), data.type],
            [t(tk("businessData.kpi.details.state")), data.state],
            [t(tk("businessData.kpi.details.dataGroup")), data.dataGroup],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.kpi.sections.settings"))}>
        <KV
          rows={[
            [t(tk("businessData.kpi.details.sourceType")), data.sourceType],
            [t(tk("businessData.kpi.details.entityType")), data.entityType],
            [t(tk("businessData.kpi.details.parameter")), data.parameter],
            [t(tk("businessData.kpi.details.kpiType")), data.kpiType],
            [t(tk("businessData.kpi.details.frequency")), data.frequency],
            [t(tk("businessData.kpi.details.ownerRole")), data.ownerRole],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.kpi.sections.defaultValues"))}>
        <KV
          rows={[
            [t(tk("businessData.kpi.details.closeToTargetMinimumValue")), String(data.closeToTargetMinimumValue)],
            [t(tk("businessData.kpi.details.inTargetMinimumValue")), String(data.inTargetMinimumValue)],
            [t(tk("businessData.kpi.details.targetValue")), String(data.targetValue)],
          ]}
        />
      </Card>
    </CardGrid>,
  );
}
