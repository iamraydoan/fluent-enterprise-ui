import { useState } from "react";
import type { ContainerDetail, ContainerOperationType, ContainerUpsertInput } from "@/api";
import {
  useContainerOperation,
  useCreateContainer,
  useSetContainerState,
  useUpdateContainer,
} from "@/api";
import { useAppTranslation } from "@/i18n";
import { ConfirmOperationDialog } from "../../components/ConfirmOperationDialog";
import { EntityWizardDialog } from "../../components/EntityWizardDialog";
import type { OperationValues, WizardField, WizardStep } from "../../components/operationTypes";
import {
  AddContainerToContainerDialog,
  CloneContainerDialog,
  type CloneContainerRow,
  CommentConfirmDialog,
  DockContainerDialog,
  ManagePositionsDialog,
  StoreContainerDialog,
  TransferContainerDialog,
  TransferMaterialDialog,
} from "./ContainerManageDialogs";
import {
  CAPACITY_VALIDATION_MODES,
  OP_ADD_CONTAINER,
  OP_DOCK,
  OP_EMPTY,
  OP_MAKE_AVAILABLE,
  OP_MAKE_UNAVAILABLE,
  OP_MANAGE_POSITIONS,
  OP_REMOVE_CONTAINER,
  OP_RETRIEVE,
  OP_STORE,
  OP_TRANSFER_CONTAINER,
  OP_TRANSFER_MATERIAL,
  OP_UNDOCK,
  ORIENTATIONS,
  POSITION_SORTINGS,
  POSITION_UNIT_TYPES,
} from "./containerLookups";

const POSITION_UNIT_TYPE_OPTIONS = POSITION_UNIT_TYPES.map((v) => ({ value: v, label: v }));
const CAPACITY_MODE_OPTIONS = CAPACITY_VALIDATION_MODES.map((v) => ({ value: v, label: v }));
const ORIENTATION_OPTIONS = ORIENTATIONS.map((v) => ({ value: v, label: v }));
const SORTING_OPTIONS = POSITION_SORTINGS.map((v) => ({ value: v, label: v }));

function str(v: string | number | boolean | undefined): string | undefined {
  if (v === undefined) return undefined;
  return String(v);
}

