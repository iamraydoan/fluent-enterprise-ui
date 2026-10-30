import { useState } from "react";
import type { ChecklistDetail, ChecklistInstance, ChecklistUpsertInput } from "@/api";
import {
  useCreateChecklist,
  useOpenChecklistInstance,
  useOpenMaterialDeviation,
  usePerformChecklistInstance,
  useSetChecklistState,
  useUpdateChecklist,
  useUpdateChecklistInstance,
} from "@/api";
import { useAppTranslation } from "@/i18n";
import { ConfirmOperationDialog } from "../../components/ConfirmOperationDialog";
import { EntityWizardDialog } from "../../components/EntityWizardDialog";
import type { OperationValues, WizardField, WizardStep } from "../../components/operationTypes";
import {
  ChecklistItemsEditor,
  type ChecklistItemRow,
  CloneChecklistDialog,
  type CloneChecklistRow,
  OpenChecklistInstanceDialog,
  OpenForMaterialDialog,
  OpenMaterialDeviationDialog,
  PauseChecklistInstanceDialog,
  PerformChecklistDialog,
  PreviewChecklistDialog,
} from "./ChecklistManageDialogs";
import {
  CHECKLIST_SCOPES,
  EXECUTING_STATE_EXECUTING,
  EXECUTING_STATE_PAUSED,
  EXECUTION_MODES,
  type InstanceItemState,
} from "./checklistLookups";

const SCOPE_OPTIONS = CHECKLIST_SCOPES.map((v) => ({ value: v, label: v }));
const EXECUTION_MODE_OPTIONS = EXECUTION_MODES.map((v) => ({ value: v, label: v }));

function str(v: string | number | boolean | undefined): string | undefined {
  if (v === undefined) return undefined;
  return String(v);
}

function bool(v: string | number | boolean | undefined): boolean {
  return v === true;
}

function buildChecklistSteps(editMode: boolean): WizardStep[] {
  const nameField: WizardField[] = editMode
    ? []
    : [
        {
          key: "name",
          labelKey: "businessData.checklist.detail.name",
          type: "text",
          required: true,
        },
      ];
  return [
    {
      titleKey: "businessData.checklist.operations.stepChangeSet",
      fields: [
        { key: "changeSet", labelKey: "businessData.checklist.detail.changeSet", type: "text" },
        {
          key: "useAutomaticChangeSet",
          labelKey: "businessData.checklist.detail.useAutomaticChangeSet",
          type: "checkbox",
        },
        {
          key: "approvalRole",
          labelKey: "businessData.checklist.detail.approvalRole",
          type: "text",
        },
        {
          key: "makeEffectiveOnApproval",
          labelKey: "businessData.checklist.detail.makeEffectiveOnApproval",
          type: "checkbox",
        },
      ],
    },
    {
      titleKey: "businessData.checklist.operations.stepGeneralData",
      fields: [
        ...nameField,
        {
          key: "description",
          labelKey: "businessData.checklist.detail.description",
          type: "textarea",
        },
        { key: "type", labelKey: "businessData.checklist.detail.type", type: "text" },
        {
          key: "scope",
          labelKey: "businessData.checklist.detail.scope",
          type: "select",
          options: SCOPE_OPTIONS,
        },
        {
          key: "executionMode",
          labelKey: "businessData.checklist.detail.executionMode",
          type: "select",
          options: EXECUTION_MODE_OPTIONS,
        },
        { key: "bom", labelKey: "businessData.checklist.detail.bom", type: "text" },
        { key: "product", labelKey: "businessData.checklist.detail.product", type: "text" },
        {
          key: "dataCollection",
          labelKey: "businessData.checklist.detail.dataCollection",
          type: "text",
        },
        {
          key: "dataCollectionLimitSet",
          labelKey: "businessData.checklist.detail.dataCollectionLimitSet",
          type: "text",
        },
        {
          key: "materialDeviationProtocol",
          labelKey: "businessData.checklist.detail.materialDeviationProtocol",
          type: "text",
        },
        {
          key: "defineStandardTimes",
          labelKey: "businessData.checklist.detail.defineStandardTimes",
          type: "checkbox",
        },
        {
          key: "trackExecutionTimes",
          labelKey: "businessData.checklist.detail.trackExecutionTimes",
          type: "checkbox",
        },
        {
          key: "documentationUrl",
          labelKey: "businessData.checklist.detail.documentationUrl",
          type: "text",
        },
        {
          key: "standardDuration",
          labelKey: "businessData.checklist.detail.standardDuration",
          type: "text",
        },
      ],
    },
    {
      titleKey: "businessData.checklist.operations.stepItems",
      fields: [
        {
          key: "items",
          labelKey: "businessData.checklist.detail.items",
          type: "custom",
          render: (values, onChange) => (
            <ChecklistItemsEditor values={values} onChange={onChange} />
          ),
        },
      ],
    },
  ];
}

