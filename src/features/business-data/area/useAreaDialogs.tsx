import { useState } from "react";
import type { AreaDetail, AreaUpsertInput } from "@/api";
import { useCreateArea, useSetAreaState, useUpdateArea } from "@/api";
import { useAppTranslation } from "@/i18n";
import { ConfirmOperationDialog } from "../components/ConfirmOperationDialog";
import { EntityWizardDialog } from "../components/EntityWizardDialog";
import type { OperationValues, WizardStep } from "../components/operationTypes";
import {
  ManageSupplyAreasDialog,
  ManageTransferRequirementTypesDialog,
  ViewAreaDashboardsDialog,
} from "./AreaDialogs";

const AREA_TYPE_OPTIONS = [
  { value: "Area", label: "Area" },
  { value: "Production Line", label: "Production Line" },
  { value: "Storage Area", label: "Storage Area" },
];

const TYPE_OPTIONS = [
  { value: "Cookie Production", label: "Cookie Production" },
  { value: "Process", label: "Process" },
];

const FACILITY_OPTIONS = [{ value: "Cookie Factory", label: "Cookie Factory" }];
const CALENDAR_OPTIONS = [{ value: "Standard", label: "Standard" }];

const CREATE_AREA_STEPS: WizardStep[] = [
  {
    titleKey: "businessData.area.detail.generalData",
    fields: [
      { key: "name", labelKey: "businessData.area.detail.name", type: "text", required: true },
      { key: "description", labelKey: "businessData.area.detail.description", type: "textarea" },
      {
        key: "type",
        labelKey: "businessData.area.detail.type",
        type: "select",
        options: TYPE_OPTIONS,
        required: true,
      },
      {
        key: "facility",
        labelKey: "businessData.area.detail.facility",
        type: "select",
        options: FACILITY_OPTIONS,
        required: true,
      },
      { key: "displayOrder", labelKey: "businessData.area.detail.displayOrder", type: "number" },
      {
        key: "areaType",
        labelKey: "businessData.area.detail.areaType",
        type: "select",
        options: AREA_TYPE_OPTIONS,
        required: true,
      },
      {
        key: "parentArea",
        labelKey: "businessData.area.operations.parentArea",
        type: "text",
      },
    ],
  },
  {
    titleKey: "businessData.area.operations.additionalInformation",
    fields: [
      {
        key: "calendar",
        labelKey: "businessData.area.detail.calendar",
        type: "select",
        options: CALENDAR_OPTIONS,
      },
      { key: "schedule", labelKey: "businessData.area.detail.schedule", type: "text" },
      {
        key: "costCenter",
        labelKey: "businessData.area.detail.costCenter",
        type: "text",
      },
      {
        key: "enableShiftLogbook",
        labelKey: "businessData.area.detail.enableShiftLogbook",
        type: "checkbox",
      },
    ],
  },
];

const CLONE_AREA_STEPS: WizardStep[] = [
  {
    titleKey: "businessData.area.detail.generalData",
    fields: [
      {
        key: "name",
        labelKey: "businessData.area.operations.newName",
        type: "text",
        required: true,
      },
    ],
  },
];

function toUpsertInput(values: OperationValues): AreaUpsertInput {
  return {
    name: String(values.name ?? ""),
    description: values.description === undefined ? undefined : String(values.description),
    facility: values.facility === undefined ? undefined : String(values.facility),
    type: values.type === undefined ? undefined : String(values.type),
    displayOrder: values.displayOrder === undefined ? undefined : Number(values.displayOrder),
    areaType: values.areaType === undefined ? undefined : String(values.areaType),
    calendar: values.calendar === undefined ? undefined : String(values.calendar),
    schedule: values.schedule === undefined ? undefined : String(values.schedule),
    costCenter: values.costCenter === undefined ? undefined : String(values.costCenter),
    enableShiftLogbook: values.enableShiftLogbook === true,
  };
}

export interface AreaDialogs {
  dialogs: React.ReactNode;
  openCreate: () => void;
  openEdit: () => void;
  openClone: () => void;
  openTerminate: () => void;
  openUnterminate: () => void;
  openSupplyAreas: () => void;
  openTransferTypes: () => void;
  openDashboards: () => void;
}

