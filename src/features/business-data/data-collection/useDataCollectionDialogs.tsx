import { useState } from "react";
import type {
  DataCollectionDetail,
  DataCollectionInstance,
  DataCollectionParameter,
  DataCollectionUpsertInput,
} from "@/api";
import {
  useCorrectDataCollectionInstance,
  useCreateDataCollection,
  useManageDataCollectionParameters,
  useOpenDataCollectionInstance,
  usePerformImmediateDataCollection,
  usePostDataCollectionInstance,
  useResetDataCollectionInstance,
  useSetDataCollectionState,
  useUpdateDataCollection,
  useUpdateDataCollectionInstance,
} from "@/api";
import { useAppTranslation } from "@/i18n";
import { ConfirmOperationDialog } from "../components/ConfirmOperationDialog";
import { EntityWizardDialog } from "../components/EntityWizardDialog";
import type { OperationValues, WizardField, WizardStep } from "../components/operationTypes";
import {
  CloneDataCollectionDialog,
  type CloneDataCollectionRow,
  CommentConfirmDialog,
  CorrectDataDialog,
  DataCollectionParametersEditor,
  type DataCollectionParameterRow,
  type DataValueRow,
  ManageDataCollectionParametersDialog,
  OpenDataCollectionInstanceDialog,
  PerformImmediateDataStep,
  PerformImmediateParametersStep,
  PostDataDialog,
  ViewDataCollectionInstanceDialog,
} from "./DataCollectionDialogs";
import {
  DC_SCOPES,
  INSTANCE_STATE_CLOSED,
  INSTANCE_STATE_OPEN,
  INSTANCE_STATE_TERMINATED,
  SPC_MODES,
  USER_INTERFACES,
} from "./dataCollectionLookups";

const SCOPE_OPTIONS = DC_SCOPES.map((v) => ({ value: v, label: v }));
const SPC_MODE_OPTIONS = SPC_MODES.map((v) => ({ value: v, label: v }));
const UI_OPTIONS = USER_INTERFACES.map((v) => ({ value: v, label: v }));

function str(v: string | number | boolean | undefined): string | undefined {
  if (v === undefined) return undefined;
  return String(v);
}

function bool(v: string | number | boolean | undefined): boolean {
  return v === true;
}

function toParameters(rows: DataCollectionParameterRow[] | undefined): DataCollectionParameter[] {
  return (rows ?? []).map((r) => ({
    parameter: r.parameter,
    dataType: r.dataType,
    isOptional: r.isOptional,
    minimumSamples: r.minimumSamples,
    maximumSamples: r.maximumSamples,
    minimumSampleReadings: r.minimumSampleReadings,
    maximumSampleReadings: r.maximumSampleReadings,
    limitChecking: r.limitChecking,
  }));
}

function buildDataCollectionSteps(editMode: boolean): WizardStep[] {
  const nameField: WizardField[] = editMode
    ? []
    : [
        {
          key: "name",
          labelKey: "businessData.dataCollection.detail.name",
          type: "text",
          required: true,
        },
      ];
  return [
    {
      titleKey: "businessData.dataCollection.operations.stepChangeSet",
      fields: [
        {
          key: "changeSet",
          labelKey: "businessData.dataCollection.detail.changeSet",
          type: "text",
        },
        {
          key: "useAutomaticChangeSet",
          labelKey: "businessData.dataCollection.detail.useAutomaticChangeSet",
          type: "checkbox",
        },
        {
          key: "approvalRole",
          labelKey: "businessData.dataCollection.detail.approvalRole",
          type: "text",
        },
        {
          key: "makeEffectiveOnApproval",
          labelKey: "businessData.dataCollection.detail.makeEffectiveOnApproval",
          type: "checkbox",
        },
      ],
    },
    {
      titleKey: "businessData.dataCollection.operations.stepGeneralData",
      fields: [
        ...nameField,
        {
          key: "description",
          labelKey: "businessData.dataCollection.detail.description",
          type: "textarea",
        },
        { key: "type", labelKey: "businessData.dataCollection.detail.type", type: "text" },
        {
          key: "scope",
          labelKey: "businessData.dataCollection.detail.scope",
          type: "select",
          options: SCOPE_OPTIONS,
        },
        {
          key: "spcMode",
          labelKey: "businessData.dataCollection.detail.spcMode",
          type: "select",
          options: SPC_MODE_OPTIONS,
        },
        {
          key: "userInterface",
          labelKey: "businessData.dataCollection.detail.userInterface",
          type: "select",
          options: UI_OPTIONS,
        },
      ],
    },
    {
      titleKey: "businessData.dataCollection.operations.stepParameters",
      fields: [
        {
          key: "parameters",
          labelKey: "businessData.dataCollection.detail.parameters",
          type: "custom",
          render: (values, onChange) => (
            <DataCollectionParametersEditor values={values} onChange={onChange} />
          ),
        },
      ],
    },
  ];
}

