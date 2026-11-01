import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useBatchDetail } from "@/api";
import { DetailShell, DetailTabs, editAction, Empty, ListPage, refreshAction, TileGrid } from "@/components/common";
import type { HeaderAction } from "@/components/common";
import {
  ArrowDownload24Regular,
  ArrowExportUp24Regular,
  ArrowUp20Regular,
  Box24Regular,
  MoreVertical24Regular,
} from "@/components/icons";
import { Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { theme } from "@/styles/theme";
import { useBatchDialogs } from "./useBatchDialogs";

const useDetailStyles = makeStyles({
  card: { padding: theme.spacing.lg, display: "flex", flexDirection: "column", rowGap: theme.spacing.md },
  cardTitle: {
    fontSize: "14px",
    fontWeight: theme.font.weightSemibold,
    paddingBottom: theme.spacing.sm,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  row: { display: "flex", columnGap: theme.spacing.md, fontSize: "13px" },
  label: { color: theme.color.textTertiary, minWidth: "140px" },
});

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
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
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
            <TileGrid minWidth="300px">
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <Text className={styles.cardTitle}>{t("businessData.batch.detail.batch")}</Text>
                <KV label={t("businessData.batch.detail.name")} value={batch.name} />
                <KV label={t("businessData.batch.detail.description")} value={batch.description} />
                <KV label={t("businessData.batch.detail.type")} value={batch.type} />
                <KV
                  label={t("businessData.batch.detail.universalState")}
                  value={batch.universalState}
                />
                <KV label={t("businessData.batch.detail.systemState")} value={batch.systemState} />
                <KV label={t("businessData.batch.detail.dataGroup")} value={batch.dataGroup} />
              </div>
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <Text className={styles.cardTitle}>
                  {t("businessData.batch.detail.information")}
                </Text>
                <KV label={t("businessData.batch.detail.resource")} value={batch.resource} />
                <KV label={t("businessData.batch.detail.loadState")} value={batch.loadState} />
                <KV label={t("businessData.batch.detail.step")} value={batch.step} />
                <KV label={t("businessData.batch.detail.resourceJob")} value={batch.resourceJob} />
                <KV
                  label={t("businessData.batch.detail.priority")}
                  value={String(batch.priority)}
                />
              </div>
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <Text className={styles.cardTitle}>
                  {t("businessData.batch.detail.resourceInformation")}
                </Text>
                <KV
                  label={t("businessData.batch.detail.resourceType")}
                  value={batch.resourceType}
                />
                <KV label={t("businessData.batch.detail.facility")} value={batch.facility} />
                <KV
                  label={t("businessData.batch.detail.loadStartMode")}
                  value={batch.loadStartMode}
                />
                <KV label={t("businessData.batch.detail.loadMode")} value={batch.loadMode} />
                <KV
                  label={t("businessData.batch.detail.materialSplitMode")}
                  value={batch.materialSplitMode}
                />
                <KV
                  label={t("businessData.batch.detail.allowProductMix")}
                  value={
                    batch.allowProductMix
                      ? t("businessData.batch.detail.yes")
                      : t("businessData.batch.detail.no")
                  }
                />
                <KV
                  label={t("businessData.batch.detail.minimumBatchSize")}
                  value={batch.minimumBatchSize}
                />
              </div>
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <Text className={styles.cardTitle}>
                  {t("businessData.batch.detail.materialInformation")}
                </Text>
                <KV
                  label={t("businessData.batch.detail.mainMaterial")}
                  value={batch.mainMaterial}
                />
                <KV label={t("businessData.batch.detail.service")} value={batch.service} />
                <KV label={t("businessData.batch.detail.product")} value={batch.product} />
                <KV
                  label={t("businessData.batch.detail.productDescription")}
                  value={batch.productDescription}
                />
                <KV
                  label={t("businessData.batch.detail.capacityClass")}
                  value={batch.capacityClass}
                />
                <KV label={t("businessData.batch.detail.quantity")} value={batch.quantity} />
                <KV label={t("businessData.batch.detail.batchSize")} value={batch.batchSize} />
              </div>
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <Text className={styles.cardTitle}>
                  {t("businessData.batch.detail.containerInformation")}
                </Text>
                <KV
                  label={t("businessData.batch.detail.containerType")}
                  value={batch.containerType}
                />
              </div>
            </TileGrid>
          </DetailShell>
        )}
        {tab !== "details" && (
          <Empty>{t("businessData.batch.detail.historyEmpty")}</Empty>
        )}
      </DetailTabs>
    </ListPage>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>{value === "" ? t("businessData.batch.detail.emptyValue") : value}</span>
    </div>
  );
}
