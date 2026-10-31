import { useState } from "react";
import { useKpiDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Target24Regular } from "@/components/icons";
import { Button, Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { EntityTerminateDialog } from "../components/EntityTerminateDialog";
const L: Record<string, TranslationKey> = {
  terminateTitle: "businessData.kpi.terminateDialog.title",
  terminateMessage: "businessData.kpi.terminateDialog.message",
  terminateConfirm: "businessData.kpi.terminateDialog.terminate",
};
import { MODE_CLONE, MODE_EDIT, TERMINATE } from "../components/wizardMode";
import { KpiDialog } from "./dialogs/KpiDialog";
import { KpiDimensionsDialog } from "./dialogs/KpiDimensionsDialog";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  "businessData.kpi.sections.details",
  "businessData.kpi.sections.dimensionsAndTimeFrames",
  "businessData.kpi.sections.attachments",
];

export function KpiDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.kpi.sections.details");
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [dimensionsOpen, setDimensionsOpen] = useState(false);
  const { data, isLoading } = useKpiDetail(name);

  const shell = (content: React.ReactNode) => (
    <>
      <DetailShell
        title={name}
        icon={<Target24Regular />}
        topTabs={TOP_TABS}
        top={top}
        onTop={setTop}
        leftItems={LEFT_ITEMS}
        left={left}
        onLeft={setLeft}
        onEdit={() => setEditOpen(true)}
        onClone={() => setCloneOpen(true)}
        onTerminate={() => setTerminateOpen(true)}
        onAskAi={() => undefined}
      >
        {content}
      </DetailShell>
      {editOpen && (
        <KpiDialog mode={MODE_EDIT} initialName={name} onClose={() => setEditOpen(false)} />
      )}
      {cloneOpen && (
        <KpiDialog
          mode={MODE_CLONE}
          initialName={`${name} (Copy)`}
          onClose={() => setCloneOpen(false)}
        />
      )}
      <EntityTerminateDialog
        open={terminateOpen}
        name={name}
        mode={TERMINATE}
        terminateTitleKey={L.terminateTitle}
        terminateMessageKey={L.terminateMessage}
        terminateConfirmKey={L.terminateConfirm}
        onClose={() => setTerminateOpen(false)}
        onConfirm={() => setTerminateOpen(false)}
      />
      {dimensionsOpen && <KpiDimensionsDialog onClose={() => setDimensionsOpen(false)} />}
    </>
  );

  if (isLoading || !data) {
    return shell(
      <Empty>
        <Text>{t("businessData.kpi.sections.emptyBody")}</Text>
      </Empty>,
    );
  }

  if (top === "details" && left === "businessData.kpi.sections.dimensionsAndTimeFrames") {
    return shell(
      <Card title={t("businessData.kpi.sections.dimensionsAndTimeFrames")}>
        <Button appearance="primary" onClick={() => setDimensionsOpen(true)}>
          {t("businessData.kpi.actions.manageDimensions")}
        </Button>
      </Card>,
    );
  }

  if (top !== "details" || left !== "businessData.kpi.sections.details") {
    return shell(
      <Empty>
        <Text>{t("businessData.kpi.sections.empty")}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t("businessData.kpi.sections.kpi")}>
        <KV
          rows={[
            [t("businessData.kpi.details.name"), data.name],
            [t("businessData.kpi.details.description"), data.description],
            [t("businessData.kpi.details.type"), data.type],
            [t("businessData.kpi.details.state"), data.state],
            [t("businessData.kpi.details.dataGroup"), data.dataGroup],
          ]}
        />
      </Card>
      <Card title={t("businessData.kpi.sections.settings")}>
        <KV
          rows={[
            [t("businessData.kpi.details.sourceType"), data.sourceType],
            [t("businessData.kpi.details.entityType"), data.entityType],
            [t("businessData.kpi.details.parameter"), data.parameter],
            [t("businessData.kpi.details.kpiType"), data.kpiType],
            [t("businessData.kpi.details.frequency"), data.frequency],
            [t("businessData.kpi.details.ownerRole"), data.ownerRole],
          ]}
        />
      </Card>
      <Card title={t("businessData.kpi.sections.defaultValues")}>
        <KV
          rows={[
            [
              t("businessData.kpi.details.closeToTargetMinimumValue"),
              String(data.closeToTargetMinimumValue),
            ],
            [t("businessData.kpi.details.inTargetMinimumValue"), String(data.inTargetMinimumValue)],
            [t("businessData.kpi.details.targetValue"), String(data.targetValue)],
          ]}
        />
      </Card>
    </CardGrid>,
  );
}
