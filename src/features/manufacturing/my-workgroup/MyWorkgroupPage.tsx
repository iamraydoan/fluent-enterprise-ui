import { useState } from "react";
import { useMyWorkgroupResources, useMyWorkgroupSteps, useMyWorkgroups } from "@/api";
import type { WorkgroupResourceTile, WorkgroupStepTile } from "@/api";
import { ListPage } from "@/components/common";
import {
  ArrowExportUp24Regular,
  ArrowSync24Regular,
  Box24Regular,
  Checkmark20Filled,
  ChevronDown16Regular,
  ChevronLeft20Regular,
  PanelLeftExpand20Regular,
  Search20Regular,
  Settings20Regular,
} from "@/components/icons";
import {
  Button,
  Input,
  Menu,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Text,
  makeStyles,
  mergeClasses,
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { PanelSettingsDialog } from "./dialogs";

const usePageStyles = makeStyles({
  body: { display: "flex", columnGap: "10px", flexGrow: 1, minHeight: 0 },
  side: { display: "flex", flexDirection: "column", minHeight: 0 },
  main: { flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column", rowGap: "12px" },
  panel: { width: "300px", flexShrink: 0, display: "flex", flexDirection: "column" },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 8px 8px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  workgroupButton: {
    display: "flex",
    alignItems: "center",
    columnGap: "4px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "15px",
    fontWeight: tokens.fontWeightSemibold,
    padding: "4px 6px",
    borderRadius: tokens.borderRadiusMedium,
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  headerActions: { display: "flex", alignItems: "center", columnGap: "2px" },
  navList: { display: "flex", flexDirection: "column", padding: "6px", rowGap: "2px" },
  navItem: {
    display: "flex",
    alignItems: "center",
    columnGap: "10px",
    width: "100%",
    padding: "10px 12px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    fontSize: "14px",
    borderRadius: tokens.borderRadiusMedium,
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  navItemActive: { backgroundColor: tokens.colorNeutralBackground1Selected },
  navCount: { marginLeft: "auto", fontWeight: tokens.fontWeightSemibold },
  stepDot: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    backgroundColor: tokens.colorBrandBackground,
    flexShrink: 0,
  },
  filterBar: {
    display: "flex",
    alignItems: "center",
    columnGap: "16px",
    flexWrap: "wrap",
    rowGap: "8px",
    padding: "4px 2px",
  },
  filterGroup: { display: "flex", alignItems: "center", columnGap: "8px" },
  filterLabel: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground3,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
  },
  dropdownButton: {
    display: "flex",
    alignItems: "center",
    columnGap: "4px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    fontWeight: tokens.fontWeightSemibold,
    padding: "4px 6px",
    borderRadius: tokens.borderRadiusMedium,
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  facilityWrap: { display: "flex", alignItems: "stretch" },
  tileGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "12px",
    alignContent: "start",
    overflowY: "auto",
    paddingBottom: "12px",
  },
  tile: {
    position: "relative",
    padding: "12px 14px 12px 18px",
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
    minHeight: "110px",
    cursor: "pointer",
    overflow: "hidden",
  },
  tileAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "5px",
  },
  tileTitle: { fontSize: "14px", fontWeight: tokens.fontWeightSemibold },
  tileSubtitle: { fontSize: "12px", color: tokens.colorNeutralForeground3 },
  tileBottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingTop: "8px",
  },
  tileCounts: { display: "flex", alignItems: "center", columnGap: "14px" },
  tileCount: { display: "flex", alignItems: "center", columnGap: "4px", fontSize: "13px" },
  empty: {
    padding: "48px",
    textAlign: "center",
    color: tokens.colorNeutralForeground3,
    fontSize: "14px",
  },
});

type Panel = "resources" | "steps";

const RESOURCE_TYPE_OPTIONS = ["Standard"];
const RESOURCE_SYSTEM_STATE_OPTIONS = ["Up", "Down"];
const RESOURCE_STATE_OPTIONS = ["Dispatched", "InProcess", "Processed"];
const STEP_PROCESSING_TYPE_OPTIONS = ["FrontEnd"];
const STEP_TYPE_OPTIONS = ["Standard"];

