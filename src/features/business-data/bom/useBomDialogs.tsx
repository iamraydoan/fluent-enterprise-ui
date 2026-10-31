import { useState } from "react";
import type { BomDetail, BomUpsertInput } from "@/api";
import { useCreateBom, useSetBomState, useUpdateBom } from "@/api";
import { useAppTranslation } from "@/i18n";
import { ConfirmOperationDialog } from "../components/ConfirmOperationDialog";
import { EntityWizardDialog } from "../components/EntityWizardDialog";
import type { OperationValues, WizardStep } from "../components/operationTypes";
import { ManageBomItemsDialog } from "./BomDialogs";

const SCOPE_OPTIONS = [
  { value: "Compose Map", label: "Compose Map" },
  { value: "Durables", label: "Durables" },
  { value: "Materials", label: "Materials" },
  { value: "Packing", label: "Packing" },
  { value: "Parts", label: "Parts" },
  { value: "Weigh And Dispense", label: "Weigh And Dispense" },
];

const TYPE_OPTIONS = [
  { value: "Standard", label: "Standard" },
  { value: "Phantom", label: "Phantom" },
];

const UNIT_OPTIONS = [
  { value: "Kg", label: "Kg" },
  { value: "g", label: "g" },
  { value: "Each", label: "Each" },
  { value: "L", label: "L" },
];

function buildBomSteps(): WizardStep[] {
  return [
    {
      titleKey: "businessData.bom.operations.changeSet",
      fields: [
        {
          key: "changeSet",
          labelKey: "businessData.bom.operations.changeSetName",
          type: "text",
        },
        {
          key: "useAutomaticChangeSet",
          labelKey: "businessData.bom.operations.useAutomaticChangeSet",
          type: "checkbox",
        },
        {
          key: "approvalRole",
          labelKey: "businessData.bom.operations.approvalRole",
          type: "text",
        },
        {
          key: "makeEffectiveOnApproval",
          labelKey: "businessData.bom.operations.makeEffectiveOnApproval",
          type: "checkbox",
        },
      ],
    },
    {
      titleKey: "businessData.bom.detail.information",
      fields: [
        { key: "name", labelKey: "businessData.bom.detail.name", type: "text", required: true },
        { key: "description", labelKey: "businessData.bom.detail.description", type: "textarea" },
        {
          key: "type",
          labelKey: "businessData.bom.detail.type",
          type: "select",
          options: TYPE_OPTIONS,
          required: true,
        },
        {
          key: "scope",
          labelKey: "businessData.bom.detail.scope",
          type: "select",
          options: SCOPE_OPTIONS,
          required: true,
        },
        { key: "product", labelKey: "businessData.bom.detail.product", type: "text" },
        { key: "baseQuantity", labelKey: "businessData.bom.detail.baseQuantity", type: "number" },
        {
          key: "units",
          labelKey: "businessData.bom.detail.units",
          type: "select",
          options: UNIT_OPTIONS,
        },
        {
          key: "useTolerances",
          labelKey: "businessData.bom.detail.useTolerances",
          type: "checkbox",
        },
        {
          key: "useMixedAssembly",
          labelKey: "businessData.bom.detail.useMixedAssembly",
          type: "checkbox",
        },
      ],
    },
  ];
}

function toUpsertInput(values: OperationValues): BomUpsertInput {
  return {
    name: String(values.name ?? ""),
    description: values.description === undefined ? undefined : String(values.description),
    type: values.type === undefined ? undefined : String(values.type),
    scope: values.scope === undefined ? undefined : String(values.scope),
    product: values.product === undefined ? undefined : String(values.product),
    baseQuantity: values.baseQuantity === undefined ? undefined : Number(values.baseQuantity),
    units: values.units === undefined ? undefined : String(values.units),
    useTolerances: values.useTolerances === true,
    useMixedAssembly: values.useMixedAssembly === true,
    changeSet: values.changeSet === undefined ? undefined : String(values.changeSet),
  };
}

export interface BomDialogs {
  dialogs: React.ReactNode;
  openCreate: () => void;
  openEdit: () => void;
  openClone: () => void;
  openTerminate: () => void;
  openUnterminate: () => void;
  openManageItems: () => void;
}

export function useBomDialogs(bom?: BomDetail): BomDialogs {
  const { t } = useAppTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [itemsOpen, setItemsOpen] = useState(false);

  const createMutation = useCreateBom();
  const updateMutation = useUpdateBom();
  const stateMutation = useSetBomState();

  const steps = buildBomSteps();
  const entityLabel = t("businessData.bom.entityName");

  const editInitial: OperationValues = bom
    ? {
        name: bom.name,
        description: bom.description,
        type: bom.type,
        scope: bom.scope,
        product: bom.product,
        baseQuantity: bom.baseQuantity,
        units: bom.units,
        useTolerances: bom.useTolerances,
        useMixedAssembly: bom.useMixedAssembly,
        changeSet: bom.changeSet,
      }
    : {};

  const cloneSteps: WizardStep[] = [
    {
      titleKey: "businessData.bom.detail.information",
      fields: [
        { key: "name", labelKey: "businessData.bom.detail.name", type: "text", required: true },
        { key: "description", labelKey: "businessData.bom.detail.description", type: "textarea" },
      ],
    },
  ];

  const dialogs = (
    <>
      <EntityWizardDialog
        open={createOpen}
        titleKey="businessData.bom.operations.createTitle"
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
        titleKey="businessData.bom.operations.editTitle"
        steps={steps}
        initialValues={editInitial}
        submitLabelKey="common.save"
        onClose={() => setEditOpen(false)}
        onSubmit={(values) => {
          if (bom) updateMutation.mutate({ name: bom.name, input: toUpsertInput(values) });
          setEditOpen(false);
        }}
      />
      <EntityWizardDialog
        open={cloneOpen}
        titleKey="businessData.bom.operations.cloneTitle"
        steps={cloneSteps}
        initialValues={bom ? { name: `${bom.name} - Clone`, description: bom.description } : {}}
        submitLabelKey="common.create"
        onClose={() => setCloneOpen(false)}
        onSubmit={(values) => {
          if (bom) {
            createMutation.mutate({
              ...toUpsertInput({ ...editInitial, ...values }),
              name: String(values.name ?? `${bom.name} - Clone`),
            });
          }
          setCloneOpen(false);
        }}
      />
      <ConfirmOperationDialog
        open={terminateOpen}
        titleKey="businessData.bom.operations.terminateTitle"
        messageKey="businessData.bom.operations.terminateMessage"
        messageParams={{ name: bom?.name ?? entityLabel }}
        confirmLabelKey="actionBar.terminate"
        danger
        onClose={() => setTerminateOpen(false)}
        onConfirm={() => {
          if (bom) stateMutation.mutate({ name: bom.name, state: "Terminated" });
        }}
      />
      <ConfirmOperationDialog
        open={unterminateOpen}
        titleKey="businessData.bom.operations.unterminateTitle"
        messageKey="businessData.bom.operations.unterminateMessage"
        messageParams={{ name: bom?.name ?? entityLabel }}
        confirmLabelKey="actionBar.unterminate"
        onClose={() => setUnterminateOpen(false)}
        onConfirm={() => {
          if (bom) stateMutation.mutate({ name: bom.name, state: "Active" });
        }}
      />
      <ManageBomItemsDialog
        open={itemsOpen}
        bomName={bom?.name ?? ""}
        onClose={() => setItemsOpen(false)}
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
    openManageItems: () => setItemsOpen(true),
  };
}
