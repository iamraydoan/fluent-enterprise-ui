import { useState } from "react";
import type { CalendarDetail, CalendarUpsertInput } from "@/api";
import { useCreateCalendar, useSetCalendarState, useUpdateCalendar } from "@/api";
import { useAppTranslation } from "@/i18n";
import { ConfirmOperationDialog } from "../../components/ConfirmOperationDialog";
import { EntityWizardDialog } from "../../components/EntityWizardDialog";
import type { OperationValues, WizardStep } from "../../components/operationTypes";
import {
  EditCalendarDaysDialog,
  GenerateCalendarDaysDialog,
  RemoveCalendarDaysDialog,
} from "./CalendarManageDialogs";

const WEEK_DAY_OPTIONS = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];

const MONTH_OPTIONS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
].map((m) => ({ value: m, label: m }));

function buildCalendarSteps(): WizardStep[] {
  return [
    {
      titleKey: "businessData.calendar.detail.information",
      fields: [
        { key: "name", labelKey: "businessData.calendar.detail.name", type: "text", required: true },
        {
          key: "description",
          labelKey: "businessData.calendar.detail.description",
          type: "textarea",
        },
      ],
    },
    {
      titleKey: "businessData.calendar.operations.calendarInfo",
      fields: [
        { key: "timeZone", labelKey: "businessData.calendar.detail.timeZone", type: "text" },
        {
          key: "clockInEarlyStartMinutes",
          labelKey: "businessData.calendar.detail.clockInEarlyStart",
          type: "number",
        },
        {
          key: "enterpriseWideReportingDimension",
          labelKey: "businessData.calendar.detail.enterpriseReporting",
          type: "checkbox",
        },
        {
          key: "weekStartDay",
          labelKey: "businessData.calendar.detail.weekStartDay",
          type: "select",
          options: WEEK_DAY_OPTIONS,
        },
        {
          key: "fiscalStartDay",
          labelKey: "businessData.calendar.detail.fiscalStartDay",
          type: "number",
        },
        {
          key: "fiscalStartMonth",
          labelKey: "businessData.calendar.detail.fiscalStartMonth",
          type: "select",
          options: MONTH_OPTIONS,
        },
        { key: "dayStartTime", labelKey: "businessData.calendar.detail.dayStartTime", type: "text" },
      ],
    },
  ];
}

function toUpsertInput(values: OperationValues): CalendarUpsertInput {
  return {
    name: String(values.name ?? ""),
    description: values.description === undefined ? undefined : String(values.description),
    timeZone: values.timeZone === undefined ? undefined : String(values.timeZone),
    clockInEarlyStartMinutes:
      values.clockInEarlyStartMinutes === undefined
        ? undefined
        : Number(values.clockInEarlyStartMinutes),
    enterpriseWideReportingDimension: values.enterpriseWideReportingDimension === true,
    weekStartDay: values.weekStartDay === undefined ? undefined : String(values.weekStartDay),
    fiscalStartDay:
      values.fiscalStartDay === undefined ? undefined : Number(values.fiscalStartDay),
    fiscalStartMonth:
      values.fiscalStartMonth === undefined ? undefined : String(values.fiscalStartMonth),
    dayStartTime: values.dayStartTime === undefined ? undefined : String(values.dayStartTime),
  };
}

export interface CalendarDialogs {
  dialogs: React.ReactNode;
  openCreate: () => void;
  openEdit: () => void;
  openClone: () => void;
  openTerminate: () => void;
  openUnterminate: () => void;
  openGenerateDays: () => void;
  openEditDays: () => void;
  openRemoveDays: () => void;
}

