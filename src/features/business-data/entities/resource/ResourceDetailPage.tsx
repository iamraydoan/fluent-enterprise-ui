import { useState } from "react";
import { useResourceDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailShellMoreAction, DetailTab } from "@/components/common";
import { Wrench20Regular } from "@/components/icons";
import { Body1Strong, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { RecordState } from "@/lib/recordState";
import { ConfirmOperationDialog } from "../qualification/dialogs/ConfirmOperationDialog";
import {
  AddResourceToContainerDialog,
  RemoveResourceFromContainerDialog,
  RetrieveResourceDialog,
  StoreContainersInResourceDialog,
  StoreMaterialsInResourceDialog,
  StoreResourceDialog,
  TransferResourceBetweenContainersDialog,
} from "./dialogs/ContainerDialogs";
import {
  ManageConsumableFeedsDialog,
  ManageResourceRecipesDialog,
  ManageResourceServicesDialog,
  ManageRunningModesDialog,
  ManageStructureDialog,
} from "./dialogs/ManageDialogs1";
import {
  ManageConsumablesDialog,
  ManageCostsDialog,
  ManageDispatchQueueDialog,
  ManageMeasurementCapabilitiesDialog,
  ManagePersonnelDialog,
} from "./dialogs/ManageDialogs2";
import {
  ManageRepairablePartsDialog,
  ManageResourceDurablesDialog,
  ManageResourceEmployeesDialog,
  ManageResourceInstrumentsDialog,
  ManageResourceInventoryDialog,
} from "./dialogs/ManageDialogs3";
import {
  ManageResourceLanesDialog,
  ManageResourceLocationsDialog,
  ManageResourceMaterialConsumablesDialog,
  ManageResourceMaterialDurablesDialog,
  ManageResourcePartsDialog,
} from "./dialogs/ManageDialogs4";
import {
  ManageResourceStorageBinsDialog,
  ManageResourceTraineesDialog,
  ManageRunAtRiskMaterialsDialog,
  ManageSchedulingBatchingDialog,
} from "./dialogs/ManageDialogs5";
import {
  CloneResourceDialog,
  ResourceOEEConfigurationDialog,
  SetResourceRecipeDialog,
  ViewResourceDashboardsDialog,
  ViewResourceDocumentsDialog,
  ViewResourceReportsDialog,
} from "./dialogs/MiscDialogs";
import { ResourceFormDialog } from "./dialogs/ResourceFormDialog";
import {
  BeginLineSetupDialog,
  BeginPreSetupDialog,
  BeginSetupDialog,
  CancelLineSetupDialog,
  CancelSetupDialog,
  CompleteLineSetupDialog,
  CompleteSetupDialog,
  PerformLineSetupDialog,
  PerformPreSetupDialog,
  PerformSetupDialog,
  ResetLineSetupDialog,
  ResetSetupDialog,
  ViewLineSetupDialog,
  ViewSetupDialog,
} from "./dialogs/SetupDialogs";
import {
  ChangeAutomationModeDialog,
  ChangeInstrumentModeDialog,
  ChangeProductDialog,
  ChangeResourceStateDialog,
  ChangeRunningModeDialog,
  ChangeSystemStateDialog,
  EvaluateDispatchableRuleDialog,
} from "./dialogs/StateChangeDialogs";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.resource.tabs.details" },
  { value: "resourceView", labelKey: "businessData.resource.tabs.resourceView" },
  { value: "schedule", labelKey: "businessData.resource.tabs.schedule" },
  { value: "storage", labelKey: "businessData.resource.tabs.storage" },
  { value: "maintenance", labelKey: "businessData.resource.tabs.maintenance" },
  { value: "contexts", labelKey: "businessData.resource.tabs.contexts" },
  { value: "compare", labelKey: "businessData.resource.tabs.compare" },
  { value: "references", labelKey: "businessData.resource.tabs.references" },
  { value: "history", labelKey: "businessData.resource.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.resource.sections.details",
  "businessData.resource.sections.structure",
  "businessData.resource.sections.runningModes",
  "businessData.resource.sections.parts",
  "businessData.resource.sections.recipes",
  "businessData.resource.sections.runAtRiskMaterials",
  "businessData.resource.sections.materials",
  "businessData.resource.sections.instruments",
  "businessData.resource.sections.measurementCapabilities",
  "businessData.resource.sections.consumableFeeds",
  "businessData.resource.sections.locations",
  "businessData.resource.sections.lanes",
  "businessData.resource.sections.durables",
  "businessData.resource.sections.inventory",
  "businessData.resource.sections.storageBins",
  "businessData.resource.sections.services",
  "businessData.resource.sections.personnel",
  "businessData.resource.sections.protocols",
  "businessData.resource.sections.resourceJobs",
  "businessData.resource.sections.notifications",
  "businessData.resource.sections.schedulingBatching",
  "businessData.resource.sections.collectedData",
  "businessData.resource.sections.workgroups",
  "businessData.resource.sections.storedMaterials",
  "businessData.resource.sections.attributes",
  "businessData.resource.sections.attachments",
];

interface ResourceDetailPageProps {
  name: string;
}

const DLG = {
  edit: "edit",
  clone: "clone",
  terminate: "terminate",
  unterminate: "unterminate",
  changeResourceState: "changeResourceState",
  changeSystemState: "changeSystemState",
  changeAutomationMode: "changeAutomationMode",
  changeInstrumentMode: "changeInstrumentMode",
  changeRunningMode: "changeRunningMode",
  changeProduct: "changeProduct",
  evaluateDispatchableRule: "evaluateDispatchableRule",
  beginSetup: "beginSetup",
  performSetup: "performSetup",
  completeSetup: "completeSetup",
  cancelSetup: "cancelSetup",
  resetSetup: "resetSetup",
  viewSetup: "viewSetup",
  beginLineSetup: "beginLineSetup",
  performLineSetup: "performLineSetup",
  completeLineSetup: "completeLineSetup",
  cancelLineSetup: "cancelLineSetup",
  resetLineSetup: "resetLineSetup",
  viewLineSetup: "viewLineSetup",
  beginPreSetup: "beginPreSetup",
  performPreSetup: "performPreSetup",
  addResourceToContainer: "addResourceToContainer",
  removeResourceFromContainer: "removeResourceFromContainer",
  transferResourceBetweenContainers: "transferResourceBetweenContainers",
  storeContainersInResource: "storeContainersInResource",
  storeMaterialsInResource: "storeMaterialsInResource",
  storeResource: "storeResource",
  retrieveResource: "retrieveResource",
  manageStructure: "manageStructure",
  manageRunningModes: "manageRunningModes",
  manageResourceParts: "manageResourceParts",
  manageRepairableParts: "manageRepairableParts",
  manageResourceRecipes: "manageResourceRecipes",
  manageRunAtRiskMaterials: "manageRunAtRiskMaterials",
  manageResourceInstruments: "manageResourceInstruments",
  manageMeasurementCapabilities: "manageMeasurementCapabilities",
  manageConsumableFeeds: "manageConsumableFeeds",
  manageConsumables: "manageConsumables",
  manageResourceLocations: "manageResourceLocations",
  manageResourceLanes: "manageResourceLanes",
  manageResourceDurables: "manageResourceDurables",
  manageResourceInventory: "manageResourceInventory",
  manageResourceStorageBins: "manageResourceStorageBins",
  manageResourceServices: "manageResourceServices",
  managePersonnel: "managePersonnel",
  manageResourceEmployees: "manageResourceEmployees",
  manageResourceTrainees: "manageResourceTrainees",
  manageCosts: "manageCosts",
  manageDispatchQueue: "manageDispatchQueue",
  manageResourceMaterialConsumables: "manageResourceMaterialConsumables",
  manageResourceMaterialDurables: "manageResourceMaterialDurables",
  manageSchedulingBatching: "manageSchedulingBatching",
  setResourceRecipe: "setResourceRecipe",
  resourceOEEConfiguration: "resourceOEEConfiguration",
  viewResourceDashboards: "viewResourceDashboards",
  viewResourceDocuments: "viewResourceDocuments",
  viewResourceReports: "viewResourceReports",
} as const;

export function ResourceDetailPage({ name }: ResourceDetailPageProps) {
  const { t } = useAppTranslation();
  const { data, isLoading } = useResourceDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.resource.sections.details");
  const handleLeft = (value: TranslationKey) => setLeft(value);

  const [dialog, setDialog] = useState<string | null>(null);
  const close = () => setDialog(null);
  const open = (key: string) => () => setDialog(key);

  const isTerminated = data?.state === RecordState.Terminated;
  const mk = "businessData.resource.more";

  const moreActions: DetailShellMoreAction[] = [
    { label: t(`${mk}.clone`), onClick: open(DLG.clone) },
    ...(isTerminated
      ? [{ label: t(`${mk}.unterminate`), onClick: open(DLG.unterminate) }]
      : [{ label: t(`${mk}.terminate`), onClick: open(DLG.terminate) }]),
    { label: t(`${mk}.changeResourceState`), onClick: open(DLG.changeResourceState) },
    { label: t(`${mk}.changeSystemState`), onClick: open(DLG.changeSystemState) },
    { label: t(`${mk}.changeAutomationMode`), onClick: open(DLG.changeAutomationMode) },
    { label: t(`${mk}.changeInstrumentMode`), onClick: open(DLG.changeInstrumentMode) },
    { label: t(`${mk}.changeRunningMode`), onClick: open(DLG.changeRunningMode) },
    { label: t(`${mk}.changeProduct`), onClick: open(DLG.changeProduct) },
    { label: t(`${mk}.evaluateDispatchableRule`), onClick: open(DLG.evaluateDispatchableRule) },
    { label: t(`${mk}.beginSetup`), onClick: open(DLG.beginSetup) },
    { label: t(`${mk}.performSetup`), onClick: open(DLG.performSetup) },
    { label: t(`${mk}.completeSetup`), onClick: open(DLG.completeSetup) },
    { label: t(`${mk}.cancelSetup`), onClick: open(DLG.cancelSetup) },
    { label: t(`${mk}.resetSetup`), onClick: open(DLG.resetSetup) },
    { label: t(`${mk}.viewSetup`), onClick: open(DLG.viewSetup) },
    { label: t(`${mk}.beginLineSetup`), onClick: open(DLG.beginLineSetup) },
    { label: t(`${mk}.performLineSetup`), onClick: open(DLG.performLineSetup) },
    { label: t(`${mk}.completeLineSetup`), onClick: open(DLG.completeLineSetup) },
    { label: t(`${mk}.cancelLineSetup`), onClick: open(DLG.cancelLineSetup) },
    { label: t(`${mk}.resetLineSetup`), onClick: open(DLG.resetLineSetup) },
    { label: t(`${mk}.viewLineSetup`), onClick: open(DLG.viewLineSetup) },
    { label: t(`${mk}.beginPreSetup`), onClick: open(DLG.beginPreSetup) },
    { label: t(`${mk}.performPreSetup`), onClick: open(DLG.performPreSetup) },
    { label: t(`${mk}.addResourceToContainer`), onClick: open(DLG.addResourceToContainer) },
    { label: t(`${mk}.removeResourceFromContainer`), onClick: open(DLG.removeResourceFromContainer) },
    { label: t(`${mk}.transferResourceBetweenContainers`), onClick: open(DLG.transferResourceBetweenContainers) },
    { label: t(`${mk}.storeContainersInResource`), onClick: open(DLG.storeContainersInResource) },
    { label: t(`${mk}.storeMaterialsInResource`), onClick: open(DLG.storeMaterialsInResource) },
    { label: t(`${mk}.storeResource`), onClick: open(DLG.storeResource) },
    { label: t(`${mk}.retrieveResource`), onClick: open(DLG.retrieveResource) },
    { label: t(`${mk}.manageStructure`), onClick: open(DLG.manageStructure) },
    { label: t(`${mk}.manageRunningModes`), onClick: open(DLG.manageRunningModes) },
    { label: t(`${mk}.manageResourceParts`), onClick: open(DLG.manageResourceParts) },
    { label: t(`${mk}.manageRepairableParts`), onClick: open(DLG.manageRepairableParts) },
    { label: t(`${mk}.manageResourceRecipes`), onClick: open(DLG.manageResourceRecipes) },
    { label: t(`${mk}.manageRunAtRiskMaterials`), onClick: open(DLG.manageRunAtRiskMaterials) },
    { label: t(`${mk}.manageResourceInstruments`), onClick: open(DLG.manageResourceInstruments) },
    { label: t(`${mk}.manageMeasurementCapabilities`), onClick: open(DLG.manageMeasurementCapabilities) },
    { label: t(`${mk}.manageConsumableFeeds`), onClick: open(DLG.manageConsumableFeeds) },
    { label: t(`${mk}.manageConsumables`), onClick: open(DLG.manageConsumables) },
    { label: t(`${mk}.manageResourceLocations`), onClick: open(DLG.manageResourceLocations) },
    { label: t(`${mk}.manageResourceLanes`), onClick: open(DLG.manageResourceLanes) },
    { label: t(`${mk}.manageResourceDurables`), onClick: open(DLG.manageResourceDurables) },
    { label: t(`${mk}.manageResourceInventory`), onClick: open(DLG.manageResourceInventory) },
    { label: t(`${mk}.manageResourceStorageBins`), onClick: open(DLG.manageResourceStorageBins) },
    { label: t(`${mk}.manageResourceServices`), onClick: open(DLG.manageResourceServices) },
    { label: t(`${mk}.managePersonnel`), onClick: open(DLG.managePersonnel) },
    { label: t(`${mk}.manageResourceEmployees`), onClick: open(DLG.manageResourceEmployees) },
    { label: t(`${mk}.manageResourceTrainees`), onClick: open(DLG.manageResourceTrainees) },
    { label: t(`${mk}.manageCosts`), onClick: open(DLG.manageCosts) },
    { label: t(`${mk}.manageDispatchQueue`), onClick: open(DLG.manageDispatchQueue) },
    { label: t(`${mk}.manageResourceMaterialConsumables`), onClick: open(DLG.manageResourceMaterialConsumables) },
    { label: t(`${mk}.manageResourceMaterialDurables`), onClick: open(DLG.manageResourceMaterialDurables) },
    { label: t(`${mk}.manageSchedulingBatching`), onClick: open(DLG.manageSchedulingBatching) },
    { label: t(`${mk}.setResourceRecipe`), onClick: open(DLG.setResourceRecipe) },
    { label: t(`${mk}.resourceOEEConfiguration`), onClick: open(DLG.resourceOEEConfiguration) },
    { label: t(`${mk}.viewResourceDashboards`), onClick: open(DLG.viewResourceDashboards) },
    { label: t(`${mk}.viewResourceDocuments`), onClick: open(DLG.viewResourceDocuments) },
    { label: t(`${mk}.viewResourceReports`), onClick: open(DLG.viewResourceReports) },
  ];

  if (isLoading || data === undefined) {
    return null;
  }

  const stateLabel =
    data.state === RecordState.Active ? t("common.active") : t("common.terminated");

  let content;
  if (top !== "details" || left !== "businessData.resource.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.resource.sections.empty")}</Body1Strong>
          <Caption1>{t("businessData.resource.sections.emptyBody")}</Caption1>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <CardGrid>
        <Card title={t("businessData.resource.cards.resource")}>
          <KV
            rows={[
              [t("businessData.resource.details.name"), data.name],
              [t("businessData.resource.details.description"), data.description],
              [t("businessData.resource.details.type"), data.type],
              [t("businessData.resource.details.processingType"), data.processingType],
              [t("businessData.resource.details.state"), stateLabel],
              [t("businessData.resource.details.dataGroup"), data.dataGroup],
            ]}
          />
        </Card>
        <Card title={t("businessData.resource.cards.information")}>
          <KV
            rows={[
              [t("businessData.resource.details.area"), data.area],
              [t("businessData.resource.details.systemState"), data.systemState],
              [t("businessData.resource.details.automationMode"), data.automationMode],
              [t("businessData.resource.details.stateModel"), data.stateModel],
              [t("businessData.resource.details.resourceState"), data.resourceState],
              [t("businessData.resource.details.runningMode"), data.runningMode],
            ]}
          />
        </Card>
      </CardGrid>
    );
  }

  const dlg = (key: string) => dialog === key;

  return (
    <>
      <DetailShell
        title={data.name}
        icon={<Wrench20Regular />}
        topTabs={TOP_TABS}
        top={top}
        onTop={setTop}
        leftItems={LEFT_SECTIONS}
        left={left}
        onLeft={handleLeft}
        onEdit={open(DLG.edit)}
        onAskAi={() => {}}
        moreActions={moreActions}
      >
        {content}
      </DetailShell>

      <ResourceFormDialog
        open={dlg(DLG.edit)}
        onClose={close}
        title={t("businessData.resource.dialogs.form.editTitle")}
        initial={data}
        nameReadOnly
        submitLabel={t("common.save")}
      />
      <CloneResourceDialog open={dlg(DLG.clone)} onClose={close} resourceName={data.name} />
      <ConfirmOperationDialog
        open={dlg(DLG.terminate)}
        onClose={close}
        title={t("businessData.resource.dialogs.terminate.title")}
        message={t("businessData.resource.dialogs.terminate.message", { name: data.name })}
        confirmLabel={t("businessData.resource.dialogs.terminate.confirm")}
      />
      <ConfirmOperationDialog
        open={dlg(DLG.unterminate)}
        onClose={close}
        title={t("businessData.resource.dialogs.unterminate.title")}
        message={t("businessData.resource.dialogs.unterminate.message", { name: data.name })}
        confirmLabel={t("businessData.resource.dialogs.unterminate.confirm")}
      />

      <ChangeResourceStateDialog open={dlg(DLG.changeResourceState)} onClose={close} resourceName={data.name} />
      <ChangeSystemStateDialog open={dlg(DLG.changeSystemState)} onClose={close} resourceName={data.name} />
      <ChangeAutomationModeDialog open={dlg(DLG.changeAutomationMode)} onClose={close} resourceName={data.name} />
      <ChangeInstrumentModeDialog open={dlg(DLG.changeInstrumentMode)} onClose={close} resourceName={data.name} />
      <ChangeRunningModeDialog open={dlg(DLG.changeRunningMode)} onClose={close} resourceName={data.name} />
      <ChangeProductDialog open={dlg(DLG.changeProduct)} onClose={close} resourceName={data.name} />
      <EvaluateDispatchableRuleDialog open={dlg(DLG.evaluateDispatchableRule)} onClose={close} resourceName={data.name} />

      <BeginSetupDialog open={dlg(DLG.beginSetup)} onClose={close} resourceName={data.name} />
      <PerformSetupDialog open={dlg(DLG.performSetup)} onClose={close} resourceName={data.name} />
      <CompleteSetupDialog open={dlg(DLG.completeSetup)} onClose={close} resourceName={data.name} />
      <CancelSetupDialog open={dlg(DLG.cancelSetup)} onClose={close} resourceName={data.name} />
      <ResetSetupDialog open={dlg(DLG.resetSetup)} onClose={close} resourceName={data.name} />
      <ViewSetupDialog open={dlg(DLG.viewSetup)} onClose={close} resourceName={data.name} />
      <BeginLineSetupDialog open={dlg(DLG.beginLineSetup)} onClose={close} resourceName={data.name} />
      <PerformLineSetupDialog open={dlg(DLG.performLineSetup)} onClose={close} resourceName={data.name} />
      <CompleteLineSetupDialog open={dlg(DLG.completeLineSetup)} onClose={close} resourceName={data.name} />
      <CancelLineSetupDialog open={dlg(DLG.cancelLineSetup)} onClose={close} resourceName={data.name} />
      <ResetLineSetupDialog open={dlg(DLG.resetLineSetup)} onClose={close} resourceName={data.name} />
      <ViewLineSetupDialog open={dlg(DLG.viewLineSetup)} onClose={close} resourceName={data.name} />
      <BeginPreSetupDialog open={dlg(DLG.beginPreSetup)} onClose={close} resourceName={data.name} />
      <PerformPreSetupDialog open={dlg(DLG.performPreSetup)} onClose={close} resourceName={data.name} />

      <AddResourceToContainerDialog open={dlg(DLG.addResourceToContainer)} onClose={close} resourceName={data.name} />
      <RemoveResourceFromContainerDialog open={dlg(DLG.removeResourceFromContainer)} onClose={close} resourceName={data.name} />
      <TransferResourceBetweenContainersDialog open={dlg(DLG.transferResourceBetweenContainers)} onClose={close} resourceName={data.name} />
      <StoreContainersInResourceDialog open={dlg(DLG.storeContainersInResource)} onClose={close} resourceName={data.name} />
      <StoreMaterialsInResourceDialog open={dlg(DLG.storeMaterialsInResource)} onClose={close} resourceName={data.name} />
      <StoreResourceDialog open={dlg(DLG.storeResource)} onClose={close} resourceName={data.name} />
      <RetrieveResourceDialog open={dlg(DLG.retrieveResource)} onClose={close} resourceName={data.name} />

      <ManageStructureDialog open={dlg(DLG.manageStructure)} onClose={close} resourceName={data.name} />
      <ManageRunningModesDialog open={dlg(DLG.manageRunningModes)} onClose={close} resourceName={data.name} />
      <ManageResourcePartsDialog open={dlg(DLG.manageResourceParts)} onClose={close} resourceName={data.name} />
      <ManageRepairablePartsDialog open={dlg(DLG.manageRepairableParts)} onClose={close} resourceName={data.name} />
      <ManageResourceRecipesDialog open={dlg(DLG.manageResourceRecipes)} onClose={close} resourceName={data.name} />
      <ManageRunAtRiskMaterialsDialog open={dlg(DLG.manageRunAtRiskMaterials)} onClose={close} resourceName={data.name} />
      <ManageResourceInstrumentsDialog open={dlg(DLG.manageResourceInstruments)} onClose={close} resourceName={data.name} />
      <ManageMeasurementCapabilitiesDialog open={dlg(DLG.manageMeasurementCapabilities)} onClose={close} resourceName={data.name} />
      <ManageConsumableFeedsDialog open={dlg(DLG.manageConsumableFeeds)} onClose={close} resourceName={data.name} />
      <ManageConsumablesDialog open={dlg(DLG.manageConsumables)} onClose={close} resourceName={data.name} />
      <ManageResourceLocationsDialog open={dlg(DLG.manageResourceLocations)} onClose={close} resourceName={data.name} />
      <ManageResourceLanesDialog open={dlg(DLG.manageResourceLanes)} onClose={close} resourceName={data.name} />
      <ManageResourceDurablesDialog open={dlg(DLG.manageResourceDurables)} onClose={close} resourceName={data.name} />
      <ManageResourceInventoryDialog open={dlg(DLG.manageResourceInventory)} onClose={close} resourceName={data.name} />
      <ManageResourceStorageBinsDialog open={dlg(DLG.manageResourceStorageBins)} onClose={close} resourceName={data.name} />
      <ManageResourceServicesDialog open={dlg(DLG.manageResourceServices)} onClose={close} resourceName={data.name} />
      <ManagePersonnelDialog open={dlg(DLG.managePersonnel)} onClose={close} resourceName={data.name} />
      <ManageResourceEmployeesDialog open={dlg(DLG.manageResourceEmployees)} onClose={close} resourceName={data.name} />
      <ManageResourceTraineesDialog open={dlg(DLG.manageResourceTrainees)} onClose={close} resourceName={data.name} />
      <ManageCostsDialog open={dlg(DLG.manageCosts)} onClose={close} resourceName={data.name} />
      <ManageDispatchQueueDialog open={dlg(DLG.manageDispatchQueue)} onClose={close} resourceName={data.name} />
      <ManageResourceMaterialConsumablesDialog open={dlg(DLG.manageResourceMaterialConsumables)} onClose={close} resourceName={data.name} />
      <ManageResourceMaterialDurablesDialog open={dlg(DLG.manageResourceMaterialDurables)} onClose={close} resourceName={data.name} />
      <ManageSchedulingBatchingDialog open={dlg(DLG.manageSchedulingBatching)} onClose={close} resourceName={data.name} />

      <SetResourceRecipeDialog open={dlg(DLG.setResourceRecipe)} onClose={close} resourceName={data.name} />
      <ResourceOEEConfigurationDialog open={dlg(DLG.resourceOEEConfiguration)} onClose={close} resourceName={data.name} />
      <ViewResourceDashboardsDialog open={dlg(DLG.viewResourceDashboards)} onClose={close} resourceName={data.name} />
      <ViewResourceDocumentsDialog open={dlg(DLG.viewResourceDocuments)} onClose={close} resourceName={data.name} />
      <ViewResourceReportsDialog open={dlg(DLG.viewResourceReports)} onClose={close} resourceName={data.name} />
    </>
  );
}
