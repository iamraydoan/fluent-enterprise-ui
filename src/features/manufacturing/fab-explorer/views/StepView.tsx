import { useMemo, useRef, useState } from "react";
import { postFabOperation, useStepMaterials, useStepResources, useStepSummary } from "@/api";
import type { FabResource } from "@/api";
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
  DispatchAndTrackInDialog,
  DispatchDialog,
  HoldMaterialDialog,
  MergeDialog,
  MoveNextDialog,
  PerformChecklistDialog,
  PostDataDialog,
  ReworkDialog,
  RecordAssembledLossBonusDialog,
  RecordLossBonusDialog,
  RecordSubMaterialLossesDialog,
  ReleaseMaterialDialog,
  ResetLayoutDialog,
  SaveLayoutDialog,
  SpecialMoveNextDialog,
  SplitDialog,
  TrackInDialog,
  TrackOutAndMoveNextDialog,
  TrackOutDialog,
  UndispatchDialog,
} from "../dialogs";
import { MATERIAL_COLUMNS } from "./materialColumns";

const useViewStyles = makeStyles({
  page: { display: "flex", flexDirection: "column", height: "100%", minHeight: 0 },
  header: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
    padding: "8px 16px",
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
  stateDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: theme.color.brand,
  },
  body: { display: "flex", flexGrow: 1, minHeight: 0, columnGap: "10px", padding: "10px" },
  left: { width: "220px", flexShrink: 0, display: "flex", flexDirection: "column", minHeight: 0 },
  center: { flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column", rowGap: "8px" },
  right: { width: "260px", flexShrink: 0, display: "flex", flexDirection: "column", minHeight: 0 },
  filterBar: {
    display: "flex",
    alignItems: "center",
    columnGap: "12px",
    flexWrap: "wrap",
    padding: "8px 12px",
    backgroundColor: theme.color.surface,
    border: `1px solid ${theme.color.borderSubtle}`,
    borderRadius: theme.radius.md,
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
    borderRadius: theme.radius.md,
    ":hover": { backgroundColor: theme.color.surfaceHover },
  },
  catActive: {
    backgroundColor: theme.color.surfaceSelected,
    fontWeight: theme.font.weightSemibold,
  },
  catRefresh: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "4px",
    display: "flex",
    ":hover": { backgroundColor: theme.color.surfaceTertiary },
  },
  sectionTitle: {
    fontSize: "12px",
    fontWeight: theme.font.weightSemibold,
    color: theme.color.textTertiary,
    padding: "8px 12px 4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailCard: {
    backgroundColor: theme.color.surface,
    border: `1px solid ${theme.color.borderSubtle}`,
    borderRadius: theme.radius.md,
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
  },
  toolbarRight: { marginLeft: "auto", display: "flex", columnGap: "4px" },
});

type Category = "materials" | "resources";

const L: Record<string, TranslationKey> = {
  materials: "manufacturing.fabExplorer.stepView.materials",
  resources: "manufacturing.fabExplorer.stepView.resources",
  details: "manufacturing.fabExplorer.stepView.details",
  holds: "manufacturing.fabExplorer.stepView.holdsOffFlows",
  protocols: "manufacturing.fabExplorer.stepView.protocols",
  documents: "manufacturing.fabExplorer.stepView.documents",
};

const CATEGORIES: Category[] = ["materials", "resources"];

const MOCK_HOLD = "No Salt";
const MOCK_PROTOCOL = "PDCA - Warning";
const MOCK_DOC = "Doc C images.jpg";

const RESOURCE_COLUMNS: DataColumn<FabResource>[] = [
  {
    field: "name",
    headerName: "manufacturing.fabExplorer.stepView.columns.resource",
    cellRenderer: (r) => <Text size={300}>{r.name}</Text>,
  },
  {
    field: "description",
    headerName: "manufacturing.fabExplorer.stepView.columns.description",
  },
  {
    field: "processingType",
    headerName: "manufacturing.fabExplorer.stepView.columns.processingType",
  },
  {
    field: "group",
    headerName: "manufacturing.fabExplorer.stepView.columns.group",
  },
  {
    field: "systemState",
    headerName: "manufacturing.fabExplorer.stepView.columns.systemState",
  },
  {
    field: "state",
    headerName: "manufacturing.fabExplorer.stepView.columns.state",
  },
];

