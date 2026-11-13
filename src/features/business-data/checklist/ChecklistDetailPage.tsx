import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useChecklistDetail } from "@/api";
import type { ChecklistInstance } from "@/api";
import {
  DetailCard,
  DetailCardTitle,
  DetailEmpty,
  DetailField,
  DetailShell,
  DetailTabs,
  EntityTile,
  Grid,
  ListPage,
  ListRow,
  VStack,
  cloneAction,
  editAction,
  refreshAction,
  terminateAction,
  unterminateAction,
} from "@/components/common";
import type { HeaderAction } from "@/components/common";
import { Box24Regular, Eye20Regular, MoreVertical24Regular } from "@/components/icons";
import { Button } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { ChecklistItemSubTabs } from "./ChecklistItemSubTabs";
import { useChecklistDialogs } from "./useChecklistDialogs";

const TABS = ["details", "checklistItems", "compare", "references", "history"] as const;
const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.checklist.detail.sections.details",
  "businessData.checklist.detail.sections.instances",
  "businessData.checklist.detail.sections.attachments",
];

export function ChecklistDetailPage() {
  const { t } = useAppTranslation();
  const [tab, setTab] = useState<string>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const [itemIdx, setItemIdx] = useState(0);
  const [subTab, setSubTab] = useState<string>("generalData");
  const { name } = useParams({ strict: false }) as { name: string };
  const displayName = decodeURIComponent(name);
  const { data: cl, isLoading } = useChecklistDetail(displayName);
  const {
    dialogs,
    openEdit,
    openClone,
    openTerminate,
    openUnterminate,
    openPreview,
    openInstance,
    openForMaterial,
    openPerformImmediateForMaterial,
    openPerformInstance,
    openPauseInstance,
    openResumeInstance,
    openTerminateInstance,
    openDeviation,
  } = useChecklistDialogs(cl);

  const displayValue = (value: string) =>
    value === "" ? t("businessData.checklist.detail.emptyValue") : value;
  const displayYesNo = (value: boolean) =>
    value ? t("businessData.checklist.detail.yes") : t("businessData.checklist.detail.no");

  if (isLoading || !cl) {
    return (
      <ListPage
        header={{
          icon: <Box24Regular />,
          title: displayName,
          actions: [refreshAction, editAction],
        }}
      >
        <DetailEmpty>{t("businessData.checklist.detail.loading")}</DetailEmpty>
      </ListPage>
    );
  }

  const terminated = cl.state === "Terminated";
  const detailActions: HeaderAction[] = [
    refreshAction,
    { ...editAction, onClick: openEdit },
    { ...cloneAction, onClick: openClone },
    terminated
      ? { ...unterminateAction, onClick: openUnterminate }
      : { ...terminateAction, onClick: openTerminate },
    {
      id: "preview",
      icon: <Eye20Regular />,
      labelKey: "businessData.checklist.operations.preview",
      onClick: openPreview,
    },
    {
      id: "more",
      icon: <MoreVertical24Regular />,
      labelKey: "actionBar.more",
      menu: [
        { label: t("businessData.checklist.operations.openInstance"), onClick: openInstance },
        { label: t("businessData.checklist.operations.openForMaterial"), onClick: openForMaterial },
        {
          label: t("businessData.checklist.operations.performImmediateForMaterial"),
          onClick: openPerformImmediateForMaterial,
        },
      ],
    },
  ];

  const showInstances = left === "businessData.checklist.detail.sections.instances";
  const item = cl.items[Math.min(itemIdx, cl.items.length - 1)];

  return (
    <ListPage
      header={{ icon: <Box24Regular />, title: `${cl.name} (${cl.state})`, actions: detailActions }}
    >
      <DetailTabs
        tabs={TABS.map((value) => ({
          value,
          label: t(`businessData.checklist.detail.tabs.${value}`),
        }))}
        active={tab}
        onChange={(value) => setTab(value as typeof tab)}
      >
        {tab === "details" && (
          <DetailShell
            title={cl.name}
            icon={<Box24Regular />}
            topTabs={[]}
            top="details"
            onTop={() => undefined}
            leftItems={LEFT_SECTIONS}
            left={left}
            onLeft={setLeft}
            onEdit={() => undefined}
            onAskAi={() => undefined}
            showState={false}
          >
            {showInstances ? (
              <DetailCard>
                <DetailCardTitle>
                  {t("businessData.checklist.detail.instancesTitle", {
                    count: cl.instances.length,
                  })}
                </DetailCardTitle>
                <VStack gap="xs">
                  {cl.instances.length === 0 && (
                    <DetailEmpty>{t("businessData.checklist.detail.noInstances")}</DetailEmpty>
                  )}
                  {cl.instances.map((i) => (
                    <InstanceRow
                      key={i.name}
                      instance={i}
                      onPerform={() => openPerformInstance(i)}
                      onPause={() => openPauseInstance(i)}
                      onResume={() => openResumeInstance(i)}
                      onTerminate={() => openTerminateInstance(i)}
                      onDeviation={() => openDeviation(i)}
                    />
                  ))}
                </VStack>
              </DetailCard>
            ) : (
              <Grid columns="auto-fit" gap="md">
                <DetailCard>
                  <DetailCardTitle>{t("businessData.checklist.detail.checklist")}</DetailCardTitle>
                  <DetailField
                    label={t("businessData.checklist.detail.name")}
                    value={displayValue(cl.name)}
                    labelWidth={200}
                  />
                  <DetailField
                    label={t("businessData.checklist.detail.description")}
                    value={displayValue(cl.description)}
                    labelWidth={200}
                  />
                  <DetailField
                    label={t("businessData.checklist.detail.type")}
                    value={displayValue(cl.type)}
                    labelWidth={200}
                  />
                  <DetailField
                    label={t("businessData.checklist.detail.universalState")}
                    value={displayValue(cl.universalState)}
                    labelWidth={200}
                  />
                  <DetailField
                    label={t("businessData.checklist.detail.dataGroup")}
                    value={displayValue(cl.dataGroup)}
                    labelWidth={200}
                  />
                </DetailCard>
                <DetailCard>
                  <DetailCardTitle>
                    {t("businessData.checklist.detail.information")}
                  </DetailCardTitle>
                  <DetailField
                    label={t("businessData.checklist.detail.scope")}
                    value={displayValue(cl.scope)}
                    labelWidth={200}
                  />
                  <DetailField
                    label={t("businessData.checklist.detail.executionMode")}
                    value={displayValue(cl.executionMode)}
                    labelWidth={200}
                  />
                  <DetailField
                    label={t("businessData.checklist.detail.bom")}
                    value={displayValue(cl.bom)}
                    labelWidth={200}
                  />
                  <DetailField
                    label={t("businessData.checklist.detail.product")}
                    value={displayValue(cl.product)}
                    labelWidth={200}
                  />
                  <DetailField
                    label={t("businessData.checklist.detail.materialDeviationProtocol")}
                    value={displayValue(cl.materialDeviationProtocol)}
                    labelWidth={200}
                  />
                  <DetailField
                    label={t("businessData.checklist.detail.defineStandardTimes")}
                    value={displayYesNo(cl.defineStandardTimes)}
                    labelWidth={200}
                  />
                  <DetailField
                    label={t("businessData.checklist.detail.trackExecutionTimes")}
                    value={displayYesNo(cl.trackExecutionTimes)}
                    labelWidth={200}
                  />
                  <DetailField
                    label={t("businessData.checklist.detail.standardDuration")}
                    value={displayValue(cl.standardDuration)}
                    labelWidth={200}
                  />
                </DetailCard>
              </Grid>
            )}
          </DetailShell>
        )}
        {tab === "checklistItems" && (
          <DetailCard>
            <DetailCardTitle>
              {t("businessData.checklist.detail.itemsTitle", { count: cl.items.length })}
            </DetailCardTitle>
            <Grid columns="aside-main" asideWidth={320} gap="md" align="start">
              <VStack gap="xs">
                {cl.items.map((i, idx) => (
                  <EntityTile
                    key={i.name}
                    title={i.name}
                    description={i.description}
                    selected={idx === Math.min(itemIdx, cl.items.length - 1)}
                    onClick={() => setItemIdx(idx)}
                  />
                ))}
              </VStack>
              {item && (
                <div>
                  <ChecklistItemSubTabs
                    selected={subTab}
                    itemCount={cl.items.length}
                    onSelect={setSubTab}
                  />
                  {subTab === "generalData" && (
                    <VStack gap="md">
                      <DetailField
                        label={t("businessData.checklist.detail.itemName")}
                        value={displayValue(item.name)}
                        labelWidth={200}
                      />
                      <DetailField
                        label={t("businessData.checklist.detail.activityType")}
                        value={displayValue(item.activityType)}
                        labelWidth={200}
                      />
                      <DetailField
                        label={t("businessData.checklist.detail.trackingType")}
                        value={displayValue(item.trackingType)}
                        labelWidth={200}
                      />
                      <DetailField
                        label={t("businessData.checklist.detail.standardDuration")}
                        value={displayValue(item.standardDuration)}
                        labelWidth={200}
                      />
                      <DetailField
                        label={t("businessData.checklist.detail.optional")}
                        value={displayYesNo(item.optional)}
                        labelWidth={200}
                      />
                      <DetailField
                        label={t("businessData.checklist.detail.floating")}
                        value={displayYesNo(item.floating)}
                        labelWidth={200}
                      />
                    </VStack>
                  )}
                  {subTab !== "generalData" && (
                    <DetailEmpty>{t("businessData.checklist.detail.historyEmpty")}</DetailEmpty>
                  )}
                </div>
              )}
            </Grid>
          </DetailCard>
        )}
        {!["details", "checklistItems"].includes(tab) && (
          <DetailEmpty>{t("businessData.checklist.detail.historyEmpty")}</DetailEmpty>
        )}
      </DetailTabs>
      {dialogs}
    </ListPage>
  );
}

