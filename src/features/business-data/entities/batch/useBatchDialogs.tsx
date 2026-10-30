import { useState } from "react";
import type { BatchDetail, BatchUpsertInput } from "@/api";
import { useCreateBatch, useSetBatchState, useUpdateBatch } from "@/api";
import { useAppTranslation } from "@/i18n";
import { ConfirmOperationDialog } from "../../components/ConfirmOperationDialog";
import { EntityWizardDialog } from "../../components/EntityWizardDialog";
import type { OperationValues, WizardStep } from "../../components/operationTypes";
import {
  ChangeBatchResourceDialog,
  ContainerListEditor,
  ManageBatchContainersDialog,
  ManageBatchMaterialsDialog,
  MaterialListEditor,
} from "./BatchManageDialogs";
import type { MaterialRow } from "./BatchManageDialogs";
import type { BatchTransition } from "./batchTransitions";
import { BATCH_TRANSITIONS, TRANSITION_STATE } from "./batchTransitions";

const RESOURCE_OPTIONS = [
  { value: "Baker-01", label: "Baker-01" },
  { value: "Baker-02", label: "Baker-02" },
  { value: "Mixer-01", label: "Mixer-01" },
];

const STEP_OPTIONS = [
  { value: "Baking", label: "Baking" },
  { value: "Mixing", label: "Mixing" },
  { value: "Moulding", label: "Moulding" },
];


function buildBatchSteps(): WizardStep[] {
  return [
    {
      titleKey: "businessData.batch.detail.information",
      fields: [
        { key: "name", labelKey: "businessData.batch.detail.name", type: "text" },
        { key: "description", labelKey: "businessData.batch.detail.description", type: "textarea" },
        {
          key: "resource",
          labelKey: "businessData.batch.detail.resource",
          type: "select",
          options: RESOURCE_OPTIONS,
          required: true,
        },
        {
          key: "step",
          labelKey: "businessData.batch.detail.step",
          type: "select",
          options: STEP_OPTIONS,
          required: true,
        },
        { key: "priority", labelKey: "businessData.batch.detail.priority", type: "number" },
      ],
    },
    {
      titleKey: "businessData.batch.operations.materials",
      fields: [
        {
          key: "materials",
          labelKey: "businessData.batch.operations.materials",
          type: "custom",
          render: (values, onChange) => (
            <MaterialListEditor values={values} onChange={onChange} />
          ),
        },
      ],
    },
    {
      titleKey: "businessData.batch.operations.containers",
      fields: [
        {
          key: "containers",
          labelKey: "businessData.batch.operations.containers",
          type: "custom",
          render: (values, onChange) => (
            <ContainerListEditor values={values} onChange={onChange} />
          ),
        },
      ],
    },
  ];
}

function toUpsertInput(values: OperationValues): BatchUpsertInput {
  const materials = (values.materials as unknown as MaterialRow[] | undefined) ?? [];
  const main = materials.find((m) => m.isMain);
  return {
    name: String(values.name ?? `Batch-${Date.now()}`),
    description: values.description === undefined ? undefined : String(values.description),
    resource: values.resource === undefined ? undefined : String(values.resource),
    step: values.step === undefined ? undefined : String(values.step),
    priority: values.priority === undefined ? undefined : Number(values.priority),
    mainMaterial: main?.material,
  };
}



export interface BatchDialogs {
  dialogs: React.ReactNode;
  openCreate: () => void;
  openEdit: () => void;
  openManageMaterials: () => void;
  openManageContainers: () => void;
  openChangeResource: () => void;
  openTransition: (transition: BatchTransition) => void;
}

export function useBatchDialogs(batch?: BatchDetail): BatchDialogs {
  const { t } = useAppTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [containersOpen, setContainersOpen] = useState(false);
  const [changeResourceOpen, setChangeResourceOpen] = useState(false);
  const [transition, setTransition] = useState<BatchTransition | null>(null);

  const createMutation = useCreateBatch();
  const updateMutation = useUpdateBatch();
  const stateMutation = useSetBatchState();

  const steps = buildBatchSteps();
  const entityLabel = t("businessData.batch.entityName");

  const editInitial: OperationValues = batch
    ? {
        name: batch.name,
        description: batch.description,
        resource: batch.resource,
        step: batch.step,
        priority: batch.priority,
      }
    : {};

  const dialogs = (
    <>
      <EntityWizardDialog
        open={createOpen}
        titleKey="businessData.batch.operations.createTitle"
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
        titleKey="businessData.batch.operations.editTitle"
        steps={steps}
        initialValues={editInitial}
        submitLabelKey="common.save"
        onClose={() => setEditOpen(false)}
        onSubmit={(values) => {
          if (batch) updateMutation.mutate({ name: batch.name, input: toUpsertInput(values) });
          setEditOpen(false);
        }}
      />
      <ManageBatchMaterialsDialog
        open={materialsOpen}
        batchName={batch?.name ?? ""}
        onClose={() => setMaterialsOpen(false)}
      />
      <ManageBatchContainersDialog
        open={containersOpen}
        batchName={batch?.name ?? ""}
        onClose={() => setContainersOpen(false)}
      />
      <ChangeBatchResourceDialog
        open={changeResourceOpen}
        batchName={batch?.name ?? ""}
        currentResource={batch?.resource ?? ""}
        onClose={() => setChangeResourceOpen(false)}
        onChange={(resource) => {
          if (batch) updateMutation.mutate({ name: batch.name, input: { resource } });
        }}
      />
      {BATCH_TRANSITIONS.map((key) => (
        <ConfirmOperationDialog
          key={key}
          open={transition === key}
          titleKey={`businessData.batch.operations.${key}Title`}
          messageKey={`businessData.batch.operations.${key}Message`}
          messageParams={{ name: batch?.name ?? entityLabel }}
          confirmLabelKey={`businessData.batch.operations.${key}`}
          danger={key === "abort" || key === "cancel"}
          onClose={() => setTransition(null)}
          onConfirm={() => {
            if (batch) {
              stateMutation.mutate({ name: batch.name, patch: TRANSITION_STATE[key] });
            }
          }}
        />
      ))}
    </>
  );

  return {
    dialogs,
    openCreate: () => setCreateOpen(true),
    openEdit: () => setEditOpen(true),
    openManageMaterials: () => setMaterialsOpen(true),
    openManageContainers: () => setContainersOpen(true),
    openChangeResource: () => setChangeResourceOpen(true),
    openTransition: (next: BatchTransition) => setTransition(next),
  };
}
