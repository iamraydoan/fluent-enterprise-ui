import { useState } from "react";
import type { CertificationDetail, CertificationUpsertInput } from "@/api";
import { useCreateCertification, useSetCertificationState } from "@/api";
import { useAppTranslation } from "@/i18n";
import { ConfirmOperationDialog } from "../../components/ConfirmOperationDialog";
import { EntityWizardDialog } from "../../components/EntityWizardDialog";
import type { OperationValues, WizardStep } from "../../components/operationTypes";
import {
  AssignEmployeesDialog,
  GrantCertificationDialog,
  ManageEmployeesCertificationDialog,
} from "./CertificationManageDialogs";

const TYPE_OPTIONS = [
  { value: "General", label: "General" },
  { value: "Safety", label: "Safety" },
  { value: "Quality", label: "Quality" },
];

function buildCertificationSteps(): WizardStep[] {
  return [
    {
      titleKey: "businessData.certification.detail.info",
      fields: [
        {
          key: "name",
          labelKey: "businessData.certification.detail.name",
          type: "text",
          required: true,
        },
        {
          key: "description",
          labelKey: "businessData.certification.detail.description",
          type: "textarea",
        },
        {
          key: "type",
          labelKey: "businessData.certification.detail.type",
          type: "select",
          options: TYPE_OPTIONS,
          required: true,
        },
        {
          key: "ownerRole",
          labelKey: "businessData.certification.detail.ownerRole",
          type: "text",
        },
        { key: "validFor", labelKey: "businessData.certification.detail.validFor", type: "text" },
        {
          key: "allowOverride",
          labelKey: "businessData.certification.detail.allowOverride",
          type: "checkbox",
        },
      ],
    },
    {
      titleKey: "businessData.certification.detail.permission",
      fields: [
        {
          key: "allowManualGrants",
          labelKey: "businessData.certification.detail.allowManualGrants",
          type: "checkbox",
        },
        {
          key: "allowSelfGranting",
          labelKey: "businessData.certification.detail.allowSelfGranting",
          type: "checkbox",
        },
        {
          key: "allowGrantingByManager",
          labelKey: "businessData.certification.detail.allowGrantingByManager",
          type: "checkbox",
        },
        {
          key: "sendNotificationOnChanges",
          labelKey: "businessData.certification.detail.sendNotificationOnChanges",
          type: "checkbox",
        },
        {
          key: "sendNotificationWhenRequired",
          labelKey: "businessData.certification.detail.sendNotificationWhenRequired",
          type: "checkbox",
        },
      ],
    },
    {
      titleKey: "businessData.certification.detail.training",
      fields: [
        {
          key: "traineeByDefault",
          labelKey: "businessData.certification.detail.traineeByDefault",
          type: "checkbox",
        },
        {
          key: "trainingMaximumDuration",
          labelKey: "businessData.certification.detail.trainingMaximumDuration",
          type: "text",
        },
      ],
    },
  ];
}

function toUpsertInput(values: OperationValues): CertificationUpsertInput {
  return {
    name: String(values.name ?? ""),
    description: values.description === undefined ? undefined : String(values.description),
    type: values.type === undefined ? undefined : String(values.type),
    ownerRole: values.ownerRole === undefined ? undefined : String(values.ownerRole),
    validFor: values.validFor === undefined ? undefined : String(values.validFor),
    allowOverride: values.allowOverride === true,
    allowManualGrants: values.allowManualGrants === true,
    allowSelfGranting: values.allowSelfGranting === true,
    allowGrantingByManager: values.allowGrantingByManager === true,
    sendNotificationOnChanges: values.sendNotificationOnChanges === true,
    sendNotificationWhenRequired: values.sendNotificationWhenRequired === true,
    traineeByDefault: values.traineeByDefault === true,
    trainingMaximumDuration:
      values.trainingMaximumDuration === undefined
        ? undefined
        : String(values.trainingMaximumDuration),
  };
}

export interface CertificationDialogs {
  dialogs: React.ReactNode;
  openCreate: () => void;
  openClone: () => void;
  openTerminate: () => void;
  openUnterminate: () => void;
  openAssign: () => void;
  openGrant: () => void;
  openManageEmployees: () => void;
  openRevoke: () => void;
  openUnassign: () => void;
}

