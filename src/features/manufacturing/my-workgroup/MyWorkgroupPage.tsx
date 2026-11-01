import { useState } from "react";
import { useMyWorkgroupResources, useMyWorkgroupSteps, useMyWorkgroups } from "@/api";
import type { WorkgroupResourceTile, WorkgroupStepTile } from "@/api";
import {
  Dot,
  Empty,
  EntityTile,
  FilterBar,
  FilterGroup,
  HStack,
  IconButton,
  ListPage,
  MenuTriggerButton,
  SidebarNavItem,
  Split,
  TileGrid,
  VStack,
} from "@/components/common";
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
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";
import { PanelSettingsDialog } from "./dialogs";

type Panel = "resources" | "steps";

const RESOURCES_PANEL: Panel = "resources";
const STEPS_PANEL: Panel = "steps";

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
  return (
    <FilterGroup label={label}>
      <Menu
        checkedValues={{ filter: [value] }}
        onCheckedValueChange={(checkedItems) => {
          const next = checkedItems[0];
          if (next !== undefined) onChange(next);
        }}
      >
        <MenuTrigger disableButtonEnhancement>
          <MenuTriggerButton ariaLabel={label}>
            {value === "" ? t(L.all).toUpperCase() : value.toUpperCase()}
            <ChevronDown16Regular />
          </MenuTriggerButton>
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
    </FilterGroup>
  );
}

function TileCount({ value, title, icon }: { value: number; title: string; icon: React.ReactNode }) {
  return (
    <HStack gap="xs" align="center" title={title}>
      <Text size={300}>{value}</Text>
      {icon}
    </HStack>
  );
}

function ResourceTile({ tile, onOpen }: { tile: WorkgroupResourceTile; onOpen: () => void }) {
  const { t } = useAppTranslation();
  return (
    <EntityTile
      title={`${tile.name}(${tile.facility})`}
      subtitle={tile.type}
      accentColor={tile.systemState === "Up" ? theme.color.textSuccess : theme.color.textDanger}
      backgroundColor={tile.systemState === "Up" ? undefined : theme.color.dangerSubtle}
      onClick={onOpen}
      ariaLabel={`${tile.name} (${tile.facility})`}
      footer={
        <>
          <span style={{ color: theme.color.textBrand, display: "inline-flex" }}>
            <Box24Regular />
          </span>
          <HStack gap="md" align="center">
            <TileCount
              value={tile.dispatched}
              title={t("myWorkgroup.tiles.dispatched")}
              icon={<ArrowExportUp24Regular />}
            />
            <TileCount
              value={tile.inProcess}
              title={t("myWorkgroup.tiles.inProcess")}
              icon={<ArrowSync24Regular />}
            />
            <TileCount
              value={tile.processed}
              title={t("myWorkgroup.tiles.processed")}
              icon={<Checkmark20Filled />}
            />
          </HStack>
        </>
      }
    />
  );
}

function StepTile({ tile, onOpen }: { tile: WorkgroupStepTile; onOpen: () => void }) {
  const { t } = useAppTranslation();
  return (
    <EntityTile
      title={`${tile.name}(${tile.facility})`}
      subtitle={tile.processingType}
      onClick={onOpen}
      ariaLabel={`${tile.name} (${tile.facility})`}
      footer={
        <>
          <Dot />
          <HStack gap="md" align="center">
            <TileCount
              value={tile.materials}
              title={t("myWorkgroup.tiles.materials")}
              icon={<Box24Regular />}
            />
            <TileCount
              value={tile.resources}
              title={t("myWorkgroup.tiles.resources")}
              icon={<Box24Regular />}
            />
          </HStack>
        </>
      }
    />
  );
}