export function useCalendarDialogs(calendar?: CalendarDetail): CalendarDialogs {
  const { t } = useAppTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [editDaysOpen, setEditDaysOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const createMutation = useCreateCalendar();
  const updateMutation = useUpdateCalendar();
  const stateMutation = useSetCalendarState();

  const steps = buildCalendarSteps();
  const entityLabel = t("businessData.calendar.entityName");

  const editInitial: OperationValues = calendar
    ? {
        name: calendar.name,
        description: calendar.description,
        timeZone: calendar.timeZone,
        clockInEarlyStartMinutes: calendar.clockInEarlyStartMinutes,
        enterpriseWideReportingDimension: calendar.enterpriseWideReportingDimension,
        weekStartDay: calendar.weekStartDay,
        fiscalStartDay: calendar.fiscalStartDay,
        fiscalStartMonth: calendar.fiscalStartMonth,
        dayStartTime: calendar.dayStartTime,
      }
    : {};

  const cloneSteps: WizardStep[] = [
    {
      titleKey: "businessData.calendar.detail.information",
      fields: [
        { key: "name", labelKey: "businessData.calendar.detail.name", type: "text", required: true },
        {
          key: "description",
          labelKey: "businessData.calendar.detail.description",
          type: "textarea",
        },
      ],
    },
  ];

  const dialogs = (
    <>
      <EntityWizardDialog
        open={createOpen}
        titleKey="businessData.calendar.operations.createTitle"
        steps={steps}
        submitLabelKey="common.create"
        onClose={() => setCreateOpen(false)}
        onSubmit={(values) => {
          createMutation.mutate(toUpsertInput(values));
          setCreateOpen(false);
        }}
      />
      <EntityWizardDialog
        open={editOpen}
        titleKey="businessData.calendar.operations.editTitle"
        steps={steps}
        initialValues={editInitial}
        submitLabelKey="common.save"
        onClose={() => setEditOpen(false)}
        onSubmit={(values) => {
          if (calendar)
            updateMutation.mutate({ name: calendar.name, input: toUpsertInput(values) });
          setEditOpen(false);
        }}
      />
      <EntityWizardDialog
        open={cloneOpen}
        titleKey="businessData.calendar.operations.cloneTitle"
        steps={cloneSteps}
        initialValues={
          calendar ? { name: `${calendar.name} - Clone`, description: calendar.description } : {}
        }
        submitLabelKey="common.create"
        onClose={() => setCloneOpen(false)}
        onSubmit={(values) => {
          if (calendar) {
            createMutation.mutate({
              ...toUpsertInput({ ...editInitial, ...values }),
              name: String(values.name ?? `${calendar.name} - Clone`),
            });
          }
          setCloneOpen(false);
        }}
      />
      <ConfirmOperationDialog
        open={terminateOpen}
        titleKey="businessData.calendar.operations.terminateTitle"
        messageKey="businessData.calendar.operations.terminateMessage"
        messageParams={{ name: calendar?.name ?? entityLabel }}
        confirmLabelKey="actionBar.terminate"
        danger
        onClose={() => setTerminateOpen(false)}
        onConfirm={() => {
          if (calendar) stateMutation.mutate({ name: calendar.name, state: "Terminated" });
        }}
      />
      <ConfirmOperationDialog
        open={unterminateOpen}
        titleKey="businessData.calendar.operations.unterminateTitle"
        messageKey="businessData.calendar.operations.unterminateMessage"
        messageParams={{ name: calendar?.name ?? entityLabel }}
        confirmLabelKey="actionBar.unterminate"
        onClose={() => setUnterminateOpen(false)}
        onConfirm={() => {
          if (calendar) stateMutation.mutate({ name: calendar.name, state: "Active" });
        }}
      />
      <GenerateCalendarDaysDialog
        open={generateOpen}
        calendarName={calendar?.name ?? ""}
        onClose={() => setGenerateOpen(false)}
      />
      <EditCalendarDaysDialog
        open={editDaysOpen}
        calendarName={calendar?.name ?? ""}
        onClose={() => setEditDaysOpen(false)}
      />
      <RemoveCalendarDaysDialog
        open={removeOpen}
        calendarName={calendar?.name ?? ""}
        onClose={() => setRemoveOpen(false)}
      />
    </>
  );

  return {
    dialogs,
    openCreate: () => setCreateOpen(true),
    openEdit: () => setEditOpen(true),
    openClone: () => setCloneOpen(true),
    openTerminate: () => setTerminateOpen(true),
    openUnterminate: () => setUnterminateOpen(true),
    openGenerateDays: () => setGenerateOpen(true),
    openEditDays: () => setEditDaysOpen(true),
    openRemoveDays: () => setRemoveOpen(true),
  };
}
