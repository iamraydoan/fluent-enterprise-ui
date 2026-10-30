import { useMemo, useState } from "react";
import { useEntityTypeProperties } from "@/api";
import type { EntityTypeProperty } from "@/api";
import { Card } from "@/components/common";
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
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { ManagePropertiesDialog } from "./ManagePropertiesDialog";
import { searchTypeLabelKey, NOT_APPLICABLE } from "./propertyUtils";

const useSectionStyles = makeStyles({
  toolbar: {
    display: "flex",
    alignItems: "center",
    columnGap: "4px",
    padding: "8px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  filterBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    columnGap: "16px",
    padding: "10px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  list: { display: "flex", flexDirection: "column" },
  row: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  rowHead: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
    width: "100%",
    padding: "10px 12px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  rowTitle: { fontSize: "14px", fontWeight: tokens.fontWeightSemibold },
  rowSub: { fontSize: "12px", color: tokens.colorNeutralForeground3 },
  rowBody: {
    padding: "4px 12px 12px 36px",
    display: "flex",
    flexDirection: "column",
    rowGap: "4px",
  },
  detailRow: { display: "flex", columnGap: "8px", fontSize: "13px" },
  detailLabel: { color: tokens.colorNeutralForeground3, minWidth: "110px" },
  searchableBadge: {
    fontSize: "11px",
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorPaletteGreenForeground1,
    backgroundColor: tokens.colorPaletteGreenBackground1,
    borderRadius: tokens.borderRadiusSmall,
    padding: "2px 8px",
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
        !property.name.toLowerCase().includes(needle) &&
        !property.description.toLowerCase().includes(needle)
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
          appearance="subtle"
          icon={<ArrowSync20Regular />}
          onClick={() => refetch()}
          aria-label={t("actionBar.refresh")}
        >
          {t("actionBar.refresh")}
        </Button>
        <Button
          appearance="subtle"
          icon={<Settings20Regular />}
          onClick={() => setManageOpen(true)}
          aria-label={t("entityTypes.properties.manage")}
        >
          {t("entityTypes.properties.manage")}
        </Button>
      </div>
      <div className={styles.filterBar}>
        <Checkbox
          label={t("entityTypes.properties.searchableFilter")}
          checked={searchableOnly}
          onChange={(_, data) => setSearchableOnly(data.checked === true)}
        />
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button appearance="subtle" size="small">
              {t("entityTypes.properties.referenceTypeFilter", {
                value: referenceType === ALL ? t("common.all") : referenceType,
              })}
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList
              checkedValues={{ referenceType: [referenceType] }}
              onCheckedValueChange={(_, data) => setReferenceType(data.checkedItems[0] ?? ALL)}
            >
              {referenceTypes.map((value) => (
                <MenuItemRadio key={value} name="referenceType" value={value}>
                  {value === ALL ? t("common.all") : value}
                </MenuItemRadio>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
        <Input
          size="small"
          contentBefore={<Search20Regular />}
          placeholder={t("common.search")}
          value={search}
          onChange={(_, data) => setSearch(data.value)}
          aria-label={t("common.search")}
        />
      </div>
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