export function useAreaDialogs(area?: AreaDetail): AreaDialogs {
  const { t } = useAppTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [supplyAreasOpen, setSupplyAreasOpen] = useState(false);
  const [transferTypesOpen, setTransferTypesOpen] = useState(false);
  const [dashboardsOpen, setDashboardsOpen] = useState(false);

  const createMutation = useCreateArea();
  const updateMutation = useUpdateArea();
  const stateMutation = useSetAreaState();

  const editInitial: OperationValues = area
    ? {
        name: area.name,
        description: area.description,
        type: area.type,
        facility: area.facility,
        displayOrder: area.displayOrder,
        areaType: area.areaType,
        calendar: area.calendar,
        schedule: area.schedule,
        costCenter: area.costCenter,
        enableShiftLogbook: area.enableShiftLogbook,
      }
    : {};

  const cloneInitial: OperationValues = area
    ? {
        name: `${area.name} (1)`,
        description: area.description,
        type: area.type,
        facility: area.facility,
        displayOrder: area.displayOrder,
        areaType: area.areaType,
        calendar: area.calendar,
        schedule: area.schedule,
        costCenter: area.costCenter,
        enableShiftLogbook: area.enableShiftLogbook,
      }
    : {};

  const entityName = t("businessData.area.entityName");

  const dialogs = (
    <>
      <EntityWizardDialog
        open={createOpen}
        titleKey="businessData.area.operations.createTitle"
        steps={CREATE_AREA_STEPS}
        submitLabelKey="common.create"
        onClose={() => setCreateOpen(false)}
        onSubmit={(values) => {
          createMutation.mutate(toUpsertInput(values));
          setCreateOpen(false);
        }}
      />
      <EntityWizardDialog
        open={editOpen}
        titleKey="businessData.area.operations.editTitle"
        steps={CREATE_AREA_STEPS}
        initialValues={editInitial}
        submitLabelKey="common.save"
        onClose={() => setEditOpen(false)}
        onSubmit={(values) => {
          if (area) {
            updateMutation.mutate({ name: area.name, input: toUpsertInput(values) });
          }
          setEditOpen(false);
        }}
      />
      <EntityWizardDialog
        open={cloneOpen}
        titleKey="businessData.area.operations.cloneTitle"
        steps={CLONE_AREA_STEPS}
        initialValues={{ name: String(cloneInitial.name ?? "") }}
        submitLabelKey="common.create"
        onClose={() => setCloneOpen(false)}
        onSubmit={(values) => {
          createMutation.mutate(toUpsertInput({ ...cloneInitial, name: values.name }));
          setCloneOpen(false);
        }}
      />
      <ConfirmOperationDialog
        open={terminateOpen}
        titleKey="businessData.area.operations.terminateTitle"
        messageKey="businessData.area.operations.terminateMessage"
        messageParams={{ name: area?.name ?? entityName }}
        confirmLabelKey="actionBar.terminate"
        danger
        onClose={() => setTerminateOpen(false)}
        onConfirm={() => {
          if (area) stateMutation.mutate({ name: area.name, state: "Terminated" });
        }}
      />
      <ConfirmOperationDialog
        open={unterminateOpen}
        titleKey="businessData.area.operations.unterminateTitle"
        messageKey="businessData.area.operations.unterminateMessage"
        messageParams={{ name: area?.name ?? entityName }}
        confirmLabelKey="actionBar.unterminate"
        onClose={() => setUnterminateOpen(false)}
        onConfirm={() => {
          if (area) stateMutation.mutate({ name: area.name, state: "Active" });
        }}
      />
      <ManageSupplyAreasDialog
        open={supplyAreasOpen}
        areaName={area?.name ?? ""}
        onClose={() => setSupplyAreasOpen(false)}
      />
      <ManageTransferRequirementTypesDialog
        open={transferTypesOpen}
        areaName={area?.name ?? ""}
        onClose={() => setTransferTypesOpen(false)}
      />
      <ViewAreaDashboardsDialog open={dashboardsOpen} onClose={() => setDashboardsOpen(false)} />
    </>
  );

  return {
    dialogs,
    openCreate: () => setCreateOpen(true),
    openEdit: () => setEditOpen(true),
    openClone: () => setCloneOpen(true),
    openTerminate: () => setTerminateOpen(true),
    openUnterminate: () => setUnterminateOpen(true),
    openSupplyAreas: () => setSupplyAreasOpen(true),
    openTransferTypes: () => setTransferTypesOpen(true),
    openDashboards: () => setDashboardsOpen(true),
  };
}