const MATERIAL_FILTERS: DataFilter[] = [
  {
    type: "select",
    param: "state",
    labelKey: "manufacturing.fabExplorer.stepView.filters.state",
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
  rework: "rework",
  special_move_next: "special-move-next",
  split: "split",
  track_in: "track-in",
  track_out: "track-out",
  track_out_move_next: "track-out-move-next",
  undispatch: "undispatch",
} as const;

const DLG = {
  abort: "abort",
  assembledLoss: "assembledLoss",
  changeMaterialType: "changeMaterialType",
  changeResourceState: "changeResourceState",
  checklist: "checklist",
  dispatch: "dispatch",
  dispatchTrackIn: "dispatchTrackIn",
  hold: "hold",
  lossBonus: "lossBonus",
  merge: "merge",
  moveNext: "moveNext",
  postData: "postData",
  release: "release",
  resetLayout: "resetLayout",
  rework: "rework",
  saveLayout: "saveLayout",
  specialMoveNext: "specialMoveNext",
  split: "split",
  subLoss: "subLoss",
  trackIn: "trackIn",
  trackOut: "trackOut",
  trackOutMoveNext: "trackOutMoveNext",
  undispatch: "undispatch",
} as const;

export function StepView({ name, onBack }: { name: string; onBack: () => void }) {
  const { t } = useAppTranslation();
  const styles = useViewStyles();
  const [category, setCategory] = useState<Category>("materials");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [dlg, setDlg] = useState<string | null>(null);
  const closeDlg = () => setDlg(null);
  const confirmOp = async (operation: string) => {
    await postFabOperation(operation, { materials: [...selected] });
    closeDlg();
    setSelected(new Set());
  };

  const { data: summary } = useStepSummary(name);
  const materialsApiRef = useRef<DataTableCardApi | null>(null);
  const resourcesApiRef = useRef<DataTableCardApi | null>(null);

  const useMaterialsQuery = useMemo(
    () =>
      function useMaterialsQuery(params: ListQueryParams) {
        return useStepMaterials(name, params);
      },
    [name],
  );
  const useResourcesQuery = useMemo(
    () =>
      function useResourcesQuery(params: ListQueryParams) {
        return useStepResources(name, params);
      },
    [name],
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
      label: t("manufacturing.fabExplorer.operations.moveNext"),
      onClick: () => setDlg(DLG.moveNext),
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
  const refreshCategory = (cat: Category) => {
    if (cat === "materials") materialsApiRef.current?.refresh();
    else resourcesApiRef.current?.refresh();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={onBack}
          aria-label={t("manufacturing.fabExplorer.stepView.back")}
        >
          <ChevronLeft20Regular />
        </button>
        <span className={styles.stateDot} />
        <Text weight="semibold" size={400}>
          {name}
        </Text>
      </div>

      <ActionBar>
        <RibbonButton
          icon={<ArrowSync24Regular />}
          label={t("manufacturing.fabExplorer.operations.refresh")}
          onClick={() => refreshCategory(category)}
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
          label={t("manufacturing.fabExplorer.operations.changeMaterialState")}
          onClick={() => setDlg(DLG.changeResourceState)}
        />
        <RibbonButton
          icon={<Box24Regular />}
          label={t("manufacturing.fabExplorer.operations.split")}
          onClick={() => setDlg(DLG.split)}
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

      <div className={styles.body}>
        <div className={styles.left}>
          <SidePanel
            title={t("manufacturing.fabExplorer.stepView.details")}
            collapsed={false}
            onToggle={() => undefined}
          >
            {CATEGORIES.map((cat) => (
              <div
                key={cat}
                className={mergeClasses(styles.catRow, category === cat && styles.catActive)}
                onClick={() => {
                  setCategory(cat);
                  setSelected(new Set());
                }}
              >
                <Text size={300} weight={category === cat ? "semibold" : "regular"}>
                  {t(L[cat])} (
                  {cat === "materials"
                    ? (summary?.materialCount ?? 0)
                    : (summary?.resourceCount ?? 0)}
                  )
                </Text>
                <button
                  className={styles.catRefresh}
                  aria-label={t("manufacturing.fabExplorer.stepView.refreshCategory", {
                    category: t(L[cat]),
                  })}
                  onClick={(e) => {
                    e.stopPropagation();
                    refreshCategory(cat);
                  }}
                >
                  <ArrowSync24Regular />
                </button>
              </div>
            ))}
          </SidePanel>
        </div>

        <div className={styles.center}>
          {category === "materials" ? (
            <DataTableCard
              title={(count) => t("manufacturing.fabExplorer.stepView.materialsTitle", { count })}
              ariaLabel={t("manufacturing.fabExplorer.stepView.materialsTitle", { count: 0 })}
              columns={MATERIAL_COLUMNS}
              filters={MATERIAL_FILTERS}
              useListQuery={useMaterialsQuery}
              getRowId={(r) => r.name}
              selectable
              selectedIds={selected}
              onSelectionChange={setSelected}
              apiRef={materialsApiRef}
            />
          ) : (
            <DataTableCard
              title={(count) => t("manufacturing.fabExplorer.stepView.resourcesTitle", { count })}
              ariaLabel={t("manufacturing.fabExplorer.stepView.resourcesTitle", { count: 0 })}
              columns={RESOURCE_COLUMNS}
              useListQuery={useResourcesQuery}
              getRowId={(r) => r.name}
              selectable
              selectedIds={selected}
              onSelectionChange={setSelected}
              apiRef={resourcesApiRef}
            />
          )}
        </div>

        <div className={styles.right}>
          <div className={styles.detailCard}>
            <div className={styles.sectionTitle}>
              <span>{t(L.details)}</span>
            </div>
            <Text size={300} weight="semibold">
              {t(L.holds)} (1)
            </Text>
            <Text size={300}>{MOCK_HOLD}</Text>
            <Text size={300} weight="semibold">
              {t(L.protocols)} (1)
            </Text>
            <Text size={300}>{MOCK_PROTOCOL}</Text>
            <Text size={300} weight="semibold">
              {t(L.documents)} (1)
            </Text>
            <Text size={300}>{MOCK_DOC}</Text>
          </div>
        </div>
      </div>

      <DispatchDialog
        open={dlg === DLG.dispatch}
        materials={selectedMaterials}
        resource=""
        onClose={closeDlg}
        onConfirm={() => confirmOp(OP.dispatch)}
      />
      <DispatchAndTrackInDialog
        open={dlg === DLG.dispatchTrackIn}
        materials={selectedMaterials}
        resource=""
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
        resource=""
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
        resource=""
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
      <SaveLayoutDialog open={dlg === DLG.saveLayout} onClose={closeDlg} onConfirm={closeDlg} />
      <ResetLayoutDialog open={dlg === DLG.resetLayout} onClose={closeDlg} onConfirm={closeDlg} />
    </div>
  );
}
