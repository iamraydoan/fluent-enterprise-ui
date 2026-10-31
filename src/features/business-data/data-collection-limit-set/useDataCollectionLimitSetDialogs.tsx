import { useState } from "react";
import type { DataCollectionLimitSetDetail, ParameterLimit } from "@/api";
import {
  useCopyDataCollectionLimitSets,
  useCreateDataCollectionLimitSet,
  useDataCollections,
  useManageDataCollectionLimitSetParameters,
  useSetDataCollectionLimitSetState,
  useUpdateDataCollectionLimitSet,
} from "@/api";
import { useAppTranslation } from "@/i18n";
import { ConfirmOperationDialog } from "../components/ConfirmOperationDialog";
import { EntityWizardDialog } from "../components/EntityWizardDialog";
import type { OperationValues, WizardStep } from "../components/operationTypes";
import {
  CopyLimitSetsNamesStep,
  CopyLimitSetsSelectStep,
  EditDataCollectionLimitSetDialog,
  ParameterLimitsEditor,
  type ParameterLimitRow,
  SampleLimitsEditor,
} from "./DataCollectionLimitSetDialogs";
import { COPY_NAMES_KEY, COPY_SOURCES_KEY, LIMIT_SET_TYPES } from "./dataCollectionLimitSetLookups";

const TYPE_OPTIONS = LIMIT_SET_TYPES.map((v) => ({ value: v, label: v }));

function str(v: string | number | boolean | undefined): string | undefined {
  if (v === undefined) return undefined;
  return String(v);
}

function bool(v: string | number | boolean | undefined): boolean {
  return v === true;
}

function toParameterLimits(rows: ParameterLimitRow[]): ParameterLimit[] {
  return rows.map((r) => ({
    parameter: r.parameter,
    overrideParameter: r.overrideParameter,
    includeSampleLimits: r.includeSampleLimits,
    minValue: r.minValue,
    maxValue: r.maxValue,
    limitType: r.limitType,
    lowerErrorLimit: r.lowerErrorLimit,
    lowerWarningLimit: r.lowerWarningLimit,
    target: r.target,
    upperWarningLimit: r.upperWarningLimit,
    upperErrorLimit: r.upperErrorLimit,
    sampleLimits: r.sampleLimits.map((sm) => ({
      sampleId: sm.sampleId,
      lowerErrorLimit: sm.lowerErrorLimit,
      lowerWarningLimit: sm.lowerWarningLimit,
      target: sm.target,
      upperWarningLimit: sm.upperWarningLimit,
      upperErrorLimit: sm.upperErrorLimit,
    })),
  }));
}

function changeSetStep(): WizardStep {
  return {
    titleKey: "businessData.dataCollectionLimitSet.operations.stepChangeSet",
    fields: [
      {
        key: "changeSet",
        labelKey: "businessData.dataCollectionLimitSet.detail.changeSet",
        type: "text",
      },
      {
        key: "useAutomaticChangeSet",
        labelKey: "businessData.dataCollectionLimitSet.detail.useAutomaticChangeSet",
        type: "checkbox",
      },
      {
        key: "approvalRole",
        labelKey: "businessData.dataCollectionLimitSet.detail.approvalRole",
        type: "text",
      },
    ],
  };
}