const L = {
  pageLabel: "myWorkgroup.pageLabel",
  resources: "myWorkgroup.resources",
  steps: "myWorkgroup.steps",
  type: "myWorkgroup.filters.type",
  systemState: "myWorkgroup.filters.systemState",
  facility: "myWorkgroup.filters.facility",
  state: "myWorkgroup.filters.state",
  processingType: "myWorkgroup.filters.processingType",
  all: "myWorkgroup.filters.all",
  facilityPlaceholder: "myWorkgroup.filters.facilityPlaceholder",
  resourceNamePlaceholder: "myWorkgroup.filters.resourceNamePlaceholder",
  stepNamePlaceholder: "myWorkgroup.filters.stepNamePlaceholder",
} as const;

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = usePageStyles();
  return (
    <span className={styles.filterGroup}>
      <span className={styles.filterLabel}>{label}:</span>
      <Menu
        checkedValues={{ filter: [value] }}
        onCheckedValueChange={(_, d) => {
          const next = d.checkedItems[0];
          if (next !== undefined) onChange(next);
        }}
      >
        <MenuTrigger disableButtonEnhancement>
          <button className={styles.dropdownButton}>
            {value === "" ? t(L.all).toUpperCase() : value.toUpperCase()}
            <ChevronDown16Regular />
          </button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItemRadio name="filter" value="">
              {t(L.all)}
            </MenuItemRadio>
            {options.map((option) => (
              <MenuItemRadio key={option} name="filter" value={option}>
                {option}
              </MenuItemRadio>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
    </span>
  );
}

function ResourceTile({ tile, onOpen }: { tile: WorkgroupResourceTile; onOpen: () => void }) {
  const { t } = useAppTranslation();
  const styles = usePageStyles();
  const sharedStyles = useSharedStyles();
  const isUp = tile.systemState === "Up";
  return (
    <div
      className={mergeClasses(sharedStyles.contentCard, styles.tile)}
      style={{
        backgroundColor: isUp ? "#EAF3FB" : "#FDECEC",
      }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
      }}
      aria-label={`${tile.name} (${tile.facility})`}
    >
      <div
        className={styles.tileAccent}
        style={{ backgroundColor: isUp ? "#4CAF6D" : "#D83B3B" }}
      />
      <div>
        <div className={styles.tileTitle}>
          {tile.name}({tile.facility})
        </div>
        <div className={styles.tileSubtitle}>{tile.type}</div>
      </div>
      <div className={styles.tileBottom}>
        <span style={{ color: tokens.colorBrandForeground1 }}>
          <Box24Regular />
        </span>
        <span className={styles.tileCounts}>
          <span className={styles.tileCount} title={t("myWorkgroup.tiles.dispatched")}>
            {tile.dispatched} <ArrowExportUp24Regular />
          </span>
          <span className={styles.tileCount} title={t("myWorkgroup.tiles.inProcess")}>
            {tile.inProcess} <ArrowSync24Regular />
          </span>
          <span className={styles.tileCount} title={t("myWorkgroup.tiles.processed")}>
            {tile.processed} <Checkmark20Filled />
          </span>
        </span>
      </div>
    </div>
  );
}

function StepTile({ tile, onOpen }: { tile: WorkgroupStepTile; onOpen: () => void }) {
  const { t } = useAppTranslation();
  const styles = usePageStyles();
  const sharedStyles = useSharedStyles();
  return (
    <div
      className={mergeClasses(sharedStyles.contentCard, styles.tile)}
      style={{ backgroundColor: "#EAF3FB" }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
      }}
      aria-label={`${tile.name} (${tile.facility})`}
    >
      <div>
        <div className={styles.tileTitle}>
          {tile.name}({tile.facility})
        </div>
        <div className={styles.tileSubtitle}>{tile.processingType}</div>
      </div>
      <div className={styles.tileBottom}>
        <span className={styles.stepDot} />
        <span className={styles.tileCounts}>
          <span className={styles.tileCount} title={t("myWorkgroup.tiles.materials")}>
            {tile.materials} <Box24Regular />
          </span>
          <span className={styles.tileCount} title={t("myWorkgroup.tiles.resources")}>
            {tile.resources} <Box24Regular />
          </span>
        </span>
      </div>
    </div>
  );
}

