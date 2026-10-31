import { useState } from "react";
import { useUIPageFolders, useUIPages } from "@/api";
import type { UIPageRecord, UIPageScope } from "@/api";
import {
  createAction,
  exportAction,
  importAction,
  ListPage,
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
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const ALL_FOLDERS = "all";

const usePageStyles = makeStyles({
  body: { display: "flex", columnGap: "10px", flexGrow: 1, minHeight: 0 },
  main: { flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column" },
  contentCard: {
    display: "flex",
    flexDirection: "column",
    rowGap: "12px",
    padding: "16px",
    flexGrow: 1,
    minHeight: 0,
  },
  filterBar: {
    display: "flex",
    alignItems: "center",
    columnGap: "16px",
    flexWrap: "wrap",
    rowGap: "8px",
    paddingBottom: "12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  filterGroup: { display: "flex", alignItems: "center", columnGap: "8px" },
  filterLabel: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground3,
    textTransform: "uppercase",
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
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  tileName: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  tileMeta: { fontSize: "12px", color: tokens.colorNeutralForeground3 },
  sectionLabel: {
    fontSize: "11px",
    color: tokens.colorNeutralForeground3,
    textTransform: "uppercase",
    padding: "12px 12px 4px",
    letterSpacing: "0.5px",
  },
  empty: { padding: "32px", textAlign: "center", color: tokens.colorNeutralForeground3 },
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
    <ListPage
      header={{
        icon: <DocumentBulletList24Regular />,
        title: t("uiPages.pageLabel"),
        actions: [createAction, refreshAction, importAction, exportAction],
      }}
    >
      <div className={styles.body}>
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
        <div className={styles.main}>
          <div className={mergeClasses(sharedStyles.contentCard, styles.contentCard)}>
            <div className={styles.filterBar} role="search">
              <div className={styles.filterGroup}>
                <Checkbox
                  checked={showTerminated}
                  onChange={(_, data) => setShowTerminated(data.checked === true)}
                  label={t("uiPages.filters.terminated")}
                />
              </div>
              <div className={styles.filterGroup}>
                <Checkbox
                  checked={showSystemItems}
                  onChange={(_, data) => setShowSystemItems(data.checked === true)}
                  label={t("uiPages.filters.systemItems")}
                />
              </div>
              <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>{t("uiPages.filters.scope")}</span>
                <Menu>
                  <MenuTrigger disableButtonEnhancement>
                    <button className={styles.folderItem} style={{ width: "auto" }}>
                      {scope === "all" ? t("uiPages.filters.all") : scope}
                    </button>
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
              </div>
              <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>{t("uiPages.filters.section")}</span>
                <Menu>
                  <MenuTrigger disableButtonEnhancement>
                    <button className={styles.folderItem} style={{ width: "auto" }}>
                      {section === "all" ? t("uiPages.filters.all") : section}
                    </button>
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
              </div>
              <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>{t("uiPages.filters.entityType")}</span>
                <Input
                  value={entityType}
                  onChange={(_, data) => setEntityType(data.value)}
                  placeholder={t("uiPages.filters.entityTypePlaceholder")}
                  style={{ width: "160px" }}
                />
              </div>
              <div className={styles.filterGroup} style={{ marginLeft: "auto" }}>
                <Input
                  value={q}
                  onChange={(_, data) => setQ(data.value)}
                  placeholder={t("common.search")}
                  style={{ width: "200px" }}
                />
              </div>
            </div>
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
        </div>
      </div>
    </ListPage>
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
