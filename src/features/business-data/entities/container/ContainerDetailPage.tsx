import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useContainerDetail } from "@/api";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  makeStyles,
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { useContainerDialogs } from "./useContainerDialogs";

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
  label: { color: tokens.colorNeutralForeground3, minWidth: "180px" },
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
  positionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
    gap: "8px",
  },
  positionCell: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: "6px",
    padding: "10px",
    cursor: "pointer",
    fontSize: "12px",
    textAlign: "center",
    backgroundColor: tokens.colorNeutralBackground1,
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  positionActive: { border: `2px solid ${tokens.colorBrandStroke1}` },
  positionFilled: { backgroundColor: tokens.colorPaletteBlueBackground2 },
  positionNum: { fontWeight: tokens.fontWeightSemibold, fontSize: "14px" },
  split: {
    display: "grid",
    gridTemplateColumns: "3fr minmax(280px, 1fr)",
    gap: "12px",
    alignItems: "start",
  },
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
        <div className={styles.empty}>{t("businessData.container.detail.loading")}</div>
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
      <div className={styles.tabs} role="tablist">
        {TABS.map((value) => (
          <button
            key={value}
            role="tab"
            aria-selected={tab === value}
            className={`${styles.tab} ${tab === value ? styles.tabActive : ""}`}
            onClick={() => setTab(value)}
          >
            {t(`businessData.container.detail.tabs.${value}`)}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
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
                <Text className={styles.cardTitle}>
                  {t("businessData.container.detail.materialsTitle", { count: c.materials.length })}
                </Text>
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
              <div className={styles.cards}>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.container.detail.container")}
                  </Text>
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
                  <Text className={styles.cardTitle}>
                    {t("businessData.container.detail.information")}
                  </Text>
                  <KV label={t("businessData.container.detail.facility")} value={c.facility} />
                  <KV label={t("businessData.container.detail.parent")} value={c.parent} />
                  <Bool label={t("businessData.container.detail.onHold")} value={c.onHold} />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.container.detail.positions")}
                  </Text>
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
              </div>
            )}
          </DetailShell>
        )}
        {tab === "container" && (
          <div className={styles.split}>
            <div className={`${sharedStyles.contentCard} ${styles.card}`}>
              <Text className={styles.cardTitle}>
                {t("businessData.container.detail.positionsView")}
              </Text>
              <div className={styles.positionsGrid}>
                {c.positions.map((p) => (
                  <button
                    key={p.position}
                    className={`${styles.positionCell} ${p.material !== "" ? styles.positionFilled : ""} ${selectedPosition === p.position ? styles.positionActive : ""}`}
                    onClick={() => setSelectedPosition(p.position)}
                  >
                    <div className={styles.positionNum}>{p.position}</div>
                    <div>
                      {p.material === ""
                        ? t("businessData.container.detail.emptyValue")
                        : p.material}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className={`${sharedStyles.contentCard} ${styles.card}`}>
              <Text className={styles.cardTitle}>
                {t("businessData.container.detail.positionDetails")}
              </Text>
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
                <div className={styles.empty}>
                  {t("businessData.container.detail.selectPosition")}
                </div>
              )}
            </div>
          </div>
        )}
        {!["details", "container"].includes(tab) && (
          <div className={styles.empty}>{t("businessData.container.detail.historyEmpty")}</div>
        )}
      </div>
      {dialogs}
    </ListPage>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>{value === "" ? t("businessData.container.detail.emptyValue") : value}</span>
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
        {value ? t("businessData.container.detail.yes") : t("businessData.container.detail.no")}
      </span>
    </div>
  );
}
