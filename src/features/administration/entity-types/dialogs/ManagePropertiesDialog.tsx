import { useMemo, useState } from "react";
import { useUpdateEntityTypeProperties } from "@/api";
import type { EntityTypeProperty, PropertySearchType } from "@/api";
import { BaseDialog, FormField, OptionItem, Grid, HStack, VStack  } from "@/components/common";
import { Add24Regular, Delete20Regular, Warning12Filled } from "@/components/icons";
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
import { theme } from "@/styles/theme";
import { DEFAULT_SEARCH_TYPE, isContainsSearchType, searchTypeLabelKey } from "../propertyUtils";

const MAX_SEARCHABLE = 2;

const useDialogStyles = makeStyles({
  bodyGrid: {
    minHeight: 0,
  },
  headTitle: { display: "flex", alignItems: "center", columnGap: "10px" },
  listPane: {
    minHeight: 0,
  },
  listHead: {
    marginBottom: "8px",
  },
  
  list: {
    flexGrow: 1,
    minHeight: 0,
    overflowY: "auto",
    border: `1px solid ${theme.color.border}`,
    backgroundColor: theme.color.surface,
  },
  listItem: {
    width: "100%",
    display: "block",
    padding: `10px ${theme.spacing.md}`,
    border: "none",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    backgroundColor: "transparent",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    fontSize: "13px",
    ":hover": { backgroundColor: theme.color.surfaceHover },
  },
  formPane: { minHeight: 0, overflowY: "auto", paddingRight: "8px" },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: theme.font.weightSemibold,
    margin: `${theme.spacing.lg} 0 ${theme.spacing.sm}`,
  },
  alert: {
    padding: "10px 12px",
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    fontSize: "13px",
  },
  alertError: {
    backgroundColor: theme.color.dangerEmphasis,
    borderLeft: `3px solid ${theme.color.borderDanger}`,
  },
  alertWarning: {
    backgroundColor: theme.color.warningEmphasis,
    borderLeft: `3px solid ${theme.color.borderWarning}`,
  },
});

function canBeSearchable(property: EntityTypeProperty): boolean {
  if (property.name === "Name") return true;
  return (
    property.referenceType === "None" &&
    (property.scalarType === "Varchar" || property.scalarType === "NVarchar") &&
    (property.size ?? 0) >= 1 &&
    (property.size ?? 0) <= 512
  );
}

interface ManagePropertiesDialogProps {
  entityName: string;
  properties: EntityTypeProperty[];
  onClose: () => void;
}

export function ManagePropertiesDialog({
  entityName,
  properties: initial,
  onClose,
}: ManagePropertiesDialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [properties, setProperties] = useState<EntityTypeProperty[]>(initial);
  const [selected, setSelected] = useState<string>(initial[0]?.name ?? "");
  const [error, setError] = useState<string | null>(null);
  const update = useUpdateEntityTypeProperties(entityName);

  const selectedProperty = properties.find((property) => property.name === selected);

  const searchableCount = useMemo(
    () => properties.filter((property) => property.searchable && property.name !== "Name").length,
    [properties],
  );
  const hasContains = properties.some(
    (property) => property.searchable && isContainsSearchType(property.searchType),
  );

  const applyPatch = (name: string, patch: Partial<EntityTypeProperty>) =>
    setProperties((current) =>
      current.map((property) => (property.name === name ? { ...property, ...patch } : property)),
    );

  const handleUpdate = () => {
    if (searchableCount > MAX_SEARCHABLE) {
      setError(t("entityTypes.manage.searchableLimitError"));
      return;
    }
    setError(null);
    update.mutate(properties, { onSuccess: onClose });
  };

  return (
    <BaseDialog
      open
      title={t("entityTypes.manage.title")}
      onClose={onClose}
      width="1100px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button variant="primary" onClick={handleUpdate} disabled={update.isPending}>
            {t("common.update")}
          </Button>
        </>
      }
    >
      <Grid columns="300px minmax(0, 1fr)" gap="24px" className={styles.bodyGrid}>
        <VStack className={styles.listPane}>
          <HStack align="center" justify="space-between" className={styles.listHead}>
            <Text weight="semibold" size={300}>
              {t("entityTypes.manage.properties")}
            </Text>
            <HStack gap="4px">
              <Button
                variant="subtle"
                size="sm"
                icon={<Add24Regular />}
                aria-label={t("entityTypes.manage.add")}
                onClick={() => {}}
              />
              <Button
                variant="subtle"
                size="sm"
                icon={<Delete20Regular />}
                aria-label={t("entityTypes.manage.remove")}
                onClick={() => {}}
              />
            </HStack>
          </HStack>
          <div
            className={styles.list}
            role="listbox"
            aria-label={t("entityTypes.manage.properties")}
          >
            {properties.map((property) => (
              <OptionItem
                key={property.name}
                title={
                  <>
                    {property.name}
                    {property.isSystem ? ` (${t("entityTypes.manage.system")})` : ""}
                  </>
                }
                selected={property.name === selected}
                onClick={() => setSelected(property.name)}
                ariaLabel={property.name}
              />
            ))}
          </div>
        </VStack>
        <div className={styles.formPane}>
          {error && (
            <HStack gap="8px" align="flex-start" className={`${styles.alert} ${styles.alertError}`} role="alert">
              <Warning12Filled />
              <span>{error}</span>
            </HStack>
          )}
          {hasContains && (
            <HStack gap="8px" align="flex-start" className={`${styles.alert} ${styles.alertWarning}`} role="status">
              <Warning12Filled />
              <span>{t("entityTypes.manage.containsWarning")}</span>
            </HStack>
          )}
          {selectedProperty && (
            <PropertyForm
              property={selectedProperty}
              onPatch={(partial) => applyPatch(selectedProperty.name, partial)}
            />
          )}
        </div>
      </Grid>
    </BaseDialog>
  );
}

