import { useState } from "react";
import { useUIPageFolders, useUIPages } from "@/api";
import type { UIPageRecord, UIPageScope } from "@/api";
import {
  DataListPage,
  FilterBar,
  FilterGroup,
  createAction,
  exportAction,
  importAction,
  refreshAction,
  SidePanel,
  SidebarNavItem, Grid, MenuTriggerButton, VStack, HStack  
} from "@/components/common";
import { DocumentBulletList24Regular, Folder24Regular, Grid24Regular } from "@/components/icons";
import {
  Checkbox,
  Input,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Text,
  makeStyles,
  mergeClasses,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { theme } from "@/styles/theme";

const ALL_FOLDERS = "all";

const usePageStyles = makeStyles({
  contentCard: {
    padding: "16px",
    minHeight: 0,
  },
  grid: {
    overflowY: "auto",
    paddingBottom: "8px",
  },
  tile: {
    padding: "14px",
    cursor: "pointer",
    minHeight: "110px",
    backgroundColor: theme.color.surface,
    border: `1px solid ${theme.color.borderSubtle}`,
    borderRadius: theme.radius.md,
    ": hover": { backgroundColor: theme.color.surfaceHover },
  },
  tileName: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  tileMeta: { fontSize: "12px", color: theme.color.textTertiary },
  sectionLabel: {
    fontSize: "11px",
    color: theme.color.textTertiary,
    textTransform: "uppercase",
    padding: "12px 12px 4px",
    letterSpacing: "0.5px",
  },
  empty: { padding: "32px", textAlign: "center", color: theme.color.textTertiary },
});

const SCOPES: Array<"all" | UIPageScope> = [
  "all",
  "General",
  "EntityType",
  "MenuEntry",
  "Workspace",
];
const ALL_VALUE = "all";

export function UIPagesPage() {
  const { t } = useAppTranslation();
  const styles = usePageStyles();
  const sharedStyles = useSharedStyles();
  const [collapsed, setCollapsed] = useState(false);
  const [folder, setFolder] = useState(ALL_FOLDERS);
  const [scope, setScope] = useState<"all" | UIPageScope>("all");
  const [section, setSection] = useState(ALL_FOLDERS);
  const [entityType, setEntityType] = useState("");
  const [q, setQ] = useState("");
  const [showTerminated, setShowTerminated] = useState(false);
  const [showSystemItems, setShowSystemItems] = useState(false);

  const { data: folders = [] } = useUIPageFolders();
  const { data: pages = [] } = useUIPages({
    folder: folder === ALL_FOLDERS ? undefined : folder,
    scope: scope === "all" ? undefined : scope,
    section: section === "all" ? undefined : section,
    entityType: entityType === "" ? undefined : entityType,
    q: q === "" ? undefined : q,
    showTerminated,
    showSystemItems,
  });

  const sections = Array.from(new Set(pages.map((page) => page.section))).filter(Boolean);

  return (
    <DataListPage
      icon={<DocumentBulletList24Regular />}
      titleKey="uiPages.pageLabel"
      actions={[createAction, refreshAction, importAction, exportAction]}
      sidebar={
        <SidePanel
          title={t("uiPages.foldersTitle")}
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
        >
          <SidebarNavItem
            icon={<Grid24Regular />}
            label={t("uiPages.allUIPages")}
            active={folder === ALL_FOLDERS}
            onClick={() => setFolder(ALL_FOLDERS)}
          />
          <div className={styles.sectionLabel}>{t("uiPages.foldersSection")}</div>
          {folders.map((entry) => (
            <SidebarNavItem
              key={entry.path}
              icon={<Folder24Regular />}
              label={entry.name}
              active={folder === entry.path}
              onClick={() => setFolder(entry.path)}
            />
          ))}
        </SidePanel>
      }
    >
      <VStack gap="12px" className={mergeClasses(sharedStyles.contentCard, styles.contentCard)}>
        <FilterBar>
          <FilterGroup>
            <Checkbox
              checked={showTerminated}
              onChange={setShowTerminated}
              label={t("uiPages.filters.terminated")}
            />
          </FilterGroup>
          <FilterGroup>
            <Checkbox
              checked={showSystemItems}
              onChange={setShowSystemItems}
              label={t("uiPages.filters.systemItems")}
            />
          </FilterGroup>
          <FilterGroup label={t("uiPages.filters.scope")}>
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <MenuTriggerButton>
                  {scope === "all" ? t("uiPages.filters.all") : scope}
                </MenuTriggerButton>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  {SCOPES.map((value) => (
                    <MenuItem key={value} onClick={() => setScope(value)}>
                      {value === "all" ? t("uiPages.filters.all") : value}
                    </MenuItem>
                  ))}
                </MenuList>
              </MenuPopover>
            </Menu>
          </FilterGroup>
          <FilterGroup label={t("uiPages.filters.section")}>
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <MenuTriggerButton>
                  {section === "all" ? t("uiPages.filters.all") : section}
                </MenuTriggerButton>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem onClick={() => setSection(ALL_VALUE)}>
                    {t("uiPages.filters.all")}
                  </MenuItem>
                  {sections.map((value) => (
                    <MenuItem key={value} onClick={() => setSection(value)}>
                      {value}
                    </MenuItem>
                  ))}
                </MenuList>
              </MenuPopover>
            </Menu>
          </FilterGroup>
          <FilterGroup label={t("uiPages.filters.entityType")}>
            <Input
              value={entityType}
              onChange={setEntityType}
              placeholder={t("uiPages.filters.entityTypePlaceholder")}
              style={{ width: "160px" }}
            />
          </FilterGroup>
          <FilterGroup alignEnd>
            <Input
              value={q}
              onChange={setQ}
              placeholder={t("common.search")}
              style={{ width: "200px" }}
            />
          </FilterGroup>
        </FilterBar>
        {pages.length === 0 ? (
          <div className={styles.empty}>{t("uiPages.noPages")}</div>
        ) : (
          <Grid columns="repeat(auto-fill, minmax(220px, 1fr))" gap="12px" className={styles.grid}>
            {pages.map((page) => (
              <UIPageTile key={page.name} page={page} />
            ))}
          </Grid>
        )}
      </VStack>
    </DataListPage>
  );
}

function UIPageTile({ page }: { page: UIPageRecord }) {
  const styles = usePageStyles();
  return (
    <VStack gap="10px" role="button" tabIndex={0} aria-label={page.name} className={styles.tile}>
      <Text weight="semibold" size={400} className={styles.tileName} title={page.name}>
        {page.name}
      </Text>
      <HStack gap="6px">
        <Text className={styles.tileMeta}>{page.type}</Text>
        <Text className={styles.tileMeta}>{page.scope}</Text>
      </HStack>
      {page.description !== "" && (
        <Text className={styles.tileMeta} title={page.description}>
          {page.description}
        </Text>
      )}
    </VStack>
  );
}
