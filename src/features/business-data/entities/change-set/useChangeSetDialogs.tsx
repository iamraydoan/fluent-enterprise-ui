import { useState } from "react";
import type { ChangeSetDetail, ChangeSetUpsertInput } from "@/api";
import { useCreateChangeSet, useSetChangeSetState, useUpdateChangeSet } from "@/api";
import { useAppTranslation } from "@/i18n";
import { ConfirmOperationDialog } from "../../components/ConfirmOperationDialog";
import { EntityWizardDialog } from "../../components/EntityWizardDialog";
import type { OperationValues, WizardStep } from "../../components/operationTypes";
import {
  ApproveChangeSetItemsDialog,
  ChangeChangeSetDialog,
  CompareChangeSetItemsDialog,
  CreateChangeSetItemsDialog,
  ManageChangeSetItemsDialog,
  ManageStateReviewersDialog,
  ManageSubscribersDialog,
  TakeOwnershipDialog,
  TransferChangeSetItemsDialog,
} from "./ChangeSetManageDialogs";
import type { ChangeSetTransition } from "./changeSetTransitions";
import { CHANGE_SET_TRANSITIONS, TRANSITION_STATE } from "./changeSetTransitions";

const TYPE_OPTIONS = [
  { value: "General", label: "General" },
  { value: "Emergency", label: "Emergency" },
];

function buildChangeSetSteps(): WizardStep[] {
  return [
    {
      titleKey: "businessData.changeSet.detail.information",
      fields: [
        {
          key: "name",
          labelKey: "businessData.changeSet.detail.name",
          type: "text",
          required: true,
        },
        {
          key: "description",
          labelKey: "businessData.changeSet.detail.description",
          type: "textarea",
        },
        {
          key: "type",
          labelKey: "businessData.changeSet.detail.type",
          type: "select",
          options: TYPE_OPTIONS,
          required: true,
        },
        { key: "category", labelKey: "businessData.changeSet.detail.category", type: "text" },
        { key: "urgency", labelKey: "businessData.changeSet.detail.urgency", type: "text" },
        { key: "owner", labelKey: "businessData.changeSet.detail.owner", type: "text" },
      ],
    },
    {
      titleKey: "businessData.changeSet.detail.approval",
      fields: [
        {
          key: "requiresApproval",
          labelKey: "businessData.changeSet.detail.requiresApproval",
          type: "checkbox",
        },
        {
          key: "approvalRole",
          labelKey: "businessData.changeSet.detail.approvalRole",
          type: "text",
        },
        {
          key: "makeItemsEffectiveOnApproval",
          labelKey: "businessData.changeSet.detail.makeItemsEffectiveOnApproval",
          type: "checkbox",
        },
      ],
    },
    {
      titleKey: "businessData.changeSet.detail.notification",
      fields: [
        {
          key: "sendEmailToRequester",
          labelKey: "businessData.changeSet.detail.sendEmailToRequester",
          type: "checkbox",
        },
        {
          key: "sendEmailToApprovers",
          labelKey: "businessData.changeSet.detail.sendEmailToApprovers",
          type: "checkbox",
        },
      ],
    },
    {
      titleKey: "businessData.changeSet.detail.documentation",
      fields: [
        {
          key: "reasonForChange",
          labelKey: "businessData.changeSet.detail.reasonForChange",
          type: "textarea",
        },
        {
          key: "descriptionOfChange",
          labelKey: "businessData.changeSet.detail.descriptionOfChange",
          type: "textarea",
        },
      ],
    },
  ];
}

