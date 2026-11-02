import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useEntityType, useEntityTypes } from "@/api";
import {
  ActionBar,
  Card,
  Grid,
  HStack,
  IconButton,
  KV,
  MiniBar,
  PageHeader,
  Panel,
  RibbonButton,
  VStack,
  YesNo,
} from "@/components/common";
import {
  ArrowExportUp24Regular,
  ArrowSync20Regular,
  ArrowSync24Regular,
  DocumentBulletList20Regular,
  DocumentBulletList24Regular,
  Edit24Regular,
  Flash24Regular,
  PanelLeftContract20Regular,
  PanelLeftExpand20Regular,
  Settings20Regular,
} from "@/components/icons";
import {
  Button,
  Tab,
  TabList,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  makeStyles,
  mergeClasses,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { cardSurface, detailTileColors, useSharedStyles } from "@/styles/shared";
import { theme } from "@/styles/theme";
import { EntityTypeItemList } from "./EntityTypeItemList";
import {
  EntityTypeDialog,
  GenerateDialog,
  ManageDialog,
  OdsDialog,
} from "./dialogs/EntityTypeDialogs";
import type {
  EntityItem,
  EntityItemKind,
  EntityTypeDetails,
  EntityTypeModel,
  EntityTypeRow,
  EntityTypeStoreEntry,
  OdsModel,
  StateModel,
} from "./entityData";
import { entityStore, spaced } from "./entityData";

type DetailSection = "details" | "states" | EntityItemKind | "ods";

type DetailDialog =
  { type: "edit" } | { type: "manage"; kind: EntityItemKind } | { type: "ods" } | { type: "gen" };

const SECTION_ORDER: DetailSection[] = [
  "details",
  "states",
  "property",
  "attribute",
  "operation",
  "opAttr",
  "ods",
];

const SECTION_LABEL_KEYS: Record<DetailSection, TranslationKey> = {
  details: "entityTypes.sections.details",
  states: "entityTypes.sections.stateModels",
  property: "entityTypes.sections.properties",
  attribute: "entityTypes.sections.attributes",
  operation: "entityTypes.sections.operations",
  opAttr: "entityTypes.sections.operationAttributes",
  ods: "entityTypes.sections.odsRetention",
};

const MODEL_KEY: Record<
  EntityItemKind,
  "properties" | "attributes" | "operations" | "opAttributes"
> = {
  property: "properties",
  attribute: "attributes",
  operation: "operations",
  opAttr: "opAttributes",
};

const useDetailStyles = makeStyles({
  body: { marginTop: "10px", flexGrow: 1, minHeight: 0 },
  left: {
    ...cardSurface,
    width: "268px",
    flexShrink: 0,
    padding: "4px 4px 8px",
    position: "relative",
  },
  collapse: { position: "absolute", top: "8px", right: "8px" },
  leftItem: {
    width: "100%",
    justifyContent: "flex-start",
    height: "42px",
    padding: "0 34px 0 14px",
    borderRadius: "4px",
    fontSize: "13px",
    fontWeight: 400,
    flexShrink: 0,
    ":hover": { backgroundColor: theme.color.surfaceHover },
  },
  leftActive: {
    backgroundColor: theme.color.surfaceSelected,
    fontWeight: 600,
    ":hover": { backgroundColor: theme.color.surfaceSelected },
  },
  area: { flexGrow: 1, minWidth: 0, minHeight: 0 },
  tile: {
    width: "76px",
    height: "76px",
    flexShrink: 0,
    backgroundColor: detailTileColors.background,
    color: detailTileColors.foreground,
    textAlign: "center",
    lineHeight: "76px",
  },
  grow: { flexGrow: 1, minWidth: 0 },
  stateText: { fontSize: "12px" },
  countTitle: { padding: "12px 0 8px" },
  tabRow: { padding: "10px 0 0" },
});

function yn(value: boolean): ReactNode {
  return <YesNo value={value} />;
}

function DetailsSection({ details }: { details: EntityTypeDetails }) {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const days = (value: string): string => `${value} ${t("entityTypes.detailPage.labels.days")}`;
  const relationRows: [string, ReactNode][] = [
    [t("entityTypes.field.relation"), yn(details.relation)],
    ...(details.relation
      ? ([
          [t("entityTypes.field.sourceEntity"), details.sourceEntity],
          [t("entityTypes.field.targetEntity"), details.targetEntity],
        ] as [string, ReactNode][])
      : []),
    [t("entityTypes.field.lockType"), spaced(details.lockType)],
    [t("entityTypes.field.cloneBehavior"), spaced(details.cloneBehavior)],
  ];
  return (
    <Grid columns="repeat(auto-fit, minmax(340px, 1fr))" gap="10px" align="start">
      <VStack gap="10px">
        <Card title={t("entityTypes.field.generalData")}>
          <HStack gap="18px" align="start">
            <div className={styles.tile}>
              <DocumentBulletList24Regular style={{ fontSize: 44, verticalAlign: "middle" }} />
            </div>
            <div className={styles.grow}>
              <KV
                rows={[
                  [t("entityTypes.field.name"), details.name],
                  [t("entityTypes.field.description"), details.desc],
                  [t("entityTypes.field.system"), yn(details.system)],
                  [t("entityTypes.field.universalState"), details.state],
                ]}
              />
            </div>
          </HStack>
        </Card>
        <Card title={t("entityTypes.field.flags")}>
          <KV
            rows={[
              [t("entityTypes.field.licensed"), yn(details.licensed)],
              [t("entityTypes.field.uniqueNameRequired"), yn(details.uniqueName)],
              [t("entityTypes.field.replicateToOds"), yn(details.replicateOds)],
              [t("entityTypes.field.historyEnabled"), yn(details.historyEnabled)],
              [t("entityTypes.field.partitioned"), yn(details.partitioned)],
              [t("entityTypes.field.visibleInBusinessData"), yn(details.visibleBD)],
              [t("entityTypes.field.connectIoTEnabled"), yn(details.connectIoT)],
              [t("entityTypes.field.semanticSearchEnabled"), yn(details.semanticSearch)],
              [t("entityTypes.field.withAttributes"), yn(details.withAttributes)],
              [t("entityTypes.field.withOperationAttributes"), yn(details.withOpAttributes)],
              [t("entityTypes.field.systemManagedStateModels"), yn(details.sysManagedSM)],
              [t("entityTypes.field.allowMultipleStateModels"), yn(details.multipleSM)],
              [t("entityTypes.field.allowBarcodeIds"), yn(details.barcodeIds)],
              [t("entityTypes.field.canBeImported"), yn(details.canImport)],
              [t("entityTypes.field.canBeExported"), yn(details.canExport)],
            ]}
          />
        </Card>
      </VStack>
      <VStack gap="10px">
        <Card title={t("entityTypes.field.relation")}>
          <KV rows={relationRows} />
        </Card>
        <Card title={t("entityTypes.field.information")}>
          <KV
            rows={[
              [t("entityTypes.field.historyRetentionTime"), days(details.histRetention)],
              [t("entityTypes.field.historyDefaultInterval"), days(details.histInterval)],
              [t("entityTypes.field.purgeType"), details.purge],
              [t("entityTypes.field.procedure"), details.procedure],
              [t("entityTypes.field.cloneable"), yn(details.cloneable)],
              [t("entityTypes.field.localizedMessageKey"), details.locKey],
            ]}
          />
        </Card>
      </VStack>
      <VStack gap="10px">
        <Card title={t("entityTypes.field.instances")}>
          <KV
            rows={[
              [t("entityTypes.field.versioned"), yn(details.versioned)],
              [t("entityTypes.field.allowAutomaticChangeSet"), yn(details.allowAutoCS)],
              [
                t("entityTypes.field.makeChangeSetItemsEffectiveOnApproval"),
                yn(details.makeEffective),
              ],
              [t("entityTypes.field.changeSetNameGenerator"), details.csNameGen],
              [t("entityTypes.field.approval"), details.approvalRef],
              [t("entityTypes.field.notifyRequester"), yn(details.notifyReq)],
              [t("entityTypes.field.notifyApprovers"), yn(details.notifyApp)],
              [t("entityTypes.field.useChangeSetApprovalContext"), yn(details.useCsCtx)],
              [t("entityTypes.field.enableAutomaticApproval"), yn(details.autoApproval)],
              [t("entityTypes.field.displayChangeSetOnClone"), yn(details.displayCsClone)],
              [t("entityTypes.field.allowDeleteInstances"), yn(details.allowDelete)],
              [t("entityTypes.field.enableDefaultRevisionDates"), yn(details.defaultRevDates)],
              [t("entityTypes.field.enableVersionCreation"), yn(details.versionCreation)],
              [t("entityTypes.field.newStateForFirstRevision"), details.newStateFirst],
              [t("entityTypes.field.newStateForNextRevisions"), details.newStateNext],
            ]}
          />
        </Card>
      </VStack>
    </Grid>
  );
}

function StateModelsSection({
  models,
  onRefresh,
}: {
  models: StateModel[];
  onRefresh: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const shared = useSharedStyles();
  return (
    <Panel>
      <MiniBar
        groups={[
          {
            buttons: [
              { icon: <ArrowSync20Regular />, label: t("actionBar.refresh"), onClick: onRefresh },
            ],
          },
        ]}
      />
      <div className={styles.countTitle}>
        <Text size={400}>
          {t("entityTypes.detailPage.counts.stateModels", { count: models.length })}
        </Text>
      </div>
      <div className={shared.tableScroll}>
        <Table aria-label={t("entityTypes.sections.stateModels")}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell className={shared.tableHeaderCell}>
                {t("entityTypes.field.name")}
              </TableHeaderCell>
              <TableHeaderCell className={shared.tableHeaderCell}>
                {t("entityTypes.field.description")}
              </TableHeaderCell>
              <TableHeaderCell className={shared.tableHeaderCell}>
                {t("entityTypes.detailPage.tables.mainStateModel")}
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => (
              <TableRow key={model.name}>
                <TableCell className={shared.tableCell}>{model.name}</TableCell>
                <TableCell className={shared.tableCell}>{model.desc}</TableCell>
                <TableCell className={shared.tableCell}>{yn(model.main)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Panel>
  );
}

function OdsSection({
  ods,
  onRefresh,
  onManage,
}: {
  ods: OdsModel;
  onRefresh: () => void;
  onManage: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const shared = useSharedStyles();
  const [odsTab, setOdsTab] = useState<"state" | "history">("state");
  const rules = ods[odsTab];
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
      <div className={styles.tabRow}>
        <TabList
          selectedValue={odsTab}
          onTabSelect={(value) => setOdsTab(value as "state" | "history")}
        >
          <Tab value="state">{t("entityTypes.field.state")}</Tab>
          <Tab value="history">{t("entityTypes.field.historyEnabled")}</Tab>
        </TabList>
      </div>
      <div className={styles.countTitle}>
        <Text size={400}>
          {t("entityTypes.detailPage.counts.odsRetention", { count: rules.length })}
        </Text>
      </div>
      <div className={shared.tableScroll}>
        <Table aria-label={t("entityTypes.sections.odsRetention")}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell className={shared.tableHeaderCell}>
                {t("entityTypes.detailPage.tables.olderThan")}
              </TableHeaderCell>
              <TableHeaderCell className={shared.tableHeaderCell}>
                {t("entityTypes.detailPage.tables.location")}
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className={shared.tableCell}>
                  {rule.n} {rule.unit}
                </TableCell>
                <TableCell className={shared.tableCell}>
                  {rule.loc.toLowerCase() === "default"
                    ? t("entityTypes.detailPage.labels.defaultLocation")
                    : rule.loc}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {rules.length === 0 && (
          <div className={styles.countTitle}>
            <Text>{t("entityTypes.detailPage.empty.noOdsRules")}</Text>
          </div>
        )}
      </div>
    </Panel>
  );
}

const EDIT_MODE = "edit" as const;

export function EntityTypeDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDetailStyles();
  const [, setRev] = useState(0);
  const [section, setSection] = useState<DetailSection>("details");
  const [showLeft, setShowLeft] = useState(true);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const [dialog, setDialog] = useState<DetailDialog | null>(null);

  const { data: record, isLoading } = useEntityType(name);
  const { data: listPage } = useEntityTypes({ page: 1, limit: 100 });

  const entry: EntityTypeStoreEntry | undefined = useMemo(() => {
    if (!record) return undefined;
    const row: EntityTypeRow = {
      name: record.name,
      description: record.description,
      system: record.system,
      relation: record.isRelation,
      versioned: record.versioned,
      state: record.state,
    };
    return entityStore(row);
  }, [record]);

  const entityNames = useMemo(() => (listPage?.data ?? []).map((item) => item.name), [listPage]);

  if (isLoading || !record || !entry) return null;

  const details = entry.details;
  const model: EntityTypeModel = entry.model;

  const refresh = () => setRev((x) => x + 1);
  const openEditDialog = () => setDialog({ type: "edit" });
  const openGenerateDialog = () => setDialog({ type: "gen" });
  const openOdsDialog = () => setDialog({ type: "ods" });
  const openManageDialog = (kind: EntityItemKind) => setDialog({ type: "manage", kind });

  const visibleSections = SECTION_ORDER.filter(
    (key) =>
      (key !== "attribute" || details.withAttributes) &&
      (key !== "opAttr" || details.withOpAttributes) &&
      (key !== "ods" || details.replicateOds),
  );
  const current = visibleSections.includes(section) ? section : "details";

  const saveEdit = (saved: EntityTypeDetails) => {
    entry.details = { ...entry.details, ...saved };
    if (!saved.withAttributes && section === "attribute") setSection("details");
    if (!saved.withOpAttributes && section === "opAttr") setSection("details");
    if (!saved.replicateOds && section === "ods") setSection("details");
    setDialog(null);
    refresh();
  };

  const updateItems = (kind: EntityItemKind, items: EntityItem[]) => {
    model[MODEL_KEY[kind]] = items;
    setDialog(null);
    refresh();
  };

  const updateOds = (ods: OdsModel) => {
    model.ods = ods;
    setDialog(null);
    refresh();
  };

  let content: ReactNode;
  if (current === "details") {
    content = <DetailsSection details={details} />;
  } else if (current === "states") {
    content = <StateModelsSection models={model.stateModels} onRefresh={refresh} />;
  } else if (current === "ods") {
    content = <OdsSection ods={model.ods} onRefresh={refresh} onManage={openOdsDialog} />;
  } else {
    content = (
      <EntityTypeItemList
        key={current}
        kind={current}
        items={model[MODEL_KEY[current]]}
        onRefresh={refresh}
        onManage={() => openManageDialog(current)}
      />
    );
  }

  return (
    <>
      <div className={shared.headerBlock}>
        {!headerCollapsed && (
          <ActionBar>
            <div className={shared.actionBarGroup}>
              <div className={shared.actionBarGroupButtons}>
                <RibbonButton
                  sharedStyles={shared}
                  icon={<ArrowSync24Regular />}
                  label={t("actionBar.refresh")}
                  onClick={refresh}
                />
                <RibbonButton
                  sharedStyles={shared}
                  icon={<Edit24Regular />}
                  label={t("actionBar.edit")}
                  onClick={openEditDialog}
                />
                <RibbonButton
                  sharedStyles={shared}
                  icon={<ArrowExportUp24Regular style={{ transform: "rotate(180deg)" }} />}
                  label={t("actionBar.export")}
                />
              </div>
              <div className={shared.actionBarGroupLabel}>
                {t("entityTypes.detailPage.groups.general")}
              </div>
            </div>
            <div className={shared.actionBarGroup}>
              <div className={shared.actionBarGroupButtons}>
                <RibbonButton
                  sharedStyles={shared}
                  icon={<Flash24Regular />}
                  label={t("actionBar.generate")}
                  onClick={openGenerateDialog}
                />
              </div>
              <div className={shared.actionBarGroupLabel}>
                {t("entityTypes.detailPage.groups.schema")}
              </div>
            </div>
          </ActionBar>
        )}
        <PageHeader collapsed={headerCollapsed} onToggle={() => setHeaderCollapsed((v) => !v)}>
          <HStack align="center" gap="md">
            <DocumentBulletList20Regular />
            <Text size={400} weight="semibold">
              {name}
            </Text>
            <Text size={300} className={styles.stateText}>
              ({details.state})
            </Text>
          </HStack>
        </PageHeader>
      </div>

      <HStack gap="10px" className={styles.body}>
        {showLeft && (
          <VStack gap="none" aria-label={t("common.detailsView")} className={styles.left}>
            <IconButton
              icon={<PanelLeftContract20Regular />}
              ariaLabel={t("common.collapsePanel")}
              onClick={() => setShowLeft(false)}
              className={styles.collapse}
            />
            {visibleSections.map((key) => (
              <Button
                key={key}
                variant="subtle"
                className={mergeClasses(styles.leftItem, current === key && styles.leftActive)}
                aria-current={current === key || undefined}
                onClick={() => setSection(key)}
              >
                {t(SECTION_LABEL_KEYS[key])}
              </Button>
            ))}
          </VStack>
        )}
        <div className={styles.area}>
          {!showLeft && (
            <div style={{ marginBottom: 6 }}>
              <Button
                size="sm"
                variant="subtle"
                icon={<PanelLeftExpand20Regular />}
                aria-label={t("common.expandPanel")}
                onClick={() => setShowLeft(true)}
              />
            </div>
          )}
          {content}
        </div>
      </HStack>

      {dialog?.type === "edit" && (
        <EntityTypeDialog
          mode={EDIT_MODE}
          initial={details}
          existingNames={entityNames}
          entityNames={entityNames}
          onSave={saveEdit}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.type === "manage" && (
        <ManageDialog
          kind={dialog.kind}
          entityName={name}
          entityDesc={details.desc}
          entityState={details.state}
          initial={model[MODEL_KEY[dialog.kind]]}
          versioned={details.versioned}
          entityNames={entityNames}
          onUpdate={(items) => updateItems(dialog.kind, items)}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.type === "ods" && (
        <OdsDialog
          entityName={name}
          entityDesc={details.desc}
          entityState={details.state}
          initial={model.ods}
          onUpdate={updateOds}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.type === "gen" && (
        <GenerateDialog
          name={name}
          desc={details.desc}
          state={details.state}
          onClose={() => setDialog(null)}
        />
      )}
    </>
  );
}
