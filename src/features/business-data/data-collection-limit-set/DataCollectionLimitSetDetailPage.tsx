import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useDataCollectionLimitSetDetail } from "@/api";
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
  SectionHeader,
  terminateAction,
  unterminateAction,
} from "@/components/common";
import { Box24Regular, MoreVertical24Regular } from "@/components/icons";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useDataCollectionLimitSetDialogs } from "./useDataCollectionLimitSetDialogs";

const TABS = ["details", "references", "history"] as const;
const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.dataCollectionLimitSet.detail.sections.details",
  "businessData.dataCollectionLimitSet.detail.sections.parameterLimits",
  "businessData.dataCollectionLimitSet.detail.sections.attachments",
];

export function DataCollectionLimitSetDetailPage() {
  const { t } = useAppTranslation();
  const [tab, setTab] = useState<string>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const { name } = useParams({ strict: false }) as { name: string };
  const displayName = decodeURIComponent(name);
  const { data: ls, isLoading } = useDataCollectionLimitSetDetail(displayName);
  const { dialogs, openEdit, openTerminate, openUnterminate, openManageParameters } =
    useDataCollectionLimitSetDialogs(ls);

  const displayValue = (value: string) =>
    value === "" ? t("businessData.dataCollectionLimitSet.detail.emptyValue") : value;
  const displayYesNo = (value: boolean) =>
    value
      ? t("businessData.dataCollectionLimitSet.detail.yes")
      : t("businessData.dataCollectionLimitSet.detail.no");

  if (isLoading || !ls) {
    return (
      <ListPage
        header={{
          icon: <Box24Regular />,
          title: displayName,
          actions: [refreshAction, editAction],
        }}
      >
        <Empty>{t("businessData.dataCollectionLimitSet.detail.loading")}</Empty>
      </ListPage>
    );
  }

  const terminated = ls.state === "Terminated";
  const detailActions: HeaderAction[] = [
    refreshAction,
    { ...editAction, onClick: openEdit },
    terminated
      ? { ...unterminateAction, onClick: openUnterminate }
      : { ...terminateAction, onClick: openTerminate },
    {
      id: "more",
      icon: <MoreVertical24Regular />,
      labelKey: "actionBar.more",
      menu: [
        {
          label: t("businessData.dataCollectionLimitSet.operations.manageParametersTitle"),
          onClick: openManageParameters,
        },
      ],
    },
  ];

  const showLimits = left === "businessData.dataCollectionLimitSet.detail.sections.parameterLimits";

  return (
    <ListPage
      header={{ icon: <Box24Regular />, title: `${ls.name} (${ls.state})`, actions: detailActions }}
    >
      <DetailTabs
        tabs={TABS.map((value) => ({
          value,
          label: t(`businessData.dataCollectionLimitSet.detail.tabs.${value}`),
        }))}
        active={tab}
        onChange={(value) => setTab(value as typeof tab)}
      >
        {tab === "details" && (
          <DetailShell
            title={ls.name}
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
            {showLimits ? (
              <DetailCard
                headerGap="none"
                header={
                  <>
                    <SectionHeader
                      title={t("businessData.dataCollectionLimitSet.detail.limitsTitle", {
                        count: ls.parameterLimits.length,
                      })}
                    />
                    <Button variant="secondary" size="sm" onClick={openManageParameters}>
                      {t("businessData.dataCollectionLimitSet.operations.manageParametersTitle")}
                    </Button>
                  </>
                }
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>
                        {t("businessData.dataCollectionLimitSet.detail.limitColumns.parameter")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t(
                          "businessData.dataCollectionLimitSet.detail.limitColumns.overrideParameter",
                        )}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t(
                          "businessData.dataCollectionLimitSet.detail.limitColumns.includeSampleLimits",
                        )}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.dataCollectionLimitSet.detail.limitColumns.limitType")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t(
                          "businessData.dataCollectionLimitSet.detail.limitColumns.lowerErrorLimit",
                        )}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t(
                          "businessData.dataCollectionLimitSet.detail.limitColumns.lowerWarningLimit",
                        )}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.dataCollectionLimitSet.detail.limitColumns.target")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t(
                          "businessData.dataCollectionLimitSet.detail.limitColumns.upperWarningLimit",
                        )}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t(
                          "businessData.dataCollectionLimitSet.detail.limitColumns.upperErrorLimit",
                        )}
                      </TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ls.parameterLimits.map((p) => (
                      <TableRow key={p.parameter}>
                        <TableCell>{p.parameter}</TableCell>
                        <TableCell>{displayYesNo(p.overrideParameter)}</TableCell>
                        <TableCell>{displayYesNo(p.includeSampleLimits)}</TableCell>
                        <TableCell>{p.limitType}</TableCell>
                        <TableCell>{p.lowerErrorLimit}</TableCell>
                        <TableCell>{p.lowerWarningLimit}</TableCell>
                        <TableCell>{p.target}</TableCell>
                        <TableCell>{p.upperWarningLimit}</TableCell>
                        <TableCell>{p.upperErrorLimit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DetailCard>
            ) : (
              <Grid columns="auto-fit" gap="md">
                <DetailCard
                  title={t("businessData.dataCollectionLimitSet.detail.dataCollectionLimitSet")}
                >
                  <DetailField
                    label={t("businessData.dataCollectionLimitSet.detail.name")}
                    value={displayValue(ls.name)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.dataCollectionLimitSet.detail.description")}
                    value={displayValue(ls.description)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.dataCollectionLimitSet.detail.type")}
                    value={displayValue(ls.type)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.dataCollectionLimitSet.detail.universalState")}
                    value={displayValue(ls.universalState)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.dataCollectionLimitSet.detail.dataGroup")}
                    value={displayValue(ls.dataGroup)}
                    labelWidth={180}
                  />
                </DetailCard>
                <DetailCard title={t("businessData.dataCollectionLimitSet.detail.information")}>
                  <DetailField
                    label={t("businessData.dataCollectionLimitSet.detail.dataCollection")}
                    value={displayValue(ls.dataCollection)}
                    labelWidth={180}
                  />
                </DetailCard>
              </Grid>
            )}
          </DetailShell>
        )}
        {tab !== "details" && (
          <Empty>{t("businessData.dataCollectionLimitSet.detail.historyEmpty")}</Empty>
        )}
      </DetailTabs>
      {dialogs}
    </ListPage>
  );
}
