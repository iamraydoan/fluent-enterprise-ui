import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useChecklistDetail } from "@/api";
import type { ChecklistInstance } from "@/api";
import {
  DetailShell,
  EntityTile,
  ListPage,
  cloneAction,
  editAction,
  refreshAction,
  terminateAction,
  unterminateAction,
  DetailTabs,
  Grid,
  HStack,
  VStack,
} from "@/components/common";
import type { HeaderAction } from "@/components/common";
import { Box24Regular, Eye20Regular, MoreVertical24Regular } from "@/components/icons";
import { Button, Tab, TabList, Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { theme } from "@/styles/theme";
import { useChecklistDialogs } from "./useChecklistDialogs";

const useDetailStyles = makeStyles({
  card: { padding: "16px" },
  cardTitle: {
    fontSize: "14px",
    fontWeight: theme.font.weightSemibold,
    paddingBottom: "8px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  row: { fontSize: "13px" },
  label: { color: theme.color.textTertiary, minWidth: "200px" },
  empty: { padding: "32px", textAlign: "center", color: theme.color.textTertiary },
});

const TABS = ["details", "checklistItems", "compare", "references", "history"] as const;
const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.checklist.detail.sections.details",
  "businessData.checklist.detail.sections.instances",
  "businessData.checklist.detail.sections.attachments",
];
const SUB_TABS = ["generalData", "instructions", "bom", "condition"] as const;

export function ChecklistDetailPage() {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
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

  if (isLoading || !cl) {
    return (
      <ListPage
        header={{
          icon: <Box24Regular />,
          title: displayName,
          actions: [refreshAction, editAction],
        }}
      >
        <div className={styles.empty}>{t("businessData.checklist.detail.loading")}</div>
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
              <VStack gap="12px" className={`${sharedStyles.contentCard} ${styles.card}`}>
                <Text className={styles.cardTitle}>
                  {t("businessData.checklist.detail.instancesTitle", {
                    count: cl.instances.length,
                  })}
                </Text>
                <VStack gap="4px">
                  {cl.instances.length === 0 && (
                    <div className={styles.empty}>
                      {t("businessData.checklist.detail.noInstances")}
                    </div>
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
              </VStack>
            ) : (
              <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="12px">
                <VStack gap="12px" className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.checklist.detail.checklist")}
                  </Text>
                  <KV label={t("businessData.checklist.detail.name")} value={cl.name} />
                  <KV
                    label={t("businessData.checklist.detail.description")}
                    value={cl.description}
                  />
                  <KV label={t("businessData.checklist.detail.type")} value={cl.type} />
                  <KV
                    label={t("businessData.checklist.detail.universalState")}
                    value={cl.universalState}
                  />
                  <KV label={t("businessData.checklist.detail.dataGroup")} value={cl.dataGroup} />
                </VStack>
                <VStack gap="12px" className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.checklist.detail.information")}
                  </Text>
                  <KV label={t("businessData.checklist.detail.scope")} value={cl.scope} />
                  <KV
                    label={t("businessData.checklist.detail.executionMode")}
                    value={cl.executionMode}
                  />
                  <KV label={t("businessData.checklist.detail.bom")} value={cl.bom} />
                  <KV label={t("businessData.checklist.detail.product")} value={cl.product} />
                  <KV
                    label={t("businessData.checklist.detail.materialDeviationProtocol")}
                    value={cl.materialDeviationProtocol}
                  />
                  <Bool
                    label={t("businessData.checklist.detail.defineStandardTimes")}
                    value={cl.defineStandardTimes}
                  />
                  <Bool
                    label={t("businessData.checklist.detail.trackExecutionTimes")}
                    value={cl.trackExecutionTimes}
                  />
                  <KV
                    label={t("businessData.checklist.detail.standardDuration")}
                    value={cl.standardDuration}
                  />
                </VStack>
              </Grid>
            )}
          </DetailShell>
        )}
        {tab === "checklistItems" && (
          <VStack gap="12px" className={`${sharedStyles.contentCard} ${styles.card}`}>
            <Text className={styles.cardTitle}>
              {t("businessData.checklist.detail.itemsTitle", { count: cl.items.length })}
            </Text>
            <Grid columns="minmax(320px, 2fr) 3fr" gap="12px" align="start">
              <VStack gap="4px">
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
                  <TabList
                    selectedValue={subTab}
                    onTabSelect={setSubTab}
                    aria-label={t("businessData.checklist.detail.itemsTitle", {
                      count: cl.items.length,
                    })}
                  >
                    {SUB_TABS.map((v) => (
                      <Tab key={v} value={v}>
                        {t(`businessData.checklist.detail.subTabs.${v}`)}
                      </Tab>
                    ))}
                  </TabList>
                  {subTab === "generalData" && (
                    <VStack gap={12}>
                      <KV label={t("businessData.checklist.detail.itemName")} value={item.name} />
                      <KV
                        label={t("businessData.checklist.detail.activityType")}
                        value={item.activityType}
                      />
                      <KV
                        label={t("businessData.checklist.detail.trackingType")}
                        value={item.trackingType}
                      />
                      <KV
                        label={t("businessData.checklist.detail.standardDuration")}
                        value={item.standardDuration}
                      />
                      <Bool
                        label={t("businessData.checklist.detail.optional")}
                        value={item.optional}
                      />
                      <Bool
                        label={t("businessData.checklist.detail.floating")}
                        value={item.floating}
                      />
                    </VStack>
                  )}
                  {subTab !== "generalData" && (
                    <div className={styles.empty}>
                      {t("businessData.checklist.detail.historyEmpty")}
                    </div>
                  )}
                </div>
              )}
            </Grid>
          </VStack>
        )}
        {!["details", "checklistItems"].includes(tab) && (
          <div className={styles.empty}>{t("businessData.checklist.detail.historyEmpty")}</div>
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
  const styles = useDetailStyles();
  return (
    <HStack
      gap="12px"
      align="center"
      className={styles.row}
      style={{
        padding: "8px 0",
        borderBottom: `1px solid ${theme.color.borderSubtle}`,
      }}
    >
      <div style={{ flexGrow: 1 }}>
        <div style={{ fontWeight: 600 }}>{instance.name}</div>
        <div style={{ fontSize: "12px", color: theme.color.textTertiary }}>
          {instance.state}
          {instance.executingState ? ` · ${instance.executingState}` : ""}
          {instance.material ? ` · ${instance.material}` : ""}
        </div>
      </div>
      <HStack gap="4px" wrap>
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
      </HStack>
    </HStack>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <HStack gap="12px" className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>{value === "" ? t("businessData.checklist.detail.emptyValue") : value}</span>
    </HStack>
  );
}

function Bool({ label, value }: { label: string; value: boolean }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <HStack gap="12px" className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>
        {value ? t("businessData.checklist.detail.yes") : t("businessData.checklist.detail.no")}
      </span>
    </HStack>
  );
}
