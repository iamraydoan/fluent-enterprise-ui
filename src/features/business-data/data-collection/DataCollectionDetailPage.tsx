import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useDataCollectionDetail } from "@/api";
import type { DataCollectionInstance, DataCollectionParameter } from "@/api";
import {
  DetailCard,
  DetailCardTitle,
  DetailEmpty,
  DetailField,
  DetailShell,
  DetailSurface,
  DetailTabs,
  Grid,
  HStack,
  ListPage,
  ListRow,
  Section,
  VStack,
  cloneAction,
  editAction,
  refreshAction,
  terminateAction,
  unterminateAction,
} from "@/components/common";
import type { HeaderAction } from "@/components/common";
import { Box24Regular, MoreVertical24Regular } from "@/components/icons";
import { Button, Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useCopyDataCollectionLimitSetsDialog } from "../data-collection-limit-set/useDataCollectionLimitSetDialogs";
import { useDataCollectionDialogs } from "./useDataCollectionDialogs";

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

  const displayValue = (value: string) =>
    value === "" ? t("businessData.dataCollection.detail.emptyValue") : value;
  if (isLoading || !dc) {
    return (
      <ListPage
        header={{
          icon: <Box24Regular />,
          title: displayName,
          actions: [refreshAction, editAction],
        }}
      >
        <DetailEmpty>{t("businessData.dataCollection.detail.loading")}</DetailEmpty>
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
              <VStack gap="md">
                <HStack justify="end" mb="sm">
                  <Button variant="secondary" onClick={openManageParameters}>
                    {t("businessData.dataCollection.operations.manageParametersTitle")}
                  </Button>
                </HStack>
                {dc.parameters.map((p) => (
                  <DetailSurface key={p.parameter}>
                    <Section
                      collapsible
                      expanded={expanded === p.parameter}
                      onExpandedChange={() =>
                        setExpanded(expanded === p.parameter ? null : p.parameter)
                      }
                      title={
                        <>
                          {p.parameter}
                          <Text size={200} tone="tertiary">
                            {p.dataType}
                          </Text>
                        </>
                      }
                    >
                      <ParameterDetail parameter={p} />
                    </Section>
                  </DetailSurface>
                ))}
              </VStack>
            ) : left === "businessData.dataCollection.detail.sections.limitSets" ? (
              <DetailCard
                header={
                  <>
                    <DetailCardTitle>
                      {t("businessData.dataCollection.detail.limitSetsTitle", {
                        count: dc.limitSets.length,
                      })}
                    </DetailCardTitle>
                    <Button variant="secondary" size="sm" onClick={openCopyLimitSets}>
                      {t("businessData.dataCollectionLimitSet.operations.copyTitle")}
                    </Button>
                  </>
                }
                headerGap="none"
              >
                {dc.limitSets.map((l) => (
                  <ListRow key={l.name} variant="plain" title={l.name} />
                ))}
              </DetailCard>
            ) : left === "businessData.dataCollection.detail.sections.instances" ? (
              <DetailCard>
                <DetailCardTitle>
                  {t("businessData.dataCollection.detail.instancesTitle", {
                    count: dc.instances.length,
                  })}
                </DetailCardTitle>
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
              </DetailCard>
            ) : (
              <Grid columns="auto-fit" gap="md">
                <DetailCard>
                  <DetailCardTitle>
                    {t("businessData.dataCollection.detail.dataCollection")}
                  </DetailCardTitle>
                  <DetailField
                    label={t("businessData.dataCollection.detail.name")}
                    value={displayValue(dc.name)}
                    labelWidth={200}
                  />
                  <DetailField
                    label={t("businessData.dataCollection.detail.description")}
                    value={displayValue(dc.description)}
                    labelWidth={200}
                  />
                  <DetailField
                    label={t("businessData.dataCollection.detail.type")}
                    value={displayValue(dc.type)}
                    labelWidth={200}
                  />
                  <DetailField
                    label={t("businessData.dataCollection.detail.universalState")}
                    value={displayValue(dc.universalState)}
                    labelWidth={200}
                  />
                  <DetailField
                    label={t("businessData.dataCollection.detail.dataGroup")}
                    value={displayValue(dc.dataGroup)}
                    labelWidth={200}
                  />
                </DetailCard>
                <DetailCard>
                  <DetailCardTitle>
                    {t("businessData.dataCollection.detail.changeSet")}
                  </DetailCardTitle>
                  <DetailField
                    label={t("businessData.dataCollection.detail.changeSetLabel")}
                    value={displayValue(dc.changeSet)}
                    labelWidth={200}
                  />
                </DetailCard>
                <DetailCard>
                  <DetailCardTitle>
                    {t("businessData.dataCollection.detail.details")}
                  </DetailCardTitle>
                  <DetailField
                    label={t("businessData.dataCollection.detail.scope")}
                    value={displayValue(dc.scope)}
                    labelWidth={200}
                  />
                  <DetailField
                    label={t("businessData.dataCollection.detail.userInterface")}
                    value={displayValue(dc.userInterface)}
                    labelWidth={200}
                  />
                  <DetailField
                    label={t("businessData.dataCollection.detail.limitCheckingMode")}
                    value={displayValue(dc.limitCheckingMode)}
                    labelWidth={200}
                  />
                </DetailCard>
              </Grid>
            )}
          </DetailShell>
        )}
        {tab !== "details" && (
          <DetailEmpty>{t("businessData.dataCollection.detail.historyEmpty")}</DetailEmpty>
        )}
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
  const terminated = instance.state === "Terminated";
  return (
    <ListRow
      title={instance.name}
      subtitle={
        <>
          {instance.state}
          {postedCountSuffix(instance.postedData.length)}
        </>
      }
      actions={
        <>
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
        </>
      }
    />
  );
}