export function useCertificationDialogs(cert?: CertificationDetail): CertificationDialogs {
  const { t } = useAppTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [grantOpen, setGrantOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [unassignOpen, setUnassignOpen] = useState(false);

  const createMutation = useCreateCertification();
  const stateMutation = useSetCertificationState();

  const steps = buildCertificationSteps();
  const entityLabel = t("businessData.certification.entityName");

  const cloneSteps: WizardStep[] = [
    {
      titleKey: "businessData.certification.detail.info",
      fields: [
        {
          key: "name",
          labelKey: "businessData.certification.detail.name",
          type: "text",
          required: true,
        },
        {
          key: "description",
          labelKey: "businessData.certification.detail.description",
          type: "textarea",
        },
      ],
    },
  ];

  const dialogs = (
    <>
      <EntityWizardDialog
        open={createOpen}
        titleKey="businessData.certification.operations.createTitle"
        steps={steps}
        submitLabelKey="common.create"
        onClose={() => setCreateOpen(false)}
        onSubmit={(values) => {
          createMutation.mutate(toUpsertInput(values));
          setCreateOpen(false);
        }}
      />
      <EntityWizardDialog
        open={cloneOpen}
        titleKey="businessData.certification.operations.cloneTitle"
        steps={cloneSteps}
        initialValues={
          cert ? { name: `${cert.name} - Clone`, description: cert.description } : {}
        }
        submitLabelKey="common.create"
        onClose={() => setCloneOpen(false)}
        onSubmit={(values) => {
          if (cert) {
            createMutation.mutate({
              ...toUpsertInput(values),
              type: cert.type,
              name: String(values.name ?? `${cert.name} - Clone`),
            });
          }
          setCloneOpen(false);
        }}
      />
      <ConfirmOperationDialog
        open={terminateOpen}
        titleKey="businessData.certification.operations.terminateTitle"
        messageKey="businessData.certification.operations.terminateMessage"
        messageParams={{ name: cert?.name ?? entityLabel }}
        confirmLabelKey="actionBar.terminate"
        danger
        onClose={() => setTerminateOpen(false)}
        onConfirm={() => {
          if (cert) stateMutation.mutate({ name: cert.name, state: "Terminated" });
        }}
      />
      <ConfirmOperationDialog
        open={unterminateOpen}
        titleKey="businessData.certification.operations.unterminateTitle"
        messageKey="businessData.certification.operations.unterminateMessage"
        messageParams={{ name: cert?.name ?? entityLabel }}
        confirmLabelKey="actionBar.unterminate"
        onClose={() => setUnterminateOpen(false)}
        onConfirm={() => {
          if (cert) stateMutation.mutate({ name: cert.name, state: "Active" });
        }}
      />
      <AssignEmployeesDialog
        open={assignOpen}
        certificationName={cert?.name ?? ""}
        onClose={() => setAssignOpen(false)}
      />
      <GrantCertificationDialog
        open={grantOpen}
        certificationName={cert?.name ?? ""}
        onClose={() => setGrantOpen(false)}
      />
      <ManageEmployeesCertificationDialog
        open={manageOpen}
        certificationName={cert?.name ?? ""}
        onClose={() => setManageOpen(false)}
      />
      <ConfirmOperationDialog
        open={revokeOpen}
        titleKey="businessData.certification.operations.revokeTitle"
        messageKey="businessData.certification.operations.revokeMessage"
        messageParams={{ name: cert?.name ?? entityLabel }}
        confirmLabelKey="businessData.certification.operations.revoke"
        danger
        onClose={() => setRevokeOpen(false)}
        onConfirm={() => setRevokeOpen(false)}
      />
      <ConfirmOperationDialog
        open={unassignOpen}
        titleKey="businessData.certification.operations.unassignTitle"
        messageKey="businessData.certification.operations.unassignMessage"
        messageParams={{ name: cert?.name ?? entityLabel }}
        confirmLabelKey="businessData.certification.operations.unassign"
        danger
        onClose={() => setUnassignOpen(false)}
        onConfirm={() => setUnassignOpen(false)}
      />
    </>
  );

  return {
    dialogs,
    openCreate: () => setCreateOpen(true),
    openClone: () => setCloneOpen(true),
    openTerminate: () => setTerminateOpen(true),
    openUnterminate: () => setUnterminateOpen(true),
    openAssign: () => setAssignOpen(true),
    openGrant: () => setGrantOpen(true),
    openManageEmployees: () => setManageOpen(true),
    openRevoke: () => setRevokeOpen(true),
    openUnassign: () => setUnassignOpen(true),
  };
}
