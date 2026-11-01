import { useState } from "react";
import { useUIPageFolders, useUIPages } from "@/api";
import type { UIPageRecord, UIPageScope } from "@/api";
import {
  DataListPage,
  FilterBar,
  FilterGroup,
  MenuTriggerButton,
  createAction,
  exportAction,
  importAction,
  refreshAction,
  SidePanel,
  SidebarNavItem,
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
    display: "flex",
    flexDirection: "column",
    rowGap: "12px",
    padding: "16px",
    flexGrow: 1,
    minHeight: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "12px",
    overflowY: "auto",
    paddingBottom: "8px",
  },
  tile: {
    padding: "14px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
    minHeight: "110px",
    backgroundColor: theme.color.surface,
    border: `1px solid ${theme.color.borderSubtle}`,
    borderRadius: theme.radius.md,
    ":hover": { backgroundColor: theme.color.surfaceHover },
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
      <div className={mergeClasses(sharedStyles.contentCard, styles.contentCard)}>
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
                <MenuTriggerButton ariaLabel={t("uiPages.filters.scope")}>
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
                <MenuTriggerButton ariaLabel={t("uiPages.filters.section")}>
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
          <div className={styles.grid}>
            {pages.map((page) => (
              <UIPageTile key={page.name} page={page} />
            ))}
          </div>
        )}
      </div>
    </DataListPage>
  );
}

function UIPageTile({ page }: { page: UIPageRecord }) {
  const styles = usePageStyles();
  return (
    <div className={styles.tile} role="button" tabIndex={0} aria-label={page.name}>
      <Text weight="semibold" size={400} className={styles.tileName} title={page.name}>
        {page.name}
      </Text>
      <div style={{ display: "flex", columnGap: "6px" }}>
        <Text className={styles.tileMeta}>{page.type}</Text>
        <Text className={styles.tileMeta}>{page.scope}</Text>
      </div>
      {page.description !== "" && (
        <Text className={styles.tileMeta} title={page.description}>
          {page.description}
        </Text>
      )}
    </div>
  );
}
