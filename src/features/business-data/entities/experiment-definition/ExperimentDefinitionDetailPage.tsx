import { useState } from "react";
import { useExperimentDefinitionDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { formatDateTime } from "@/lib/formatDate";
import { useBooleanLabel } from "../propertyLabels";

const tk = (key: string) => key as TranslationKey;

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "matrix", labelKey: tk("businessData.experimentDefinition.tabs.matrix") },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  tk("businessData.experimentDefinition.sections.details"),
  tk("businessData.experimentDefinition.sections.objectives"),
  tk("businessData.experimentDefinition.sections.mainMaterialGroups"),
  tk("businessData.experimentDefinition.sections.instances"),
  tk("businessData.experimentDefinition.sections.attachments"),
];

export function ExperimentDefinitionDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>(tk("businessData.experimentDefinition.sections.details"));
  const { data, isLoading } = useExperimentDefinitionDetail(name);
  const booleanLabel = useBooleanLabel();

  const shell = (content: React.ReactNode) => (
    <DetailShell
      title={name}
      icon={<Box24Regular />}
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
        <Text>{t(tk("businessData.experimentDefinition.sections.emptyBody"))}</Text>
      </Empty>,
    );
  }

  if (top !== "details" || left !== tk("businessData.experimentDefinition.sections.details")) {
    return shell(
      <Empty>
        <Text>{t(tk("businessData.experimentDefinition.sections.empty"))}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t(tk("businessData.experimentDefinition.sections.experimentDefinition"))}>
        <KV
          rows={[
            [t(tk("businessData.experimentDefinition.details.name")), data.name],
            [t(tk("businessData.experimentDefinition.details.description")), data.description],
            [t(tk("businessData.experimentDefinition.details.type")), data.type],
            [t(tk("businessData.experimentDefinition.details.state")), data.state],
            [t(tk("businessData.experimentDefinition.details.dataGroup")), data.dataGroup],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.experimentDefinition.sections.options"))}>
        <KV
          rows={[
            [t(tk("businessData.experimentDefinition.details.ignoreInSamplingPlans")), booleanLabel(data.ignoreInSamplingPlans)],
            [t(tk("businessData.experimentDefinition.details.ignoreInSpcCharts")), booleanLabel(data.ignoreInSpcCharts)],
            [t(tk("businessData.experimentDefinition.details.closeExperimentAutomatically")), booleanLabel(data.closeExperimentAutomatically)],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.experimentDefinition.sections.information"))}>
        <KV
          rows={[
            [t(tk("businessData.experimentDefinition.details.ownerRole")), data.ownerRole],
            [t(tk("businessData.experimentDefinition.details.purpose")), data.purpose],
            [t(tk("businessData.experimentDefinition.details.note")), data.note],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.experimentDefinition.sections.results"))}>
        <KV
          rows={[
            [t(tk("businessData.experimentDefinition.details.result")), data.result],
            [t(tk("businessData.experimentDefinition.details.conclusions")), data.conclusions],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.experimentDefinition.sections.settings"))}>
        <KV
          rows={[
            [t(tk("businessData.experimentDefinition.details.product")), data.product],
            [t(tk("businessData.experimentDefinition.details.productGroup")), data.productGroup],
            [t(tk("businessData.experimentDefinition.details.maximumNumberOfMaterials")), String(data.maximumNumberOfMaterials)],
            [t(tk("businessData.experimentDefinition.details.requiredMaterialType")), data.requiredMaterialType],
            [t(tk("businessData.experimentDefinition.details.requiredMaterialForm")), data.requiredMaterialForm],
            [t(tk("businessData.experimentDefinition.details.mode")), data.mode],
            [t(tk("businessData.experimentDefinition.details.requiredSubMaterialsForm")), data.requiredSubMaterialsForm],
            [t(tk("businessData.experimentDefinition.details.requiredSubMaterialsCount")), String(data.requiredSubMaterialsCount)],
            [t(tk("businessData.experimentDefinition.details.plannedStartDate")), formatDateTime(data.plannedStartDate)],
            [t(tk("businessData.experimentDefinition.details.plannedEndDate")), formatDateTime(data.plannedEndDate)],
            [t(tk("businessData.experimentDefinition.details.flow")), data.flow],
            [t(tk("businessData.experimentDefinition.details.firstStep")), data.firstStep],
            [t(tk("businessData.experimentDefinition.details.firstStepFlowPath")), data.firstStepFlowPath],
            [t(tk("businessData.experimentDefinition.details.lastStep")), data.lastStep],
            [t(tk("businessData.experimentDefinition.details.lastStepFlowPath")), data.lastStepFlowPath],
          ]}
        />
      </Card>
    </CardGrid>,
  );
}