function PropertyForm({
  property,
  onPatch,
}: {
  property: EntityTypeProperty;
  onPatch: (patch: Partial<EntityTypeProperty>) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const searchableAllowed = canBeSearchable(property);
  const isName = property.name === "Name";

  return (
    <>
      <div className={styles.sectionTitle}>{t("entityTypes.manage.propertyDetails")}</div>
      <FormField label={t("entityTypes.property.name")} labelWidth="160px" labelAlign="right">
        <Text size={300}>{property.name}</Text>
      </FormField>
      <FormField label={t("entityTypes.property.description")} labelWidth="160px" labelAlign="right">
        <Input
          size="sm"
          value={property.description}
          onChange={(value) => onPatch({ description: value })}
          disabled={property.isSystem}
        />
      </FormField>
      <FormField label={t("entityTypes.property.kind")} labelWidth="160px" labelAlign="right">
        <Text size={300}>{property.kind}</Text>
      </FormField>
      <FormField label={t("entityTypes.property.enabled")} labelWidth="160px" labelAlign="right">
        <Checkbox
          checked={property.enabled}
          onChange={(checked) => onPatch({ enabled: checked === true })}
          disabled={property.isSystem}
        />
      </FormField>

      <div className={styles.sectionTitle}>{t("entityTypes.manage.content")}</div>
      <FormField label={t("entityTypes.property.referenceType")} labelWidth="160px" labelAlign="right">
        <Text size={300}>{property.referenceType}</Text>
      </FormField>
      <FormField label={t("entityTypes.property.scalarType")} labelWidth="160px" labelAlign="right">
        <Text size={300}>{property.scalarType}</Text>
      </FormField>
      {property.size !== undefined && (
        <FormField label={t("entityTypes.property.size")} labelWidth="160px" labelAlign="right">
        <Text size={300}>{property.size}</Text>
      </FormField>
      )}

      <div className={styles.sectionTitle}>{t("entityTypes.manage.flags")}</div>
      <FormField label={t("entityTypes.property.searchable")} labelWidth="160px" labelAlign="right">
        <Checkbox
          checked={property.searchable}
          disabled={!searchableAllowed || isName || property.isSystem}
          onChange={(checked) => {
            const searchable = checked === true;
            onPatch({
              searchable,
              searchType: searchable ? (property.searchType ?? DEFAULT_SEARCH_TYPE) : undefined,
            });
          }}
        />
      </FormField>
      {!searchableAllowed && !isName && (
        <FormField label="" labelWidth="160px" labelAlign="right">
          <Text size={200}>{t("entityTypes.manage.searchableNotAllowed")}</Text>
        </FormField>
      )}
      {property.searchable && (
        <FormField label={t("entityTypes.property.searchType")} labelWidth="160px" labelAlign="right">
        <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Button variant="subtle" size="sm" disabled={isName || property.isSystem}>
                {t(searchTypeLabelKey(property.searchType ?? DEFAULT_SEARCH_TYPE))}
              </Button>
            </MenuTrigger>
            <MenuPopover>
              <MenuList
                checkedValues={{ searchType: [property.searchType ?? DEFAULT_SEARCH_TYPE] }}
                onCheckedValueChange={(checkedItems) =>
                  onPatch({
                    searchType: checkedItems[0] as PropertySearchType,
                  })
                }
              >
                <MenuItemRadio name="searchType" value="StartsWith">
                  {t("entityTypes.searchType.startswith")}
                </MenuItemRadio>
                <MenuItemRadio name="searchType" value="Contains">
                  {t("entityTypes.searchType.contains")}
                </MenuItemRadio>
              </MenuList>
            </MenuPopover>
          </Menu>
      </FormField>
      )}
    </>
  );
}
