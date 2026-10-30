import { useState } from "react";
import { useInspectionPlanDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { TableSimple24Regular } from "@/components/icons";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useBooleanLabel } from "../propertyLabels";

const tk = (key: string) => key as TranslationKey;

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "compare", labelKey: tk("businessData.inspectionPlan.tabs.compare") },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  tk("businessData.inspectionPlan.sections.details"),
  tk("businessData.inspectionPlan.sections.steps"),
  tk("businessData.inspectionPlan.sections.configurations"),
  tk("businessData.inspectionPlan.sections.instances"),
  tk("businessData.inspectionPlan.sections.attachments"),
];

export function InspectionPlanDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>(tk("businessData.inspectionPlan.sections.details"));
  const { data, isLoading } = useInspectionPlanDetail(name);
  const booleanLabel = useBooleanLabel();

  const shell = (content: React.ReactNode) => (
    <DetailShell
      title={name}
      icon={<TableSimple24Regular />}
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
        <Text>{t(tk("businessData.inspectionPlan.sections.emptyBody"))}</Text>
      </Empty>,
    );
  }

  if (top !== "details" || left !== tk("businessData.inspectionPlan.sections.details")) {
    return shell(
      <Empty>
        <Text>{t(tk("businessData.inspectionPlan.sections.empty"))}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t(tk("businessData.inspectionPlan.sections.inspectionPlan"))}>
        <KV
          rows={[
            [t(tk("businessData.inspectionPlan.details.name")), data.name],
            [t(tk("businessData.inspectionPlan.details.description")), data.description],
            [t(tk("businessData.inspectionPlan.details.type")), data.type],
            [t(tk("businessData.inspectionPlan.details.state")), data.state],
            [t(tk("businessData.inspectionPlan.details.dataGroup")), data.dataGroup],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.inspectionPlan.sections.defaultInspection"))}>
        <KV
          rows={[
            [t(tk("businessData.inspectionPlan.details.resultsRequiredBeforeTrackOut")), booleanLabel(data.resultsRequiredBeforeTrackOut)],
            [t(tk("businessData.inspectionPlan.details.enableMultipleSamples")), booleanLabel(data.enableMultipleSamples)],
            [t(tk("businessData.inspectionPlan.details.containsSeparateInspectionSteps")), booleanLabel(data.containsSeparateInspectionSteps)],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.inspectionPlan.sections.inspectionSettings"))}>
        <KV
          rows={[
            [t(tk("businessData.inspectionPlan.details.closeAutomaticallyOnPass")), booleanLabel(data.closeAutomaticallyOnPass)],
            [t(tk("businessData.inspectionPlan.details.closeAutomaticallyOnFail")), booleanLabel(data.closeAutomaticallyOnFail)],
            [t(tk("businessData.inspectionPlan.details.openProtocolOnFail")), booleanLabel(data.openProtocolOnFail)],
            [t(tk("businessData.inspectionPlan.details.protocol")), data.protocol],
            [t(tk("businessData.inspectionPlan.details.futureHoldCreationMode")), data.futureHoldCreationMode],
            [t(tk("businessData.inspectionPlan.details.setHoldOnFail")), booleanLabel(data.setHoldOnFail)],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.inspectionPlan.sections.futureHoldInformation"))}>
        <KV
          rows={[
            [t(tk("businessData.inspectionPlan.details.step")), data.futureHoldStep],
            [t(tk("businessData.inspectionPlan.details.reason")), data.futureHoldReason],
            [t(tk("businessData.inspectionPlan.details.releaseRole")), data.futureHoldReleaseRole],
            [t(tk("businessData.inspectionPlan.details.comment")), data.futureHoldComment],
            [t(tk("businessData.inspectionPlan.details.distributionList")), data.futureHoldDistributionList],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.inspectionPlan.sections.holdInformation"))}>
        <KV
          rows={[
            [t(tk("businessData.inspectionPlan.details.reason")), data.holdReason],
            [t(tk("businessData.inspectionPlan.details.releaseRole")), data.holdReleaseRole],
            [t(tk("businessData.inspectionPlan.details.comment")), data.holdComment],
          ]}
        />
      </Card>
    </CardGrid>,
  );
}