function toUpsertInput(values: OperationValues): ChangeSetUpsertInput {
  return {
    name: String(values.name ?? ""),
    description: values.description === undefined ? undefined : String(values.description),
    type: values.type === undefined ? undefined : String(values.type),
    category: values.category === undefined ? undefined : String(values.category),
    urgency: values.urgency === undefined ? undefined : String(values.urgency),
    owner: values.owner === undefined ? undefined : String(values.owner),
    requiresApproval: values.requiresApproval === true,
    approvalRole: values.approvalRole === undefined ? undefined : String(values.approvalRole),
    makeItemsEffectiveOnApproval: values.makeItemsEffectiveOnApproval === true,
    sendEmailToRequester: values.sendEmailToRequester === true,
    sendEmailToApprovers: values.sendEmailToApprovers === true,
    reasonForChange:
      values.reasonForChange === undefined ? undefined : String(values.reasonForChange),
    descriptionOfChange:
      values.descriptionOfChange === undefined ? undefined : String(values.descriptionOfChange),
  };
}

export interface ChangeSetDialogs {
  dialogs: React.ReactNode;
  openCreate: () => void;
  openEdit: () => void;
  openClone: () => void;
  openTerminate: () => void;
  openTransition: (transition: ChangeSetTransition) => void;
  openManageItems: () => void;
  openCreateItems: () => void;
  openApproveItems: () => void;
  openCompareItems: () => void;
  openTransferItems: () => void;
  openManageReviewers: () => void;
  openManageSubscribers: () => void;
  openTakeOwnership: () => void;
  openChange: () => void;
}

