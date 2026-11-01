import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useChecklistDetail } from "@/api";
import type { ChecklistInstance } from "@/api";
import {
  cloneAction,
  DetailShell,
  DetailTabs,
  editAction,
  Empty,
  ListPage,
  refreshAction,
  terminateAction,
  unterminateAction,
} from "@/components/common";
import type { HeaderAction } from "@/components/common";
import { Box24Regular, Eye20Regular, MoreVertical24Regular } from "@/components/icons";
import { Button, Text, makeStyles} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { theme } from "@/styles/theme";
import { useChecklistDialogs } from "./useChecklistDialogs";

const useDetailStyles = makeStyles({
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: theme.spacing.md,
  },
  card: { padding: theme.spacing.lg, display: "flex", flexDirection: "column", rowGap: theme.spacing.md },
  cardTitle: {
    fontSize: "14px",
    fontWeight: theme.font.weightSemibold,
    paddingBottom: theme.spacing.sm,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  row: { display: "flex", columnGap: theme.spacing.md, fontSize: "13px" },
  label: { color: theme.color.textTertiary, minWidth: "200px" },
  split: {
    display: "grid",
    gridTemplateColumns: "minmax(320px, 2fr) 3fr",
    gap: theme.spacing.md,
    alignItems: "start",
  },
  itemList: { display: "flex", flexDirection: "column", rowGap: theme.spacing.xs },
  itemButton: {
    textAlign: "left",
    padding: `10px ${theme.spacing.md}`,
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    borderRadius: "4px",
    ":hover": { backgroundColor: theme.color.surfaceHover },
  },
  itemActive: {
    backgroundColor: theme.color.brandInvertedSelected,
    fontWeight: theme.font.weightSemibold,
  },
  itemDesc: { fontSize: "12px", color: theme.color.textTertiary, marginTop: theme.spacing.xs },
  subTabs: {
    display: "flex",
    columnGap: theme.spacing.xs,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    marginBottom: theme.spacing.md,
  },
  subTab: {
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "12px",
    textTransform: "uppercase",
    borderBottom: "2px solid transparent",
  },
  subTabActive: {
    color: theme.color.textBrand,
    borderBottom: `2px solid ${theme.color.borderBrand}`,
    fontWeight: theme.font.weightSemibold,
  },
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
        <Empty>{t("businessData.checklist.detail.loading")}</Empty>
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
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <Text className={styles.cardTitle}>
                  {t("businessData.checklist.detail.instancesTitle", {
                    count: cl.instances.length,
                  })}
                </Text>
                <div className={styles.itemList}>
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
                </div>
              </div>
            ) : (
              <div className={styles.cards}>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
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
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
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
                </div>
              </div>
            )}
          </DetailShell>
        )}
        {tab === "checklistItems" && (
          <div className={`${sharedStyles.contentCard} ${styles.card}`}>
            <Text className={styles.cardTitle}>
              {t("businessData.checklist.detail.itemsTitle", { count: cl.items.length })}
            </Text>
            <div className={styles.split}>
              <div className={styles.itemList}>
                {cl.items.map((i, idx) => (
                  <button
                    key={i.name}
                    className={`${styles.itemButton} ${idx === Math.min(itemIdx, cl.items.length - 1) ? styles.itemActive : ""}`}
                    onClick={() => setItemIdx(idx)}
                  >
                    <div>{i.name}</div>
                    <div className={styles.itemDesc}>{i.description}</div>
                  </button>
                ))}
              </div>
              {item && (
                <div>
                  <div className={styles.subTabs}>
                    {SUB_TABS.map((v) => (
                      <button
                        key={v}
                        className={`${styles.subTab} ${subTab === v ? styles.subTabActive : ""}`}
                        onClick={() => setSubTab(v)}
                      >
                        {t(`businessData.checklist.detail.subTabs.${v}`)}
                      </button>
                    ))}
                  </div>
                  {subTab === "generalData" && (
                    <div style={{ display: "flex", flexDirection: "column", rowGap: theme.spacing.md }}>
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
                    </div>
                  )}
                  {subTab !== "generalData" && (
                    <div className={styles.empty}>
                      {t("businessData.checklist.detail.historyEmpty")}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {!["details", "checklistItems"].includes(tab) && (
          <Empty>{t("businessData.checklist.detail.historyEmpty")}</Empty>
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
    <div
      className={styles.row}
      style={{
        alignItems: "center",
        padding: `${theme.spacing.sm} 0`,
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
      <div style={{ display: "flex", columnGap: theme.spacing.xs, flexWrap: "wrap" }}>
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
      </div>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>{value === "" ? t("businessData.checklist.detail.emptyValue") : value}</span>
    </div>
  );
}

function Bool({ label, value }: { label: string; value: boolean }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>
        {value ? t("businessData.checklist.detail.yes") : t("businessData.checklist.detail.no")}
      </span>
    </div>
  );
}
