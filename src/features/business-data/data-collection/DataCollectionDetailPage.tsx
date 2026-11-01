import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useDataCollectionDetail } from "@/api";
import type { DataCollectionInstance, DataCollectionParameter } from "@/api";
import type { HeaderAction } from "@/components/common";
import {
  DetailShell,
  ListPage,
  cloneAction,
  editAction,
  refreshAction,
  terminateAction,
  unterminateAction,
  DetailTabs,
  Empty,  SectionHeader, Grid, HStack, VStack 
} from "@/components/common";
import { Box24Regular, MoreVertical24Regular } from "@/components/icons";
import { Button, Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { theme } from "@/styles/theme";
import { useCopyDataCollectionLimitSetsDialog } from "../data-collection-limit-set/useDataCollectionLimitSetDialogs";
import { useDataCollectionDialogs } from "./useDataCollectionDialogs";

const useDetailStyles = makeStyles({
  
  card: { padding: "16px", display: "flex", flexDirection: "column", rowGap: "12px" },
  cardTitle: {
    fontSize: "14px",
    fontWeight: theme.font.weightSemibold,
    paddingBottom: "8px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  row: {
    fontSize: "13px",
  },
  label: { color: theme.color.textTertiary, minWidth: "200px" },
  paramHeader: {
    width: "100%",
    textAlign: "left",
    padding: "10px 12px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "14px",
    fontWeight: theme.font.weightSemibold,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  
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
  const { copyDialog, openCopy: openCopyLimitSets } = useCopyDataCollectionLimitSetsDialog(
    dc?.name ?? "",
  );

  if (isLoading || !dc) {
    return (
      <ListPage
        header={{
          icon: <Box24Regular />,
          title: displayName,
          actions: [refreshAction, editAction],
        }}
      >
        <Empty>{t("businessData.dataCollection.detail.loading")}</Empty>
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
      <DetailTabs
        tabs={TABS.map((value) => ({
          value,
          label: t(`businessData.dataCollection.detail.tabs.${value}`),
        }))}
        active={tab}
        onChange={(value) => setTab(value as typeof tab)}
      >
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
              <VStack gap="12px">
                <HStack justify="flex-end" style={{marginBottom: "8px"}}>
                  <Button variant="secondary" onClick={openManageParameters}>
                    {t("businessData.dataCollection.operations.manageParametersTitle")}
                  </Button>
                </HStack>
                {dc.parameters.map((p) => (
                  <div key={p.parameter} className={sharedStyles.contentCard}>
                    <SectionHeader
                      title={
                        <>
                          {p.parameter}
                          <Text size={200} style={{ color: theme.color.textTertiary }}>
                            {p.dataType}
                          </Text>
                        </>
                      }
                      collapsible
                      expanded={expanded === p.parameter}
                      onToggle={() => setExpanded(expanded === p.parameter ? null : p.parameter)}
                    />
                    {expanded === p.parameter && <ParameterDetail parameter={p} />}
                  </div>
                ))}
              </VStack>
            ) : left === "businessData.dataCollection.detail.sections.limitSets" ? (
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <HStack align="center" justify="space-between">
                  <SectionHeader title={t("businessData.dataCollection.detail.limitSetsTitle", {
                      count: dc.limitSets.length,
                    })} />
                  <Button variant="secondary" size="sm" onClick={openCopyLimitSets}>
                    {t("businessData.dataCollectionLimitSet.operations.copyTitle")}
                  </Button>
                </HStack>
                {dc.limitSets.map((l) => (
                  <HStack gap="12px" key={l.name} className={styles.row}>
                    <span>{l.name}</span>
                  </HStack>
                ))}
              </div>
            ) : left === "businessData.dataCollection.detail.sections.instances" ? (
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <SectionHeader title={t("businessData.dataCollection.detail.instancesTitle", {
                    count: dc.instances.length,
                  })} />
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
              <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="12px">
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <SectionHeader title={t("businessData.dataCollection.detail.dataCollection")} />
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
                  <SectionHeader title={t("businessData.dataCollection.detail.changeSet")} />
                  <KV
                    label={t("businessData.dataCollection.detail.changeSetLabel")}
                    value={dc.changeSet}
                  />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <SectionHeader title={t("businessData.dataCollection.detail.details")} />
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
              </Grid>
            )}
          </DetailShell>
        )}
        {tab !== "details" && <Empty>{t("businessData.dataCollection.detail.historyEmpty")}</Empty>}
      </DetailTabs>
      {dialogs}
      {copyDialog}
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
    <HStack gap="12px" style={{
        alignItems: "center",
        padding: "8px 0",
        borderBottom: `1px solid ${theme.color.borderSubtle}`,
      }} className={styles.row}>
      <div style={{ flexGrow: 1 }}>
        <div style={{ fontWeight: 600 }}>{instance.name}</div>
        <div style={{ fontSize: "12px", color: theme.color.textTertiary }}>
          {instance.state}
          {postedCountSuffix(instance.postedData.length)}
        </div>
      </div>
      <HStack gap="4px" wrap>
        <Button variant="secondary" size="sm" onClick={onView}>
          {t("businessData.dataCollection.operations.viewInstanceTitle")}
        </Button>
        <Button variant="secondary" size="sm" onClick={onPost}>
          {t("businessData.dataCollection.operations.post")}
        </Button>
        <Button variant="secondary" size="sm" onClick={onCorrect}>
          {t("businessData.dataCollection.operations.correct")}
        </Button>
        <Button variant="secondary" size="sm" onClick={onClose}>
          {t("businessData.dataCollection.operations.close")}
        </Button>
        <Button variant="secondary" size="sm" onClick={onReset}>
          {t("businessData.dataCollection.operations.reset")}
        </Button>
        {terminated ? (
          <Button variant="secondary" size="sm" onClick={onUnterminate}>
            {t("businessData.dataCollection.operations.unterminateInstance")}
          </Button>
        ) : (
          <Button variant="secondary" size="sm" onClick={onTerminate}>
            {t("businessData.dataCollection.operations.terminateInstance")}
          </Button>
        )}
      </HStack>
    </HStack>
  );
}

function ParameterDetail({ parameter }: { parameter: DataCollectionParameter }) {
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
  const { t } = useAppTranslation();
  return (
    <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="12px" style={{ padding: 16 }}>
      <div className={`${sharedStyles.contentCard} ${styles.card}`}>
        <SectionHeader title={t("businessData.dataCollection.detail.parameterDetails")} />
        <KV label={t("businessData.dataCollection.detail.parameter")} value={parameter.parameter} />
        <Bool
          label={t("businessData.dataCollection.detail.isOptional")}
          value={parameter.isOptional}
        />
      </div>
      <div className={`${sharedStyles.contentCard} ${styles.card}`}>
        <SectionHeader title={t("businessData.dataCollection.detail.samples")} />
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
        <SectionHeader title={t("businessData.dataCollection.detail.readings")} />
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
        <SectionHeader title={t("businessData.dataCollection.detail.calculation")} />
        <KV
          label={t("businessData.dataCollection.detail.limitChecking")}
          value={parameter.limitChecking}
        />
      </div>
    </Grid>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <HStack gap="12px" className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>{value === "" ? t("businessData.dataCollection.detail.emptyValue") : value}</span>
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
        {value
          ? t("businessData.dataCollection.detail.yes")
          : t("businessData.dataCollection.detail.no")}
      </span>
    </HStack>
  );
}
