import { useState } from "react";
import { useMaintenancePlanDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Wrench24Regular } from "@/components/icons";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useBooleanLabel } from "../propertyLabels";

const tk = (key: string) => key as TranslationKey;

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "activities", labelKey: tk("businessData.maintenancePlan.tabs.maintenanceActivities") },
  { value: "compare", labelKey: tk("businessData.maintenancePlan.tabs.compare") },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  tk("businessData.maintenancePlan.sections.details"),
  tk("businessData.maintenancePlan.sections.instances"),
  tk("businessData.maintenancePlan.sections.attachments"),
];

export function MaintenancePlanDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>(tk("businessData.maintenancePlan.sections.details"));
  const [selectedActivity, setSelectedActivity] = useState(0);
  const { data, isLoading } = useMaintenancePlanDetail(name);
  const booleanLabel = useBooleanLabel();

  const shell = (content: React.ReactNode) => (
    <DetailShell
      title={name}
      icon={<Wrench24Regular />}
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
        <Text>{t(tk("businessData.maintenancePlan.sections.emptyBody"))}</Text>
      </Empty>,
    );
  }

  if (top === "activities") {
    const activity = data.activities[selectedActivity];
    return shell(
      <div style={{ display: "flex", gap: 16, height: "100%" }}>
        <Panel>
          <Text weight="semibold">{t(tk("businessData.maintenancePlan.sections.activities"))}</Text>
          {data.activities.map((item, index) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setSelectedActivity(index)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: index === selectedActivity ? "#e8f0f8" : "transparent",
                border: "none",
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              <Text>{item.name}</Text>
            </button>
          ))}
        </Panel>
        {activity && (
          <Card title={t(tk("businessData.maintenancePlan.sections.generalData"))}>
            <KV
              rows={[
                [t(tk("businessData.maintenancePlan.details.name")), activity.name],
                [t(tk("businessData.maintenancePlan.details.description")), activity.description],
                [t(tk("businessData.maintenancePlan.details.type")), activity.type],
                [t(tk("businessData.maintenancePlan.details.scheduleType")), activity.scheduleType],
                [t(tk("businessData.maintenancePlan.details.expectedDurationHours")), String(activity.expectedDurationHours)],
                [t(tk("businessData.maintenancePlan.details.executionRole")), activity.executionRole],
                [t(tk("businessData.maintenancePlan.details.requestApprovalMode")), activity.requestApprovalMode],
                [t(tk("businessData.maintenancePlan.details.maintenanceType")), activity.maintenanceType],
                [t(tk("businessData.maintenancePlan.details.materialTypeRestrictionMode")), activity.materialTypeRestrictionMode],
                [t(tk("businessData.maintenancePlan.details.orderReleaseMode")), activity.orderReleaseMode],
                [t(tk("businessData.maintenancePlan.details.acceptanceMode")), activity.acceptanceMode],
                [t(tk("businessData.maintenancePlan.details.ignoreInScheduling")), booleanLabel(activity.ignoreInScheduling)],
                [t(tk("businessData.maintenancePlan.details.autoDisableAfterLateDue")), booleanLabel(activity.autoDisableAfterLateDue)],
                [t(tk("businessData.maintenancePlan.details.postMaintenanceActivity")), activity.postMaintenanceActivity],
              ]}
            />
          </Card>
        )}
      </div>,
    );
  }

  if (top !== "details" || left !== tk("businessData.maintenancePlan.sections.details")) {
    return shell(
      <Empty>
        <Text>{t(tk("businessData.maintenancePlan.sections.empty"))}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t(tk("businessData.maintenancePlan.sections.maintenancePlan"))}>
        <KV
          rows={[
            [t(tk("businessData.maintenancePlan.details.name")), data.name],
            [t(tk("businessData.maintenancePlan.details.description")), data.description],
            [t(tk("businessData.maintenancePlan.details.type")), data.type],
            [t(tk("businessData.maintenancePlan.details.state")), data.state],
            [t(tk("businessData.maintenancePlan.details.scope")), data.scope],
            [t(tk("businessData.maintenancePlan.details.dataGroup")), data.dataGroup],
          ]}
        />
      </Card>
    </CardGrid>,
  );
}
