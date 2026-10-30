import { useState } from "react";
import { useMaintenancePlanDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Wrench24Regular } from "@/components/icons";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useBooleanLabel } from "../propertyLabels";


const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "activities", labelKey: "businessData.maintenancePlan.tabs.maintenanceActivities" },
  { value: "compare", labelKey: "businessData.maintenancePlan.tabs.compare" },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  "businessData.maintenancePlan.sections.details",
  "businessData.maintenancePlan.sections.instances",
  "businessData.maintenancePlan.sections.attachments",
];

export function MaintenancePlanDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.maintenancePlan.sections.details");
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
        <Text>{t("businessData.maintenancePlan.sections.emptyBody")}</Text>
      </Empty>,
    );
  }

  if (top === "activities") {
    const activity = data.activities[selectedActivity];
    return shell(
      <div style={{ display: "flex", gap: 16, height: "100%" }}>
        <Panel>
          <Text weight="semibold">{t("businessData.maintenancePlan.sections.activities")}</Text>
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
          <Card title={t("businessData.maintenancePlan.sections.generalData")}>
            <KV
              rows={[
                [t("businessData.maintenancePlan.details.name"), activity.name],
                [t("businessData.maintenancePlan.details.description"), activity.description],
                [t("businessData.maintenancePlan.details.type"), activity.type],
                [t("businessData.maintenancePlan.details.scheduleType"), activity.scheduleType],
                [t("businessData.maintenancePlan.details.expectedDurationHours"), String(activity.expectedDurationHours)],
                [t("businessData.maintenancePlan.details.executionRole"), activity.executionRole],
                [t("businessData.maintenancePlan.details.requestApprovalMode"), activity.requestApprovalMode],
                [t("businessData.maintenancePlan.details.maintenanceType"), activity.maintenanceType],
                [t("businessData.maintenancePlan.details.materialTypeRestrictionMode"), activity.materialTypeRestrictionMode],
                [t("businessData.maintenancePlan.details.orderReleaseMode"), activity.orderReleaseMode],
                [t("businessData.maintenancePlan.details.acceptanceMode"), activity.acceptanceMode],
                [t("businessData.maintenancePlan.details.ignoreInScheduling"), booleanLabel(activity.ignoreInScheduling)],
                [t("businessData.maintenancePlan.details.autoDisableAfterLateDue"), booleanLabel(activity.autoDisableAfterLateDue)],
                [t("businessData.maintenancePlan.details.postMaintenanceActivity"), activity.postMaintenanceActivity],
              ]}
            />
          </Card>
        )}
      </div>,
    );
  }

  if (top !== "details" || left !== "businessData.maintenancePlan.sections.details") {
    return shell(
      <Empty>
        <Text>{t("businessData.maintenancePlan.sections.empty")}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t("businessData.maintenancePlan.sections.maintenancePlan")}>
        <KV
          rows={[
            [t("businessData.maintenancePlan.details.name"), data.name],
            [t("businessData.maintenancePlan.details.description"), data.description],
            [t("businessData.maintenancePlan.details.type"), data.type],
            [t("businessData.maintenancePlan.details.state"), data.state],
            [t("businessData.maintenancePlan.details.scope"), data.scope],
            [t("businessData.maintenancePlan.details.dataGroup"), data.dataGroup],
          ]}
        />
      </Card>
    </CardGrid>,
  );
}
