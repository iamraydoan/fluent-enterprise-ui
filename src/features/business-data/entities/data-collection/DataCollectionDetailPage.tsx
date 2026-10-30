import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useDataCollectionDetail } from "@/api";
import type { DataCollectionInstance, DataCollectionParameter } from "@/api";
import {
  DetailShell,
  ListPage,
  cloneAction,
  editAction,
  refreshAction,
  terminateAction,
  unterminateAction,
} from "@/components/common";
import type { HeaderAction } from "@/components/common";
import { Box24Regular, MoreVertical24Regular } from "@/components/icons";
import { Button, Text, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { useDataCollectionDialogs } from "./useDataCollectionDialogs";

const useDetailStyles = makeStyles({
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "12px",
  },
  card: { padding: "16px", display: "flex", flexDirection: "column", rowGap: "12px" },
  cardTitle: {
    fontSize: "14px",
    fontWeight: tokens.fontWeightSemibold,
    paddingBottom: "8px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  row: { display: "flex", columnGap: "12px", fontSize: "13px" },
  label: { color: tokens.colorNeutralForeground3, minWidth: "200px" },
  tabs: { display: "flex", columnGap: "4px", padding: "0 16px" },
  tab: {
    padding: "10px 16px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    borderBottom: "2px solid transparent",
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  tabActive: {
    fontWeight: tokens.fontWeightSemibold,
    borderBottom: `2px solid ${tokens.colorBrandStroke1}`,
  },
  tabContent: { padding: "16px", flexGrow: 1, minHeight: 0, overflowY: "auto" },
  empty: { padding: "32px", textAlign: "center", color: tokens.colorNeutralForeground3 },
  paramHeader: {
    width: "100%",
    textAlign: "left",
    padding: "10px 12px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "14px",
    fontWeight: tokens.fontWeightSemibold,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  paramBlock: { display: "flex", flexDirection: "column", rowGap: "12px" },
});

const TABS = ["details", "compare", "references", "history"] as const;
const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.dataCollection.detail.sections.details",
  "businessData.dataCollection.detail.sections.parameters",
  "businessData.dataCollection.detail.sections.limitSets",
  "businessData.dataCollection.detail.sections.instances",
  "businessData.dataCollection.detail.sections.attachments",
];

export function DataCollectionDetailPage() {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
  const [tab, setTab] = useState<string>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { name } = useParams({ strict: false }) as { name: string };
  const displayName = decodeURIComponent(name);
  const { data: dc, isLoading } = useDataCollectionDetail(displayName);
  const {
    dialogs,
    openEdit,
    openClone,
    openTerminate,
    openUnterminate,
    openManageParameters,
    openInstance,
    openPerformImmediate,
    openViewInstance,
    openPostData,
    openCorrect,
    openCloseInstance,
    openResetInstance,
    openTerminateInstance,
    openUnterminateInstance,
  } = useDataCollectionDialogs(dc);

  if (isLoading || !dc) {
    return (
      <ListPage
        header={{
          icon: <Box24Regular />,
          title: displayName,
          actions: [refreshAction, editAction],
        }}
      >
        <div className={styles.empty}>{t("businessData.dataCollection.detail.loading")}</div>
      </ListPage>
    );
  }

  const terminated = dc.state === "Terminated";
  const detailActions: HeaderAction[] = [
    refreshAction,
    { ...editAction, onClick: openEdit },
    { ...cloneAction, onClick: openClone },
    terminated
      ? { ...unterminateAction, onClick: openUnterminate }
      : { ...terminateAction, onClick: openTerminate },
    {
      id: "more",
      icon: <MoreVertical24Regular />,
      labelKey: "actionBar.more",
      menu: [
        {
          label: t("businessData.dataCollection.operations.manageParametersTitle"),
          onClick: openManageParameters,
        },
        {
          label: t("businessData.dataCollection.operations.openInstanceTitle"),
          onClick: openInstance,
        },
        {
          label: t("businessData.dataCollection.operations.performImmediateTitle"),
          onClick: openPerformImmediate,
        },
      ],
    },
  ];

  return (
    <ListPage
      header={{ icon: <Box24Regular />, title: `${dc.name} (${dc.state})`, actions: detailActions }}
    >
      <div className={styles.tabs} role="tablist">
        {TABS.map((value) => (
          <button
            key={value}
            role="tab"
            aria-selected={tab === value}
            className={`${styles.tab} ${tab === value ? styles.tabActive : ""}`}
            onClick={() => setTab(value)}
          >
            {t(`businessData.dataCollection.detail.tabs.${value}`)}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {tab === "details" && (
          <DetailShell
            title={dc.name}
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
            {left === "businessData.dataCollection.detail.sections.parameters" ? (
              <div className={styles.paramBlock}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
                  <Button appearance="secondary" onClick={openManageParameters}>
                    {t("businessData.dataCollection.operations.manageParametersTitle")}
                  </Button>
                </div>
                {dc.parameters.map((p) => (
                  <div key={p.parameter} className={sharedStyles.contentCard}>
                    <button
                      className={styles.paramHeader}
                      onClick={() => setExpanded(expanded === p.parameter ? null : p.parameter)}
                    >
                      {p.parameter}
                      <span
                        style={{
                          display: "block",
                          fontWeight: "normal",
                          fontSize: 12,
                          color: tokens.colorNeutralForeground3,
                        }}
                      >
                        {p.dataType}
                      </span>
                    </button>
                    {expanded === p.parameter && <ParameterDetail parameter={p} />}
                  </div>
                ))}
              </div>
            ) : left === "businessData.dataCollection.detail.sections.limitSets" ? (
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <Text className={styles.cardTitle}>
                  {t("businessData.dataCollection.detail.limitSetsTitle", {
                    count: dc.limitSets.length,
                  })}
                </Text>
                {dc.limitSets.map((l) => (
                  <div key={l.name} className={styles.row}>
                    <span>{l.name}</span>
                  </div>
                ))}
              </div>
            ) : left === "businessData.dataCollection.detail.sections.instances" ? (
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <Text className={styles.cardTitle}>
                  {t("businessData.dataCollection.detail.instancesTitle", {
                    count: dc.instances.length,
                  })}
                </Text>
                {dc.instances.map((i) => (
                  <InstanceRow
                    key={i.name}
                    instance={i}
                    onView={() => openViewInstance(i)}
                    onPost={() => openPostData(i)}
                    onCorrect={() => openCorrect(i)}
                    onClose={() => openCloseInstance(i)}
                    onReset={() => openResetInstance(i)}
                    onTerminate={() => openTerminateInstance(i)}
                    onUnterminate={() => openUnterminateInstance(i)}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.cards}>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.dataCollection.detail.dataCollection")}
                  </Text>
                  <KV label={t("businessData.dataCollection.detail.name")} value={dc.name} />
                  <KV
                    label={t("businessData.dataCollection.detail.description")}
                    value={dc.description}
                  />
                  <KV label={t("businessData.dataCollection.detail.type")} value={dc.type} />
                  <KV
                    label={t("businessData.dataCollection.detail.universalState")}
                    value={dc.universalState}
                  />
                  <KV
                    label={t("businessData.dataCollection.detail.dataGroup")}
                    value={dc.dataGroup}
                  />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.dataCollection.detail.changeSet")}
                  </Text>
                  <KV
                    label={t("businessData.dataCollection.detail.changeSetLabel")}
                    value={dc.changeSet}
                  />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.dataCollection.detail.details")}
                  </Text>
                  <KV label={t("businessData.dataCollection.detail.scope")} value={dc.scope} />
                  <KV
                    label={t("businessData.dataCollection.detail.userInterface")}
                    value={dc.userInterface}
                  />
                  <KV
                    label={t("businessData.dataCollection.detail.limitCheckingMode")}
                    value={dc.limitCheckingMode}
                  />
                </div>
              </div>
            )}
          </DetailShell>
        )}
        {tab !== "details" && (
          <div className={styles.empty}>{t("businessData.dataCollection.detail.historyEmpty")}</div>
        )}
      </div>
      {dialogs}
    </ListPage>
  );
}

function postedCountSuffix(count: number): string {
  return count > 0 ? ` · ${String(count)}` : "";
}

function InstanceRow({
  instance,
  onView,
  onPost,
  onCorrect,
  onClose,
  onReset,
  onTerminate,
  onUnterminate,
}: {
  instance: DataCollectionInstance;
  onView: () => void;
  onPost: () => void;
  onCorrect: () => void;
  onClose: () => void;
  onReset: () => void;
  onTerminate: () => void;
  onUnterminate: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const terminated = instance.state === "Terminated";
  return (
    <div
      className={styles.row}
      style={{
        alignItems: "center",
        padding: "8px 0",
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
      }}
    >
      <div style={{ flexGrow: 1 }}>
        <div style={{ fontWeight: 600 }}>{instance.name}</div>
        <div style={{ fontSize: "12px", color: tokens.colorNeutralForeground3 }}>
          {instance.state}
          {postedCountSuffix(instance.postedData.length)}
        </div>
      </div>
      <div style={{ display: "flex", columnGap: "4px", flexWrap: "wrap" }}>
        <Button appearance="secondary" size="small" onClick={onView}>
          {t("businessData.dataCollection.operations.viewInstanceTitle")}
        </Button>
        <Button appearance="secondary" size="small" onClick={onPost}>
          {t("businessData.dataCollection.operations.post")}
        </Button>
        <Button appearance="secondary" size="small" onClick={onCorrect}>
          {t("businessData.dataCollection.operations.correct")}
        </Button>
        <Button appearance="secondary" size="small" onClick={onClose}>
          {t("businessData.dataCollection.operations.close")}
        </Button>
        <Button appearance="secondary" size="small" onClick={onReset}>
          {t("businessData.dataCollection.operations.reset")}
        </Button>
        {terminated ? (
          <Button appearance="secondary" size="small" onClick={onUnterminate}>
            {t("businessData.dataCollection.operations.unterminateInstance")}
          </Button>
        ) : (
          <Button appearance="secondary" size="small" onClick={onTerminate}>
            {t("businessData.dataCollection.operations.terminateInstance")}
          </Button>
        )}
      </div>
    </div>
  );
}

function ParameterDetail({ parameter }: { parameter: DataCollectionParameter }) {
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
  const { t } = useAppTranslation();
  return (
    <div className={styles.cards} style={{ padding: 16 }}>
      <div className={`${sharedStyles.contentCard} ${styles.card}`}>
        <Text className={styles.cardTitle}>
          {t("businessData.dataCollection.detail.parameterDetails")}
        </Text>
        <KV label={t("businessData.dataCollection.detail.parameter")} value={parameter.parameter} />
        <Bool
          label={t("businessData.dataCollection.detail.isOptional")}
          value={parameter.isOptional}
        />
      </div>
      <div className={`${sharedStyles.contentCard} ${styles.card}`}>
        <Text className={styles.cardTitle}>{t("businessData.dataCollection.detail.samples")}</Text>
        <KV label={t("businessData.dataCollection.detail.type")} value={parameter.dataType} />
        <KV
          label={t("businessData.dataCollection.detail.minimumSamples")}
          value={String(parameter.minimumSamples)}
        />
        <KV
          label={t("businessData.dataCollection.detail.maximumSamples")}
          value={String(parameter.maximumSamples)}
        />
      </div>
      <div className={`${sharedStyles.contentCard} ${styles.card}`}>
        <Text className={styles.cardTitle}>{t("businessData.dataCollection.detail.readings")}</Text>
        <KV
          label={t("businessData.dataCollection.detail.minimumSampleReadings")}
          value={String(parameter.minimumSampleReadings)}
        />
        <KV
          label={t("businessData.dataCollection.detail.maximumSampleReadings")}
          value={String(parameter.maximumSampleReadings)}
        />
      </div>
      <div className={`${sharedStyles.contentCard} ${styles.card}`}>
        <Text className={styles.cardTitle}>
          {t("businessData.dataCollection.detail.calculation")}
        </Text>
        <KV
          label={t("businessData.dataCollection.detail.limitChecking")}
          value={parameter.limitChecking}
        />
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
      <span>{value === "" ? t("businessData.dataCollection.detail.emptyValue") : value}</span>
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
        {value
          ? t("businessData.dataCollection.detail.yes")
          : t("businessData.dataCollection.detail.no")}
      </span>
    </div>
  );
}