function buildPerformImmediateSteps(dc: DataCollectionDetail | undefined): WizardStep[] {
  const limitSetOptions = [{ value: "", label: "" }].concat(
    (dc?.limitSets ?? []).map((l) => ({ value: l.name, label: l.name })),
  );
  return [
    {
      titleKey: "businessData.dataCollection.operations.stepInstanceDetails",
      fields: [
        {
          key: "instanceName",
          labelKey: "businessData.dataCollection.operations.instanceName",
          type: "text",
        },
        {
          key: "description",
          labelKey: "businessData.dataCollection.detail.description",
          type: "textarea",
        },
        {
          key: "adHoc",
          labelKey: "businessData.dataCollection.operations.adHoc",
          type: "checkbox",
        },
        {
          key: "limitSet",
          labelKey: "businessData.dataCollection.operations.limitSet",
          type: "select",
          options: limitSetOptions,
        },
      ],
    },
    {
      titleKey: "businessData.dataCollection.operations.stepParameters",
      fields: [
        {
          key: "adHocParameters",
          labelKey: "businessData.dataCollection.detail.parameters",
          type: "custom",
          render: (values, onChange) => (
            <PerformImmediateParametersStep
              values={values}
              onChange={onChange}
              dcParameters={dc?.parameters ?? []}
            />
          ),
        },
      ],
    },
    {
      titleKey: "businessData.dataCollection.operations.stepDataCollection",
      fields: [
        {
          key: "dataValues",
          labelKey: "businessData.dataCollection.operations.dataValues",
          type: "custom",
          render: (values, onChange) => (
            <PerformImmediateDataStep
              values={values}
              onChange={onChange}
              dcParameters={dc?.parameters ?? []}
            />
          ),
        },
        {
          key: "comment",
          labelKey: "businessData.dataCollection.operations.comment",
          type: "textarea",
        },
      ],
    },
  ];
}

function toDataCollectionUpsertInput(values: OperationValues): DataCollectionUpsertInput {
  const rows = values.parameters as unknown as DataCollectionParameterRow[] | undefined;
  return {
    name: str(values.name),
    description: str(values.description),
    type: str(values.type),
    scope: str(values.scope),
    changeSet: str(values.changeSet),
    useAutomaticChangeSet: bool(values.useAutomaticChangeSet),
    approvalRole: str(values.approvalRole),
    makeEffectiveOnApproval: bool(values.makeEffectiveOnApproval),
    spcMode: str(values.spcMode),
    userInterface: str(values.userInterface),
    parameters: toParameters(rows),
  };
}

function dataCollectionToValues(dc: DataCollectionDetail): OperationValues {
  return {
    name: dc.name,
    description: dc.description,
    type: dc.type,
    scope: dc.scope,
    changeSet: dc.changeSet,
    spcMode: dc.spcMode,
    userInterface: dc.userInterface,
    parameters: dc.parameters.map((p, idx) => ({
      ...p,
      id: Date.now() + idx,
    })) as unknown as boolean,
  };
}