function ParameterDetail({ parameter }: { parameter: DataCollectionParameter }) {
  const { t } = useAppTranslation();
  const displayValue = (value: string) =>
    value === "" ? t("businessData.dataCollection.detail.emptyValue") : value;
  const displayYesNo = (value: boolean) =>
    value
      ? t("businessData.dataCollection.detail.yes")
      : t("businessData.dataCollection.detail.no");
  return (
    <Grid columns="auto-fit" gap="md" p="lg">
      <DetailCard>
        <DetailCardTitle>
          {t("businessData.dataCollection.detail.parameterDetails")}
        </DetailCardTitle>
        <DetailField
          label={t("businessData.dataCollection.detail.parameter")}
          value={displayValue(parameter.parameter)}
          labelWidth={200}
        />
        <DetailField
          label={t("businessData.dataCollection.detail.isOptional")}
          value={displayYesNo(parameter.isOptional)}
          labelWidth={200}
        />
      </DetailCard>
      <DetailCard>
        <DetailCardTitle>{t("businessData.dataCollection.detail.samples")}</DetailCardTitle>
        <DetailField
          label={t("businessData.dataCollection.detail.type")}
          value={displayValue(parameter.dataType)}
          labelWidth={200}
        />
        <DetailField
          label={t("businessData.dataCollection.detail.minimumSamples")}
          value={displayValue(String(parameter.minimumSamples))}
          labelWidth={200}
        />
        <DetailField
          label={t("businessData.dataCollection.detail.maximumSamples")}
          value={displayValue(String(parameter.maximumSamples))}
          labelWidth={200}
        />
      </DetailCard>
      <DetailCard>
        <DetailCardTitle>{t("businessData.dataCollection.detail.readings")}</DetailCardTitle>
        <DetailField
          label={t("businessData.dataCollection.detail.minimumSampleReadings")}
          value={displayValue(String(parameter.minimumSampleReadings))}
          labelWidth={200}
        />
        <DetailField
          label={t("businessData.dataCollection.detail.maximumSampleReadings")}
          value={displayValue(String(parameter.maximumSampleReadings))}
          labelWidth={200}
        />
      </DetailCard>
      <DetailCard>
        <DetailCardTitle>{t("businessData.dataCollection.detail.calculation")}</DetailCardTitle>
        <DetailField
          label={t("businessData.dataCollection.detail.limitChecking")}
          value={displayValue(parameter.limitChecking)}
          labelWidth={200}
        />
      </DetailCard>
    </Grid>
  );
}
