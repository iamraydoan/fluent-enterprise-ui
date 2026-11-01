import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useDataCollectionLimitSetDetail } from "@/api";
import type { HeaderAction } from "@/components/common";
import {
  DetailShell,
  DetailTabs,
  editAction,
  ListPage,
  refreshAction,
  terminateAction,
  unterminateAction,
  Empty,
  SectionHeader,
  Grid,
  HStack,
  VStack,
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
  makeStyles,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { theme } from "@/styles/theme";
import { useDataCollectionLimitSetDialogs } from "./useDataCollectionLimitSetDialogs";

const useDetailStyles = makeStyles({
  card: { padding: theme.spacing.lg },
  cardTitle: {
    fontSize: "14px",
    fontWeight: theme.font.weightSemibold,
    paddingBottom: theme.spacing.sm,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  row: {
    fontSize: "13px",
  },
  label: { color: theme.color.textTertiary, minWidth: "180px" },
});

const TABS = ["details", "references", "history"] as const;
const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.dataCollectionLimitSet.detail.sections.details",
  "businessData.dataCollectionLimitSet.detail.sections.parameterLimits",
  "businessData.dataCollectionLimitSet.detail.sections.attachments",
];

export function DataCollectionLimitSetDetailPage() {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
  const [tab, setTab] = useState<string>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const { name } = useParams({ strict: false }) as { name: string };
  const displayName = decodeURIComponent(name);
  const { data: ls, isLoading } = useDataCollectionLimitSetDetail(displayName);
  const { dialogs, openEdit, openTerminate, openUnterminate, openManageParameters } =
    useDataCollectionLimitSetDialogs(ls);

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
              <VStack gap="md" className={`${sharedStyles.contentCard} ${styles.card}`}>
                <HStack align="center" justify="space-between">
                  <SectionHeader
                    title={t("businessData.dataCollectionLimitSet.detail.limitsTitle", {
                      count: ls.parameterLimits.length,
                    })}
                  />
                  <Button variant="secondary" size="sm" onClick={openManageParameters}>
                    {t("businessData.dataCollectionLimitSet.operations.manageParametersTitle")}
                  </Button>
                </HStack>
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
                        <TableCell>
                          {p.overrideParameter
                            ? t("businessData.dataCollectionLimitSet.detail.yes")
                            : t("businessData.dataCollectionLimitSet.detail.no")}
                        </TableCell>
                        <TableCell>
                          {p.includeSampleLimits
                            ? t("businessData.dataCollectionLimitSet.detail.yes")
                            : t("businessData.dataCollectionLimitSet.detail.no")}
                        </TableCell>
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
              </VStack>
            ) : (
              <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="12px">
                <VStack gap="md" className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <SectionHeader
                    title={t("businessData.dataCollectionLimitSet.detail.dataCollectionLimitSet")}
                  />
                  <KV
                    label={t("businessData.dataCollectionLimitSet.detail.name")}
                    value={ls.name}
                  />
                  <KV
                    label={t("businessData.dataCollectionLimitSet.detail.description")}
                    value={ls.description}
                  />
                  <KV
                    label={t("businessData.dataCollectionLimitSet.detail.type")}
                    value={ls.type}
                  />
                  <KV
                    label={t("businessData.dataCollectionLimitSet.detail.universalState")}
                    value={ls.universalState}
                  />
                  <KV
                    label={t("businessData.dataCollectionLimitSet.detail.dataGroup")}
                    value={ls.dataGroup}
                  />
                </VStack>
                <VStack gap="md" className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <SectionHeader
                    title={t("businessData.dataCollectionLimitSet.detail.information")}
                  />
                  <KV
                    label={t("businessData.dataCollectionLimitSet.detail.dataCollection")}
                    value={ls.dataCollection}
                  />
                </VStack>
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

function KV({ label, value }: { label: string; value: string }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <HStack gap="12px" className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>
        {value === "" ? t("businessData.dataCollectionLimitSet.detail.emptyValue") : value}
      </span>
    </HStack>
  );
}
