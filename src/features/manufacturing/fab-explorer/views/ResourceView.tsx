import { useMemo, useRef, useState } from "react";
import type { FabMaterial } from "@/api";
import {
  postFabOperation,
  useDispatchList,
  useFabResourceDetail,
  useResourceMaterials,
} from "@/api";
import {
  ActionBar,
  DataTableCard,
  RibbonButton,
  SidePanel,
  searchFilter,
} from "@/components/common";
import type { DataColumn, DataFilter, DataTableCardApi, RibbonMenuItem } from "@/components/common";
import {
  ArrowSync24Regular,
  Box24Regular,
  ChevronLeft20Regular,
  Send24Regular,
  Settings20Regular,
} from "@/components/icons";
import { Text, makeStyles, mergeClasses } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import type { ListQueryParams } from "@/lib/listQuery";
import { theme } from "@/styles/theme";
import {
  AbortDialog,
  ChangeMaterialTypeDialog,
  ChangeResourceStateDialog,
  CheckInEmployeeDialog,
  CheckOutEmployeeDialog,
  DispatchAndTrackInDialog,
  DispatchDialog,
  HoldMaterialDialog,
  MergeDialog,
  MoveNextDialog,
  PanelSettingsDialog,
  PerformChecklistDialog,
  PostDataDialog,
  ReworkDialog,
  RecordAssembledLossBonusDialog,
  RecordLossBonusDialog,
  RecordSubMaterialLossesDialog,
  ReleaseMaterialDialog,
  ResetLayoutDialog,
  RetrieveDialog,
  SaveLayoutDialog,
  SpecialMoveNextDialog,
  SplitDialog,
  StoreDialog,
  TrackInDialog,
  TrackOutAndMoveNextDialog,
  TrackOutDialog,
  UndispatchDialog,
} from "../dialogs";
import type { PanelSection } from "../dialogs";
import { MATERIAL_COLUMNS } from "./materialColumns";

