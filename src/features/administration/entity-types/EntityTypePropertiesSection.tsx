import { useMemo, useState } from "react";
import { useEntityTypeProperties } from "@/api";
import type { EntityTypeProperty } from "@/api";
import { Card, FilterBar, FilterGroup, HStack, Section, VStack } from "@/components/common";
import {
  ArrowSync20Regular,
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
    padding: "8px 12px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  row: {
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  rowTitle: { fontSize: "14px", fontWeight: theme.font.weightSemibold },
  rowSub: { fontSize: "12px", color: theme.color.textTertiary },
  rowBody: {
    padding: "4px 12px 12px 36px",
  },
  detailRow: { fontSize: "13px" },
  detailLabel: { color: theme.color.textTertiary, minWidth: "110px" },
  searchableBadge: {
    fontSize: "11px",
    fontWeight: theme.font.weightSemibold,
    color: theme.color.textSuccess,
    backgroundColor: theme.color.successEmphasis,
    borderRadius: theme.radius.sm,
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
      <HStack align="center" gap="4px" className={styles.toolbar}>
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
      </HStack>
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
      <VStack gap="none" role="list">
        {visible.map((property) => (
          <PropertyRow
            key={property.name}
            property={property}
            expanded={expanded === property.name}
            onToggle={() => toggle(property.name)}
          />
        ))}
      </VStack>
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
      <Section
        collapsible
        expanded={expanded}
        onExpandedChange={() => onToggle()}
        title={
          <span>
            <div className={styles.rowTitle}>{property.name}</div>
            <div className={styles.rowSub}>
              {property.description} / {property.referenceType}
            </div>
          </span>
        }
        actions={
          property.searchable ? (
            <span className={styles.searchableBadge}>{t("entityTypes.properties.searchable")}</span>
          ) : undefined
        }
      >
        <VStack gap="4px" className={styles.rowBody}>
          <HStack gap="8px" className={styles.detailRow}>
            <span className={styles.detailLabel}>{t("entityTypes.property.kind")}</span>
            <Text size={300}>{property.kind}</Text>
          </HStack>
          <HStack gap="8px" className={styles.detailRow}>
            <span className={styles.detailLabel}>{t("entityTypes.property.scalarType")}</span>
            <Text size={300}>
              {property.scalarType}
              {property.size !== undefined ? ` (${property.size})` : ""}
            </Text>
          </HStack>
          <HStack gap="8px" className={styles.detailRow}>
            <span className={styles.detailLabel}>{t("entityTypes.property.searchType")}</span>
            <Text size={300}>
              {property.searchable && property.searchType
                ? t(searchTypeLabelKey(property.searchType))
                : NOT_APPLICABLE}
            </Text>
          </HStack>
          <HStack gap="8px" className={styles.detailRow}>
            <span className={styles.detailLabel}>{t("entityTypes.property.enabled")}</span>
            <Text size={300}>{property.enabled ? t("common.yes") : t("common.no")}</Text>
          </HStack>
        </VStack>
      </Section>
    </div>
  );
}
