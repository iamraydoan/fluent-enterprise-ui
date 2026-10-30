import { useState } from "react";
import type { BinConverterDetail, BinConverterUpsertInput } from "@/api";
import { useCreateBinConverter, useSetBinConverterState, useUpdateBinConverter } from "@/api";
import { useAppTranslation } from "@/i18n";
import { ConfirmOperationDialog } from "../../components/ConfirmOperationDialog";
import { EntityWizardDialog } from "../../components/EntityWizardDialog";
import type { OperationValues, WizardStep } from "../../components/operationTypes";
import { BinConversionListEditor } from "./BinConverterManageDialogs";

const CONVERTER_TYPE_OPTIONS = [
  { value: "Colors", label: "Colors" },
  { value: "ColorsAndValues", label: "Colors and Values" },
];

const BIN_TYPE_OPTIONS = [
  { value: "Ascii", label: "Ascii" },
  { value: "Decimal", label: "Decimal" },
  { value: "Hexadecimal", label: "Hexadecimal" },
  { value: "Integer2", label: "Integer2" },
];

function buildBinConverterSteps(): WizardStep[] {
  return [
    {
      titleKey: "businessData.binConverter.detail.binConverter",
      fields: [
        { key: "name", labelKey: "businessData.binConverter.detail.name", type: "text", required: true },
        {
          key: "description",
          labelKey: "businessData.binConverter.detail.description",
          type: "textarea",
        },
        {
          key: "converterType",
          labelKey: "businessData.binConverter.detail.converterType",
          type: "select",
          options: CONVERTER_TYPE_OPTIONS,
          required: true,
        },
        {
          key: "binType",
          labelKey: "businessData.binConverter.detail.binType",
          type: "select",
          options: BIN_TYPE_OPTIONS,
          required: true,
        },
      ],
    },
    {
      titleKey: "businessData.binConverter.operations.binConversions",
      fields: [
        {
          key: "conversions",
          labelKey: "businessData.binConverter.operations.binConversions",
          type: "custom",
          render: (values, onChange) => (
            <BinConversionListEditor values={values} onChange={onChange} />
          ),
        },
      ],
    },
  ];
}

function toUpsertInput(values: OperationValues): BinConverterUpsertInput {
  return {
    name: String(values.name ?? ""),
    description: values.description === undefined ? undefined : String(values.description),
    converterType: values.converterType === undefined ? undefined : String(values.converterType),
    binType: values.binType === undefined ? undefined : String(values.binType),
  };
}

export interface BinConverterDialogs {
  dialogs: React.ReactNode;
  openCreate: () => void;
  openEdit: () => void;
  openClone: () => void;
  openTerminate: () => void;
  openUnterminate: () => void;
}

export function useBinConverterDialogs(converter?: BinConverterDetail): BinConverterDialogs {
  const { t } = useAppTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);

  const createMutation = useCreateBinConverter();
  const updateMutation = useUpdateBinConverter();
  const stateMutation = useSetBinConverterState();

  const steps = buildBinConverterSteps();
  const entityLabel = t("businessData.binConverter.entityName");

  const editInitial: OperationValues = converter
    ? {
        name: converter.name,
        description: converter.description,
        converterType: converter.converterType,
        binType: converter.binType,
      }
    : {};

  const cloneSteps: WizardStep[] = [
    {
      titleKey: "businessData.binConverter.detail.binConverter",
      fields: [
        { key: "name", labelKey: "businessData.binConverter.detail.name", type: "text", required: true },
        {
          key: "description",
          labelKey: "businessData.binConverter.detail.description",
          type: "textarea",
        },
      ],
    },
  ];

  const dialogs = (
    <>
      <EntityWizardDialog
        open={createOpen}
        titleKey="businessData.binConverter.operations.createTitle"
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
        titleKey="businessData.binConverter.operations.editTitle"
        steps={steps}
        initialValues={editInitial}
        submitLabelKey="common.save"
        onClose={() => setEditOpen(false)}
        onSubmit={(values) => {
          if (converter)
            updateMutation.mutate({ name: converter.name, input: toUpsertInput(values) });
          setEditOpen(false);
        }}
      />
      <EntityWizardDialog
        open={cloneOpen}
        titleKey="businessData.binConverter.operations.cloneTitle"
        steps={cloneSteps}
        initialValues={
          converter ? { name: `${converter.name} - Clone`, description: converter.description } : {}
        }
        submitLabelKey="common.create"
        onClose={() => setCloneOpen(false)}
        onSubmit={(values) => {
          if (converter) {
            createMutation.mutate({
              ...toUpsertInput({ ...editInitial, ...values }),
              name: String(values.name ?? `${converter.name} - Clone`),
            });
          }
          setCloneOpen(false);
        }}
      />
      <ConfirmOperationDialog
        open={terminateOpen}
        titleKey="businessData.binConverter.operations.terminateTitle"
        messageKey="businessData.binConverter.operations.terminateMessage"
        messageParams={{ name: converter?.name ?? entityLabel }}
        confirmLabelKey="actionBar.terminate"
        danger
        onClose={() => setTerminateOpen(false)}
        onConfirm={() => {
          if (converter) stateMutation.mutate({ name: converter.name, state: "Terminated" });
        }}
      />
      <ConfirmOperationDialog
        open={unterminateOpen}
        titleKey="businessData.binConverter.operations.unterminateTitle"
        messageKey="businessData.binConverter.operations.unterminateMessage"
        messageParams={{ name: converter?.name ?? entityLabel }}
        confirmLabelKey="actionBar.unterminate"
        onClose={() => setUnterminateOpen(false)}
        onConfirm={() => {
          if (converter) stateMutation.mutate({ name: converter.name, state: "Active" });
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
  };
}