const useViewStyles = makeStyles({
  page: { display: "flex", flexDirection: "column", height: "100%", minHeight: 0 },
  header: {
    display: "flex",
    alignItems: "center",
    columnGap: theme.spacing.md,
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    backgroundColor: theme.color.surface,
  },
  backBtn: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: "6px",
    borderRadius: theme.radius.md,
    display: "flex",
    ":hover": { backgroundColor: theme.color.surfaceHover },
  },
  body: { display: "flex", flexGrow: 1, minHeight: 0, columnGap: "10px", padding: "10px" },
  left: { width: "230px", flexShrink: 0, display: "flex", flexDirection: "column", minHeight: 0 },
  center: { flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column", rowGap: theme.spacing.sm },
  right: { width: "260px", flexShrink: 0, display: "flex", flexDirection: "column", minHeight: 0 },
  filterBar: {
    display: "flex",
    alignItems: "center",
    columnGap: theme.spacing.md,
    flexWrap: "wrap",
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: theme.color.surface,
    border: `1px solid ${theme.color.borderSubtle}`,
    borderRadius: theme.radius.md,
  },
  catRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "13px",
    borderRadius: theme.radius.md,
    ":hover": { backgroundColor: theme.color.surfaceHover },
  },
  catActive: {
    backgroundColor: theme.color.surfaceSelected,
    fontWeight: theme.font.weightSemibold,
  },
  sectionHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${theme.spacing.sm} ${theme.spacing.xs}`,
  },
  detailCard: {
    backgroundColor: theme.color.surface,
    border: `1px solid ${theme.color.borderSubtle}`,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    display: "flex",
    flexDirection: "column",
    rowGap: theme.spacing.sm,
  },
  toolbarRight: { marginLeft: "auto", display: "flex", columnGap: theme.spacing.xs },
  tabs: { display: "flex", columnGap: theme.spacing.xs, padding: `0 ${theme.spacing.xs}` },
  tab: {
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "13px",
    textTransform: "uppercase",
    borderBottom: "2px solid transparent",
    ":hover": { backgroundColor: theme.color.surfaceHover },
  },
  tabActive: {
    fontWeight: theme.font.weightSemibold,
    borderBottom: `2px solid ${theme.color.borderBrand}`,
  },
});

type Category =
  | "dispatchList"
  | "materialsAtResource"
  | "loadPorts"
  | "subResources"
  | "consumables"
  | "durables"
  | "recipe"
  | "upcomingMaintenances"
  | "alerts";

const ALL_CATEGORIES: Category[] = [
  "dispatchList",
  "materialsAtResource",
  "loadPorts",
  "subResources",
  "consumables",
  "durables",
  "recipe",
  "upcomingMaintenances",
  "alerts",
];

const L: Record<Category, TranslationKey> = {
  dispatchList: "manufacturing.fabExplorer.resourceView.dispatchList",
  materialsAtResource: "manufacturing.fabExplorer.resourceView.materialsAtResource",
  loadPorts: "manufacturing.fabExplorer.resourceView.loadPorts",
  subResources: "manufacturing.fabExplorer.resourceView.subResources",
  consumables: "manufacturing.fabExplorer.resourceView.consumables",
  durables: "manufacturing.fabExplorer.resourceView.durables",
  recipe: "manufacturing.fabExplorer.resourceView.recipe",
  upcomingMaintenances: "manufacturing.fabExplorer.resourceView.upcomingMaintenances",
  alerts: "manufacturing.fabExplorer.resourceView.alerts",
};

const MOCK_DOC = "Doc C images.jpg";

const STORAGE_COLUMNS: DataColumn<FabMaterial>[] = [
  {
    field: "storagePosition",
    headerName: "manufacturing.fabExplorer.stepView.columns.storagePosition",
    valueGetter: () => "",
  },
  {
    field: "name",
    headerName: "manufacturing.fabExplorer.stepView.columns.material",
    cellRenderer: (r) => <Text size={300}>{r.name}</Text>,
  },
  {
    field: "state",
    headerName: "manufacturing.fabExplorer.stepView.columns.state",
  },
  {
    field: "product",
    headerName: "manufacturing.fabExplorer.stepView.columns.product",
  },
];

const RESOURCE_MATERIAL_FILTERS: DataFilter[] = [
  {
    type: "select",
    param: "state",
    labelKey: "manufacturing.fabExplorer.resourceView.filters.state",
    includeAll: true,
    options: [
      { value: "Queued", labelKey: "manufacturing.fabExplorer.stepView.filters.stateQueued" },
      {
        value: "In Process",
        labelKey: "manufacturing.fabExplorer.stepView.filters.stateInProcess",
      },
    ],
  },
  searchFilter("q"),
];

const OP = {
  abort: "abort",
  change_material_type: "change-material-type",
  change_resource_state: "change-resource-state",
  check_in_employee: "check-in-employee",
  check_out_employee: "check-out-employee",
  dispatch: "dispatch",
  dispatch_track_in: "dispatch-track-in",
  hold: "hold",
  merge: "merge",
  move_next: "move-next",
  perform_checklist: "perform-checklist",
  post_data: "post-data",
  record_assembled_loss_bonus: "record-assembled-loss-bonus",
  record_loss_bonus: "record-loss-bonus",
  record_submaterial_losses: "record-submaterial-losses",
  release: "release",
  retrieve: "retrieve",
  rework: "rework",
  special_move_next: "special-move-next",
  split: "split",
  store: "store",
  track_in: "track-in",
  track_out: "track-out",
  track_out_move_next: "track-out-move-next",
  undispatch: "undispatch",
} as const;

const STORAGE_TABS = ["storable", "stored"] as const;

const DLG = {
  abort: "abort",
  assembledLoss: "assembledLoss",
  changeMaterialType: "changeMaterialType",
  changeResourceState: "changeResourceState",
  checkIn: "checkIn",
  checkOut: "checkOut",
  checklist: "checklist",
  dispatch: "dispatch",
  dispatchTrackIn: "dispatchTrackIn",
  hold: "hold",
  lossBonus: "lossBonus",
  merge: "merge",
  moveNext: "moveNext",
  panelSettings: "panelSettings",
  postData: "postData",
  release: "release",
  resetLayout: "resetLayout",
  retrieve: "retrieve",
  rework: "rework",
  saveLayout: "saveLayout",
  specialMoveNext: "specialMoveNext",
  split: "split",
  store: "store",
  subLoss: "subLoss",
  trackIn: "trackIn",
  trackOut: "trackOut",
  trackOutMoveNext: "trackOutMoveNext",
  undispatch: "undispatch",
} as const;

export function ResourceView({ name, onBack }: { name: string; onBack: () => void }) {
  const { t } = useAppTranslation();
  const styles = useViewStyles();
  const [category, setCategory] = useState<Category>("materialsAtResource");
  const [visibleCategories, setVisibleCategories] = useState<Category[]>(ALL_CATEGORIES);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [storageTab, setStorageTab] = useState<"storable" | "stored">("stored");

  const [dlg, setDlg] = useState<string | null>(null);
  const closeDlg = () => setDlg(null);
  const confirmOp = async (operation: string) => {
    await postFabOperation(operation, { materials: [...selected], resource: name });
    closeDlg();
    setSelected(new Set());
  };

  const { data: detail } = useFabResourceDetail(name);
  const isStorage = detail?.processingType === "Storage";
  const isDispatch = category === "dispatchList";

  const gridApiRef = useRef<DataTableCardApi | null>(null);

  const useStoredMaterialsQuery = useMemo(
    () =>
      function useStoredMaterialsQuery(params: ListQueryParams) {
        const query = useResourceMaterials(name, params);
        return storageTab === "stored"
          ? query
          : { data: { data: [], meta: { total: 0 } }, isLoading: false };
      },
    [name, storageTab],
  );
  const useGridMaterialsQuery = useMemo(
    () =>
      function useGridMaterialsQuery(params: ListQueryParams) {
        const materialsQuery = useResourceMaterials(name, params);
        const dispatchQuery = useDispatchList(name, params);
        return isDispatch ? dispatchQuery : materialsQuery;
      },
    [name, isDispatch],
  );

  const moreMenu: RibbonMenuItem[] = [
    {
      label: t("manufacturing.fabExplorer.operations.undispatch"),
      onClick: () => setDlg(DLG.undispatch),
    },
    {
      label: t("manufacturing.fabExplorer.operations.trackIn"),
      onClick: () => setDlg(DLG.trackIn),
    },
    {
      label: t("manufacturing.fabExplorer.operations.trackOut"),
      onClick: () => setDlg(DLG.trackOut),
    },
    {
      label: t("manufacturing.fabExplorer.operations.trackOutAndMoveNext"),
      onClick: () => setDlg(DLG.trackOutMoveNext),
    },
    {
      label: t("manufacturing.fabExplorer.operations.specialMoveNext"),
      onClick: () => setDlg(DLG.specialMoveNext),
    },
    { label: t("manufacturing.fabExplorer.operations.abort"), onClick: () => setDlg(DLG.abort) },
    { label: t("manufacturing.fabExplorer.operations.merge"), onClick: () => setDlg(DLG.merge) },
    {
      label: t("manufacturing.fabExplorer.operations.changeMaterialType"),
      onClick: () => setDlg(DLG.changeMaterialType),
    },
    {
      label: t("manufacturing.fabExplorer.operations.recordAssembledLossBonus"),
      onClick: () => setDlg(DLG.assembledLoss),
    },
    {
      label: t("manufacturing.fabExplorer.operations.recordSubMaterialLosses"),
      onClick: () => setDlg(DLG.subLoss),
    },
    {
      label: t("manufacturing.fabExplorer.operations.releaseMaterial"),
      onClick: () => setDlg(DLG.release),
    },
    {
      label: t("manufacturing.fabExplorer.operations.checkInEmployee"),
      onClick: () => setDlg(DLG.checkIn),
    },
    {
      label: t("manufacturing.fabExplorer.operations.checkOutEmployee"),
      onClick: () => setDlg(DLG.checkOut),
    },
  ];

  const layoutMenu: RibbonMenuItem[] = [
    {
      label: t("manufacturing.fabExplorer.layout.saveLayout"),
      onClick: () => setDlg(DLG.saveLayout),
    },
    {
      label: t("manufacturing.fabExplorer.layout.resetToMyDefault"),
      onClick: () => setDlg(DLG.resetLayout),
    },
    {
      label: t("manufacturing.fabExplorer.layout.resetToAllUsersDefault"),
      onClick: () => setDlg(DLG.resetLayout),
    },
    {
      label: t("manufacturing.fabExplorer.layout.resetToApplicationDefault"),
      onClick: () => setDlg(DLG.resetLayout),
    },
  ];

  const selectedMaterials = [...selected];

  const categoryCount = (cat: Category): string | number => {
    if (!detail) return 0;
    switch (cat) {
      case "dispatchList":
        return detail.dispatchCount;
      case "materialsAtResource":
        return detail.materialsCount;
      case "loadPorts":
        return detail.loadPortCount;
      case "subResources":
        return detail.subResourceCount;
      case "consumables":
        return detail.consumableCount;
      case "durables":
        return detail.durableCount;
      case "recipe":
        return detail.recipe;
      case "upcomingMaintenances":
        return detail.upcomingMaintenanceCount;
      case "alerts":
        return detail.alertCount;
    }
  };

  const panelSections: PanelSection[] = ALL_CATEGORIES.map((cat) => ({
    id: cat,
    label: t(L[cat]),
    count: categoryCount(cat),
  }));

  const selectCategory = (cat: Category) => {
    setCategory(cat);
    setSelected(new Set());
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={onBack}
          aria-label={t("manufacturing.fabExplorer.resourceView.back")}
        >
          <ChevronLeft20Regular />
        </button>
        <Text weight="semibold" size={400}>
          {name}
        </Text>
        {detail && (
          <Text size={300}>
            {detail.state} ({detail.systemState})
          </Text>
        )}
      </div>

      {isStorage ? (
        <ActionBar>
          <RibbonButton
            icon={<ArrowSync24Regular />}
            label={t("manufacturing.fabExplorer.operations.refresh")}
            onClick={() => gridApiRef.current?.refresh()}
          />
          <RibbonButton
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.store")}
            onClick={() => setDlg(DLG.store)}
          />
          <RibbonButton
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.retrieve")}
            onClick={() => setDlg(DLG.retrieve)}
          />
          <RibbonButton
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.performChecklist")}
            onClick={() => setDlg(DLG.checklist)}
          />
          <RibbonButton
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.more")}
            menu={moreMenu}
          />
          <div className={styles.toolbarRight}>
            <RibbonButton
              icon={<Box24Regular />}
              label={t("manufacturing.fabExplorer.layout.views")}
            />
            <RibbonButton
              icon={<Box24Regular />}
              label={t("manufacturing.fabExplorer.layout.layout")}
              menu={layoutMenu}
            />
          </div>
        </ActionBar>
      ) : (
        <ActionBar>
          <RibbonButton
            icon={<ArrowSync24Regular />}
            label={t("manufacturing.fabExplorer.operations.refresh")}
            onClick={() => gridApiRef.current?.refresh()}
          />
          <RibbonButton
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.changeResourceState")}
            onClick={() => setDlg(DLG.changeResourceState)}
          />
          <RibbonButton
            icon={<Send24Regular />}
            label={t("manufacturing.fabExplorer.operations.dispatch")}
            onClick={() => setDlg(DLG.dispatch)}
          />
          <RibbonButton
            icon={<Send24Regular />}
            label={t("manufacturing.fabExplorer.operations.dispatchAndTrackIn")}
            onClick={() => setDlg(DLG.dispatchTrackIn)}
          />
          <RibbonButton
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.moveNext")}
            onClick={() => setDlg(DLG.moveNext)}
          />
          <RibbonButton
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.split")}
            onClick={() => setDlg(DLG.split)}
          />
          <RibbonButton
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.merge")}
            onClick={() => setDlg(DLG.merge)}
          />
          <RibbonButton
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.holdMaterial")}
            onClick={() => setDlg(DLG.hold)}
          />
          <RibbonButton
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.rework")}
            onClick={() => setDlg(DLG.rework)}
          />
          <RibbonButton
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.recordLossBonus")}
            onClick={() => setDlg(DLG.lossBonus)}
          />
          <RibbonButton
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.postData")}
            onClick={() => setDlg(DLG.postData)}
          />
          <RibbonButton
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.more")}
            menu={moreMenu}
          />
          <div className={styles.toolbarRight}>
            <RibbonButton
              icon={<Box24Regular />}
              label={t("manufacturing.fabExplorer.layout.views")}
            />
            <RibbonButton
              icon={<Box24Regular />}
              label={t("manufacturing.fabExplorer.layout.layout")}
              menu={layoutMenu}
            />
          </div>
        </ActionBar>
      )}

      <div className={styles.body}>
        {!isStorage && (
          <div className={styles.left}>
            <SidePanel
              title={t("manufacturing.fabExplorer.stepView.columns.resource")}
              collapsed={false}
              onToggle={() => undefined}
            >
              <div className={styles.sectionHead}>
                <span />
                <button
                  className={styles.backBtn}
                  aria-label={t("manufacturing.fabExplorer.resourceView.panelSettings")}
                  onClick={() => setDlg(DLG.panelSettings)}
                >
                  <Settings20Regular />
                </button>
              </div>
              {visibleCategories.map((cat) => (
                <button
                  key={cat}
                  className={mergeClasses(styles.catRow, category === cat && styles.catActive)}
                  onClick={() => selectCategory(cat)}
                >
                  <Text size={300} weight={category === cat ? "semibold" : "regular"}>
                    {t(L[cat])}
                  </Text>
                  <Text size={300}>{categoryCount(cat)}</Text>
                </button>
              ))}
            </SidePanel>
          </div>
        )}

        <div className={styles.center}>
          {isStorage ? (
            <>
              <Text weight="semibold" size={400}>
                {t("manufacturing.fabExplorer.resourceView.resourceMaterials")}
              </Text>
              <div className={styles.tabs} role="tablist">
                {STORAGE_TABS.map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={storageTab === tab}
                    className={mergeClasses(styles.tab, storageTab === tab && styles.tabActive)}
                    onClick={() => setStorageTab(tab)}
                  >
                    {tab === "storable"
                      ? t("manufacturing.fabExplorer.resourceView.storable")
                      : t("manufacturing.fabExplorer.resourceView.stored")}
                  </button>
                ))}
              </div>
              <DataTableCard
                title={(count) =>
                  t("manufacturing.fabExplorer.resourceView.storageTitle", { count })
                }
                ariaLabel={t("manufacturing.fabExplorer.resourceView.storageTitle", { count: 0 })}
                columns={STORAGE_COLUMNS}
                useListQuery={useStoredMaterialsQuery}
                getRowId={(r) => r.name}
                selectable
                selectedIds={selected}
                onSelectionChange={setSelected}
                apiRef={gridApiRef}
              />
            </>
          ) : (
            <DataTableCard
              title={(count) =>
                t("manufacturing.fabExplorer.resourceView.materialsTitle", { count })
              }
              ariaLabel={t("manufacturing.fabExplorer.resourceView.materialsTitle", { count: 0 })}
              columns={MATERIAL_COLUMNS}
              filters={RESOURCE_MATERIAL_FILTERS}
              useListQuery={useGridMaterialsQuery}
              getRowId={(r) => r.name}
              selectable
              selectedIds={selected}
              onSelectionChange={setSelected}
              apiRef={gridApiRef}
            />
          )}
        </div>

        {!isStorage && (
          <div className={styles.right}>
            <div className={styles.detailCard}>
              <Text size={300} weight="semibold">
                {t("manufacturing.fabExplorer.stepView.details")}
              </Text>
              <Text size={300} weight="semibold">
                {t("manufacturing.fabExplorer.stepView.holdsOffFlows")} (0)
              </Text>
              <Text size={300} weight="semibold">
                {t("manufacturing.fabExplorer.stepView.protocols")} (0)
              </Text>
              <Text size={300} weight="semibold">
                {t("manufacturing.fabExplorer.stepView.documents")} (1)
              </Text>
              <Text size={300}>{MOCK_DOC}</Text>
            </div>
          </div>
        )}
      </div>

      <DispatchDialog
        open={dlg === DLG.dispatch}
        materials={selectedMaterials}
        resource={name}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.dispatch)}
      />
      <DispatchAndTrackInDialog
        open={dlg === DLG.dispatchTrackIn}
        materials={selectedMaterials}
        resource={name}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.dispatch_track_in)}
      />
      <UndispatchDialog
        open={dlg === DLG.undispatch}
        materials={selectedMaterials}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.undispatch)}
      />
      <TrackInDialog
        open={dlg === DLG.trackIn}
        materials={selectedMaterials}
        resource={name}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.track_in)}
      />
      <TrackOutDialog
        open={dlg === DLG.trackOut}
        materials={selectedMaterials}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.track_out)}
      />
      <TrackOutAndMoveNextDialog
        open={dlg === DLG.trackOutMoveNext}
        materials={selectedMaterials}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.track_out_move_next)}
      />
      <MoveNextDialog
        open={dlg === DLG.moveNext}
        materials={selectedMaterials}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.move_next)}
      />
      <SpecialMoveNextDialog
        open={dlg === DLG.specialMoveNext}
        materials={selectedMaterials}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.special_move_next)}
      />
      <ChangeResourceStateDialog
        open={dlg === DLG.changeResourceState}
        resource={name}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.change_resource_state)}
      />
      <SplitDialog
        open={dlg === DLG.split}
        materials={selectedMaterials}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.split)}
      />
      <MergeDialog
        open={dlg === DLG.merge}
        materials={selectedMaterials}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.merge)}
      />
      <ChangeMaterialTypeDialog
        open={dlg === DLG.changeMaterialType}
        materials={selectedMaterials}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.change_material_type)}
      />
      <ReworkDialog
        open={dlg === DLG.rework}
        materials={selectedMaterials}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.rework)}
      />
      <RecordLossBonusDialog
        open={dlg === DLG.lossBonus}
        materials={selectedMaterials}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.record_loss_bonus)}
      />
      <RecordAssembledLossBonusDialog
        open={dlg === DLG.assembledLoss}
        materials={selectedMaterials}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.record_assembled_loss_bonus)}
      />
      <RecordSubMaterialLossesDialog
        open={dlg === DLG.subLoss}
        materials={selectedMaterials}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.record_submaterial_losses)}
      />
      <HoldMaterialDialog
        open={dlg === DLG.hold}
        materials={selectedMaterials}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.hold)}
      />
      <ReleaseMaterialDialog
        open={dlg === DLG.release}
        materials={selectedMaterials}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.release)}
      />
      <AbortDialog
        open={dlg === DLG.abort}
        materials={selectedMaterials}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.abort)}
      />
      <PostDataDialog
        open={dlg === DLG.postData}
        materials={selectedMaterials}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.post_data)}
      />
      <PerformChecklistDialog
        open={dlg === DLG.checklist}
        materials={selectedMaterials}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.perform_checklist)}
      />
      <CheckInEmployeeDialog
        open={dlg === DLG.checkIn}
        resource={name}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.check_in_employee)}
      />
      <CheckOutEmployeeDialog
        open={dlg === DLG.checkOut}
        resource={name}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.check_out_employee)}
      />
      <StoreDialog
        open={dlg === DLG.store}
        materials={selectedMaterials}
        resource={name}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.store)}
      />
      <RetrieveDialog
        open={dlg === DLG.retrieve}
        materials={selectedMaterials}
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.retrieve)}
      />
      <SaveLayoutDialog open={dlg === DLG.saveLayout} onClose={closeDlg} onConfirm={closeDlg} />
      <ResetLayoutDialog open={dlg === DLG.resetLayout} onClose={closeDlg} onConfirm={closeDlg} />
      <PanelSettingsDialog
        open={dlg === DLG.panelSettings}
        sections={panelSections}
        selected={visibleCategories}
        onClose={closeDlg}
        onConfirm={(sel) => {
          setVisibleCategories(sel as Category[]);
          closeDlg();
        }}
      />
    </div>
  );
}
