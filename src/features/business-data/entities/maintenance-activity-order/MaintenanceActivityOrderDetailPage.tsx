import { useState } from "react";
import { useMaintenanceActivityOrderDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Wrench24Regular } from "@/components/icons";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { formatDateTime } from "@/lib/formatDate";

const tk = (key: string) => key as TranslationKey;

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  tk("businessData.maintenanceActivityOrder.sections.details"),
  tk("businessData.maintenanceActivityOrder.sections.parts"),
  tk("businessData.maintenanceActivityOrder.sections.labor"),
  tk("businessData.maintenanceActivityOrder.sections.personnel"),
  tk("businessData.maintenanceActivityOrder.sections.transferRequirements"),
  tk("businessData.maintenanceActivityOrder.sections.documents"),
  tk("businessData.maintenanceActivityOrder.sections.pastMaos"),
  tk("businessData.maintenanceActivityOrder.sections.joinedMaos"),
  tk("businessData.maintenanceActivityOrder.sections.attachments"),
];

export function MaintenanceActivityOrderDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>(tk("businessData.maintenanceActivityOrder.sections.details"));
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
        <Text>{t(tk("businessData.maintenanceActivityOrder.sections.emptyBody"))}</Text>
      </Empty>,
    );
  }

  if (top !== "details" || left !== tk("businessData.maintenanceActivityOrder.sections.details")) {
    return shell(
      <Empty>
        <Text>{t(tk("businessData.maintenanceActivityOrder.sections.empty"))}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t(tk("businessData.maintenanceActivityOrder.sections.order"))}>
        <KV
          rows={[
            [t(tk("businessData.maintenanceActivityOrder.details.name")), data.name],
            [t(tk("businessData.maintenanceActivityOrder.details.description")), data.description],
            [t(tk("businessData.maintenanceActivityOrder.details.type")), data.type],
            [t(tk("businessData.maintenanceActivityOrder.details.state")), data.state],
            [t(tk("businessData.maintenanceActivityOrder.details.dataGroup")), data.dataGroup],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.maintenanceActivityOrder.sections.scheduling"))}>
        <KV
          rows={[
            [t(tk("businessData.maintenanceActivityOrder.details.scheduleDate")), formatDateTime(data.scheduleDate)],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.maintenanceActivityOrder.sections.requestInformation"))}>
        <KV
          rows={[
            [t(tk("businessData.maintenanceActivityOrder.details.requestedBy")), data.requestedBy],
            [t(tk("businessData.maintenanceActivityOrder.details.requestDate")), formatDateTime(data.requestDate)],
            [t(tk("businessData.maintenanceActivityOrder.details.comment")), data.comment],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.maintenanceActivityOrder.sections.definition"))}>
        <KV
          rows={[
            [t(tk("businessData.maintenanceActivityOrder.details.maintenancePlanInstance")), data.maintenancePlanInstance],
            [t(tk("businessData.maintenanceActivityOrder.details.resource")), data.resource],
            [t(tk("businessData.maintenanceActivityOrder.details.ownerRole")), data.ownerRole],
            [t(tk("businessData.maintenanceActivityOrder.details.maintenanceActivity")), data.maintenanceActivity],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.maintenanceActivityOrder.sections.execution"))}>
        <KV
          rows={[
            [t(tk("businessData.maintenanceActivityOrder.details.role")), data.role],
            [t(tk("businessData.maintenanceActivityOrder.details.beginDate")), data.beginDate === null ? "" : formatDateTime(data.beginDate)],
            [t(tk("businessData.maintenanceActivityOrder.details.endDate")), data.endDate === null ? "" : formatDateTime(data.endDate)],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.maintenanceActivityOrder.sections.information"))}>
        <KV
          rows={[
            [t(tk("businessData.maintenanceActivityOrder.details.scheduleType")), data.scheduleType],
            [t(tk("businessData.maintenanceActivityOrder.details.expectedDuration")), data.expectedDuration],
            [t(tk("businessData.maintenanceActivityOrder.details.executionState")), data.executionState],
            [t(tk("businessData.maintenanceActivityOrder.details.reworkCount")), String(data.reworkCount)],
            [t(tk("businessData.maintenanceActivityOrder.details.requestApprovalMode")), data.requestApprovalMode],
            [t(tk("businessData.maintenanceActivityOrder.details.maintenanceType")), data.maintenanceType],
            [t(tk("businessData.maintenanceActivityOrder.details.materialTypeRestrictionMode")), data.materialTypeRestrictionMode],
            [t(tk("businessData.maintenanceActivityOrder.details.materialType")), data.materialType],
            [t(tk("businessData.maintenanceActivityOrder.details.orderReleaseMode")), data.orderReleaseMode],
            [t(tk("businessData.maintenanceActivityOrder.details.completionAcceptanceMode")), data.completionAcceptanceMode],
            [t(tk("businessData.maintenanceActivityOrder.details.beginAndCompleteMode")), data.beginAndCompleteMode],
            [t(tk("businessData.maintenanceActivityOrder.details.cost")), `$${data.cost.toFixed(2)}`],
          ]}
        />
      </Card>
    </CardGrid>,
  );
}