function toChecklistUpsertInput(values: OperationValues): ChecklistUpsertInput {
  const rows = (values.items as unknown as ChecklistItemRow[] | undefined) ?? [];
  return {
    name: str(values.name),
    description: str(values.description),
    type: str(values.type),
    changeSet: str(values.changeSet),
    useAutomaticChangeSet: bool(values.useAutomaticChangeSet),
    approvalRole: str(values.approvalRole),
    makeEffectiveOnApproval: bool(values.makeEffectiveOnApproval),
    scope: str(values.scope),
    executionMode: str(values.executionMode) as ChecklistUpsertInput["executionMode"],
    bom: str(values.bom),
    product: str(values.product),
    dataCollection: str(values.dataCollection),
    dataCollectionLimitSet: str(values.dataCollectionLimitSet),
    materialDeviationProtocol: str(values.materialDeviationProtocol),
    defineStandardTimes: bool(values.defineStandardTimes),
    trackExecutionTimes: bool(values.trackExecutionTimes),
    documentationUrl: str(values.documentationUrl),
    standardDuration: str(values.standardDuration),
    items: rows.map((r) => ({
      name: r.name,
      description: r.description,
      itemType: r.itemType,
      documentationUrl: r.documentationUrl,
      activityType: r.activityType as
        "Manual Task" | "Manual Action" | "Automatic Action" | "Signature",
      trackingType: r.trackingType as "Start And End" | "End",
      rule: r.rule,
      timeCategory: r.timeCategory,
      standardDuration: r.standardDuration,
      floating: r.floating,
      optional: r.optional,
      executedOutOfOrder: r.executedOutOfOrder,
      group: r.group,
      instructions: r.instructions,
      conditionType: r.conditionType,
      conditionExpression: r.conditionExpression,
      parameters: r.parameters,
    })),
  };
}

function checklistToValues(cl: ChecklistDetail): OperationValues {
  return {
    name: cl.name,
    description: cl.description,
    type: cl.type,
    changeSet: cl.changeSet,
    useAutomaticChangeSet: cl.useAutomaticChangeSet,
    approvalRole: cl.approvalRole,
    makeEffectiveOnApproval: cl.makeEffectiveOnApproval,
    scope: cl.scope,
    executionMode: cl.executionMode,
    bom: cl.bom,
    product: cl.product,
    dataCollection: cl.dataCollection,
    dataCollectionLimitSet: cl.dataCollectionLimitSet,
    materialDeviationProtocol: cl.materialDeviationProtocol,
    defineStandardTimes: cl.defineStandardTimes,
    trackExecutionTimes: cl.trackExecutionTimes,
    documentationUrl: cl.documentationUrl,
    standardDuration: cl.standardDuration,
    items: cl.items.map((i, idx) => ({ ...i, id: Date.now() + idx })) as unknown as boolean,
  };
}

export interface ChecklistDialogs {
  dialogs: React.ReactNode;
  openCreate: () => void;
  openEdit: () => void;
  openClone: () => void;
  openTerminate: () => void;
  openUnterminate: () => void;
  openPreview: () => void;
  openInstance: () => void;
  openForMaterial: () => void;
  openPerformImmediateForMaterial: () => void;
  openPerformInstance: (instance: ChecklistInstance) => void;
  openPauseInstance: (instance: ChecklistInstance) => void;
  openResumeInstance: (instance: ChecklistInstance) => void;
  openTerminateInstance: (instance: ChecklistInstance) => void;
  openDeviation: (instance: ChecklistInstance) => void;
}

