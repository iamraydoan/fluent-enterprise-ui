import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useBinConverterDetail } from "@/api";
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
  terminateAction,
  unterminateAction,
} from "@/components/common";
import { Box24Regular } from "@/components/icons";
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
import { useBinConverterDialogs } from "./useBinConverterDialogs";

const TABS = ["details", "compare", "references", "history"] as const;
const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.binConverter.detail.sections.details",
  "businessData.binConverter.detail.sections.conversions",
  "businessData.binConverter.detail.sections.attachments",
];

export function BinConverterDetailPage() {
  const { t } = useAppTranslation();
  const [tab, setTab] = useState<string>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const { name } = useParams({ strict: false }) as { name: string };
  const displayName = decodeURIComponent(name);
  const { data: bc, isLoading } = useBinConverterDetail(displayName);
  const { dialogs, openEdit, openClone, openTerminate, openUnterminate } =
    useBinConverterDialogs(bc);

  const displayValue = (value: string) =>
    value === "" ? t("businessData.binConverter.detail.emptyValue") : value;

  if (isLoading || !bc) {
    return (
      <ListPage
        header={{
          icon: <Box24Regular />,
          title: displayName,
          actions: [refreshAction, editAction],
        }}
      >
        <Empty>{t("businessData.binConverter.detail.loading")}</Empty>
      </ListPage>
    );
  }

  const showConversions = left === "businessData.binConverter.detail.sections.conversions";

  const detailActions: HeaderAction[] = [
    refreshAction,
    { ...editAction, onClick: openEdit },
    { ...cloneAction, onClick: openClone },
    bc?.state === "Terminated"
      ? { ...unterminateAction, onClick: openUnterminate }
      : { ...terminateAction, onClick: openTerminate },
  ];

  return (
    <ListPage
      header={{ icon: <Box24Regular />, title: `${bc.name} (${bc.state})`, actions: detailActions }}
    >
      {dialogs}
      <DetailTabs
        tabs={TABS.map((value) => ({
          value,
          label: t(`businessData.binConverter.detail.tabs.${value}`),
        }))}
        active={tab}
        onChange={(value) => setTab(value as typeof tab)}
      >
        {tab === "details" && (
          <DetailShell
            title={bc.name}
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
            {showConversions ? (
              <DetailCard
                title={t("businessData.binConverter.detail.conversionsTitle", {
                  count: bc.conversions.length,
                })}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>
                        {t("businessData.binConverter.detail.convColumns.fromBinCode")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.binConverter.detail.convColumns.toBinCode")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.binConverter.detail.convColumns.toBinDescription")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.binConverter.detail.convColumns.toBinQuality")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.binConverter.detail.convColumns.toBinColor")}
                      </TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bc.conversions.map((c) => (
                      <TableRow key={c.fromBinCode}>
                        <TableCell>{c.fromBinCode}</TableCell>
                        <TableCell>{c.toBinCode}</TableCell>
                        <TableCell>{c.toBinDescription}</TableCell>
                        <TableCell>{c.toBinQuality}</TableCell>
                        <TableCell>{c.toBinColor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DetailCard>
            ) : (
              <Grid columns="auto-fit" gap="md">
                <DetailCard title={t("businessData.binConverter.detail.binConverter")}>
                  <DetailField
                    label={t("businessData.binConverter.detail.name")}
                    value={displayValue(bc.name)}
                    labelWidth={140}
                  />
                  <DetailField
                    label={t("businessData.binConverter.detail.description")}
                    value={displayValue(bc.description)}
                    labelWidth={140}
                  />
                  <DetailField
                    label={t("businessData.binConverter.detail.universalState")}
                    value={displayValue(bc.universalState)}
                    labelWidth={140}
                  />
                  <DetailField
                    label={t("businessData.binConverter.detail.dataGroup")}
                    value={displayValue(bc.dataGroup)}
                    labelWidth={140}
                  />
                </DetailCard>
                <DetailCard>
                  <DetailField
                    label={t("businessData.binConverter.detail.converterType")}
                    value={displayValue(bc.converterType)}
                    labelWidth={140}
                  />
                  <DetailField
                    label={t("businessData.binConverter.detail.binType")}
                    value={displayValue(bc.binType)}
                    labelWidth={140}
                  />
                </DetailCard>
              </Grid>
            )}
          </DetailShell>
        )}
        {tab !== "details" && <Empty>{t("businessData.binConverter.detail.historyEmpty")}</Empty>}
      </DetailTabs>
    </ListPage>
  );
}
