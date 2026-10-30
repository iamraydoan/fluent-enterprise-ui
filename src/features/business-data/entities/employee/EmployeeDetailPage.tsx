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
import { EmployeeDialog } from "./EmployeeDialog";
import { EmployeeTerminateDialog } from "./EmployeeTerminateDialog";
import { MODE_CLONE, MODE_EDIT, TERMINATE, UNTERMINATE } from "./wizardMode";


const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "calendar", labelKey: "businessData.employee.tabs.calendar" },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  "businessData.employee.sections.details",
  "businessData.employee.sections.subordinates",
  "businessData.employee.sections.delegates",
  "businessData.employee.sections.certifications",
  "businessData.employee.sections.qualifications",
  "businessData.employee.sections.timeSheetEntries",
  "businessData.employee.sections.checkInInformation",
  "businessData.employee.sections.attachments",
];

export function EmployeeDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.employee.sections.details");
  const { data, isLoading } = useEmployeeDetail(name);
  const booleanLabel = useBooleanLabel();

  const shell = (content: React.ReactNode) => (
    <>
    <DetailShell
      title={name}
      icon={<Organization24Regular />}
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
    {editOpen && <EmployeeDialog mode={MODE_EDIT} initialName={name} onClose={() => setEditOpen(false)} />}
    {cloneOpen && (
      <EmployeeDialog mode={MODE_CLONE} initialName={`${name} (Copy)`} onClose={() => setCloneOpen(false)} />
    )}
    {terminateOpen && (
      <EmployeeTerminateDialog name={name} mode={TERMINATE} onClose={() => setTerminateOpen(false)} />
    )}
    {unterminateOpen && (
      <EmployeeTerminateDialog name={name} mode={UNTERMINATE} onClose={() => setUnterminateOpen(false)} />
    )}
    </>
  );

  if (isLoading || !data) {
    return shell(
      <Empty>
        <Text>{t("businessData.employee.sections.emptyBody")}</Text>
      </Empty>,
    );
  }

  if (top !== "details" || left !== "businessData.employee.sections.details") {
    return shell(
      <Empty>
        <Text>{t("businessData.employee.sections.empty")}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t("businessData.employee.sections.employee")}>
        <KV
          rows={[
            [t("businessData.employee.details.name"), data.name],
            [t("businessData.employee.details.description"), data.description],
            [t("businessData.employee.details.type"), data.type],
            [t("businessData.employee.details.state"), data.state],
            [t("businessData.employee.details.dataGroup"), data.dataGroup],
          ]}
        />
      </Card>
      <Card title={t("businessData.employee.sections.clockInOut")}>
        <KV
          rows={[
            [t("businessData.employee.details.requireClockIn"), booleanLabel(data.requireClockIn)],
            [t("businessData.employee.details.enableAutomaticClockIn"), booleanLabel(data.enableAutomaticClockIn)],
            [t("businessData.employee.details.lastClockInDate"), data.lastClockInDate === null ? "" : formatDateTime(data.lastClockInDate)],
            [t("businessData.employee.details.clockedState"), data.clockedState],
            [t("businessData.employee.details.automaticClockOutAtEndOfShift"), booleanLabel(data.automaticClockOutAtEndOfShift)],
          ]}
        />
      </Card>
      <Card title={t("businessData.employee.sections.information")}>
        <KV
          rows={[
            [t("businessData.employee.details.user"), data.user],
            [t("businessData.employee.details.number"), data.number],
            [t("businessData.employee.details.area"), data.area],
            [t("businessData.employee.details.calendar"), data.calendar],
            [t("businessData.employee.details.team"), data.team],
            [t("businessData.employee.details.manager"), data.manager],
            [t("businessData.employee.details.position"), data.position],
            [t("businessData.employee.details.workgroup"), data.workgroup],
            [t("businessData.employee.details.shiftplan"), data.shiftplan],
          ]}
        />
      </Card>
      <Card title={t("businessData.employee.sections.costing")}>
        <KV
          rows={[
            [t("businessData.employee.details.costCenter"), data.costCenter],
            [t("businessData.employee.details.costPerHour"), `$${data.costPerHour.toFixed(2)}`],
          ]}
        />
      </Card>
    </CardGrid>,
  );
}
