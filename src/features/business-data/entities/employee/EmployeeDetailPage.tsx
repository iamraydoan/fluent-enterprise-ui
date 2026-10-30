import { useState } from "react";
import { useEmployeeDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Organization24Regular } from "@/components/icons";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { formatDateTime } from "@/lib/formatDate";
import { useBooleanLabel } from "../propertyLabels";

const tk = (key: string) => key as TranslationKey;

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "calendar", labelKey: tk("businessData.employee.tabs.calendar") },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  tk("businessData.employee.sections.details"),
  tk("businessData.employee.sections.subordinates"),
  tk("businessData.employee.sections.delegates"),
  tk("businessData.employee.sections.certifications"),
  tk("businessData.employee.sections.qualifications"),
  tk("businessData.employee.sections.timeSheetEntries"),
  tk("businessData.employee.sections.checkInInformation"),
  tk("businessData.employee.sections.attachments"),
];

export function EmployeeDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>(tk("businessData.employee.sections.details"));
  const { data, isLoading } = useEmployeeDetail(name);
  const booleanLabel = useBooleanLabel();

  const shell = (content: React.ReactNode) => (
    <DetailShell
      title={name}
      icon={<Organization24Regular />}
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
        <Text>{t(tk("businessData.employee.sections.emptyBody"))}</Text>
      </Empty>,
    );
  }

  if (top !== "details" || left !== tk("businessData.employee.sections.details")) {
    return shell(
      <Empty>
        <Text>{t(tk("businessData.employee.sections.empty"))}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t(tk("businessData.employee.sections.employee"))}>
        <KV
          rows={[
            [t(tk("businessData.employee.details.name")), data.name],
            [t(tk("businessData.employee.details.description")), data.description],
            [t(tk("businessData.employee.details.type")), data.type],
            [t(tk("businessData.employee.details.state")), data.state],
            [t(tk("businessData.employee.details.dataGroup")), data.dataGroup],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.employee.sections.clockInOut"))}>
        <KV
          rows={[
            [t(tk("businessData.employee.details.requireClockIn")), booleanLabel(data.requireClockIn)],
            [t(tk("businessData.employee.details.enableAutomaticClockIn")), booleanLabel(data.enableAutomaticClockIn)],
            [t(tk("businessData.employee.details.lastClockInDate")), data.lastClockInDate === null ? "" : formatDateTime(data.lastClockInDate)],
            [t(tk("businessData.employee.details.clockedState")), data.clockedState],
            [t(tk("businessData.employee.details.automaticClockOutAtEndOfShift")), booleanLabel(data.automaticClockOutAtEndOfShift)],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.employee.sections.information"))}>
        <KV
          rows={[
            [t(tk("businessData.employee.details.user")), data.user],
            [t(tk("businessData.employee.details.number")), data.number],
            [t(tk("businessData.employee.details.area")), data.area],
            [t(tk("businessData.employee.details.calendar")), data.calendar],
            [t(tk("businessData.employee.details.team")), data.team],
            [t(tk("businessData.employee.details.manager")), data.manager],
            [t(tk("businessData.employee.details.position")), data.position],
            [t(tk("businessData.employee.details.workgroup")), data.workgroup],
            [t(tk("businessData.employee.details.shiftplan")), data.shiftplan],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.employee.sections.costing"))}>
        <KV
          rows={[
            [t(tk("businessData.employee.details.costCenter")), data.costCenter],
            [t(tk("businessData.employee.details.costPerHour")), `$${data.costPerHour.toFixed(2)}`],
          ]}
        />
      </Card>
    </CardGrid>,
  );
}