export function MyWorkgroupPage() {
  const { t } = useAppTranslation();
  const [panel, setPanel] = useState<Panel>(RESOURCES_PANEL);
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [workgroup, setWorkgroup] = useState("W1");
  const [visiblePanels, setVisiblePanels] = useState<Panel[]>([RESOURCES_PANEL, STEPS_PANEL]);

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
      <Split
        sidebarWidth="300px"
        sidebar={
          collapsed ? (
            <Button
              variant="subtle"
              icon={<PanelLeftExpand20Regular />}
              aria-label={t("common.expandPanel")}
              onClick={() => setCollapsed(false)}
            />
          ) : (
            <VStack surface grow gap="none">
              <HStack align="center" justify="between" p="sm" divider>
                <Menu
                  checkedValues={{ workgroup: [workgroup] }}
                  onCheckedValueChange={(checkedItems) => {
                    const next = checkedItems[0];
                    if (next !== undefined) setWorkgroup(next);
                  }}
                >
                  <MenuTrigger disableButtonEnhancement>
                    <MenuTriggerButton size="md" ariaLabel={t("myWorkgroup.workgroup")}>
                      {workgroup}
                      <ChevronDown16Regular />
                    </MenuTriggerButton>
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
                <HStack gap="xs" align="center">
                  <IconButton
                    icon={<Settings20Regular />}
                    ariaLabel={t("myWorkgroup.settings")}
                    onClick={() => setSettingsOpen(true)}
                  />
                  <IconButton
                    icon={<ChevronLeft20Regular />}
                    ariaLabel={t("common.collapsePanel")}
                    onClick={() => setCollapsed(true)}
                  />
                </HStack>
              </HStack>
              <VStack gap="xs" p="xs">
                {visiblePanels.includes(RESOURCES_PANEL) && (
                  <SidebarNavItem
                    icon={
                      <span style={{ color: theme.color.textBrand, display: "inline-flex" }}>
                        <Box24Regular />
                      </span>
                    }
                    label={t(L.resources)}
                    active={panel === RESOURCES_PANEL}
                    onClick={() => setPanel(RESOURCES_PANEL)}
                    endContent={<Text size={300}>{resources.length}</Text>}
                  />
                )}
                {visiblePanels.includes(STEPS_PANEL) && (
                  <SidebarNavItem
                    icon={<Dot />}
                    label={t(L.steps)}
                    active={panel === STEPS_PANEL}
                    onClick={() => setPanel(STEPS_PANEL)}
                    endContent={<Text size={300}>{steps.length}</Text>}
                  />
                )}
              </VStack>
            </VStack>
          )
        }
      >
        {panel === RESOURCES_PANEL && visiblePanels.includes(RESOURCES_PANEL) && (
          <>
            <FilterBar>
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
              <FilterGroup label={t(L.facility)}>
                <HStack>
                  <Input
                    value={resourceFacility}
                    onChange={setResourceFacility}
                    placeholder={t(L.facilityPlaceholder)}
                    style={{ width: "140px" }}
                  />
                  <IconButton icon={<Search20Regular />} ariaLabel={t(L.facility)} />
                </HStack>
              </FilterGroup>
              <FilterDropdown
                label={t(L.state)}
                value={resourceState}
                options={RESOURCE_STATE_OPTIONS}
                onChange={setResourceState}
              />
              <Input
                value={resourceName}
                onChange={setResourceName}
                placeholder={t(L.resourceNamePlaceholder)}
                contentBefore={<Search20Regular />}
                style={{ width: "220px" }}
              />
            </FilterBar>
            {resourcesLoading ? (
              <Empty>{t("myWorkgroup.loading")}</Empty>
            ) : resources.length === 0 ? (
              <Empty>{t("myWorkgroup.noResources")}</Empty>
            ) : (
              <TileGrid minWidth="300px">
                {resources.map((tile) => (
                  <ResourceTile
                    key={tile.name}
                    tile={tile}
                    onOpen={() => openResourceView(tile.name)}
                  />
                ))}
              </TileGrid>
            )}
          </>
        )}
        {panel === STEPS_PANEL && visiblePanels.includes(STEPS_PANEL) && (
          <>
            <FilterBar>
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
              <FilterGroup label={t(L.facility)}>
                <HStack>
                  <Input
                    value={stepFacility}
                    onChange={setStepFacility}
                    placeholder={t(L.facilityPlaceholder)}
                    style={{ width: "140px" }}
                  />
                  <IconButton icon={<Search20Regular />} ariaLabel={t(L.facility)} />
                </HStack>
              </FilterGroup>
              <Input
                value={stepName}
                onChange={setStepName}
                placeholder={t(L.stepNamePlaceholder)}
                contentBefore={<Search20Regular />}
                style={{ width: "220px" }}
              />
            </FilterBar>
            {stepsLoading ? (
              <Empty>{t("myWorkgroup.loading")}</Empty>
            ) : steps.length === 0 ? (
              <Empty>{t("myWorkgroup.noSteps")}</Empty>
            ) : (
              <TileGrid minWidth="300px">
                {steps.map((tile) => (
                  <StepTile key={tile.name} tile={tile} onOpen={() => openStepView(tile.name)} />
                ))}
              </TileGrid>
            )}
          </>
        )}
      </Split>
      <PanelSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        visiblePanels={visiblePanels}
        onApply={setVisiblePanels}
      />
    </ListPage>
  );
}
