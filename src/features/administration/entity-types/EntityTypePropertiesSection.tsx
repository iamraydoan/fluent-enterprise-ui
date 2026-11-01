import { useMemo, useState } from "react";
import { useEntityTypeProperties } from "@/api";
import type { EntityTypeProperty } from "@/api";
import { Card, FilterBar, FilterGroup } from "@/components/common";
import {
  ArrowSync20Regular,
  ChevronDown20Regular,
  ChevronRight20Regular,
  Search20Regular,
  Settings20Regular,
} from "@/components/icons";
import {
  Button,
  Checkbox,
  Input,
  makeStyles,
  Menu,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Text,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { containsIgnoreCase } from "@/lib/utils";
import { theme } from "@/styles/theme";
import { ManagePropertiesDialog } from "./dialogs/ManagePropertiesDialog";
import { searchTypeLabelKey, NOT_APPLICABLE } from "./propertyUtils";

const useSectionStyles = makeStyles({
  toolbar: {
    display: "flex",
    alignItems: "center",
    columnGap: theme.spacing.xs,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  filterBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    columnGap: theme.spacing.lg,
    padding: `10px ${theme.spacing.md}`,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  list: { display: "flex", flexDirection: "column" },
  row: {
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  rowHead: {
    display: "flex",
    alignItems: "center",
    columnGap: theme.spacing.sm,
    width: "100%",
    padding: `10px ${theme.spacing.md}`,
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    ":hover": { backgroundColor: theme.color.surfaceHover },
  },
  rowTitle: { fontSize: "14px", fontWeight: theme.font.weightSemibold },
  rowSub: { fontSize: "12px", color: theme.color.textTertiary },
  rowBody: {
    padding: `${theme.spacing.xs} ${theme.spacing.md} ${theme.spacing.md} 36px`,
    display: "flex",
    flexDirection: "column",
    rowGap: theme.spacing.xs,
  },
  detailRow: { display: "flex", columnGap: theme.spacing.sm, fontSize: "13px" },
  detailLabel: { color: theme.color.textTertiary, minWidth: "110px" },
  searchableBadge: {
    fontSize: "11px",
    fontWeight: theme.font.weightSemibold,
    color: theme.color.textSuccess,
    backgroundColor: theme.color.successEmphasis,
    borderRadius: theme.radius.sm,
    padding: `2px ${theme.spacing.sm}`,
  },
});

const ALL = "all";

interface EntityTypePropertiesSectionProps {
  entityName: string;
}

export function EntityTypePropertiesSection({ entityName }: EntityTypePropertiesSectionProps) {
  const { t } = useAppTranslation();
  const styles = useSectionStyles();
  const { data: properties = [], refetch } = useEntityTypeProperties(entityName);
  const [searchableOnly, setSearchableOnly] = useState(false);
  const [referenceType, setReferenceType] = useState(ALL);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [manageOpen, setManageOpen] = useState(false);

  const referenceTypes = useMemo(() => {
    const set = new Set(properties.map((property) => property.referenceType));
    return [ALL, ...Array.from(set).sort()];
  }, [properties]);

  const visible = properties.filter((property) => {
    if (searchableOnly && !property.searchable) return false;
    if (referenceType !== ALL && property.referenceType !== referenceType) return false;
    if (search !== "") {
      const needle = search.toLowerCase();
      if (
        !containsIgnoreCase(property.name, needle) &&
        !containsIgnoreCase(property.description, needle)
      )
        return false;
    }
    return true;
  });

  const toggle = (name: string) => setExpanded((current) => (current === name ? null : name));

  return (
    <Card title={t("entityTypes.properties.title", { count: properties.length })}>
      <div className={styles.toolbar}>
        <Button
          variant="subtle"
          icon={<ArrowSync20Regular />}
          onClick={() => refetch()}
          aria-label={t("actionBar.refresh")}
        >
          {t("actionBar.refresh")}
        </Button>
        <Button
          variant="subtle"
          icon={<Settings20Regular />}
          onClick={() => setManageOpen(true)}
          aria-label={t("entityTypes.properties.manage")}
        >
          {t("entityTypes.properties.manage")}
        </Button>
      </div>
      <FilterBar>
        <FilterGroup>
          <Checkbox
            label={t("entityTypes.properties.searchableFilter")}
            checked={searchableOnly}
            onChange={setSearchableOnly}
          />
        </FilterGroup>
        <FilterGroup>
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Button variant="subtle" size="sm">
                {t("entityTypes.properties.referenceTypeFilter", {
                  value: referenceType === ALL ? t("common.all") : referenceType,
                })}
              </Button>
            </MenuTrigger>
            <MenuPopover>
              <MenuList
                checkedValues={{ referenceType: [referenceType] }}
                onCheckedValueChange={(checkedItems) => setReferenceType(checkedItems[0] ?? ALL)}
              >
                {referenceTypes.map((value) => (
                  <MenuItemRadio key={value} name="referenceType" value={value}>
                    {value === ALL ? t("common.all") : value}
                  </MenuItemRadio>
                ))}
              </MenuList>
            </MenuPopover>
          </Menu>
        </FilterGroup>
        <FilterGroup>
          <Input
            size="sm"
            contentBefore={<Search20Regular />}
            placeholder={t("common.search")}
            value={search}
            onChange={setSearch}
            aria-label={t("common.search")}
          />
        </FilterGroup>
      </FilterBar>
      <div className={styles.list} role="list">
        {visible.map((property) => (
          <PropertyRow
            key={property.name}
            property={property}
            expanded={expanded === property.name}
            onToggle={() => toggle(property.name)}
          />
        ))}
      </div>
      {manageOpen && (
        <ManagePropertiesDialog
          entityName={entityName}
          properties={properties}
          onClose={() => setManageOpen(false)}
        />
      )}
    </Card>
  );
}

function PropertyRow({
  property,
  expanded,
  onToggle,
}: {
  property: EntityTypeProperty;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useSectionStyles();
  return (
    <div className={styles.row} role="listitem">
      <button className={styles.rowHead} onClick={onToggle} aria-expanded={expanded}>
        {expanded ? <ChevronDown20Regular /> : <ChevronRight20Regular />}
        <span>
          <div className={styles.rowTitle}>{property.name}</div>
          <div className={styles.rowSub}>
            {property.description} / {property.referenceType}
          </div>
        </span>
        {property.searchable && (
          <span className={styles.searchableBadge}>{t("entityTypes.properties.searchable")}</span>
        )}
      </button>
      {expanded && (
        <div className={styles.rowBody}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t("entityTypes.property.kind")}</span>
            <Text size={300}>{property.kind}</Text>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t("entityTypes.property.scalarType")}</span>
            <Text size={300}>
              {property.scalarType}
              {property.size !== undefined ? ` (${property.size})` : ""}
            </Text>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t("entityTypes.property.searchType")}</span>
            <Text size={300}>
              {property.searchable && property.searchType
                ? t(searchTypeLabelKey(property.searchType))
                : NOT_APPLICABLE}
            </Text>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t("entityTypes.property.enabled")}</span>
            <Text size={300}>{property.enabled ? t("common.yes") : t("common.no")}</Text>
          </div>
        </div>
      )}
    </div>
  );
}