export function MyWorkgroupPage() {
  const { t } = useAppTranslation();
  const styles = usePageStyles();
  const sharedStyles = useSharedStyles();
  const [panel, setPanel] = useState<Panel>("resources");
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [workgroup, setWorkgroup] = useState("W1");
  const [visiblePanels, setVisiblePanels] = useState<Panel[]>(["resources", "steps"]);

  const [resourceType, setResourceType] = useState("");
  const [resourceSystemState, setResourceSystemState] = useState("");
  const [resourceFacility, setResourceFacility] = useState("");
  const [resourceState, setResourceState] = useState("");
  const [resourceName, setResourceName] = useState("");

  const [stepProcessingType, setStepProcessingType] = useState("");
  const [stepType, setStepType] = useState("");
  const [stepFacility, setStepFacility] = useState("");
  const [stepName, setStepName] = useState("");

  const { data: workgroups = [] } = useMyWorkgroups();
  const { data: resources = [], isLoading: resourcesLoading } = useMyWorkgroupResources({
    workgroup,
    type: resourceType || undefined,
    systemState: resourceSystemState || undefined,
    facility: resourceFacility || undefined,
    state: resourceState || undefined,
    q: resourceName || undefined,
  });
  const { data: steps = [], isLoading: stepsLoading } = useMyWorkgroupSteps({
    workgroup,
    processingType: stepProcessingType || undefined,
    type: stepType || undefined,
    facility: stepFacility || undefined,
    q: stepName || undefined,
  });

  const openResourceView = (_name: string): void => undefined;

  const openStepView = (_name: string): void => undefined;

  return (
    <ListPage
      header={{
        icon: <Box24Regular />,
        title: t(L.pageLabel),
        actions: [],
      }}
    >
      <div className={styles.body}>
        <div className={styles.side}>
          {collapsed ? (
            <Button
              appearance="subtle"
              icon={<PanelLeftExpand20Regular />}
              aria-label={t("common.expandPanel")}
              onClick={() => setCollapsed(false)}
            />
          ) : (
            <div className={mergeClasses(sharedStyles.contentCard, styles.panel)}>
              <div className={styles.panelHeader}>
                <Menu
                  checkedValues={{ workgroup: [workgroup] }}
                  onCheckedValueChange={(_, d) => {
                    const next = d.checkedItems[0];
                    if (next !== undefined) setWorkgroup(next);
                  }}
                >
                  <MenuTrigger disableButtonEnhancement>
                    <button
                      className={styles.workgroupButton}
                      aria-label={t("myWorkgroup.workgroup")}
                    >
                      {workgroup}
                      <ChevronDown16Regular />
                    </button>
                  </MenuTrigger>
                  <MenuPopover>
                    <MenuList>
                      {workgroups.map((wg) => (
                        <MenuItemRadio key={wg.name} name="workgroup" value={wg.name}>
                          {wg.name}
                        </MenuItemRadio>
                      ))}
                    </MenuList>
                  </MenuPopover>
                </Menu>
                <span className={styles.headerActions}>
                  <Button
                    appearance="subtle"
                    icon={<Settings20Regular />}
                    aria-label={t("myWorkgroup.settings")}
                    onClick={() => setSettingsOpen(true)}
                  />
                  <Button
                    appearance="subtle"
                    icon={<ChevronLeft20Regular />}
                    aria-label={t("common.collapsePanel")}
                    onClick={() => setCollapsed(true)}
                  />
                </span>
              </div>
              <div className={styles.navList}>
                {visiblePanels.includes("resources") && (
                  <button
                    className={mergeClasses(
                      styles.navItem,
                      panel === "resources" && styles.navItemActive,
                    )}
                    onClick={() => setPanel("resources")}
                    aria-current={panel === "resources" ? "page" : undefined}
                  >
                    <span style={{ color: tokens.colorBrandForeground1 }}>
                      <Box24Regular />
                    </span>
                    <Text weight={panel === "resources" ? "semibold" : "regular"}>
                      {t(L.resources)}
                    </Text>
                    <span className={styles.navCount}>{resources.length}</span>
                  </button>
                )}
                {visiblePanels.includes("steps") && (
                  <button
                    className={mergeClasses(
                      styles.navItem,
                      panel === "steps" && styles.navItemActive,
                    )}
                    onClick={() => setPanel("steps")}
                    aria-current={panel === "steps" ? "page" : undefined}
                  >
                    <span className={styles.stepDot} />
                    <Text weight={panel === "steps" ? "semibold" : "regular"}>{t(L.steps)}</Text>
                    <span className={styles.navCount}>{steps.length}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        <div className={styles.main}>
          {panel === "resources" && visiblePanels.includes("resources") && (
            <>
              <div className={styles.filterBar}>
                <FilterDropdown
                  label={t(L.type)}
                  value={resourceType}
                  options={RESOURCE_TYPE_OPTIONS}
                  onChange={setResourceType}
                />
                <FilterDropdown
                  label={t(L.systemState)}
                  value={resourceSystemState}
                  options={RESOURCE_SYSTEM_STATE_OPTIONS}
                  onChange={setResourceSystemState}
                />
                <span className={styles.filterGroup}>
                  <span className={styles.filterLabel}>{t(L.facility)}:</span>
                  <span className={styles.facilityWrap}>
                    <Input
                      value={resourceFacility}
                      onChange={(_, data) => setResourceFacility(data.value)}
                      placeholder={t(L.facilityPlaceholder)}
                      style={{ width: "140px" }}
                    />
                    <Button
                      appearance="subtle"
                      icon={<Search20Regular />}
                      aria-label={t(L.facility)}
                    />
                  </span>
                </span>
                <FilterDropdown
                  label={t(L.state)}
                  value={resourceState}
                  options={RESOURCE_STATE_OPTIONS}
                  onChange={setResourceState}
                />
                <Input
                  value={resourceName}
                  onChange={(_, data) => setResourceName(data.value)}
                  placeholder={t(L.resourceNamePlaceholder)}
                  contentBefore={<Search20Regular />}
                  style={{ width: "220px" }}
                />
              </div>
              {resourcesLoading ? (
                <div className={styles.empty}>{t("myWorkgroup.loading")}</div>
              ) : resources.length === 0 ? (
                <div className={styles.empty}>{t("myWorkgroup.noResources")}</div>
              ) : (
                <div className={styles.tileGrid}>
                  {resources.map((tile) => (
                    <ResourceTile
                      key={tile.name}
                      tile={tile}
                      onOpen={() => openResourceView(tile.name)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
          {panel === "steps" && visiblePanels.includes("steps") && (
            <>
              <div className={styles.filterBar}>
                <FilterDropdown
                  label={t(L.processingType)}
                  value={stepProcessingType}
                  options={STEP_PROCESSING_TYPE_OPTIONS}
                  onChange={setStepProcessingType}
                />
                <FilterDropdown
                  label={t(L.type)}
                  value={stepType}
                  options={STEP_TYPE_OPTIONS}
                  onChange={setStepType}
                />
                <span className={styles.filterGroup}>
                  <span className={styles.filterLabel}>{t(L.facility)}:</span>
                  <span className={styles.facilityWrap}>
                    <Input
                      value={stepFacility}
                      onChange={(_, data) => setStepFacility(data.value)}
                      placeholder={t(L.facilityPlaceholder)}
                      style={{ width: "140px" }}
                    />
                    <Button
                      appearance="subtle"
                      icon={<Search20Regular />}
                      aria-label={t(L.facility)}
                    />
                  </span>
                </span>
                <Input
                  value={stepName}
                  onChange={(_, data) => setStepName(data.value)}
                  placeholder={t(L.stepNamePlaceholder)}
                  contentBefore={<Search20Regular />}
                  style={{ width: "220px" }}
                />
              </div>
              {stepsLoading ? (
                <div className={styles.empty}>{t("myWorkgroup.loading")}</div>
              ) : steps.length === 0 ? (
                <div className={styles.empty}>{t("myWorkgroup.noSteps")}</div>
              ) : (
                <div className={styles.tileGrid}>
                  {steps.map((tile) => (
                    <StepTile key={tile.name} tile={tile} onOpen={() => openStepView(tile.name)} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <PanelSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        visiblePanels={visiblePanels}
        onApply={setVisiblePanels}
      />
    </ListPage>
  );
}