export function useChangeSetDialogs(cs?: ChangeSetDetail): ChangeSetDialogs {
  const { t } = useAppTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [transition, setTransition] = useState<ChangeSetTransition | null>(null);
  const [manageItemsOpen, setManageItemsOpen] = useState(false);
  const [createItemsOpen, setCreateItemsOpen] = useState(false);
  const [approveItemsOpen, setApproveItemsOpen] = useState(false);
  const [compareItemsOpen, setCompareItemsOpen] = useState(false);
  const [transferItemsOpen, setTransferItemsOpen] = useState(false);
  const [reviewersOpen, setReviewersOpen] = useState(false);
  const [subscribersOpen, setSubscribersOpen] = useState(false);
  const [ownershipOpen, setOwnershipOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);

  const createMutation = useCreateChangeSet();
  const updateMutation = useUpdateChangeSet();
  const stateMutation = useSetChangeSetState();

  const steps = buildChangeSetSteps();
  const entityLabel = t("businessData.changeSet.entityName");

  const editInitial: OperationValues = cs
    ? {
        name: cs.name,
        description: cs.description,
        type: cs.type,
        category: cs.category,
        urgency: cs.urgency,
        owner: cs.owner,
        requiresApproval: cs.requiresApproval,
        approvalRole: cs.approvalRole,
        makeItemsEffectiveOnApproval: cs.makeItemsEffectiveOnApproval,
        sendEmailToRequester: cs.sendEmailToRequester,
        sendEmailToApprovers: cs.sendEmailToApprovers,
        reasonForChange: cs.reasonForChange,
        descriptionOfChange: cs.descriptionOfChange,
      }
    : {};

  const cloneSteps: WizardStep[] = [
    {
      titleKey: "businessData.changeSet.detail.information",
      fields: [
        {
          key: "name",
          labelKey: "businessData.changeSet.detail.name",
          type: "text",
          required: true,
        },
        {
          key: "description",
          labelKey: "businessData.changeSet.detail.description",
          type: "textarea",
        },
      ],
    },
  ];

  const dialogs = (
    <>
      <EntityWizardDialog
        open={createOpen}
        titleKey="businessData.changeSet.operations.createTitle"
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
        titleKey="businessData.changeSet.operations.editTitle"
        steps={steps}
        initialValues={editInitial}
        submitLabelKey="common.save"
        onClose={() => setEditOpen(false)}
        onSubmit={(values) => {
          if (cs) updateMutation.mutate({ name: cs.name, input: toUpsertInput(values) });
          setEditOpen(false);
        }}
      />
      <EntityWizardDialog
        open={cloneOpen}
        titleKey="businessData.changeSet.operations.cloneTitle"
        steps={cloneSteps}
        initialValues={cs ? { name: `${cs.name} - Clone`, description: cs.description } : {}}
        submitLabelKey="common.create"
        onClose={() => setCloneOpen(false)}
        onSubmit={(values) => {
          if (cs) {
            createMutation.mutate({
              ...toUpsertInput({ ...editInitial, ...values }),
              name: String(values.name ?? `${cs.name} - Clone`),
            });
          }
          setCloneOpen(false);
        }}
      />
      <ConfirmOperationDialog
        open={terminateOpen}
        titleKey="businessData.changeSet.operations.terminateTitle"
        messageKey="businessData.changeSet.operations.terminateMessage"
        messageParams={{ name: cs?.name ?? entityLabel }}
        confirmLabelKey="actionBar.terminate"
        danger
        onClose={() => setTerminateOpen(false)}
        onConfirm={() => {
          if (cs) stateMutation.mutate({ name: cs.name, patch: { state: "Terminated" } });
        }}
      />
      {CHANGE_SET_TRANSITIONS.map((key) => (
        <ConfirmOperationDialog
          key={key}
          open={transition === key}
          titleKey={`businessData.changeSet.operations.${key}Title`}
          messageKey={`businessData.changeSet.operations.${key}Message`}
          messageParams={{ name: cs?.name ?? entityLabel }}
          confirmLabelKey={`businessData.changeSet.operations.${key}`}
          danger={key === "reject" || key === "cancel"}
          onClose={() => setTransition(null)}
          onConfirm={() => {
            if (cs) {
              stateMutation.mutate({ name: cs.name, patch: TRANSITION_STATE[key] });
            }
          }}
        />
      ))}
      <ManageChangeSetItemsDialog
        open={manageItemsOpen}
        changeSetName={cs?.name ?? ""}
        onClose={() => setManageItemsOpen(false)}
      />
      <CreateChangeSetItemsDialog
        open={createItemsOpen}
        changeSetName={cs?.name ?? ""}
        onClose={() => setCreateItemsOpen(false)}
      />
      <ApproveChangeSetItemsDialog
        open={approveItemsOpen}
        changeSetName={cs?.name ?? ""}
        onClose={() => setApproveItemsOpen(false)}
      />
      <CompareChangeSetItemsDialog
        open={compareItemsOpen}
        changeSetName={cs?.name ?? ""}
        onClose={() => setCompareItemsOpen(false)}
      />
      <TransferChangeSetItemsDialog
        open={transferItemsOpen}
        changeSetName={cs?.name ?? ""}
        onClose={() => setTransferItemsOpen(false)}
      />
      <ManageStateReviewersDialog
        open={reviewersOpen}
        changeSetName={cs?.name ?? ""}
        onClose={() => setReviewersOpen(false)}
      />
      <ManageSubscribersDialog
        open={subscribersOpen}
        changeSetName={cs?.name ?? ""}
        onClose={() => setSubscribersOpen(false)}
      />
      <TakeOwnershipDialog
        open={ownershipOpen}
        changeSetName={cs?.name ?? ""}
        onClose={() => setOwnershipOpen(false)}
      />
      <ChangeChangeSetDialog
        open={changeOpen}
        changeSetName={cs?.name ?? ""}
        currentOwner={cs?.owner ?? ""}
        onClose={() => setChangeOpen(false)}
        onChange={(owner) => {
          if (cs) updateMutation.mutate({ name: cs.name, input: { owner } });
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
    openTransition: (next: ChangeSetTransition) => setTransition(next),
    openManageItems: () => setManageItemsOpen(true),
    openCreateItems: () => setCreateItemsOpen(true),
    openApproveItems: () => setApproveItemsOpen(true),
    openCompareItems: () => setCompareItemsOpen(true),
    openTransferItems: () => setTransferItemsOpen(true),
    openManageReviewers: () => setReviewersOpen(true),
    openManageSubscribers: () => setSubscribersOpen(true),
    openTakeOwnership: () => setOwnershipOpen(true),
    openChange: () => setChangeOpen(true),
  };
}
