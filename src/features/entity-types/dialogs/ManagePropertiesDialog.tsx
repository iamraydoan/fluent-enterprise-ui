import { useMemo, useState } from "react";
import { useUpdateEntityTypeProperties } from "@/api";
import type { EntityTypeProperty, PropertySearchType } from "@/api";
import {
  Add24Regular,
  Delete20Regular,
  Dismiss16Regular,
  Warning12Filled,
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
import { cardSurface } from "@/styles/shared";
import { DEFAULT_SEARCH_TYPE, isContainsSearchType, searchTypeLabelKey } from "../propertyUtils";

const MAX_SEARCHABLE = 2;

const useDialogStyles = makeStyles({
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "24px",
    boxSizing: "border-box",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  surface: {
    width: "min(1100px, calc(100vw - 48px))",
    height: "min(760px, calc(100vh - 48px))",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    ...cardSurface,
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "48px",
    padding: "0 16px",
    backgroundColor: "#DDE1E7",
    flexShrink: 0,
  },
  headTitle: { display: "flex", alignItems: "center", columnGap: "10px" },
  body: {
    flexGrow: 1,
    minHeight: 0,
    display: "grid",
    gridTemplateColumns: "300px minmax(0, 1fr)",
    columnGap: "24px",
    padding: "16px 24px",
    overflow: "hidden",
  },
  listPane: { display: "flex", flexDirection: "column", minHeight: 0 },
  listHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  listActions: { display: "flex", columnGap: "4px" },
  list: {
    flexGrow: 1,
    minHeight: 0,
    overflowY: "auto",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: "#fff",
  },
  listItem: {
    width: "100%",
    display: "block",
    padding: "10px 12px",
    border: "none",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: "transparent",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    fontSize: "13px",
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  listItemSelected: { backgroundColor: tokens.colorNeutralBackground1Selected },
  formPane: { minHeight: 0, overflowY: "auto", paddingRight: "8px" },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: tokens.fontWeightSemibold,
    margin: "16px 0 8px",
  },
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "160px minmax(0, 1fr)",
    alignItems: "center",
    columnGap: "12px",
    marginBottom: "8px",
  },
  fieldLabel: { fontSize: "13px", color: tokens.colorNeutralForeground2, textAlign: "right" },
  alert: {
    display: "flex",
    alignItems: "flex-start",
    columnGap: "8px",
    padding: "10px 12px",
    borderRadius: tokens.borderRadiusMedium,
    marginBottom: "12px",
    fontSize: "13px",
  },
  alertError: {
    backgroundColor: tokens.colorPaletteRedBackground1,
    borderLeft: `3px solid ${tokens.colorPaletteRedBorder1}`,
  },
  alertWarning: {
    backgroundColor: tokens.colorPaletteYellowBackground1,
    borderLeft: `3px solid ${tokens.colorPaletteYellowBorder1}`,
  },
  foot: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    columnGap: "8px",
    padding: "12px 24px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
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
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.surface}
        role="dialog"
        aria-label={t("entityTypes.manage.title")}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.head}>
          <div className={styles.headTitle}>
            <Text weight="semibold" size={400}>
              {t("entityTypes.manage.title")}
            </Text>
          </div>
          <Button
            appearance="subtle"
            icon={<Dismiss16Regular />}
            onClick={onClose}
            aria-label={t("common.close")}
          />
        </div>
        <div className={styles.body}>
          <div className={styles.listPane}>
            <div className={styles.listHead}>
              <Text weight="semibold" size={300}>
                {t("entityTypes.manage.properties")}
              </Text>
              <div className={styles.listActions}>
                <Button
                  appearance="subtle"
                  size="small"
                  icon={<Add24Regular />}
                  aria-label={t("entityTypes.manage.add")}
                  onClick={() => {}}
                />
                <Button
                  appearance="subtle"
                  size="small"
                  icon={<Delete20Regular />}
                  aria-label={t("entityTypes.manage.remove")}
                  onClick={() => {}}
                />
              </div>
            </div>
            <div
              className={styles.list}
              role="listbox"
              aria-label={t("entityTypes.manage.properties")}
            >
              {properties.map((property) => (
                <button
                  key={property.name}
                  className={`${styles.listItem} ${property.name === selected ? styles.listItemSelected : ""}`}
                  onClick={() => setSelected(property.name)}
                  role="option"
                  aria-selected={property.name === selected}
                >
                  {property.name}
                  {property.isSystem ? ` (${t("entityTypes.manage.system")})` : ""}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.formPane}>
            {error && (
              <div className={`${styles.alert} ${styles.alertError}`} role="alert">
                <Warning12Filled />
                <span>{error}</span>
              </div>
            )}
            {hasContains && (
              <div className={`${styles.alert} ${styles.alertWarning}`} role="status">
                <Warning12Filled />
                <span>{t("entityTypes.manage.containsWarning")}</span>
              </div>
            )}
            {selectedProperty && (
              <PropertyForm
                property={selectedProperty}
                onPatch={(partial) => applyPatch(selectedProperty.name, partial)}
              />
            )}
          </div>
        </div>
        <div className={styles.foot}>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={handleUpdate} disabled={update.isPending}>
            {t("common.update")}
          </Button>
        </div>
      </div>
    </div>
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
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("entityTypes.property.name")}</span>
        <Text size={300}>{property.name}</Text>
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("entityTypes.property.description")}</span>
        <Input
          size="small"
          value={property.description}
          onChange={(_, data) => onPatch({ description: data.value })}
          disabled={property.isSystem}
        />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("entityTypes.property.kind")}</span>
        <Text size={300}>{property.kind}</Text>
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("entityTypes.property.enabled")}</span>
        <Checkbox
          checked={property.enabled}
          onChange={(_, data) => onPatch({ enabled: data.checked === true })}
          disabled={property.isSystem}
        />
      </div>

      <div className={styles.sectionTitle}>{t("entityTypes.manage.content")}</div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("entityTypes.property.referenceType")}</span>
        <Text size={300}>{property.referenceType}</Text>
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("entityTypes.property.scalarType")}</span>
        <Text size={300}>{property.scalarType}</Text>
      </div>
      {property.size !== undefined && (
        <div className={styles.fieldRow}>
          <span className={styles.fieldLabel}>{t("entityTypes.property.size")}</span>
          <Text size={300}>{property.size}</Text>
        </div>
      )}

      <div className={styles.sectionTitle}>{t("entityTypes.manage.flags")}</div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("entityTypes.property.searchable")}</span>
        <Checkbox
          checked={property.searchable}
          disabled={!searchableAllowed || isName || property.isSystem}
          onChange={(_, data) => {
            const searchable = data.checked === true;
            onPatch({
              searchable,
              searchType: searchable ? (property.searchType ?? DEFAULT_SEARCH_TYPE) : undefined,
            });
          }}
        />
      </div>
      {!searchableAllowed && !isName && (
        <div className={styles.fieldRow}>
          <span />
          <Text size={200}>{t("entityTypes.manage.searchableNotAllowed")}</Text>
        </div>
      )}
      {property.searchable && (
        <div className={styles.fieldRow}>
          <span className={styles.fieldLabel}>{t("entityTypes.property.searchType")}</span>
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Button appearance="subtle" size="small" disabled={isName || property.isSystem}>
                {t(searchTypeLabelKey(property.searchType ?? DEFAULT_SEARCH_TYPE))}
              </Button>
            </MenuTrigger>
            <MenuPopover>
              <MenuList
                checkedValues={{ searchType: [property.searchType ?? DEFAULT_SEARCH_TYPE] }}
                onCheckedValueChange={(_, data) =>
                  onPatch({
                    searchType: data.checkedItems[0] as PropertySearchType,
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
        </div>
      )}
    </>
  );
}