export function useDataCollectionLimitSetDialogs(limitSet?: DataCollectionLimitSetDetail) {
  const { t } = useAppTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  const createMutation = useCreateDataCollectionLimitSet();
  const updateMutation = useUpdateDataCollectionLimitSet();
  const stateMutation = useSetDataCollectionLimitSetState();
  const manageMutation = useManageDataCollectionLimitSetParameters();

  const { data: dcList } = useDataCollections({ page: 1, limit: 100, filters: {} });
  const dcOptions = (dcList?.data ?? []).map((d) => ({ value: d.name, label: d.name }));

  const toUpsertInput = (values: OperationValues) => ({
    name: str(values.name),
    description: str(values.description),
    type: str(values.type) ?? LIMIT_SET_TYPES[0],
    dataCollection: str(values.dataCollection),
    revision: str(values.revision),
    changeSet: str(values.changeSet),
    useAutomaticChangeSet: bool(values.useAutomaticChangeSet),
    approvalRole: str(values.approvalRole),
    parameterLimits: toParameterLimits(
      (values.parameterLimits as unknown as ParameterLimitRow[] | undefined) ?? [],
    ),
  });

  const createSteps: WizardStep[] = [
    changeSetStep(),
    {
      titleKey: "businessData.dataCollectionLimitSet.operations.stepGeneralData",
      fields: [
        {
          key: "name",
          labelKey: "businessData.dataCollectionLimitSet.detail.name",
          type: "text",
          required: true,
        },
        {
          key: "revision",
          labelKey: "businessData.dataCollectionLimitSet.detail.revision",
          type: "text",
        },
        {
          key: "description",
          labelKey: "businessData.dataCollectionLimitSet.detail.description",
          type: "textarea",
        },
        {
          key: "type",
          labelKey: "businessData.dataCollectionLimitSet.detail.type",
          type: "select",
          options: TYPE_OPTIONS,
        },
        {
          key: "dataCollection",
          labelKey: "businessData.dataCollectionLimitSet.detail.dataCollection",
          type: "select",
          options: dcOptions,
        },
      ],
    },
    {
      titleKey: "businessData.dataCollectionLimitSet.operations.stepParametersLimits",
      fields: [
        {
          key: "parameterLimits",
          labelKey: "businessData.dataCollectionLimitSet.detail.parameterLimits",
          type: "custom",
          render: (values, onChange) => (
            <ParameterLimitsEditor
              values={values}
              onChange={onChange}
              dataCollectionName={str(values.dataCollection)}
            />
          ),
        },
      ],
    },
    {
      titleKey: "businessData.dataCollectionLimitSet.operations.stepSampleLimits",
      fields: [
        {
          key: "sampleLimits",
          labelKey: "businessData.dataCollectionLimitSet.detail.sampleLimits",
          type: "custom",
          render: (values, onChange) => <SampleLimitsEditor values={values} onChange={onChange} />,
        },
      ],
    },
  ];

  const manageSteps: WizardStep[] = [
    {
      titleKey: "businessData.dataCollectionLimitSet.operations.stepParameters",
      fields: [
        {
          key: "parameterLimits",
          labelKey: "businessData.dataCollectionLimitSet.detail.parameterLimits",
          type: "custom",
          render: (values, onChange) => (
            <ParameterLimitsEditor
              values={values}
              onChange={onChange}
              dataCollectionName={limitSet?.dataCollection}
            />
          ),
        },
        {
          key: "comment",
          labelKey: "businessData.dataCollectionLimitSet.operations.comment",
          type: "textarea",
        },
      ],
    },
    {
      titleKey: "businessData.dataCollectionLimitSet.operations.stepSamples",
      fields: [
        {
          key: "sampleLimits",
          labelKey: "businessData.dataCollectionLimitSet.detail.sampleLimits",
          type: "custom",
          render: (values, onChange) => <SampleLimitsEditor values={values} onChange={onChange} />,
        },
        {
          key: "comment",
          labelKey: "businessData.dataCollectionLimitSet.operations.comment",
          type: "textarea",
        },
      ],
    },
  ];

  const manageInitial: OperationValues = limitSet
    ? {
        parameterLimits: limitSet.parameterLimits.map((p, i) => ({
          id: i + 1,
          parameter: p.parameter,
          overrideParameter: p.overrideParameter,
          includeSampleLimits: p.includeSampleLimits,
          minValue: p.minValue,
          maxValue: p.maxValue,
          limitType: p.limitType,
          lowerErrorLimit: p.lowerErrorLimit,
          lowerWarningLimit: p.lowerWarningLimit,
          target: p.target,
          upperWarningLimit: p.upperWarningLimit,
          upperErrorLimit: p.upperErrorLimit,
          sampleLimits: (p.sampleLimits ?? []).map((s, j) => ({
            ...s,
            id: (i + 1) * 1000 + j + 1,
          })),
        })) as unknown as boolean,
        comment: "",
      }
    : {};

  const dialogs = (
    <>
      <EntityWizardDialog
        key={createOpen ? "open" : "closed"}
        open={createOpen}
        titleKey="businessData.dataCollectionLimitSet.operations.createTitle"
        steps={createSteps}
        submitLabelKey="common.create"
        onClose={() => setCreateOpen(false)}
        onSubmit={(values) => {
          createMutation.mutate(toUpsertInput(values));
          setCreateOpen(false);
        }}
      />
      {editOpen && limitSet && (
        <EditDataCollectionLimitSetDialog
          name={limitSet.name}
          initial={{
            description: limitSet.description,
            type: limitSet.type,
            dataCollection: limitSet.dataCollection,
          }}
          dataCollectionOptions={dcOptions}
          typeOptions={TYPE_OPTIONS}
          onClose={() => setEditOpen(false)}
          onSubmit={(editValues) => {
            updateMutation.mutate({ name: limitSet.name, input: editValues });
            setEditOpen(false);
          }}
        />
      )}
      <ConfirmOperationDialog
        open={terminateOpen}
        titleKey="businessData.dataCollectionLimitSet.operations.terminateTitle"
        messageKey="businessData.dataCollectionLimitSet.operations.terminateMessage"
        confirmLabelKey="businessData.dataCollectionLimitSet.operations.terminateAction"
        onClose={() => setTerminateOpen(false)}
        onConfirm={() => {
          if (limitSet) stateMutation.mutate({ name: limitSet.name, state: "Terminated" });
          setTerminateOpen(false);
        }}
      />
      <ConfirmOperationDialog
        open={unterminateOpen}
        titleKey="businessData.dataCollectionLimitSet.operations.unterminateTitle"
        messageKey="businessData.dataCollectionLimitSet.operations.unterminateMessage"
        confirmLabelKey="businessData.dataCollectionLimitSet.operations.unterminateAction"
        onClose={() => setUnterminateOpen(false)}
        onConfirm={() => {
          if (limitSet) stateMutation.mutate({ name: limitSet.name, state: "Active" });
          setUnterminateOpen(false);
        }}
      />
      <EntityWizardDialog
        key={manageOpen ? "open" : "closed"}
        open={manageOpen}
        titleKey="businessData.dataCollectionLimitSet.operations.manageParametersTitle"
        steps={manageSteps}
        initialValues={manageInitial}
        submitLabelKey="common.update"
        onClose={() => setManageOpen(false)}
        onSubmit={(values) => {
          if (limitSet)
            manageMutation.mutate({
              name: limitSet.name,
              input: {
                parameterLimits: toParameterLimits(
                  (values.parameterLimits as unknown as ParameterLimitRow[] | undefined) ?? [],
                ),
                comment: str(values.comment),
              },
            });
          setManageOpen(false);
        }}
      />
    </>
  );

  return {
    dialogs,
    openCreate: () => setCreateOpen(true),
    openEdit: () => setEditOpen(true),
    openTerminate: () => setTerminateOpen(true),
    openUnterminate: () => setUnterminateOpen(true),
    openManageParameters: () => setManageOpen(true),
    entityLabel: t("businessData.dataCollectionLimitSet.entityName"),
  };
}

