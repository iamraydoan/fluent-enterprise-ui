import { useState } from "react";
import { useEmployeeDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Organization24Regular } from "@/components/icons";
import { Button, Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { formatDateTime } from "@/lib/formatDate";
import { useBooleanLabel } from "../propertyLabels";
import {
  AssignSubordinatesDialog,
  AssignTeamWorkgroupDialog,
  CheckInDialog,
  CheckOutDialog,
  ClockInDialog,
  ClockOutDialog,
} from "./EmployeeAttendanceDialogs";
import {
  RemoveNonWorkingTimesDialog,
  RemoveWorkAvailabilityDialog,
  SetNonWorkingTimeDialog,
  SetWorkAvailabilityDialog,
} from "./EmployeeCalendarDaysDialogs";
import {
  AssignCertificationDialog,
  GrantCertificationDialog,
  ManageCertificationDialog,
} from "./EmployeeCertificationDialogs";
import { ManageDelegatesDialog, ManageTraineesDialog } from "./EmployeeDelegatesDialogs";
import { EmployeeDialog } from "./EmployeeDialog";
import {
  AssignQualificationDialog,
  ManageQualificationDialog,
} from "./EmployeeQualificationDialogs";
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
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [assignCertOpen, setAssignCertOpen] = useState(false);
  const [grantCertOpen, setGrantCertOpen] = useState(false);
  const [manageCertOpen, setManageCertOpen] = useState(false);
  const [assignQualOpen, setAssignQualOpen] = useState(false);
  const [manageQualOpen, setManageQualOpen] = useState(false);
  const [manageDelegatesOpen, setManageDelegatesOpen] = useState(false);
  const [manageTraineesOpen, setManageTraineesOpen] = useState(false);
  const [assignSubOpen, setAssignSubOpen] = useState(false);
  const [assignTeamOpen, setAssignTeamOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [clockInOpen, setClockInOpen] = useState(false);
  const [clockOutOpen, setClockOutOpen] = useState(false);
  const [nonWorkingOpen, setNonWorkingOpen] = useState(false);
  const [removeNonWorkingOpen, setRemoveNonWorkingOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [removeAvailabilityOpen, setRemoveAvailabilityOpen] = useState(false);
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
      {editOpen && (
        <EmployeeDialog mode={MODE_EDIT} initialName={name} onClose={() => setEditOpen(false)} />
      )}
      {cloneOpen && (
        <EmployeeDialog
          mode={MODE_CLONE}
          initialName={`${name} (Copy)`}
          onClose={() => setCloneOpen(false)}
        />
      )}
      {terminateOpen && (
        <EmployeeTerminateDialog
          name={name}
          mode={TERMINATE}
          onClose={() => setTerminateOpen(false)}
        />
      )}
      {unterminateOpen && (
        <EmployeeTerminateDialog
          name={name}
          mode={UNTERMINATE}
          onClose={() => setUnterminateOpen(false)}
        />
      )}
      {manageCertOpen && (
        <ManageCertificationDialog name={name} onClose={() => setManageCertOpen(false)} />
      )}
      {grantCertOpen && (
        <GrantCertificationDialog name={name} onClose={() => setGrantCertOpen(false)} />
      )}
      {assignCertOpen && (
        <AssignCertificationDialog name={name} onClose={() => setAssignCertOpen(false)} />
      )}
      {manageQualOpen && (
        <ManageQualificationDialog name={name} onClose={() => setManageQualOpen(false)} />
      )}
      {assignQualOpen && (
        <AssignQualificationDialog name={name} onClose={() => setAssignQualOpen(false)} />
      )}
      {checkInOpen && <CheckInDialog name={name} onClose={() => setCheckInOpen(false)} />}
      {checkOutOpen && <CheckOutDialog name={name} onClose={() => setCheckOutOpen(false)} />}
      {clockInOpen && <ClockInDialog name={name} onClose={() => setClockInOpen(false)} />}
      {clockOutOpen && <ClockOutDialog name={name} onClose={() => setClockOutOpen(false)} />}
      {assignSubOpen && (
        <AssignSubordinatesDialog name={name} onClose={() => setAssignSubOpen(false)} />
      )}
      {assignTeamOpen && (
        <AssignTeamWorkgroupDialog name={name} onClose={() => setAssignTeamOpen(false)} />
      )}
      {manageDelegatesOpen && (
        <ManageDelegatesDialog name={name} onClose={() => setManageDelegatesOpen(false)} />
      )}
      {manageTraineesOpen && (
        <ManageTraineesDialog name={name} onClose={() => setManageTraineesOpen(false)} />
      )}
      {nonWorkingOpen && (
        <SetNonWorkingTimeDialog name={name} onClose={() => setNonWorkingOpen(false)} />
      )}
      {availabilityOpen && (
        <SetWorkAvailabilityDialog name={name} onClose={() => setAvailabilityOpen(false)} />
      )}
      {removeNonWorkingOpen && (
        <RemoveNonWorkingTimesDialog name={name} onClose={() => setRemoveNonWorkingOpen(false)} />
      )}
      {removeAvailabilityOpen && (
        <RemoveWorkAvailabilityDialog
          name={name}
          onClose={() => setRemoveAvailabilityOpen(false)}
        />
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
            [
              t("businessData.employee.details.enableAutomaticClockIn"),
              booleanLabel(data.enableAutomaticClockIn),
            ],
            [
              t("businessData.employee.details.lastClockInDate"),
              data.lastClockInDate === null ? "" : formatDateTime(data.lastClockInDate),
            ],
            [t("businessData.employee.details.clockedState"), data.clockedState],
            [
              t("businessData.employee.details.automaticClockOutAtEndOfShift"),
              booleanLabel(data.automaticClockOutAtEndOfShift),
            ],
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
        <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
          <Button onClick={() => setManageCertOpen(true)}>
            {t("businessData.employee.certifications.manage")}
          </Button>
          <Button onClick={() => setGrantCertOpen(true)}>
            {t("businessData.employee.certifications.grant")}
          </Button>
          <Button onClick={() => setAssignCertOpen(true)}>
            {t("businessData.employee.certifications.assign")}
          </Button>
          <Button onClick={() => setManageQualOpen(true)}>
            {t("businessData.employee.qualifications.manage")}
          </Button>
          <Button onClick={() => setAssignQualOpen(true)}>
            {t("businessData.employee.qualifications.assign")}
          </Button>
        </div>
        <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Button size="small" onClick={() => setCheckInOpen(true)}>
            {t("businessData.employee.attendance.checkIn")}
          </Button>
          <Button size="small" onClick={() => setCheckOutOpen(true)}>
            {t("businessData.employee.attendance.checkOut")}
          </Button>
          <Button size="small" onClick={() => setClockInOpen(true)}>
            {t("businessData.employee.attendance.clockIn")}
          </Button>
          <Button size="small" onClick={() => setClockOutOpen(true)}>
            {t("businessData.employee.attendance.clockOut")}
          </Button>
          <Button size="small" onClick={() => setAssignSubOpen(true)}>
            {t("businessData.employee.attendance.assign")}
          </Button>
          <Button size="small" onClick={() => setAssignTeamOpen(true)}>
            {t("businessData.employee.attendance.save")}
          </Button>
          <Button size="small" onClick={() => setManageDelegatesOpen(true)}>
            {t("businessData.employee.delegates.manage")}
          </Button>
          <Button size="small" onClick={() => setManageTraineesOpen(true)}>
            {t("businessData.employee.delegates.checkOut")}
          </Button>
        </div>
        <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Button size="small" onClick={() => setNonWorkingOpen(true)}>
            {t("businessData.employee.calendarDays.set")}
          </Button>
          <Button size="small" onClick={() => setAvailabilityOpen(true)}>
            {t("businessData.employee.calendarDays.set")}
          </Button>
          <Button size="small" onClick={() => setRemoveNonWorkingOpen(true)}>
            {t("businessData.employee.calendarDays.remove")}
          </Button>
          <Button size="small" onClick={() => setRemoveAvailabilityOpen(true)}>
            {t("businessData.employee.calendarDays.remove")}
          </Button>
        </div>
      </Card>
    </CardGrid>,
  );
}