export interface DataCollectionDialogs {
  dialogs: React.ReactNode;
  openCreate: () => void;
  openEdit: () => void;
  openClone: () => void;
  openTerminate: () => void;
  openUnterminate: () => void;
  openManageParameters: () => void;
  openInstance: () => void;
  openPerformImmediate: () => void;
  openViewInstance: (instance: DataCollectionInstance) => void;
  openPostData: (instance: DataCollectionInstance) => void;
  openCorrect: (instance: DataCollectionInstance) => void;
  openCloseInstance: (instance: DataCollectionInstance) => void;
  openResetInstance: (instance: DataCollectionInstance) => void;
  openTerminateInstance: (instance: DataCollectionInstance) => void;
  openUnterminateInstance: (instance: DataCollectionInstance) => void;
}

export function useDataCollectionDialogs(dc?: DataCollectionDetail): DataCollectionDialogs {
  const { t } = useAppTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [manageParametersOpen, setManageParametersOpen] = useState(false);
  const [openInstanceOpen, setOpenInstanceOpen] = useState(false);
  const [performImmediateOpen, setPerformImmediateOpen] = useState(false);
  const [viewInstance, setViewInstance] = useState<DataCollectionInstance | null>(null);
  const [postInstance, setPostInstance] = useState<DataCollectionInstance | null>(null);
  const [correctInstance, setCorrectInstance] = useState<DataCollectionInstance | null>(null);
  const [closeInstance, setCloseInstance] = useState<DataCollectionInstance | null>(null);
  const [resetInstance, setResetInstance] = useState<DataCollectionInstance | null>(null);
  const [terminateInstance, setTerminateInstance] = useState<DataCollectionInstance | null>(null);
  const [unterminateInstance, setUnterminateInstance] = useState<DataCollectionInstance | null>(
    null,
  );

  const createMutation = useCreateDataCollection();
  const updateMutation = useUpdateDataCollection();
  const stateMutation = useSetDataCollectionState();
  const manageParametersMutation = useManageDataCollectionParameters();
  const openInstanceMutation = useOpenDataCollectionInstance();
  const performImmediateMutation = usePerformImmediateDataCollection();
  const updateInstanceMutation = useUpdateDataCollectionInstance();
  const postMutation = usePostDataCollectionInstance();
  const correctMutation = useCorrectDataCollectionInstance();
  const resetMutation = useResetDataCollectionInstance();

  const entityLabel = t("businessData.dataCollection.entityName");
  const createSteps = buildDataCollectionSteps(false);
  const editSteps = buildDataCollectionSteps(true);
  const editInitial = dc ? dataCollectionToValues(dc) : {};
  const performImmediateSteps = buildPerformImmediateSteps(dc);

  const setInstanceState = (instance: DataCollectionInstance | null, state: string) => {
    if (dc && instance)
      updateInstanceMutation.mutate({ name: dc.name, instance: instance.name, patch: { state } });
  };

  const dialogs = (
    <>
      <EntityWizardDialog
        open={createOpen}
        titleKey="businessData.dataCollection.operations.createTitle"
        steps={createSteps}
        submitLabelKey="common.create"
        onClose={() => setCreateOpen(false)}
        onSubmit={(values) => {
          createMutation.mutate(toDataCollectionUpsertInput(values));
          setCreateOpen(false);
        }}
      />
      <EntityWizardDialog
        open={editOpen}
        titleKey="businessData.dataCollection.operations.editTitle"
        steps={editSteps}
        initialValues={editInitial}
        submitLabelKey="common.save"
        onClose={() => setEditOpen(false)}
        onSubmit={(values) => {
          if (dc)
            updateMutation.mutate({ name: dc.name, input: toDataCollectionUpsertInput(values) });
          setEditOpen(false);
        }}
      />
      <CloneDataCollectionDialog
        open={cloneOpen}
        dataCollectionName={dc?.name ?? ""}
        onClose={() => setCloneOpen(false)}
        onClone={(rows: CloneDataCollectionRow[]) => {
          if (dc) {
            const base = toDataCollectionUpsertInput(dataCollectionToValues(dc));
            rows.forEach((row) => {
              createMutation.mutate({ ...base, name: row.name });
            });
          }
          setCloneOpen(false);
        }}
      />
      <ConfirmOperationDialog
        open={terminateOpen}
        titleKey="businessData.dataCollection.operations.terminateTitle"
        messageKey="businessData.dataCollection.operations.terminateMessage"
        messageParams={{ name: dc?.name ?? entityLabel }}
        confirmLabelKey="actionBar.terminate"
        danger
        onClose={() => setTerminateOpen(false)}
        onConfirm={() => {
          if (dc) stateMutation.mutate({ name: dc.name, state: "Terminated" });
          setTerminateOpen(false);
        }}
      />
      <ConfirmOperationDialog
        open={unterminateOpen}
        titleKey="businessData.dataCollection.operations.unterminateTitle"
        messageKey="businessData.dataCollection.operations.unterminateMessage"
        messageParams={{ name: dc?.name ?? entityLabel }}
        confirmLabelKey="actionBar.unterminate"
        onClose={() => setUnterminateOpen(false)}
        onConfirm={() => {
          if (dc) stateMutation.mutate({ name: dc.name, state: "Active" });
          setUnterminateOpen(false);
        }}
      />
      <ManageDataCollectionParametersDialog
        key={manageParametersOpen ? "open" : "closed"}
        open={manageParametersOpen}
        parameters={dc?.parameters ?? []}
        onClose={() => setManageParametersOpen(false)}
        onConfirm={(parameters) => {
          if (dc) manageParametersMutation.mutate({ name: dc.name, parameters });
          setManageParametersOpen(false);
        }}
      />
      <OpenDataCollectionInstanceDialog
        open={openInstanceOpen}
        dataCollectionName={dc?.name ?? ""}
        limitSets={(dc?.limitSets ?? []).map((l) => l.name)}
        onClose={() => setOpenInstanceOpen(false)}
        onConfirm={(input) => {
          if (dc) openInstanceMutation.mutate({ name: dc.name, input });
          setOpenInstanceOpen(false);
        }}
      />
      <EntityWizardDialog
        open={performImmediateOpen}
        titleKey="businessData.dataCollection.operations.performImmediateTitle"
        steps={performImmediateSteps}
        submitLabelKey="businessData.dataCollection.operations.perform"
        onClose={() => setPerformImmediateOpen(false)}
        onSubmit={(values) => {
          if (dc) {
            const adHoc = bool(values.adHoc);
            const adHocRows = values.adHocParameters as unknown as
              DataCollectionParameterRow[] | undefined;
            const dataRows = values.dataValues as unknown as DataValueRow[] | undefined;
            performImmediateMutation.mutate({
              name: dc.name,
              input: {
                instanceName: str(values.instanceName),
                description: str(values.description),
                adHoc,
                limitSet: str(values.limitSet),
                parameters: adHoc ? toParameters(adHocRows) : undefined,
                values: (dataRows ?? []).map((r) => ({ parameter: r.parameter, value: r.value })),
                comment: str(values.comment),
              },
            });
          }
          setPerformImmediateOpen(false);
        }}
      />
      <ViewDataCollectionInstanceDialog
        open={viewInstance !== null}
        instance={viewInstance}
        onClose={() => setViewInstance(null)}
      />
      <PostDataDialog
        key={postInstance?.name ?? "none"}
        open={postInstance !== null}
        instance={postInstance}
        parameters={(dc?.parameters ?? []).map((p) => ({
          parameter: p.parameter,
          isOptional: p.isOptional,
        }))}
        onClose={() => setPostInstance(null)}
        onConfirm={(values, comment) => {
          if (dc && postInstance) {
            postMutation.mutate({
              name: dc.name,
              instance: postInstance.name,
              values: values.map((r) => ({ parameter: r.parameter, value: r.value })),
              comment,
            });
          }
          setPostInstance(null);
        }}
      />
      <CorrectDataDialog
        key={correctInstance?.name ?? "none"}
        open={correctInstance !== null}
        instance={correctInstance}
        parameters={(dc?.parameters ?? []).map((p) => ({
          parameter: p.parameter,
          isOptional: p.isOptional,
        }))}
        onClose={() => setCorrectInstance(null)}
        onConfirm={(values) => {
          if (dc && correctInstance) {
            correctMutation.mutate({
              name: dc.name,
              instance: correctInstance.name,
              values: values.map((r) => ({ parameter: r.parameter, value: r.value })),
            });
          }
          setCorrectInstance(null);
        }}
      />
      <CommentConfirmDialog
        open={closeInstance !== null}
        titleKey="businessData.dataCollection.operations.closeInstanceTitle"
        messageKey="businessData.dataCollection.operations.closeInstanceMessage"
        messageParams={{ name: closeInstance?.name ?? entityLabel }}
        confirmLabelKey="businessData.dataCollection.operations.close"
        onClose={() => setCloseInstance(null)}
        onConfirm={() => {
          setInstanceState(closeInstance, INSTANCE_STATE_CLOSED);
          setCloseInstance(null);
        }}
      />
      <CommentConfirmDialog
        open={resetInstance !== null}
        titleKey="businessData.dataCollection.operations.resetInstanceTitle"
        messageKey="businessData.dataCollection.operations.resetInstanceMessage"
        messageParams={{ name: resetInstance?.name ?? entityLabel }}
        confirmLabelKey="businessData.dataCollection.operations.reset"
        onClose={() => setResetInstance(null)}
        onConfirm={() => {
          if (dc && resetInstance)
            resetMutation.mutate({ name: dc.name, instance: resetInstance.name });
          setResetInstance(null);
        }}
      />
      <ConfirmOperationDialog
        open={terminateInstance !== null}
        titleKey="businessData.dataCollection.operations.terminateInstanceTitle"
        messageKey="businessData.dataCollection.operations.terminateInstanceMessage"
        messageParams={{ name: terminateInstance?.name ?? entityLabel }}
        confirmLabelKey="actionBar.terminate"
        danger
        onClose={() => setTerminateInstance(null)}
        onConfirm={() => {
          setInstanceState(terminateInstance, INSTANCE_STATE_TERMINATED);
          setTerminateInstance(null);
        }}
      />
      <ConfirmOperationDialog
        open={unterminateInstance !== null}
        titleKey="businessData.dataCollection.operations.unterminateInstanceTitle"
        messageKey="businessData.dataCollection.operations.unterminateInstanceMessage"
        messageParams={{ name: unterminateInstance?.name ?? entityLabel }}
        confirmLabelKey="actionBar.unterminate"
        onClose={() => setUnterminateInstance(null)}
        onConfirm={() => {
          setInstanceState(unterminateInstance, INSTANCE_STATE_OPEN);
          setUnterminateInstance(null);
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
    openManageParameters: () => setManageParametersOpen(true),
    openInstance: () => setOpenInstanceOpen(true),
    openPerformImmediate: () => setPerformImmediateOpen(true),
    openViewInstance: (instance: DataCollectionInstance) => setViewInstance(instance),
    openPostData: (instance: DataCollectionInstance) => setPostInstance(instance),
    openCorrect: (instance: DataCollectionInstance) => setCorrectInstance(instance),
    openCloseInstance: (instance: DataCollectionInstance) => setCloseInstance(instance),
    openResetInstance: (instance: DataCollectionInstance) => setResetInstance(instance),
    openTerminateInstance: (instance: DataCollectionInstance) => setTerminateInstance(instance),
    openUnterminateInstance: (instance: DataCollectionInstance) => setUnterminateInstance(instance),
  };
}
