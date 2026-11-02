import { useState } from "react";
import type { ReactNode } from "react";
import {
  AccessGrid,
  Empty,
  FilterBar,
  FilterGroup,
  Grid,
  KV,
  MiniBar,
  Panel,
  Section,
  VStack,
  YesNo,
} from "@/components/common";
import type { AccessLevelState } from "@/components/common";
import { ArrowSync20Regular, Search20Regular, Settings20Regular } from "@/components/icons";
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
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";
import type { AccessLevel, EntityItem, EntityItemKind } from "./entityData";
import { REF_PROP } from "./entityData";

const useListStyles = makeStyles({
  uppercase: { textTransform: "uppercase" },
  searchInput: { width: "252px", fontStyle: "italic" },
  rowSub: { fontSize: "12px", color: theme.color.textTertiary },
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

const EMPTY_KEYS: Record<EntityItemKind, TranslationKey> = {
  property: "entityTypes.detailPage.empty.noProperties",
  attribute: "entityTypes.detailPage.empty.noAttributes",
  operation: "entityTypes.detailPage.empty.noOperations",
  opAttr: "entityTypes.detailPage.empty.noOpAttributes",
};

function yn(value: boolean): ReactNode {
  return <YesNo value={value} />;
}

function toAccessLevelState(al: AccessLevel): AccessLevelState {
  return { ent: { ...al.ent }, tpl: { ...al.tpl } };
}

function ExpandedItem({ kind, item }: { kind: EntityItemKind; item: EntityItem }) {
  const { t } = useAppTranslation();
  if (kind === "operation") {
    return (
      <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="22px 16px">
        <Section title={t("entityTypes.field.operationDetails")}>
          <KV
            rows={[
              [t("entityTypes.field.name"), item.name],
              [t("entityTypes.field.description"), item.desc],
              [t("entityTypes.field.system"), yn(item.system)],
            ]}
          />
        </Section>
        <Section title={t("entityTypes.field.flags")}>
          <KV
            rows={[
              [t("entityTypes.field.historyEnabled"), yn(item.historyEnabled)],
              [t("entityTypes.field.publishEventOnCompletion"), yn(item.publishEvent)],
              [t("entityTypes.field.subscribeInFabLive"), yn(item.fabLive)],
              [t("entityTypes.field.publishToKafka"), yn(item.kafka)],
            ]}
          />
        </Section>
      </Grid>
    );
  }
  const contentRows: [string, ReactNode][] = [
    [t("entityTypes.field.referenceType"), item.refType],
    [t("entityTypes.field.scalarType"), item.refType === "None" ? item.scalar : item.refTo],
    [t("entityTypes.field.size"), item.size],
    [t("entityTypes.field.defaultValue"), item.def],
    [t("entityTypes.field.array"), yn(item.array)],
  ];
  if (kind !== "opAttr") {
    contentRows.push(
      [t("entityTypes.detailPage.labels.cloneDisplayOrder"), item.cloneOrder],
      [t("entityTypes.field.copyOnClone"), yn(item.copyOnClone)],
      [t("entityTypes.field.importUpdateMode"), item.importMode],
    );
  }
  return (
    <VStack gap="xl">
      <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="22px 16px">
        <Section title={t("entityTypes.field.propertyDetails")}>
          <KV
            rows={[
              [t("entityTypes.field.name"), item.name],
              [t("entityTypes.field.description"), item.desc],
              [t("entityTypes.field.propertyType"), item.type],
              [t("entityTypes.field.dataGroup"), item.dataGroup],
              [t("entityTypes.field.enabled"), yn(item.enabled)],
              [t("entityTypes.field.system"), yn(item.system)],
              [t("entityTypes.field.state"), item.state],
            ]}
          />
        </Section>
        <Section title={t("entityTypes.field.content")}>
          <KV rows={contentRows} />
        </Section>
        <Section title={t("entityTypes.field.flags")}>
          <KV
            rows={[
              [t("entityTypes.field.indexed"), yn(item.indexed)],
              [t("entityTypes.field.mandatory"), yn(item.mandatory)],
              [t("entityTypes.field.reportable"), yn(item.reportable)],
              [t("entityTypes.field.historyEnabled"), yn(item.historyEnabled)],
              [t("entityTypes.field.versioned"), yn(item.versionedPortion)],
              [t("entityTypes.field.searchable"), yn(item.searchable)],
              [t("entityTypes.field.searchType"), item.searchable ? item.searchType : ""],
              [t("entityTypes.detailPage.labels.isToEnrichCDM"), yn(item.toEnrichCDM)],
            ]}
          />
        </Section>
      </Grid>
      <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="22px 16px">
        <Section title={t("entityTypes.field.validation")}>
          <KV
            rows={[
              [t("entityTypes.field.range"), item.range],
              [t("entityTypes.field.regularExpression"), item.regex],
            ]}
          />
        </Section>
        <Section title={t("entityTypes.field.localizedMessage")}>
          <KV rows={[[t("entityTypes.field.key"), item.locKey]]} />
        </Section>
      </Grid>
      <Section title={t("entityTypes.field.accessLevel")}>
        <AccessGrid value={toAccessLevelState(item.al)} onChange={() => undefined} readOnly />
      </Section>
    </VStack>
  );
}

function ItemRow({
  kind,
  item,
  expanded,
  onToggle,
}: {
  kind: EntityItemKind;
  item: EntityItem;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useListStyles();
  const subtitle = kind === "operation" ? item.desc : `${item.desc} / ${item.refType}`;
  return (
    <Section
      collapsible
      expanded={expanded}
      onExpandedChange={() => onToggle()}
      title={
        <VStack gap="none">
          <Text size={400}>{item.name}</Text>
          <Text size={200} className={styles.rowSub}>
            {subtitle}
          </Text>
        </VStack>
      }
      actions={
        kind === "property" && item.searchable ? (
          <span className={styles.searchableBadge}>{t("entityTypes.properties.searchable")}</span>
        ) : undefined
      }
    >
      <ExpandedItem kind={kind} item={item} />
    </Section>
  );
}

interface EntityTypeItemListProps {
  kind: EntityItemKind;
  items: EntityItem[];
  onRefresh: () => void;
  onManage: () => void;
}

export function EntityTypeItemList({ kind, items, onRefresh, onManage }: EntityTypeItemListProps) {
  const { t } = useAppTranslation();
  const styles = useListStyles();
  const [query, setQuery] = useState("");
  const [searchableOnly, setSearchableOnly] = useState(false);
  const [referenceType, setReferenceType] = useState(ALL);
  const [expanded, setExpanded] = useState<string | null>(null);

  const visible = items.filter((item) => {
    if (kind === "property") {
      if (searchableOnly && !item.searchable) return false;
      if (referenceType !== ALL && item.refType !== referenceType) return false;
    }
    return query === "" || `${item.name} ${item.desc}`.toLowerCase().includes(query.toLowerCase());
  });

  const toggle = (id: string) => setExpanded((current) => (current === id ? null : id));

  return (
    <Panel>
      <MiniBar
        groups={[
          {
            buttons: [
              { icon: <ArrowSync20Regular />, label: t("actionBar.refresh"), onClick: onRefresh },
              {
                icon: <Settings20Regular />,
                label: t("entityTypes.properties.manage"),
                onClick: onManage,
              },
            ],
          },
        ]}
      />
      <FilterBar>
        {kind === "property" && (
          <FilterGroup>
            <Checkbox
              className={styles.uppercase}
              label={t("entityTypes.properties.searchableFilter")}
              checked={searchableOnly}
              onChange={setSearchableOnly}
            />
          </FilterGroup>
        )}
        {kind === "property" && (
          <FilterGroup>
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Button variant="subtle" size="sm" className={styles.uppercase}>
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
                  {[ALL, ...REF_PROP].map((value) => (
                    <MenuItemRadio key={value} name="referenceType" value={value}>
                      {value === ALL ? t("common.all") : value}
                    </MenuItemRadio>
                  ))}
                </MenuList>
              </MenuPopover>
            </Menu>
          </FilterGroup>
        )}
        <FilterGroup>
          <Input
            size="sm"
            className={styles.searchInput}
            contentBefore={<Search20Regular />}
            placeholder={t("common.search")}
            value={query}
            onChange={setQuery}
            aria-label={t("common.search")}
          />
        </FilterGroup>
      </FilterBar>
      <VStack gap="none" role="list">
        {visible.map((item) => (
          <ItemRow
            key={item.id}
            kind={kind}
            item={item}
            expanded={expanded === item.id}
            onToggle={() => toggle(item.id)}
          />
        ))}
      </VStack>
      {visible.length === 0 && (
        <Empty>
          <Text>{items.length === 0 ? t(EMPTY_KEYS[kind]) : t("common.noResults")}</Text>
        </Empty>
      )}
    </Panel>
  );
}
