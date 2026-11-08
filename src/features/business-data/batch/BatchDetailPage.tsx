import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useBatchDetail } from "@/api";
import type { HeaderAction } from "@/components/common";
import {
  DetailCard,
  DetailField,
  DetailShell,
  DetailTabs,
  editAction,
  Empty,
  Grid,
  ListPage,
  refreshAction,
} from "@/components/common";
import {
  ArrowDownload24Regular,
  ArrowExportUp24Regular,
  ArrowUp20Regular,
  Box24Regular,
  MoreVertical24Regular,
} from "@/components/icons";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useBatchDialogs } from "./useBatchDialogs";

const TABS = ["details", "references", "history"] as const;
type BatchTab = (typeof TABS)[number];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.batch.detail.sections.details",
  "businessData.batch.detail.sections.materials",
  "businessData.batch.detail.sections.containers",
  "businessData.batch.detail.sections.attachments",
];

export function BatchDetailPage() {
  const { t } = useAppTranslation();
  const [tab, setTab] = useState<BatchTab>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const { name } = useParams({ strict: false }) as { name: string };
  const displayName = decodeURIComponent(name);
  const { data: batch, isLoading } = useBatchDetail(displayName);
  const {
    dialogs,
    openEdit,
    openManageMaterials,
    openManageContainers,
    openChangeResource,
    openTransition,
  } = useBatchDialogs(batch);

  const displayValue = (value: string) =>
    value === "" ? t("businessData.batch.detail.emptyValue") : value;

  if (isLoading || !batch) {
    return (
      <ListPage
        header={{
          icon: <Box24Regular />,
          title: displayName,
          actions: [refreshAction, editAction],
        }}
      >
        <Empty>{t("businessData.batch.detail.loading")}</Empty>
      </ListPage>
    );
  }

  const actions: HeaderAction[] = [
    refreshAction,
    { ...editAction, onClick: openEdit },
    {
      id: "release",
      icon: <ArrowExportUp24Regular />,
      labelKey: "businessData.batch.operations.release",
      onClick: () => openTransition("release"),
    },
    {
      id: "trackIn",
      icon: <ArrowDownload24Regular />,
      labelKey: "businessData.batch.operations.trackIn",
      onClick: () => openTransition("trackIn"),
    },
    {
      id: "trackOut",
      icon: <ArrowUp20Regular />,
      labelKey: "businessData.batch.operations.trackOut",
      onClick: () => openTransition("trackOut"),
    },
    {
      id: "more",
      icon: <MoreVertical24Regular />,
      labelKey: "actionBar.more",
      menu: [
        {
          label: t("businessData.batch.operations.unrelease"),
          onClick: () => openTransition("unrelease"),
        },
        { label: t("businessData.batch.operations.abort"), onClick: () => openTransition("abort") },
        {
          label: t("businessData.batch.operations.cancel"),
          onClick: () => openTransition("cancel"),
        },
        { label: t("businessData.batch.operations.manageMaterials"), onClick: openManageMaterials },
        {
          label: t("businessData.batch.operations.manageContainers"),
          onClick: openManageContainers,
        },
        { label: t("businessData.batch.operations.changeResource"), onClick: openChangeResource },
      ],
    },
  ];

  return (
    <ListPage
      header={{
        icon: <Box24Regular />,
        title: `${batch.name} (${batch.state})`,
        actions,
      }}
    >
      {dialogs}
      <DetailTabs
        tabs={TABS.map((value) => ({
          value,
          label: t(`businessData.batch.detail.tabs.${value}`),
        }))}
        active={tab}
        onChange={(value) => setTab(value as typeof tab)}
      >
        {tab === "details" && (
          <DetailShell
            title={batch.name}
            icon={<Box24Regular />}
            topTabs={[]}
            top=""
            onTop={() => undefined}
            leftItems={LEFT_SECTIONS}
            left={left}
            onLeft={setLeft}
            onEdit={() => undefined}
            onAskAi={() => undefined}
            showState={false}
          >
            <Grid columns="auto-fit" gap="md">
              <DetailCard title={t("businessData.batch.detail.batch")}>
                <DetailField
                  label={t("businessData.batch.detail.name")}
                  value={displayValue(batch.name)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.description")}
                  value={displayValue(batch.description)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.type")}
                  value={displayValue(batch.type)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.universalState")}
                  value={displayValue(batch.universalState)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.systemState")}
                  value={displayValue(batch.systemState)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.dataGroup")}
                  value={displayValue(batch.dataGroup)}
                  labelWidth={140}
                />
              </DetailCard>
              <DetailCard title={t("businessData.batch.detail.information")}>
                <DetailField
                  label={t("businessData.batch.detail.resource")}
                  value={displayValue(batch.resource)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.loadState")}
                  value={displayValue(batch.loadState)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.step")}
                  value={displayValue(batch.step)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.resourceJob")}
                  value={displayValue(batch.resourceJob)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.priority")}
                  value={String(batch.priority)}
                  labelWidth={140}
                />
              </DetailCard>
              <DetailCard title={t("businessData.batch.detail.resourceInformation")}>
                <DetailField
                  label={t("businessData.batch.detail.resourceType")}
                  value={displayValue(batch.resourceType)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.facility")}
                  value={displayValue(batch.facility)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.loadStartMode")}
                  value={displayValue(batch.loadStartMode)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.loadMode")}
                  value={displayValue(batch.loadMode)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.materialSplitMode")}
                  value={displayValue(batch.materialSplitMode)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.allowProductMix")}
                  value={
                    batch.allowProductMix
                      ? t("businessData.batch.detail.yes")
                      : t("businessData.batch.detail.no")
                  }
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.minimumBatchSize")}
                  value={displayValue(batch.minimumBatchSize)}
                  labelWidth={140}
                />
              </DetailCard>
              <DetailCard title={t("businessData.batch.detail.materialInformation")}>
                <DetailField
                  label={t("businessData.batch.detail.mainMaterial")}
                  value={displayValue(batch.mainMaterial)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.service")}
                  value={displayValue(batch.service)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.product")}
                  value={displayValue(batch.product)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.productDescription")}
                  value={displayValue(batch.productDescription)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.capacityClass")}
                  value={displayValue(batch.capacityClass)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.quantity")}
                  value={displayValue(batch.quantity)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.batch.detail.batchSize")}
                  value={displayValue(batch.batchSize)}
                  labelWidth={140}
                />
              </DetailCard>
              <DetailCard title={t("businessData.batch.detail.containerInformation")}>
                <DetailField
                  label={t("businessData.batch.detail.containerType")}
                  value={displayValue(batch.containerType)}
                  labelWidth={140}
                />
              </DetailCard>
            </Grid>
          </DetailShell>
        )}
        {tab !== "details" && <Empty>{t("businessData.batch.detail.historyEmpty")}</Empty>}
      </DetailTabs>
    </ListPage>
  );
}