function InstanceRow({
  instance,
  onPerform,
  onPause,
  onResume,
  onTerminate,
  onDeviation,
}: {
  instance: ChecklistInstance;
  onPerform: () => void;
  onPause: () => void;
  onResume: () => void;
  onTerminate: () => void;
  onDeviation: () => void;
}) {
  const { t } = useAppTranslation();
  return (
    <ListRow
      title={instance.name}
      subtitle={
        <>
          {instance.state}
          {instance.executingState ? ` · ${instance.executingState}` : ""}
          {instance.material ? ` · ${instance.material}` : ""}
        </>
      }
      actions={
        <>
          <Button variant="secondary" size="sm" onClick={onPerform}>
            {t("businessData.checklist.operations.perform")}
          </Button>
          <Button variant="secondary" size="sm" onClick={onPause}>
            {t("businessData.checklist.operations.pause")}
          </Button>
          <Button variant="secondary" size="sm" onClick={onResume}>
            {t("businessData.checklist.operations.resume")}
          </Button>
          <Button variant="secondary" size="sm" onClick={onTerminate}>
            {t("businessData.checklist.operations.terminateInstance")}
          </Button>
          <Button variant="secondary" size="sm" onClick={onDeviation}>
            {t("businessData.checklist.operations.openDeviation")}
          </Button>
        </>
      }
    />
  );
}