export function useCopyDataCollectionLimitSetsDialog(targetDataCollection: string) {
  const [copyOpen, setCopyOpen] = useState(false);
  const copyMutation = useCopyDataCollectionLimitSets();

  const copySteps: WizardStep[] = [
    changeSetStep(),
    {
      titleKey: "businessData.dataCollectionLimitSet.operations.stepLimitSets",
      fields: [
        {
          key: "copySources",
          labelKey: "businessData.dataCollectionLimitSet.operations.limitSetsToCopy",
          type: "custom",
          render: (values, onChange) => (
            <CopyLimitSetsSelectStep values={values} onChange={onChange} />
          ),
        },
      ],
    },
    {
      titleKey: "businessData.dataCollectionLimitSet.operations.stepLimitSetsNames",
      fields: [
        {
          key: "copyNames",
          labelKey: "businessData.dataCollectionLimitSet.operations.limitSetNames",
          type: "custom",
          render: (values, onChange) => (
            <CopyLimitSetsNamesStep
              values={values}
              onChange={onChange}
              targetDataCollection={targetDataCollection}
            />
          ),
        },
      ],
    },
  ];

  const copyDialog = (
    <EntityWizardDialog
      key={copyOpen ? "open" : "closed"}
      open={copyOpen}
      titleKey="businessData.dataCollectionLimitSet.operations.copyTitle"
      steps={copySteps}
      submitLabelKey="businessData.dataCollectionLimitSet.operations.copyAction"
      onClose={() => setCopyOpen(false)}
      onSubmit={(values) => {
        const sources = (values[COPY_SOURCES_KEY] as unknown as string[] | undefined) ?? [];
        const names =
          (values[COPY_NAMES_KEY] as unknown as Record<string, string> | undefined) ?? {};
        copyMutation.mutate({
          changeSet: str(values.changeSet),
          useAutomaticChangeSet: bool(values.useAutomaticChangeSet),
          approvalRole: str(values.approvalRole),
          targetDataCollection,
          copies: sources.map((s) => ({
            source: s,
            name: names[s] ?? `${targetDataCollection}_${s}`,
          })),
        });
        setCopyOpen(false);
      }}
    />
  );

  return { copyDialog, openCopy: () => setCopyOpen(true) };
}
