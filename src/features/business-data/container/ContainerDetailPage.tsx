import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useContainerDetail } from "@/api";
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
  Empty,
  EntityTile,
  SectionHeader, Grid, HStack 
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
import { useContainerDialogs } from "./useContainerDialogs";

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
  label: { color: theme.color.textTertiary, minWidth: "180px" },
  
  positionCell: {
    border: `1px solid ${theme.color.borderSubtle}`,
    borderRadius: "6px",
    padding: "10px",
    cursor: "pointer",
    fontSize: "12px",
    textAlign: "center",
    backgroundColor: theme.color.surface,
    ":hover": { backgroundColor: theme.color.surfaceHover },
  },
  positionActive: { border: `2px solid ${theme.color.borderBrand}` },
  
});

const TABS = ["details", "container", "maintenance", "compare", "references", "history"] as const;
const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.container.detail.sections.details",
  "businessData.container.detail.sections.materials",
  "businessData.container.detail.sections.attachments",
];

export function ContainerDetailPage() {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
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
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <SectionHeader title={t("businessData.container.detail.materialsTitle", { count: c.materials.length })} />
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
              </div>
            ) : (
              <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="12px">
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <SectionHeader title={t("businessData.container.detail.container")} />
                  <KV label={t("businessData.container.detail.name")} value={c.name} />
                  <KV
                    label={t("businessData.container.detail.description")}
                    value={c.description}
                  />
                  <KV label={t("businessData.container.detail.type")} value={c.type} />
                  <KV
                    label={t("businessData.container.detail.universalState")}
                    value={c.universalState}
                  />
                  <KV
                    label={t("businessData.container.detail.systemState")}
                    value={c.systemState}
                  />
                  <KV label={t("businessData.container.detail.dataGroup")} value={c.dataGroup} />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <SectionHeader title={t("businessData.container.detail.information")} />
                  <KV label={t("businessData.container.detail.facility")} value={c.facility} />
                  <KV label={t("businessData.container.detail.parent")} value={c.parent} />
                  <Bool label={t("businessData.container.detail.onHold")} value={c.onHold} />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <SectionHeader title={t("businessData.container.detail.positions")} />
                  <KV
                    label={t("businessData.container.detail.positionUnitType")}
                    value={c.positionUnitType}
                  />
                  <Bool
                    label={t("businessData.container.detail.allowMixedTypes")}
                    value={c.allowMixedTypes}
                  />
                  <KV
                    label={t("businessData.container.detail.usedPositions")}
                    value={String(c.usedPositions)}
                  />
                  <KV
                    label={t("businessData.container.detail.totalPositions")}
                    value={String(c.totalPositions)}
                  />
                  <KV
                    label={t("businessData.container.detail.capacityValidationMode")}
                    value={c.capacityValidationMode}
                  />
                  <KV
                    label={t("businessData.container.detail.capacityUnit")}
                    value={c.capacityUnit}
                  />
                  <KV
                    label={t("businessData.container.detail.capacityPerPosition")}
                    value={String(c.capacityPerPosition)}
                  />
                  <KV
                    label={t("businessData.container.detail.positionSorting")}
                    value={c.positionSorting}
                  />
                </div>
              </Grid>
            )}
          </DetailShell>
        )}
        {tab === "container" && (
          <Grid columns="3fr minmax(280px, 1fr)" gap="12px" align="start">
            <div className={`${sharedStyles.contentCard} ${styles.card}`}>
              <SectionHeader title={t("businessData.container.detail.positionsView")} />
              <Grid columns="repeat(auto-fill, minmax(90px, 1fr))" gap="8px">
                {c.positions.map((p) => (
                  <EntityTile
                    key={p.position}
                    title={p.position}
                    description={
                      p.material === ""
                        ? t("businessData.container.detail.emptyValue")
                        : p.material
                    }
                    selected={selectedPosition === p.position}
                    backgroundColor={p.material !== "" ? theme.color.infoSubtle : undefined}
                    onClick={() => setSelectedPosition(p.position)}
                    ariaLabel={p.position}
                  />
                ))}
              </Grid>
            </div>
            <div className={`${sharedStyles.contentCard} ${styles.card}`}>
              <SectionHeader title={t("businessData.container.detail.positionDetails")} />
              {selected ? (
                <>
                  <KV
                    label={t("businessData.container.detail.position")}
                    value={String(selected.position)}
                  />
                  <KV
                    label={t("businessData.container.detail.material")}
                    value={selected.material}
                  />
                  <KV label={t("businessData.container.detail.product")} value={selected.product} />
                  <KV label={t("businessData.container.detail.step")} value={selected.step} />
                  <KV
                    label={t("businessData.container.detail.quantity")}
                    value={
                      selected.quantity === 0
                        ? t("businessData.container.detail.emptyValue")
                        : `${selected.quantity} ${selected.unit}`
                    }
                  />
                  <KV label={t("businessData.container.detail.unit")} value={selected.unit} />
                </>
              ) : (
                <Empty>{t("businessData.container.detail.selectPosition")}</Empty>
              )}
            </div>
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

function KV({ label, value }: { label: string; value: string }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <HStack gap="12px" className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>{value === "" ? t("businessData.container.detail.emptyValue") : value}</span>
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
        {value ? t("businessData.container.detail.yes") : t("businessData.container.detail.no")}
      </span>
    </HStack>
  );
}
