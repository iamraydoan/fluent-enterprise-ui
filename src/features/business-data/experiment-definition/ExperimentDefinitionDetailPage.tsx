import { useState } from "react";
import { useExperimentDefinitionDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, Button } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { formatDateTime } from "@/lib/formatDate";
import { useBooleanLabel } from "../components/propertyLabels";
import { MODE_CLONE, MODE_EDIT, TERMINATE, UNTERMINATE } from "../components/wizardMode";
import { ExperimentDefinitionDialog } from "./ExperimentDefinitionDialog";
import {
  ExperimentDefinitionTerminateDialog,
  SetEffectiveDialog,
} from "./ExperimentDefinitionTerminateDialog";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "matrix", labelKey: "businessData.experimentDefinition.tabs.matrix" },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  "businessData.experimentDefinition.sections.details",
  "businessData.experimentDefinition.sections.objectives",
  "businessData.experimentDefinition.sections.mainMaterialGroups",
  "businessData.experimentDefinition.sections.instances",
  "businessData.experimentDefinition.sections.attachments",
];

export function ExperimentDefinitionDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.experimentDefinition.sections.details");
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [setEffectiveOpen, setSetEffectiveOpen] = useState(false);
  const { data, isLoading } = useExperimentDefinitionDetail(name);
  const booleanLabel = useBooleanLabel();

  const shell = (content: React.ReactNode) => (
    <>
      <DetailShell
        title={name}
        icon={<Box24Regular />}
        topTabs={TOP_TABS}
        top={top}
        onTop={setTop}
        leftItems={LEFT_ITEMS}
        left={left}
        onLeft={setLeft}
        onEdit={() => setEditOpen(true)}
        onClone={() => setCloneOpen(true)}
        onTerminate={() => setTerminateOpen(true)}
        onUnterminate={() => setUnterminateOpen(true)}
        onAskAi={() => undefined}
      >
        {content}
      </DetailShell>
      {editOpen && (
        <ExperimentDefinitionDialog
          mode={MODE_EDIT}
          initialName={name}
          onClose={() => setEditOpen(false)}
        />
      )}
      {cloneOpen && (
        <ExperimentDefinitionDialog
          mode={MODE_CLONE}
          initialName={`${name} (Copy)`}
          onClose={() => setCloneOpen(false)}
        />
      )}
      {terminateOpen && (
        <ExperimentDefinitionTerminateDialog
          name={name}
          mode={TERMINATE}
          onClose={() => setTerminateOpen(false)}
        />
      )}
      {unterminateOpen && (
        <ExperimentDefinitionTerminateDialog
          name={name}
          mode={UNTERMINATE}
          onClose={() => setUnterminateOpen(false)}
        />
      )}
      {setEffectiveOpen && (
        <SetEffectiveDialog name={name} onClose={() => setSetEffectiveOpen(false)} />
      )}
    </>
  );

  if (isLoading || !data) {
    return shell(
      <Empty>
        <Text>{t("businessData.experimentDefinition.sections.emptyBody")}</Text>
      </Empty>,
    );
  }

  if (top !== "details" || left !== "businessData.experimentDefinition.sections.details") {
    return shell(
      <Empty>
        <Text>{t("businessData.experimentDefinition.sections.empty")}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t("businessData.experimentDefinition.sections.experimentDefinition")}>
        <KV
          rows={[
            [t("businessData.experimentDefinition.details.name"), data.name],
            [t("businessData.experimentDefinition.details.description"), data.description],
            [t("businessData.experimentDefinition.details.type"), data.type],
            [t("businessData.experimentDefinition.details.state"), data.state],
            [t("businessData.experimentDefinition.details.dataGroup"), data.dataGroup],
          ]}
        />
      </Card>
      <Card title={t("businessData.experimentDefinition.sections.options")}>
        <KV
          rows={[
            [
              t("businessData.experimentDefinition.details.ignoreInSamplingPlans"),
              booleanLabel(data.ignoreInSamplingPlans),
            ],
            [
              t("businessData.experimentDefinition.details.ignoreInSpcCharts"),
              booleanLabel(data.ignoreInSpcCharts),
            ],
            [
              t("businessData.experimentDefinition.details.closeExperimentAutomatically"),
              booleanLabel(data.closeExperimentAutomatically),
            ],
          ]}
        />
      </Card>
      <Card title={t("businessData.experimentDefinition.sections.information")}>
        <KV
          rows={[
            [t("businessData.experimentDefinition.details.ownerRole"), data.ownerRole],
            [t("businessData.experimentDefinition.details.purpose"), data.purpose],
            [t("businessData.experimentDefinition.details.note"), data.note],
          ]}
        />
      </Card>
      <Card title={t("businessData.experimentDefinition.sections.results")}>
        <KV
          rows={[
            [t("businessData.experimentDefinition.details.result"), data.result],
            [t("businessData.experimentDefinition.details.conclusions"), data.conclusions],
          ]}
        />
      </Card>
      <Card title={t("businessData.experimentDefinition.sections.settings")}>
        <KV
          rows={[
            [t("businessData.experimentDefinition.details.product"), data.product],
            [t("businessData.experimentDefinition.details.productGroup"), data.productGroup],
            [
              t("businessData.experimentDefinition.details.maximumNumberOfMaterials"),
              String(data.maximumNumberOfMaterials),
            ],
            [
              t("businessData.experimentDefinition.details.requiredMaterialType"),
              data.requiredMaterialType,
            ],
            [
              t("businessData.experimentDefinition.details.requiredMaterialForm"),
              data.requiredMaterialForm,
            ],
            [t("businessData.experimentDefinition.details.mode"), data.mode],
            [
              t("businessData.experimentDefinition.details.requiredSubMaterialsForm"),
              data.requiredSubMaterialsForm,
            ],
            [
              t("businessData.experimentDefinition.details.requiredSubMaterialsCount"),
              String(data.requiredSubMaterialsCount),
            ],
            [
              t("businessData.experimentDefinition.details.plannedStartDate"),
              formatDateTime(data.plannedStartDate),
            ],
            [
              t("businessData.experimentDefinition.details.plannedEndDate"),
              formatDateTime(data.plannedEndDate),
            ],
            [t("businessData.experimentDefinition.details.flow"), data.flow],
            [t("businessData.experimentDefinition.details.firstStep"), data.firstStep],
            [
              t("businessData.experimentDefinition.details.firstStepFlowPath"),
              data.firstStepFlowPath,
            ],
            [t("businessData.experimentDefinition.details.lastStep"), data.lastStep],
            [
              t("businessData.experimentDefinition.details.lastStepFlowPath"),
              data.lastStepFlowPath,
            ],
          ]}
        />
        <div style={{ marginTop: "12px" }}>
          <Button appearance="primary" onClick={() => setSetEffectiveOpen(true)}>
            {t("businessData.experimentDefinition.actions.setEffective")}
          </Button>
        </div>
      </Card>
    </CardGrid>,
  );
}
