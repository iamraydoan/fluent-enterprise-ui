import { useState } from "react";
import type { BusinessPartnerDetail, BusinessPartnerUpsertInput } from "@/api";
import {
  useCreateBusinessPartner,
  useSetBusinessPartnerState,
  useUpdateBusinessPartner,
} from "@/api";
import { useAppTranslation } from "@/i18n";
import { ConfirmOperationDialog } from "../components/ConfirmOperationDialog";
import { EntityWizardDialog } from "../components/EntityWizardDialog";
import type { OperationValues, WizardStep } from "../components/operationTypes";

function buildBusinessPartnerSteps(): WizardStep[] {
  return [
    {
      titleKey: "businessData.businessPartner.detail.businessPartner",
      fields: [
        {
          key: "name",
          labelKey: "businessData.businessPartner.detail.name",
          type: "text",
          required: true,
        },
        {
          key: "description",
          labelKey: "businessData.businessPartner.detail.description",
          type: "textarea",
        },
        {
          key: "isContractor",
          labelKey: "businessData.businessPartner.detail.contractor",
          type: "checkbox",
        },
        {
          key: "isCustomer",
          labelKey: "businessData.businessPartner.detail.customer",
          type: "checkbox",
        },
        {
          key: "isSupplier",
          labelKey: "businessData.businessPartner.detail.supplier",
          type: "checkbox",
        },
        {
          key: "isManufacturer",
          labelKey: "businessData.businessPartner.detail.manufacturer",
          type: "checkbox",
        },
        {
          key: "labelSpecification",
          labelKey: "businessData.businessPartner.detail.labelSpecification",
          type: "text",
        },
      ],
    },
    {
      titleKey: "businessData.businessPartner.operations.address",
      fields: [
        { key: "address", labelKey: "businessData.businessPartner.detail.address", type: "text" },
        { key: "zipCode", labelKey: "businessData.businessPartner.detail.zipCode", type: "text" },
        { key: "country", labelKey: "businessData.businessPartner.detail.country", type: "text" },
        { key: "stateName", labelKey: "businessData.businessPartner.detail.state", type: "text" },
        { key: "city", labelKey: "businessData.businessPartner.detail.city", type: "text" },
      ],
    },
    {
      titleKey: "businessData.businessPartner.operations.contact",
      fields: [
        {
          key: "contactTitle",
          labelKey: "businessData.businessPartner.detail.contactTitle",
          type: "text",
        },
        {
          key: "contactName",
          labelKey: "businessData.businessPartner.detail.contactName",
          type: "text",
        },
        { key: "email", labelKey: "businessData.businessPartner.detail.email", type: "text" },
        {
          key: "businessPhone",
          labelKey: "businessData.businessPartner.detail.businessPhone",
          type: "text",
        },
        {
          key: "businessFax",
          labelKey: "businessData.businessPartner.detail.businessFax",
          type: "text",
        },
        {
          key: "mobilePhone",
          labelKey: "businessData.businessPartner.detail.mobilePhone",
          type: "text",
        },
        {
          key: "taxNumber",
          labelKey: "businessData.businessPartner.detail.taxNumber",
          type: "text",
        },
        { key: "website", labelKey: "businessData.businessPartner.detail.website", type: "text" },
      ],
    },
  ];
}

function toUpsertInput(values: OperationValues): BusinessPartnerUpsertInput {
  const str = (v: unknown) => (v === undefined ? undefined : String(v));
  const roles = [
    values.isContractor === true ? "Contractor" : "",
    values.isCustomer === true ? "Customer" : "",
    values.isSupplier === true ? "Supplier" : "",
    values.isManufacturer === true ? "Manufacturer" : "",
  ]
    .filter(Boolean)
    .join(", ");
  return {
    name: String(values.name ?? ""),
    description: str(values.description),
    role: roles || undefined,
    isContractor: values.isContractor === true,
    isCustomer: values.isCustomer === true,
    isSupplier: values.isSupplier === true,
    isManufacturer: values.isManufacturer === true,
    labelSpecification: str(values.labelSpecification),
    address: str(values.address),
    zipCode: str(values.zipCode),
    country: str(values.country),
    stateName: str(values.stateName),
    city: str(values.city),
    contactTitle: str(values.contactTitle),
    contactName: str(values.contactName),
    email: str(values.email),
    businessPhone: str(values.businessPhone),
    businessFax: str(values.businessFax),
    mobilePhone: str(values.mobilePhone),
    taxNumber: str(values.taxNumber),
    website: str(values.website),
  };
}