function num(v: string | number | boolean | undefined): number | undefined {
  if (v === undefined || v === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function bool(v: string | number | boolean | undefined): boolean {
  return v === true;
}

function buildContainerSteps(editMode: boolean): WizardStep[] {
  const nameField: WizardField[] = editMode
    ? []
    : [
        {
          key: "name",
          labelKey: "businessData.container.detail.name",
          type: "text",
          required: true,
        },
      ];
  return [
    {
      titleKey: "businessData.container.operations.stepGeneralData",
      fields: [
        ...nameField,
        {
          key: "description",
          labelKey: "businessData.container.detail.description",
          type: "textarea",
        },
        { key: "type", labelKey: "businessData.container.detail.type", type: "text" },
        { key: "dataGroup", labelKey: "businessData.container.detail.dataGroup", type: "text" },
        { key: "facility", labelKey: "businessData.container.detail.facility", type: "text" },
        { key: "vendor", labelKey: "businessData.container.detail.vendor", type: "text" },
        { key: "vendorId", labelKey: "businessData.container.detail.vendorId", type: "text" },
        {
          key: "positionUnitType",
          labelKey: "businessData.container.detail.positionUnitType",
          type: "select",
          options: POSITION_UNIT_TYPE_OPTIONS,
        },
        {
          key: "autoGeneratePositions",
          labelKey: "businessData.container.detail.autoGeneratePositions",
          type: "checkbox",
        },
        {
          key: "totalPositions",
          labelKey: "businessData.container.detail.totalPositions",
          type: "number",
        },
        {
          key: "capacityValidationMode",
          labelKey: "businessData.container.detail.capacityValidationMode",
          type: "select",
          options: CAPACITY_MODE_OPTIONS,
        },
        {
          key: "capacityForm",
          labelKey: "businessData.container.detail.capacityForm",
          type: "text",
        },
        {
          key: "capacityUnit",
          labelKey: "businessData.container.detail.capacityUnit",
          type: "text",
        },
        {
          key: "capacityPerPosition",
          labelKey: "businessData.container.detail.capacityPerPosition",
          type: "number",
        },
        {
          key: "allowMixedTypes",
          labelKey: "businessData.container.detail.allowMixedTypes",
          type: "checkbox",
        },
        {
          key: "orientation",
          labelKey: "businessData.container.detail.orientation",
          type: "select",
          options: ORIENTATION_OPTIONS,
        },
        {
          key: "positionSorting",
          labelKey: "businessData.container.detail.positionSorting",
          type: "select",
          options: SORTING_OPTIONS,
        },
      ],
    },
  ];
}

function toContainerUpsertInput(values: OperationValues): ContainerUpsertInput {
  return {
    name: str(values.name),
    description: str(values.description),
    type: str(values.type),
    dataGroup: str(values.dataGroup),
    facility: str(values.facility),
    vendor: str(values.vendor),
    vendorId: str(values.vendorId),
    positionUnitType: str(values.positionUnitType),
    autoGeneratePositions: bool(values.autoGeneratePositions),
    totalPositions: num(values.totalPositions),
    capacityValidationMode: str(values.capacityValidationMode),
    capacityForm: str(values.capacityForm),
    capacityUnit: str(values.capacityUnit),
    capacityPerPosition: num(values.capacityPerPosition),
    allowMixedTypes: bool(values.allowMixedTypes),
    orientation: str(values.orientation),
    positionSorting: str(values.positionSorting),
  };
}

function containerToValues(c: ContainerDetail): OperationValues {
  return {
    name: c.name,
    description: c.description,
    type: c.type,
    dataGroup: c.dataGroup,
    facility: c.facility,
    vendor: c.vendor,
    vendorId: c.vendorId,
    positionUnitType: c.positionUnitType,
    autoGeneratePositions: c.autoGeneratePositions,
    totalPositions: c.totalPositions,
    capacityValidationMode: c.capacityValidationMode,
    capacityForm: c.capacityForm,
    capacityUnit: c.capacityUnit,
    capacityPerPosition: c.capacityPerPosition,
    allowMixedTypes: c.allowMixedTypes,
    orientation: c.orientation,
    positionSorting: c.positionSorting,
  };
}

export interface ContainerDialogs {
  dialogs: React.ReactNode;
  openCreate: () => void;
  openEdit: () => void;
  openClone: () => void;
  openTerminate: () => void;
  openUnterminate: () => void;
  openAddContainer: () => void;
  openDock: () => void;
  openEmpty: () => void;
  openMakeAvailable: () => void;
  openMakeUnavailable: () => void;
  openManagePositions: () => void;
  openRemoveContainer: () => void;
  openRetrieve: () => void;
  openStore: () => void;
  openTransferContainer: () => void;
  openTransferMaterial: () => void;
  openUndock: () => void;
}

export function useContainerDialogs(c?: ContainerDetail): ContainerDialogs {
  const { t } = useAppTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [dockOpen, setDockOpen] = useState(false);
  const [emptyOpen, setEmptyOpen] = useState(false);
  const [makeAvailableOpen, setMakeAvailableOpen] = useState(false);
  const [makeUnavailableOpen, setMakeUnavailableOpen] = useState(false);
  const [managePositionsOpen, setManagePositionsOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [retrieveOpen, setRetrieveOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const [transferContainerOpen, setTransferContainerOpen] = useState(false);
  const [transferMaterialOpen, setTransferMaterialOpen] = useState(false);
  const [undockOpen, setUndockOpen] = useState(false);

  const createMutation = useCreateContainer();
  const updateMutation = useUpdateContainer();
  const stateMutation = useSetContainerState();
  const operationMutation = useContainerOperation();

  const entityLabel = t("businessData.container.entityName");
  const createSteps = buildContainerSteps(false);
  const editSteps = buildContainerSteps(true);
  const editInitial = c ? containerToValues(c) : {};

  const runOperation = (operation: ContainerOperationType, payload: Record<string, unknown>) => {
    if (c) operationMutation.mutate({ name: c.name, operation, payload });
  };

  const dialogs = (
    <>
      <EntityWizardDialog
        open={createOpen}
        titleKey="businessData.container.operations.createTitle"
        steps={createSteps}
        submitLabelKey="common.create"
        onClose={() => setCreateOpen(false)}
        onSubmit={(values) => {
          createMutation.mutate(toContainerUpsertInput(values));
          setCreateOpen(false);
        }}
      />
      <EntityWizardDialog
        open={editOpen}
        titleKey="businessData.container.operations.editTitle"
        steps={editSteps}
        initialValues={editInitial}
        submitLabelKey="common.save"
        onClose={() => setEditOpen(false)}
        onSubmit={(values) => {
          if (c) updateMutation.mutate({ name: c.name, input: toContainerUpsertInput(values) });
          setEditOpen(false);
        }}
      />
      <CloneContainerDialog
        open={cloneOpen}
        containerName={c?.name ?? ""}
        onClose={() => setCloneOpen(false)}
        onClone={(rows: CloneContainerRow[]) => {
          if (c) {
            const base = toContainerUpsertInput(containerToValues(c));
            rows.forEach((row) => {
              createMutation.mutate({ ...base, name: row.name });
            });
          }
          setCloneOpen(false);
        }}
      />
      <ConfirmOperationDialog
        open={terminateOpen}
        titleKey="businessData.container.operations.terminateTitle"
        messageKey="businessData.container.operations.terminateMessage"
        messageParams={{ name: c?.name ?? entityLabel }}
        confirmLabelKey="actionBar.terminate"
        danger
        onClose={() => setTerminateOpen(false)}
        onConfirm={() => {
          if (c) stateMutation.mutate({ name: c.name, state: "Terminated" });
          setTerminateOpen(false);
        }}
      />
      <ConfirmOperationDialog
        open={unterminateOpen}
        titleKey="businessData.container.operations.unterminateTitle"
        messageKey="businessData.container.operations.unterminateMessage"
        messageParams={{ name: c?.name ?? entityLabel }}
        confirmLabelKey="actionBar.unterminate"
        onClose={() => setUnterminateOpen(false)}
        onConfirm={() => {
          if (c) stateMutation.mutate({ name: c.name, state: "Active" });
          setUnterminateOpen(false);
        }}
      />
      <AddContainerToContainerDialog
        open={addOpen}
        containerName={c?.name ?? ""}
        onClose={() => setAddOpen(false)}
        onConfirm={(input) => {
          runOperation(OP_ADD_CONTAINER, input);
          setAddOpen(false);
        }}
      />
      <DockContainerDialog
        open={dockOpen}
        containerName={c?.name ?? ""}
        onClose={() => setDockOpen(false)}
        onConfirm={(input) => {
          runOperation(OP_DOCK, input);
          setDockOpen(false);
        }}
      />
      <CommentConfirmDialog
        open={emptyOpen}
        titleKey="businessData.container.operations.emptyTitle"
        messageKey="businessData.container.operations.emptyMessage"
        messageParams={{ name: c?.name ?? entityLabel }}
        confirmLabelKey="businessData.container.operations.empty"
        onClose={() => setEmptyOpen(false)}
        onConfirm={(comment) => {
          runOperation(OP_EMPTY, { comment });
          setEmptyOpen(false);
        }}
      />
      <CommentConfirmDialog
        open={makeAvailableOpen}
        titleKey="businessData.container.operations.makeAvailableTitle"
        messageKey="businessData.container.operations.makeAvailableMessage"
        messageParams={{ name: c?.name ?? entityLabel }}
        confirmLabelKey="businessData.container.operations.makeAvailable"
        onClose={() => setMakeAvailableOpen(false)}
        onConfirm={(comment) => {
          runOperation(OP_MAKE_AVAILABLE, { comment });
          setMakeAvailableOpen(false);
        }}
      />
      <CommentConfirmDialog
        open={makeUnavailableOpen}
        titleKey="businessData.container.operations.makeUnavailableTitle"
        messageKey="businessData.container.operations.makeUnavailableMessage"
        messageParams={{ name: c?.name ?? entityLabel }}
        confirmLabelKey="businessData.container.operations.makeUnavailable"
        onClose={() => setMakeUnavailableOpen(false)}
        onConfirm={(comment) => {
          runOperation(OP_MAKE_UNAVAILABLE, { comment });
          setMakeUnavailableOpen(false);
        }}
      />
      <ManagePositionsDialog
        key={c?.name ?? "none"}
        open={managePositionsOpen}
        containerName={c?.name ?? ""}
        positions={c?.positions ?? []}
        onClose={() => setManagePositionsOpen(false)}
        onConfirm={(positions, comment) => {
          runOperation(OP_MANAGE_POSITIONS, { positions, comment });
          setManagePositionsOpen(false);
        }}
      />
      <CommentConfirmDialog
        open={removeOpen}
        titleKey="businessData.container.operations.removeContainerTitle"
        messageKey="businessData.container.operations.removeContainerMessage"
        messageParams={{ name: c?.name ?? entityLabel }}
        confirmLabelKey="businessData.container.operations.remove"
        onClose={() => setRemoveOpen(false)}
        onConfirm={(comment) => {
          runOperation(OP_REMOVE_CONTAINER, { comment });
          setRemoveOpen(false);
        }}
      />
      <CommentConfirmDialog
        open={retrieveOpen}
        titleKey="businessData.container.operations.retrieveTitle"
        messageKey="businessData.container.operations.retrieveMessage"
        messageParams={{ name: c?.name ?? entityLabel }}
        confirmLabelKey="businessData.container.operations.retrieve"
        onClose={() => setRetrieveOpen(false)}
        onConfirm={(comment) => {
          runOperation(OP_RETRIEVE, { comment });
          setRetrieveOpen(false);
        }}
      />
      <StoreContainerDialog
        open={storeOpen}
        containerName={c?.name ?? ""}
        onClose={() => setStoreOpen(false)}
        onConfirm={(input) => {
          runOperation(OP_STORE, input);
          setStoreOpen(false);
        }}
      />
      <TransferContainerDialog
        open={transferContainerOpen}
        containerName={c?.name ?? ""}
        onClose={() => setTransferContainerOpen(false)}
        onConfirm={(input) => {
          runOperation(OP_TRANSFER_CONTAINER, input);
          setTransferContainerOpen(false);
        }}
      />
      <TransferMaterialDialog
        open={transferMaterialOpen}
        containerName={c?.name ?? ""}
        materials={c?.materials.map((m) => ({ position: m.position, material: m.material })) ?? []}
        onClose={() => setTransferMaterialOpen(false)}
        onConfirm={(input) => {
          runOperation(OP_TRANSFER_MATERIAL, input);
          setTransferMaterialOpen(false);
        }}
      />
      <CommentConfirmDialog
        open={undockOpen}
        titleKey="businessData.container.operations.undockTitle"
        messageKey="businessData.container.operations.undockMessage"
        messageParams={{ name: c?.name ?? entityLabel }}
        confirmLabelKey="businessData.container.operations.undock"
        onClose={() => setUndockOpen(false)}
        onConfirm={(comment) => {
          runOperation(OP_UNDOCK, { comment });
          setUndockOpen(false);
        }}
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
    openAddContainer: () => setAddOpen(true),
    openDock: () => setDockOpen(true),
    openEmpty: () => setEmptyOpen(true),
    openMakeAvailable: () => setMakeAvailableOpen(true),
    openMakeUnavailable: () => setMakeUnavailableOpen(true),
    openManagePositions: () => setManagePositionsOpen(true),
    openRemoveContainer: () => setRemoveOpen(true),
    openRetrieve: () => setRetrieveOpen(true),
    openStore: () => setStoreOpen(true),
    openTransferContainer: () => setTransferContainerOpen(true),
    openTransferMaterial: () => setTransferMaterialOpen(true),
    openUndock: () => setUndockOpen(true),
  };
}
