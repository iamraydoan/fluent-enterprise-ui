import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useBomDetail } from "@/api";
import type { HeaderAction } from "@/components/common";
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
  SectionHeader,
  Grid,
  HStack,
  VStack,
} from "@/components/common";
import { Box24Regular, MoreVertical24Regular } from "@/components/icons";
import {
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
import { useBomDialogs } from "./useBomDialogs";

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
  label: { color: theme.color.textTertiary, minWidth: "140px" },
  itemsHeader: {
    marginBottom: theme.spacing.md,
  },
});

const TABS = ["details", "compare", "references", "history"] as const;
type BomTab = (typeof TABS)[number];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.bom.detail.sections.details",
  "businessData.bom.detail.sections.bomItems",
  "businessData.bom.detail.sections.instances",
  "businessData.bom.detail.sections.attachments",
];

export function BomDetailPage() {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
  const [tab, setTab] = useState<BomTab>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const { name } = useParams({ strict: false }) as { name: string };
  const displayName = decodeURIComponent(name);
  const { data: bom, isLoading } = useBomDetail(displayName);
  const { dialogs, openEdit, openClone, openTerminate, openUnterminate, openManageItems } =
    useBomDialogs(bom);

  if (isLoading || !bom) {
    return (
      <ListPage
        header={{
          icon: <Box24Regular />,
          title: displayName,
          actions: [refreshAction, editAction],
        }}
      >
        <Empty>{t("businessData.bom.detail.loading")}</Empty>
      </ListPage>
    );
  }

  const showItems = left === "businessData.bom.detail.sections.bomItems";

  const detailActions: HeaderAction[] = [
    refreshAction,
    { ...editAction, onClick: openEdit },
    { ...cloneAction, onClick: openClone },
    bom?.state === "Terminated"
      ? { ...unterminateAction, onClick: openUnterminate }
      : { ...terminateAction, onClick: openTerminate },
    {
      id: "more",
      icon: <MoreVertical24Regular />,
      labelKey: "actionBar.more",
      menu: [{ label: t("businessData.bom.operations.manageItems"), onClick: openManageItems }],
    },
  ];

  return (
    <ListPage
      header={{
        icon: <Box24Regular />,
        title: `${bom.name} (${bom.state})`,
        actions: detailActions,
      }}
    >
      {dialogs}
      <DetailTabs
        tabs={TABS.map((value) => ({
          value,
          label: t(`businessData.bom.detail.tabs.${value}`),
        }))}
        active={tab}
        onChange={(value) => setTab(value as typeof tab)}
      >
        {tab === "details" && (
          <DetailShell
            title={bom.name}
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
            {showItems ? (
              <VStack gap="md" className={`${sharedStyles.contentCard} ${styles.card}`}>
                <HStack align="center" justify="space-between" className={styles.itemsHeader}>
                  <SectionHeader
                    title={t("businessData.bom.detail.bomItemsTitle", { count: bom.items.length })}
                  />
                </HStack>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>
                        {t("businessData.bom.detail.itemColumns.item")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.bom.detail.itemColumns.product")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.bom.detail.itemColumns.quantity")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.bom.detail.itemColumns.units")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.bom.detail.itemColumns.position")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.bom.detail.itemColumns.source")}
                      </TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bom.items.map((item) => (
                      <TableRow key={item.item}>
                        <TableCell>{item.item}</TableCell>
                        <TableCell>{item.product}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.units}</TableCell>
                        <TableCell>{item.position}</TableCell>
                        <TableCell>{item.source}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </VStack>
            ) : (
              <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="12px">
                <VStack gap="md" className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <SectionHeader title={t("businessData.bom.detail.bom")} />
                  <KV label={t("businessData.bom.detail.name")} value={bom.name} />
                  <KV label={t("businessData.bom.detail.description")} value={bom.description} />
                  <KV label={t("businessData.bom.detail.type")} value={bom.type} />
                  <KV
                    label={t("businessData.bom.detail.universalState")}
                    value={bom.universalState}
                  />
                  <KV label={t("businessData.bom.detail.dataGroup")} value={bom.dataGroup} />
                </VStack>
                <VStack gap="md" className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <SectionHeader title={t("businessData.bom.detail.changeSet")} />
                  <KV label={t("businessData.bom.detail.changeSetLabel")} value={bom.changeSet} />
                </VStack>
                <VStack gap="md" className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <SectionHeader title={t("businessData.bom.detail.information")} />
                  <KV label={t("businessData.bom.detail.scope")} value={bom.scope} />
                  <KV label={t("businessData.bom.detail.product")} value={bom.product} />
                  <KV
                    label={t("businessData.bom.detail.baseQuantity")}
                    value={String(bom.baseQuantity)}
                  />
                  <KV label={t("businessData.bom.detail.units")} value={bom.units} />
                  <KV
                    label={t("businessData.bom.detail.useTolerances")}
                    value={
                      bom.useTolerances
                        ? t("businessData.bom.detail.yes")
                        : t("businessData.bom.detail.no")
                    }
                  />
                  <KV
                    label={t("businessData.bom.detail.useMixedAssembly")}
                    value={
                      bom.useMixedAssembly
                        ? t("businessData.bom.detail.yes")
                        : t("businessData.bom.detail.no")
                    }
                  />
                </VStack>
              </Grid>
            )}
          </DetailShell>
        )}
        {tab !== "details" && <Empty>{t("businessData.bom.detail.historyEmpty")}</Empty>}
      </DetailTabs>
    </ListPage>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <HStack gap="12px" className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>{value === "" ? t("businessData.bom.detail.emptyValue") : value}</span>
    </HStack>
  );
}
