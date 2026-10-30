import { useState } from "react";
import { useMaintenanceActivityOrderDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Wrench24Regular } from "@/components/icons";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { formatDateTime } from "@/lib/formatDate";


const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  "businessData.maintenanceActivityOrder.sections.details",
  "businessData.maintenanceActivityOrder.sections.parts",
  "businessData.maintenanceActivityOrder.sections.labor",
  "businessData.maintenanceActivityOrder.sections.personnel",
  "businessData.maintenanceActivityOrder.sections.transferRequirements",
  "businessData.maintenanceActivityOrder.sections.documents",
  "businessData.maintenanceActivityOrder.sections.pastMaos",
  "businessData.maintenanceActivityOrder.sections.joinedMaos",
  "businessData.maintenanceActivityOrder.sections.attachments",
];

export function MaintenanceActivityOrderDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.maintenanceActivityOrder.sections.details");
  const { data, isLoading } = useMaintenanceActivityOrderDetail(name);

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
        <Text>{t("businessData.maintenanceActivityOrder.sections.emptyBody")}</Text>
      </Empty>,
    );
  }

  if (top !== "details" || left !== "businessData.maintenanceActivityOrder.sections.details") {
    return shell(
      <Empty>
        <Text>{t("businessData.maintenanceActivityOrder.sections.empty")}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t("businessData.maintenanceActivityOrder.sections.order")}>
        <KV
          rows={[
            [t("businessData.maintenanceActivityOrder.details.name"), data.name],
            [t("businessData.maintenanceActivityOrder.details.description"), data.description],
            [t("businessData.maintenanceActivityOrder.details.type"), data.type],
            [t("businessData.maintenanceActivityOrder.details.state"), data.state],
            [t("businessData.maintenanceActivityOrder.details.dataGroup"), data.dataGroup],
          ]}
        />
      </Card>
      <Card title={t("businessData.maintenanceActivityOrder.sections.scheduling")}>
        <KV
          rows={[
            [t("businessData.maintenanceActivityOrder.details.scheduleDate"), formatDateTime(data.scheduleDate)],
          ]}
        />
      </Card>
      <Card title={t("businessData.maintenanceActivityOrder.sections.requestInformation")}>
        <KV
          rows={[
            [t("businessData.maintenanceActivityOrder.details.requestedBy"), data.requestedBy],
            [t("businessData.maintenanceActivityOrder.details.requestDate"), formatDateTime(data.requestDate)],
            [t("businessData.maintenanceActivityOrder.details.comment"), data.comment],
          ]}
        />
      </Card>
      <Card title={t("businessData.maintenanceActivityOrder.sections.definition")}>
        <KV
          rows={[
            [t("businessData.maintenanceActivityOrder.details.maintenancePlanInstance"), data.maintenancePlanInstance],
            [t("businessData.maintenanceActivityOrder.details.resource"), data.resource],
            [t("businessData.maintenanceActivityOrder.details.ownerRole"), data.ownerRole],
            [t("businessData.maintenanceActivityOrder.details.maintenanceActivity"), data.maintenanceActivity],
          ]}
        />
      </Card>
      <Card title={t("businessData.maintenanceActivityOrder.sections.execution")}>
        <KV
          rows={[
            [t("businessData.maintenanceActivityOrder.details.role"), data.role],
            [t("businessData.maintenanceActivityOrder.details.beginDate"), data.beginDate === null ? "" : formatDateTime(data.beginDate)],
            [t("businessData.maintenanceActivityOrder.details.endDate"), data.endDate === null ? "" : formatDateTime(data.endDate)],
          ]}
        />
      </Card>
      <Card title={t("businessData.maintenanceActivityOrder.sections.information")}>
        <KV
          rows={[
            [t("businessData.maintenanceActivityOrder.details.scheduleType"), data.scheduleType],
            [t("businessData.maintenanceActivityOrder.details.expectedDuration"), data.expectedDuration],
            [t("businessData.maintenanceActivityOrder.details.executionState"), data.executionState],
            [t("businessData.maintenanceActivityOrder.details.reworkCount"), String(data.reworkCount)],
            [t("businessData.maintenanceActivityOrder.details.requestApprovalMode"), data.requestApprovalMode],
            [t("businessData.maintenanceActivityOrder.details.maintenanceType"), data.maintenanceType],
            [t("businessData.maintenanceActivityOrder.details.materialTypeRestrictionMode"), data.materialTypeRestrictionMode],
            [t("businessData.maintenanceActivityOrder.details.materialType"), data.materialType],
            [t("businessData.maintenanceActivityOrder.details.orderReleaseMode"), data.orderReleaseMode],
            [t("businessData.maintenanceActivityOrder.details.completionAcceptanceMode"), data.completionAcceptanceMode],
            [t("businessData.maintenanceActivityOrder.details.beginAndCompleteMode"), data.beginAndCompleteMode],
            [t("businessData.maintenanceActivityOrder.details.cost"), `$${data.cost.toFixed(2)}`],
          ]}
        />
      </Card>
    </CardGrid>,
  );
}