export interface BusinessPartnerDialogs {
  dialogs: React.ReactNode;
  openCreate: () => void;
  openEdit: () => void;
  openClone: () => void;
  openTerminate: () => void;
  openUnterminate: () => void;
}

export function useBusinessPartnerDialogs(partner?: BusinessPartnerDetail): BusinessPartnerDialogs {
  const { t } = useAppTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);

  const createMutation = useCreateBusinessPartner();
  const updateMutation = useUpdateBusinessPartner();
  const stateMutation = useSetBusinessPartnerState();

  const steps = buildBusinessPartnerSteps();
  const entityLabel = t("businessData.businessPartner.entityName");

  const editInitial: OperationValues = partner
    ? {
        name: partner.name,
        description: partner.description,
        isContractor: partner.isContractor,
        isCustomer: partner.isCustomer,
        isSupplier: partner.isSupplier,
        isManufacturer: partner.isManufacturer,
        labelSpecification: partner.labelSpecification,
        address: partner.address,
        zipCode: partner.zipCode,
        country: partner.country,
        stateName: partner.stateName,
        city: partner.city,
        contactTitle: partner.contactTitle,
        contactName: partner.contactName,
        email: partner.email,
        businessPhone: partner.businessPhone,
        businessFax: partner.businessFax,
        mobilePhone: partner.mobilePhone,
        taxNumber: partner.taxNumber,
        website: partner.website,
      }
    : {};

  const cloneSteps: WizardStep[] = [
    {
      titleKey: "businessData.businessPartner.detail.businessPartner",
      fields: [
        {
          key: "name",
          labelKey: "businessData.businessPartner.detail.name",
          type: "text",
          required: true,
        },
        {
          key: "description",
          labelKey: "businessData.businessPartner.detail.description",
          type: "textarea",
        },
      ],
    },
  ];

  const dialogs = (
    <>
      <EntityWizardDialog
        open={createOpen}
        titleKey="businessData.businessPartner.operations.createTitle"
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
        titleKey="businessData.businessPartner.operations.editTitle"
        steps={steps}
        initialValues={editInitial}
        submitLabelKey="common.save"
        onClose={() => setEditOpen(false)}
        onSubmit={(values) => {
          if (partner) updateMutation.mutate({ name: partner.name, input: toUpsertInput(values) });
          setEditOpen(false);
        }}
      />
      <EntityWizardDialog
        open={cloneOpen}
        titleKey="businessData.businessPartner.operations.cloneTitle"
        steps={cloneSteps}
        initialValues={
          partner ? { name: `${partner.name} - Clone`, description: partner.description } : {}
        }
        submitLabelKey="common.create"
        onClose={() => setCloneOpen(false)}
        onSubmit={(values) => {
          if (partner) {
            createMutation.mutate({
              ...toUpsertInput({ ...editInitial, ...values }),
              name: String(values.name ?? `${partner.name} - Clone`),
            });
          }
          setCloneOpen(false);
        }}
      />
      <ConfirmOperationDialog
        open={terminateOpen}
        titleKey="businessData.businessPartner.operations.terminateTitle"
        messageKey="businessData.businessPartner.operations.terminateMessage"
        messageParams={{ name: partner?.name ?? entityLabel }}
        confirmLabelKey="actionBar.terminate"
        danger
        onClose={() => setTerminateOpen(false)}
        onConfirm={() => {
          if (partner) stateMutation.mutate({ name: partner.name, state: "Terminated" });
        }}
      />
      <ConfirmOperationDialog
        open={unterminateOpen}
        titleKey="businessData.businessPartner.operations.unterminateTitle"
        messageKey="businessData.businessPartner.operations.unterminateMessage"
        messageParams={{ name: partner?.name ?? entityLabel }}
        confirmLabelKey="actionBar.unterminate"
        onClose={() => setUnterminateOpen(false)}
        onConfirm={() => {
          if (partner) stateMutation.mutate({ name: partner.name, state: "Active" });
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