export function useChecklistDialogs(cl?: ChecklistDetail): ChecklistDialogs {
  const { t } = useAppTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [openInstanceOpen, setOpenInstanceOpen] = useState(false);
  const [openForMaterialOpen, setOpenForMaterialOpen] = useState(false);
  const [performImmediateOpen, setPerformImmediateOpen] = useState(false);
  const [performTarget, setPerformTarget] = useState<{
    instance: ChecklistInstance;
    immediate: boolean;
  } | null>(null);
  const [pauseInstance, setPauseInstance] = useState<ChecklistInstance | null>(null);
  const [resumeInstance, setResumeInstance] = useState<ChecklistInstance | null>(null);
  const [terminateInstance, setTerminateInstance] = useState<ChecklistInstance | null>(null);
  const [deviationInstance, setDeviationInstance] = useState<ChecklistInstance | null>(null);

  const createMutation = useCreateChecklist();
  const updateMutation = useUpdateChecklist();
  const stateMutation = useSetChecklistState();
  const openInstanceMutation = useOpenChecklistInstance();
  const updateInstanceMutation = useUpdateChecklistInstance();
  const performMutation = usePerformChecklistInstance();
  const deviationMutation = useOpenMaterialDeviation();

  const entityLabel = t("businessData.checklist.entityName");
  const createSteps = buildChecklistSteps(false);
  const editSteps = buildChecklistSteps(true);
  const editInitial = cl ? checklistToValues(cl) : {};

  const closePerform = () => setPerformTarget(null);

  const handlePerform = (items: { name: string; state: InstanceItemState }[], close: boolean) => {
    if (cl && performTarget) {
      performMutation.mutate({
        name: cl.name,
        instance: performTarget.instance.name,
        items,
        close,
      });
    }
    closePerform();
  };

  const dialogs = (
    <>
      <EntityWizardDialog
        open={createOpen}
        titleKey="businessData.checklist.operations.createTitle"
        steps={createSteps}
        submitLabelKey="common.create"
        onClose={() => setCreateOpen(false)}
        onSubmit={(values) => {
          createMutation.mutate(toChecklistUpsertInput(values));
          setCreateOpen(false);
        }}
      />
      <EntityWizardDialog
        open={editOpen}
        titleKey="businessData.checklist.operations.editTitle"
        steps={editSteps}
        initialValues={editInitial}
        submitLabelKey="common.save"
        onClose={() => setEditOpen(false)}
        onSubmit={(values) => {
          if (cl) updateMutation.mutate({ name: cl.name, input: toChecklistUpsertInput(values) });
          setEditOpen(false);
        }}
      />
      <CloneChecklistDialog
        open={cloneOpen}
        checklistName={cl?.name ?? ""}
        onClose={() => setCloneOpen(false)}
        onClone={(rows: CloneChecklistRow[]) => {
          if (cl) {
            const base = toChecklistUpsertInput(checklistToValues(cl));
            rows.forEach((row) => {
              createMutation.mutate({ ...base, name: row.name });
            });
          }
          setCloneOpen(false);
        }}
      />
      <ConfirmOperationDialog
        open={terminateOpen}
        titleKey="businessData.checklist.operations.terminateTitle"
        messageKey="businessData.checklist.operations.terminateMessage"
        messageParams={{ name: cl?.name ?? entityLabel }}
        confirmLabelKey="actionBar.terminate"
        danger
        onClose={() => setTerminateOpen(false)}
        onConfirm={() => {
          if (cl) stateMutation.mutate({ name: cl.name, patch: { state: "Terminated" } });
          setTerminateOpen(false);
        }}
      />
      <ConfirmOperationDialog
        open={unterminateOpen}
        titleKey="businessData.checklist.operations.unterminateTitle"
        messageKey="businessData.checklist.operations.unterminateMessage"
        messageParams={{ name: cl?.name ?? entityLabel }}
        confirmLabelKey="actionBar.unterminate"
        onClose={() => setUnterminateOpen(false)}
        onConfirm={() => {
          if (cl) stateMutation.mutate({ name: cl.name, patch: { state: "Active" } });
          setUnterminateOpen(false);
        }}
      />
      <PreviewChecklistDialog
        open={previewOpen}
        checklistName={cl?.name ?? ""}
        items={cl?.items ?? []}
        onClose={() => setPreviewOpen(false)}
      />
      <OpenChecklistInstanceDialog
        open={openInstanceOpen}
        checklistName={cl?.name ?? ""}
        onClose={() => setOpenInstanceOpen(false)}
        onConfirm={() => {
          if (cl) openInstanceMutation.mutate({ name: cl.name, input: {} });
          setOpenInstanceOpen(false);
        }}
      />
      <OpenForMaterialDialog
        open={openForMaterialOpen}
        checklistName={cl?.name ?? ""}
        onClose={() => setOpenForMaterialOpen(false)}
        onConfirm={(material) => {
          if (cl) openInstanceMutation.mutate({ name: cl.name, input: { material } });
          setOpenForMaterialOpen(false);
        }}
      />
      <OpenForMaterialDialog
        open={performImmediateOpen}
        checklistName={cl?.name ?? ""}
        onClose={() => setPerformImmediateOpen(false)}
        onConfirm={(material) => {
          if (cl) {
            openInstanceMutation.mutate(
              { name: cl.name, input: { material } },
              {
                onSuccess: (data) => {
                  const inst = data.instances[data.instances.length - 1];
                  setPerformTarget({ instance: inst, immediate: true });
                },
              },
            );
          }
          setPerformImmediateOpen(false);
        }}
      />
      <PerformChecklistDialog
        open={performTarget !== null}
        instance={performTarget?.instance ?? null}
        immediate={performTarget?.immediate ?? false}
        onClose={closePerform}
        onPerform={handlePerform}
      />
      <PauseChecklistInstanceDialog
        open={pauseInstance !== null}
        instanceName={pauseInstance?.name ?? ""}
        onClose={() => setPauseInstance(null)}
        onConfirm={() => {
          if (cl && pauseInstance) {
            updateInstanceMutation.mutate({
              name: cl.name,
              instance: pauseInstance.name,
              patch: { executingState: EXECUTING_STATE_PAUSED },
            });
          }
          setPauseInstance(null);
        }}
      />
      <ConfirmOperationDialog
        open={resumeInstance !== null}
        titleKey="businessData.checklist.operations.resumeTitle"
        messageKey="businessData.checklist.operations.resumeMessage"
        messageParams={{ name: resumeInstance?.name ?? entityLabel }}
        confirmLabelKey="businessData.checklist.operations.resume"
        onClose={() => setResumeInstance(null)}
        onConfirm={() => {
          if (cl && resumeInstance) {
            updateInstanceMutation.mutate({
              name: cl.name,
              instance: resumeInstance.name,
              patch: { executingState: EXECUTING_STATE_EXECUTING },
            });
          }
          setResumeInstance(null);
        }}
      />
      <ConfirmOperationDialog
        open={terminateInstance !== null}
        titleKey="businessData.checklist.operations.terminateInstanceTitle"
        messageKey="businessData.checklist.operations.terminateInstanceMessage"
        messageParams={{ name: terminateInstance?.name ?? entityLabel }}
        confirmLabelKey="actionBar.terminate"
        danger
        onClose={() => setTerminateInstance(null)}
        onConfirm={() => {
          if (cl && terminateInstance) {
            updateInstanceMutation.mutate({
              name: cl.name,
              instance: terminateInstance.name,
              patch: { state: "Terminated" },
            });
          }
          setTerminateInstance(null);
        }}
      />
      <OpenMaterialDeviationDialog
        key={deviationInstance?.name ?? "none"}
        open={deviationInstance !== null}
        instance={deviationInstance}
        onClose={() => setDeviationInstance(null)}
        onConfirm={(input) => {
          if (cl && deviationInstance) {
            deviationMutation.mutate({
              name: cl.name,
              instance: deviationInstance.name,
              deviation: { itemName: input.itemName, deviationType: input.deviationType },
            });
          }
          setDeviationInstance(null);
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
    openPreview: () => setPreviewOpen(true),
    openInstance: () => setOpenInstanceOpen(true),
    openForMaterial: () => setOpenForMaterialOpen(true),
    openPerformImmediateForMaterial: () => setPerformImmediateOpen(true),
    openPerformInstance: (instance: ChecklistInstance) =>
      setPerformTarget({ instance, immediate: false }),
    openPauseInstance: (instance: ChecklistInstance) => setPauseInstance(instance),
    openResumeInstance: (instance: ChecklistInstance) => setResumeInstance(instance),
    openTerminateInstance: (instance: ChecklistInstance) => setTerminateInstance(instance),
    openDeviation: (instance: ChecklistInstance) => setDeviationInstance(instance),
  };
}
