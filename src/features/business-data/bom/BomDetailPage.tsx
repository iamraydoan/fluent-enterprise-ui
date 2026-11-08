import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useBomDetail } from "@/api";
import type { HeaderAction } from "@/components/common";
import {
  cloneAction,
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
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useBomDialogs } from "./useBomDialogs";

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
  const [tab, setTab] = useState<BomTab>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const { name } = useParams({ strict: false }) as { name: string };
  const displayName = decodeURIComponent(name);
  const { data: bom, isLoading } = useBomDetail(displayName);
  const { dialogs, openEdit, openClone, openTerminate, openUnterminate, openManageItems } =
    useBomDialogs(bom);

  const displayValue = (value: string) =>
    value === "" ? t("businessData.bom.detail.emptyValue") : value;

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
              <DetailCard
                header={
                  <SectionHeader
                    title={t("businessData.bom.detail.bomItemsTitle", { count: bom.items.length })}
                  />
                }
              >
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
              </DetailCard>
            ) : (
              <Grid columns="auto-fit" gap="md">
                <DetailCard title={t("businessData.bom.detail.bom")}>
                  <DetailField
                    label={t("businessData.bom.detail.name")}
                    value={displayValue(bom.name)}
                    labelWidth={140}
                  />
                  <DetailField
                    label={t("businessData.bom.detail.description")}
                    value={displayValue(bom.description)}
                    labelWidth={140}
                  />
                  <DetailField
                    label={t("businessData.bom.detail.type")}
                    value={displayValue(bom.type)}
                    labelWidth={140}
                  />
                  <DetailField
                    label={t("businessData.bom.detail.universalState")}
                    value={displayValue(bom.universalState)}
                    labelWidth={140}
                  />
                  <DetailField
                    label={t("businessData.bom.detail.dataGroup")}
                    value={displayValue(bom.dataGroup)}
                    labelWidth={140}
                  />
                </DetailCard>
                <DetailCard title={t("businessData.bom.detail.changeSet")}>
                  <DetailField
                    label={t("businessData.bom.detail.changeSetLabel")}
                    value={displayValue(bom.changeSet)}
                    labelWidth={140}
                  />
                </DetailCard>
                <DetailCard title={t("businessData.bom.detail.information")}>
                  <DetailField
                    label={t("businessData.bom.detail.scope")}
                    value={displayValue(bom.scope)}
                    labelWidth={140}
                  />
                  <DetailField
                    label={t("businessData.bom.detail.product")}
                    value={displayValue(bom.product)}
                    labelWidth={140}
                  />
                  <DetailField
                    label={t("businessData.bom.detail.baseQuantity")}
                    value={String(bom.baseQuantity)}
                    labelWidth={140}
                  />
                  <DetailField
                    label={t("businessData.bom.detail.units")}
                    value={displayValue(bom.units)}
                    labelWidth={140}
                  />
                  <DetailField
                    label={t("businessData.bom.detail.useTolerances")}
                    value={
                      bom.useTolerances
                        ? t("businessData.bom.detail.yes")
                        : t("businessData.bom.detail.no")
                    }
                    labelWidth={140}
                  />
                  <DetailField
                    label={t("businessData.bom.detail.useMixedAssembly")}
                    value={
                      bom.useMixedAssembly
                        ? t("businessData.bom.detail.yes")
                        : t("businessData.bom.detail.no")
                    }
                    labelWidth={140}
                  />
                </DetailCard>
              </Grid>
            )}
          </DetailShell>
        )}
        {tab !== "details" && <Empty>{t("businessData.bom.detail.historyEmpty")}</Empty>}
      </DetailTabs>
    </ListPage>
  );
}
