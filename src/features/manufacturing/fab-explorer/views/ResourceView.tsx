import { useMemo, useState } from "react";
import type { FabMaterial } from "@/api";
import {
  postFabOperation,
  useDispatchList,
  useFabResourceDetail,
  useResourceMaterials,
} from "@/api";
import { ActionBar, RibbonButton, SidePanel } from "@/components/common";
import type { RibbonMenuItem } from "@/components/common";
import {
  ArrowSync24Regular,
  Box24Regular,
  ChevronLeft20Regular,
  Send24Regular,
  Settings20Regular,
} from "@/components/icons";
import { Input, Text, makeStyles, mergeClasses, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { FabGrid } from "../components/FabGrid";
import type { FabGridColumn } from "../components/FabGrid";
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

const useViewStyles = makeStyles({
  page: { display: "flex", flexDirection: "column", height: "100%", minHeight: 0 },
  header: {
    display: "flex",
    alignItems: "center",
    columnGap: "12px",
    padding: "8px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  backBtn: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: "6px",
    borderRadius: tokens.borderRadiusMedium,
    display: "flex",
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  body: { display: "flex", flexGrow: 1, minHeight: 0, columnGap: "10px", padding: "10px" },
  left: { width: "230px", flexShrink: 0, display: "flex", flexDirection: "column", minHeight: 0 },
  center: { flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column", rowGap: "8px" },
  right: { width: "260px", flexShrink: 0, display: "flex", flexDirection: "column", minHeight: 0 },
  filterBar: {
    display: "flex",
    alignItems: "center",
    columnGap: "12px",
    flexWrap: "wrap",
    padding: "8px 12px",
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  filterLabel: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightSemibold,
  },
  catRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "8px 12px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "13px",
    borderRadius: tokens.borderRadiusMedium,
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  catActive: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    fontWeight: tokens.fontWeightSemibold,
  },
  sectionHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 4px",
  },
  detailCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
  },
  toolbarRight: { marginLeft: "auto", display: "flex", columnGap: "4px" },
  tabs: { display: "flex", columnGap: "4px", padding: "0 4px" },
  tab: {
    padding: "8px 16px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "13px",
    textTransform: "uppercase",
    borderBottom: "2px solid transparent",
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  tabActive: {
    fontWeight: tokens.fontWeightSemibold,
    borderBottom: `2px solid ${tokens.colorBrandStroke1}`,
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

const MATERIAL_STATES = ["Queued", "In Process"];

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
  const sharedStyles = useSharedStyles();
  const [category, setCategory] = useState<Category>("materialsAtResource");
  const [visibleCategories, setVisibleCategories] = useState<Category[]>(ALL_CATEGORIES);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");
  const [stateFilter, setStateFilter] = useState("");
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

  const materialFilters: Record<string, string> = {};
  if (q) materialFilters.q = q;
  if (stateFilter) materialFilters.state = stateFilter;
  const materialsQuery = useResourceMaterials(name, { page, limit: 25, filters: materialFilters });
  const dispatchFilters: Record<string, string> = {};
  if (q) dispatchFilters.q = q;
  const dispatchQuery = useDispatchList(name, { page, limit: 25, filters: dispatchFilters });

  const isDispatch = category === "dispatchList";
  const activeQuery = isDispatch ? dispatchQuery : materialsQuery;
  const rows = activeQuery.data?.data ?? [];
  const total = activeQuery.data?.meta.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 25));

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const toggleAll = () =>
    setSelected((prev) => {
      if (rows.every((m: FabMaterial) => prev.has(m.name))) return new Set<string>();
      return new Set(rows.map((m: FabMaterial) => m.name));
    });

  const materialColumns: FabGridColumn<FabMaterial>[] = useMemo(
    () => [
      {
        key: "material",
        headerKey: t("manufacturing.fabExplorer.stepView.columns.material"),
        render: (r: FabMaterial) => (
          <Text size={300}>
            {r.name}
            {r.subMaterialCount > 0 && (
              <span style={{ color: tokens.colorBrandForeground1, fontWeight: 600, marginLeft: 8 }}>
                ({r.subMaterialCount})
              </span>
            )}
          </Text>
        ),
      },
      {
        key: "qty",
        headerKey: t("manufacturing.fabExplorer.stepView.columns.qty"),
        render: (r: FabMaterial) => r.qty.toLocaleString(),
      },
      {
        key: "units",
        headerKey: t("manufacturing.fabExplorer.stepView.columns.units"),
        render: (r: FabMaterial) => r.units,
      },
      {
        key: "product",
        headerKey: t("manufacturing.fabExplorer.stepView.columns.product"),
        render: (r: FabMaterial) => r.product,
      },
      {
        key: "flow",
        headerKey: t("manufacturing.fabExplorer.stepView.columns.flow"),
        render: (r: FabMaterial) => r.flow,
      },
      {
        key: "step",
        headerKey: t("manufacturing.fabExplorer.stepView.columns.step"),
        render: (r: FabMaterial) => r.step,
      },
      {
        key: "priority",
        headerKey: t("manufacturing.fabExplorer.stepView.columns.priority"),
        render: (r: FabMaterial) => r.priority,
      },
      {
        key: "state",
        headerKey: t("manufacturing.fabExplorer.stepView.columns.state"),
        render: (r: FabMaterial) => r.state,
      },
      {
        key: "inOffFlow",
        headerKey: t("manufacturing.fabExplorer.stepView.columns.inOffFlow"),
        render: (r: FabMaterial) => (r.inOffFlow ? "✓" : "✗"),
      },
    ],
    [t],
  );

  const storageColumns: FabGridColumn<FabMaterial>[] = useMemo(
    () => [
      {
        key: "storagePosition",
        headerKey: t("manufacturing.fabExplorer.stepView.columns.storagePosition"),
        render: () => "",
      },
      {
        key: "material",
        headerKey: t("manufacturing.fabExplorer.stepView.columns.material"),
        render: (r: FabMaterial) => <Text size={300}>{r.name}</Text>,
      },
      {
        key: "state",
        headerKey: t("manufacturing.fabExplorer.stepView.columns.state"),
        render: (r: FabMaterial) => r.state,
      },
      {
        key: "product",
        headerKey: t("manufacturing.fabExplorer.stepView.columns.product"),
        render: (r: FabMaterial) => r.product,
      },
      {
        key: "step",
        headerKey: t("manufacturing.fabExplorer.stepView.columns.step"),
        render: (r: FabMaterial) => r.step,
      },
      {
        key: "qty",
        headerKey: t("manufacturing.fabExplorer.stepView.columns.qty"),
        render: (r: FabMaterial) => r.qty.toLocaleString(),
      },
      {
        key: "flow",
        headerKey: t("manufacturing.fabExplorer.stepView.columns.flow"),
        render: (r: FabMaterial) => r.flow,
      },
      {
        key: "container",
        headerKey: t("manufacturing.fabExplorer.stepView.columns.container"),
        render: () => "",
      },
    ],
    [t],
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
    setPage(1);
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
            sharedStyles={sharedStyles}
            icon={<ArrowSync24Regular />}
            label={t("manufacturing.fabExplorer.operations.refresh")}
            onClick={() => materialsQuery.refetch()}
          />
          <RibbonButton
            sharedStyles={sharedStyles}
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.store")}
            onClick={() => setDlg(DLG.store)}
          />
          <RibbonButton
            sharedStyles={sharedStyles}
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.retrieve")}
            onClick={() => setDlg(DLG.retrieve)}
          />
          <RibbonButton
            sharedStyles={sharedStyles}
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.performChecklist")}
            onClick={() => setDlg(DLG.checklist)}
          />
          <RibbonButton
            sharedStyles={sharedStyles}
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.more")}
            menu={moreMenu}
          />
          <div className={styles.toolbarRight}>
            <RibbonButton
              sharedStyles={sharedStyles}
              icon={<Box24Regular />}
              label={t("manufacturing.fabExplorer.layout.views")}
            />
            <RibbonButton
              sharedStyles={sharedStyles}
              icon={<Box24Regular />}
              label={t("manufacturing.fabExplorer.layout.layout")}
              menu={layoutMenu}
            />
          </div>
        </ActionBar>
      ) : (
        <ActionBar>
          <RibbonButton
            sharedStyles={sharedStyles}
            icon={<ArrowSync24Regular />}
            label={t("manufacturing.fabExplorer.operations.refresh")}
            onClick={() => activeQuery.refetch()}
          />
          <RibbonButton
            sharedStyles={sharedStyles}
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.changeResourceState")}
            onClick={() => setDlg(DLG.changeResourceState)}
          />
          <RibbonButton
            sharedStyles={sharedStyles}
            icon={<Send24Regular />}
            label={t("manufacturing.fabExplorer.operations.dispatch")}
            onClick={() => setDlg(DLG.dispatch)}
          />
          <RibbonButton
            sharedStyles={sharedStyles}
            icon={<Send24Regular />}
            label={t("manufacturing.fabExplorer.operations.dispatchAndTrackIn")}
            onClick={() => setDlg(DLG.dispatchTrackIn)}
          />
          <RibbonButton
            sharedStyles={sharedStyles}
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.moveNext")}
            onClick={() => setDlg(DLG.moveNext)}
          />
          <RibbonButton
            sharedStyles={sharedStyles}
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.split")}
            onClick={() => setDlg(DLG.split)}
          />
          <RibbonButton
            sharedStyles={sharedStyles}
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.merge")}
            onClick={() => setDlg(DLG.merge)}
          />
          <RibbonButton
            sharedStyles={sharedStyles}
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.holdMaterial")}
            onClick={() => setDlg(DLG.hold)}
          />
          <RibbonButton
            sharedStyles={sharedStyles}
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.rework")}
            onClick={() => setDlg(DLG.rework)}
          />
          <RibbonButton
            sharedStyles={sharedStyles}
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.recordLossBonus")}
            onClick={() => setDlg(DLG.lossBonus)}
          />
          <RibbonButton
            sharedStyles={sharedStyles}
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.postData")}
            onClick={() => setDlg(DLG.postData)}
          />
          <RibbonButton
            sharedStyles={sharedStyles}
            icon={<Box24Regular />}
            label={t("manufacturing.fabExplorer.operations.more")}
            menu={moreMenu}
          />
          <div className={styles.toolbarRight}>
            <RibbonButton
              sharedStyles={sharedStyles}
              icon={<Box24Regular />}
              label={t("manufacturing.fabExplorer.layout.views")}
            />
            <RibbonButton
              sharedStyles={sharedStyles}
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
              <FabGrid
                columns={storageColumns}
                rows={storageTab === "stored" ? rows : []}
                selectedIds={selected}
                onToggle={toggle}
                onToggleAll={toggleAll}
                getRowId={(r) => r.name}
                selectedLabel={t("manufacturing.fabExplorer.resourceView.itemsSelected", {
                  count: selected.size,
                })}
                page={page}
                totalPages={totalPages}
                total={storageTab === "stored" ? total : 0}
                onPageChange={setPage}
                t={t}
              />
            </>
          ) : (
            <>
              <div className={styles.filterBar}>
                <span className={styles.filterLabel}>
                  {t("manufacturing.fabExplorer.resourceView.filters.state")}:
                </span>
                <select
                  value={stateFilter}
                  onChange={(e) => {
                    setStateFilter(e.target.value);
                    setPage(1);
                  }}
                  style={{ padding: "4px 8px" }}
                >
                  <option value="">
                    {t("manufacturing.fabExplorer.resourceView.filters.all")}
                  </option>
                  <option value={MATERIAL_STATES[0]}>{MATERIAL_STATES[0]}</option>
                  <option value={MATERIAL_STATES[1]}>{MATERIAL_STATES[1]}</option>
                </select>
                <Input
                  placeholder={t("manufacturing.fabExplorer.resourceView.search")}
                  value={q}
                  onChange={(_, d) => {
                    setQ(d.value);
                    setPage(1);
                  }}
                  style={{ width: "200px", marginLeft: "auto" }}
                />
              </div>
              <FabGrid
                columns={materialColumns}
                rows={rows}
                selectedIds={selected}
                onToggle={toggle}
                onToggleAll={toggleAll}
                getRowId={(r) => r.name}
                selectedLabel={t("manufacturing.fabExplorer.resourceView.itemsSelected", {
                  count: selected.size,
                })}
                page={page}
                totalPages={totalPages}
                total={total}
                onPageChange={setPage}
                t={t}
              />
            </>
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
