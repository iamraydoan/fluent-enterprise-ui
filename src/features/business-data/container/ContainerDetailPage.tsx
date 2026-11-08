import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useContainerDetail } from "@/api";
import type { HeaderAction } from "@/components/common";
import {
  cloneAction,
  DetailCard,
  DetailField,
  DetailShell,
  DetailTabs,
  editAction,
  Empty,
  EntityTile,
  Grid,
  ListPage,
  refreshAction,
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
import { useContainerDialogs } from "./useContainerDialogs";

const TABS = ["details", "container", "maintenance", "compare", "references", "history"] as const;
const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.container.detail.sections.details",
  "businessData.container.detail.sections.materials",
  "businessData.container.detail.sections.attachments",
];

export function ContainerDetailPage() {
  const { t } = useAppTranslation();
  const [tab, setTab] = useState<string>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(1);
  const { name } = useParams({ strict: false }) as { name: string };
  const displayName = decodeURIComponent(name);
  const { data: c, isLoading } = useContainerDetail(displayName);
  const {
    dialogs,
    openEdit,
    openClone,
    openTerminate,
    openUnterminate,
    openAddContainer,
    openDock,
    openEmpty,
    openMakeAvailable,
    openMakeUnavailable,
    openManagePositions,
    openRemoveContainer,
    openRetrieve,
    openStore,
    openTransferContainer,
    openTransferMaterial,
    openUndock,
  } = useContainerDialogs(c);

  const displayValue = (value: string) =>
    value === "" ? t("businessData.container.detail.emptyValue") : value;
  const displayYesNo = (value: boolean) =>
    value ? t("businessData.container.detail.yes") : t("businessData.container.detail.no");

  if (isLoading || !c) {
    return (
      <ListPage
        header={{
          icon: <Box24Regular />,
          title: displayName,
          actions: [refreshAction, editAction],
        }}
      >
        <Empty>{t("businessData.container.detail.loading")}</Empty>
      </ListPage>
    );
  }

  const terminated = c.state === "Terminated";
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
          label: t("businessData.container.operations.addContainerTitle"),
          onClick: openAddContainer,
        },
        { label: t("businessData.container.operations.dockTitle"), onClick: openDock },
        { label: t("businessData.container.operations.emptyTitle"), onClick: openEmpty },
        {
          label: t("businessData.container.operations.makeAvailableTitle"),
          onClick: openMakeAvailable,
        },
        {
          label: t("businessData.container.operations.makeUnavailableTitle"),
          onClick: openMakeUnavailable,
        },
        {
          label: t("businessData.container.operations.managePositionsTitle"),
          onClick: openManagePositions,
        },
        {
          label: t("businessData.container.operations.removeContainerTitle"),
          onClick: openRemoveContainer,
        },
        { label: t("businessData.container.operations.retrieveTitle"), onClick: openRetrieve },
        { label: t("businessData.container.operations.storeTitle"), onClick: openStore },
        {
          label: t("businessData.container.operations.transferContainerTitle"),
          onClick: openTransferContainer,
        },
        {
          label: t("businessData.container.operations.transferMaterialTitle"),
          onClick: openTransferMaterial,
        },
        { label: t("businessData.container.operations.undockTitle"), onClick: openUndock },
      ],
    },
  ];

  const showMaterials = left === "businessData.container.detail.sections.materials";
  const selected = c.positions.find((p) => p.position === selectedPosition);

  return (
    <ListPage
      header={{ icon: <Box24Regular />, title: `${c.name} (${c.state})`, actions: detailActions }}
    >
      <DetailTabs
        tabs={TABS.map((value) => ({
          value,
          label: t(`businessData.container.detail.tabs.${value}`),
        }))}
        active={tab}
        onChange={(value) => setTab(value as typeof tab)}
      >
        {tab === "details" && (
          <DetailShell
            title={c.name}
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
            {showMaterials ? (
              <DetailCard
                title={t("businessData.container.detail.materialsTitle", {
                  count: c.materials.length,
                })}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>
                        {t("businessData.container.detail.materialColumns.position")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.container.detail.materialColumns.material")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.container.detail.materialColumns.product")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.container.detail.materialColumns.step")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.container.detail.materialColumns.quantity")}
                      </TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {c.materials.map((m) => (
                      <TableRow key={m.position}>
                        <TableCell>{m.position}</TableCell>
                        <TableCell>{m.material}</TableCell>
                        <TableCell>{m.product}</TableCell>
                        <TableCell>{m.step}</TableCell>
                        <TableCell>{m.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DetailCard>
            ) : (
              <Grid columns="auto-fit" gap="md">
                <DetailCard title={t("businessData.container.detail.container")}>
                  <DetailField
                    label={t("businessData.container.detail.name")}
                    value={displayValue(c.name)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.container.detail.description")}
                    value={displayValue(c.description)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.container.detail.type")}
                    value={displayValue(c.type)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.container.detail.universalState")}
                    value={displayValue(c.universalState)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.container.detail.systemState")}
                    value={displayValue(c.systemState)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.container.detail.dataGroup")}
                    value={displayValue(c.dataGroup)}
                    labelWidth={180}
                  />
                </DetailCard>
                <DetailCard title={t("businessData.container.detail.information")}>
                  <DetailField
                    label={t("businessData.container.detail.facility")}
                    value={displayValue(c.facility)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.container.detail.parent")}
                    value={displayValue(c.parent)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.container.detail.onHold")}
                    value={displayYesNo(c.onHold)}
                    labelWidth={180}
                  />
                </DetailCard>
                <DetailCard title={t("businessData.container.detail.positions")}>
                  <DetailField
                    label={t("businessData.container.detail.positionUnitType")}
                    value={displayValue(c.positionUnitType)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.container.detail.allowMixedTypes")}
                    value={displayYesNo(c.allowMixedTypes)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.container.detail.usedPositions")}
                    value={String(c.usedPositions)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.container.detail.totalPositions")}
                    value={String(c.totalPositions)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.container.detail.capacityValidationMode")}
                    value={displayValue(c.capacityValidationMode)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.container.detail.capacityUnit")}
                    value={displayValue(c.capacityUnit)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.container.detail.capacityPerPosition")}
                    value={String(c.capacityPerPosition)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.container.detail.positionSorting")}
                    value={displayValue(c.positionSorting)}
                    labelWidth={180}
                  />
                </DetailCard>
              </Grid>
            )}
          </DetailShell>
        )}
        {tab === "container" && (
          <Grid columns="main-aside" gap="md" align="start">
            <DetailCard title={t("businessData.container.detail.positionsView")}>
              <Grid columns="auto-fill" minColumn={90} gap="sm">
                {c.positions.map((p) => (
                  <EntityTile
                    key={p.position}
                    title={p.position}
                    description={displayValue(p.material)}
                    selected={selectedPosition === p.position}
                    tone={p.material !== "" ? "info" : undefined}
                    onClick={() => setSelectedPosition(p.position)}
                    ariaLabel={p.position}
                  />
                ))}
              </Grid>
            </DetailCard>
            <DetailCard title={t("businessData.container.detail.positionDetails")}>
              {selected ? (
                <>
                  <DetailField
                    label={t("businessData.container.detail.position")}
                    value={String(selected.position)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.container.detail.material")}
                    value={displayValue(selected.material)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.container.detail.product")}
                    value={displayValue(selected.product)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.container.detail.step")}
                    value={displayValue(selected.step)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.container.detail.quantity")}
                    value={
                      selected.quantity === 0
                        ? t("businessData.container.detail.emptyValue")
                        : `${selected.quantity} ${selected.unit}`
                    }
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.container.detail.unit")}
                    value={displayValue(selected.unit)}
                    labelWidth={180}
                  />
                </>
              ) : (
                <Empty>{t("businessData.container.detail.selectPosition")}</Empty>
              )}
            </DetailCard>
          </Grid>
        )}
        {!["details", "container"].includes(tab) && (
          <Empty>{t("businessData.container.detail.historyEmpty")}</Empty>
        )}
      </DetailTabs>
      {dialogs}
    </ListPage>
  );
}
