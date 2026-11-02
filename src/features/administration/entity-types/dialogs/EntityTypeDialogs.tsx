import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AccessGrid,
  BaseDialog,
  FIELD,
  FormCombo,
  FormRow,
  FormSection,
  FormSelect,
  IconButton,
  YesNo,
  notify,
} from "@/components/common";
import type { AccessLevelState } from "@/components/common";
import {
  Add20Regular,
  Add24Regular,
  ArrowDownload20Regular,
  CheckmarkCircle20Filled,
  ChevronDown20Regular,
  ChevronUp20Regular,
  Delete20Regular,
  Dismiss16Regular,
  DocumentBulletList20Regular,
  DocumentBulletList24Regular,
  Edit20Regular,
  ErrorCircle20Filled,
  Flash20Regular,
  Info20Filled,
  Settings20Regular,
  ShareAndroid20Regular,
  Warning20Filled,
} from "@/components/icons";
import {
  Button,
  Input,
  MessageBar,
  MessageBarBody,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Spinner,
  Switch,
  Tab,
  TabList,
  Text,
  mergeClasses,
} from "@/components/ui";
import type { TranslationKey } from "@/i18n";
import { useAppTranslation } from "@/i18n";
import type {
  AccessFlags,
  AccessLevel,
  EntityItem,
  EntityItemKind,
  EntityTypeDetails,
  Issue,
  OdsModel,
  OdsRule,
  SchemaField,
} from "../entityData";
import {
  CLONE_BEHAVIORS,
  LOCK_TYPES,
  NAME_GENERATORS,
  PURGE_TYPES,
  ROLES,
  SCHEMAS,
  STATES,
  WORKFLOWS,
  detailsFor,
  newItem,
  nid,
  refToOptions,
  validateItems,
} from "../entityData";
import type { LbosState } from "../lbos";
import { STEP_COUNT, lbosState, onLbos, resetLbos, startLbos, targetOf } from "../lbos";
import { useDialogStyles } from "./dialogStyles";

const FIELD_LABEL_KEYS: Record<string, string> = {
  name: "name",
  desc: "description",
  type: "type",
  enabled: "enabled",
  dataGroup: "dataGroup",
  refType: "referenceType",
  refTo: "referenceTo",
  scalar: "scalarType",
  size: "size",
  decimals: "decimalPlaces",
  def: "defaultValue",
  array: "array",
  editableOnClone: "editableOnClone",
  copyOnClone: "copyOnClone",
  importMode: "importUpdateMode",
  refMode: "referenceMode",
  weak: "weakReference",
  weakType: "weakReferenceType",
  weakEntity: "weakReferenceEntity",
  exportAutoInclude: "exportAutoInclude",
  indexed: "indexed",
  reportable: "reportable",
  mandatory: "mandatory",
  searchable: "searchable",
  searchType: "searchType",
  versionedPortion: "versioned",
  localOverrides: "localOverrides",
  historyEnabled: "historyEnabled",
  publishEvent: "publishEventOnCompletion",
  fabLive: "subscribeInFabLive",
  kafka: "publishToKafka",
  range: "range",
  regex: "regularExpression",
  locKey: "key",
  al: "accessLevel",
};

const SECTION_LABEL_KEYS: Record<string, string> = {
  "Property Details": "propertyDetails",
  Content: "content",
  Flags: "flags",
  Validation: "validation",
  "Localized Message": "localizedMessage",
  "Access Level": "accessLevel",
  "Operation Details": "operationDetails",
};

const KIND_TITLES: Record<EntityItemKind, TranslationKey> = {
  property: "entityTypes.manage.title",
  attribute: "entityTypes.manage.attributes",
  operation: "entityTypes.manage.operations",
  opAttr: "entityTypes.manage.operationAttributes",
};

const KIND_LABELS: Record<EntityItemKind, TranslationKey> = {
  property: "entityTypes.sections.properties",
  attribute: "entityTypes.sections.attributes",
  operation: "entityTypes.sections.operations",
  opAttr: "entityTypes.sections.operationAttributes",
};

const toAccessLevel = (state: AccessLevelState): AccessLevel => ({
  ent: { ...state.ent } as unknown as AccessFlags,
  tpl: { ...state.tpl } as unknown as AccessFlags,
});

function useFieldLabels() {
  const { t } = useAppTranslation();
  const field = (k: string, fallback: string): string => {
    const key = FIELD_LABEL_KEYS[k];
    return key === undefined ? fallback : t(`entityTypes.field.${key}` as TranslationKey);
  };
  const section = (name: string): string => {
    const key = SECTION_LABEL_KEYS[name];
    return key === undefined ? name : t(`entityTypes.field.${key}` as TranslationKey);
  };
  return { field, section };
}

interface EntitySubProps {
  name: string;
  state: string;
  desc: string;
  defaultOpen?: boolean;
}

function EntitySub({ name, state, desc, defaultOpen = false }: EntitySubProps) {
  const s = useDialogStyles();
  const { t } = useAppTranslation();
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={s.subWrap}>
      <div className={s.sub}>
        <span className={s.subRow}>
          <span className={s.link}>
            <DocumentBulletList20Regular />
            {name}
          </span>
          {state !== "" && <span> ({state})</span>}
          {desc !== "" && !open && <span className={s.subDesc}>/ {desc}</span>}
        </span>
        <IconButton
          icon={open ? <ChevronUp20Regular /> : <ChevronDown20Regular />}
          onClick={() => setOpen((o) => !o)}
          ariaLabel={
            open ? t("entityTypes.dialog.hideDetails") : t("entityTypes.dialog.showDetails")
          }
          className={s.iconBtn}
        />
      </div>
      {open && (
        <div className={s.subExpand}>
          <FormRow label={t("entityTypes.dialog.description")} labelWidth={160} ro>
            {desc}
          </FormRow>
        </div>
      )}
    </div>
  );
}

function NoticeBar({
  level,
  title,
  children,
}: {
  level: "warn" | "error" | "success";
  title: string;
  children: ReactNode;
}) {
  const s = useDialogStyles();
  const icon =
    level === "warn" ? (
      <Warning20Filled className={s.warnIcon} />
    ) : level === "error" ? (
      <ErrorCircle20Filled className={s.errIcon} />
    ) : (
      <CheckmarkCircle20Filled className={s.okIcon} />
    );
  const border =
    level === "warn" ? s.noticeWarn : level === "error" ? s.noticeError : s.noticeSuccess;
  return (
    <div role="status" className={mergeClasses(s.notice, border)}>
      {icon}
      <div>
        <div className={s.noticeTitle}>{title}</div>
        <div className={s.noticeBody}>{children}</div>
      </div>
    </div>
  );
}

function IssueIcon({ issues }: { issues: Issue[] }) {
  const s = useDialogStyles();
  const { t } = useAppTranslation();
  const [open, setOpen] = useState<"error" | "warn" | null>(null);
  const groups = [
    {
      level: "error",
      icon: <ErrorCircle20Filled className={s.errIcon} />,
      labelKey: "entityTypes.dialog.errors",
      border: s.issueError,
    },
    {
      level: "warn",
      icon: <Warning20Filled className={s.warnIcon} />,
      labelKey: "entityTypes.dialog.warnings",
      border: s.issueWarn,
    },
  ] as const;
  return (
    <>
      {groups.map((g) => {
        const list = issues.filter((i) => i.level === g.level);
        if (list.length === 0) return null;
        return (
          <Popover
            key={g.level}
            open={open === g.level}
            onOpenChange={(o) => setOpen(o ? g.level : null)}
            positioning="below"
            withArrow
          >
            <PopoverTrigger disableButtonEnhancement>
              <IconButton
                icon={g.icon}
                onClick={(e) => e.stopPropagation()}
                ariaLabel={t(g.labelKey as TranslationKey)}
                className={s.iconBtn}
              />
            </PopoverTrigger>
            <PopoverSurface className={mergeClasses(s.issuePop, g.border)}>
              {list.map((issue, n) => (
                <div
                  key={`${g.level}-${n}`}
                  className={n < list.length - 1 ? s.issueGap : undefined}
                >
                  {issue.msg}
                </div>
              ))}
              <IconButton
                icon={<Dismiss16Regular />}
                onClick={() => setOpen(null)}
                ariaLabel={t("common.close")}
                className={s.popClose}
              />
            </PopoverSurface>
          </Popover>
        );
      })}
    </>
  );
}

interface ManageDialogProps {
  kind: EntityItemKind;
  entityName: string;
  entityDesc: string;
  entityState: string;
  initial: EntityItem[];
  versioned: boolean;
  entityNames: string[];
  onUpdate: (items: EntityItem[]) => void;
  onClose: () => void;
}

export function ManageDialog({
  kind,
  entityName,
  entityDesc,
  entityState,
  initial,
  versioned,
  entityNames,
  onUpdate,
  onClose,
}: ManageDialogProps) {
  const s = useDialogStyles();
  const { t } = useAppTranslation();
  const { field, section } = useFieldLabels();
  const [items, setItems] = useState<EntityItem[]>(() => initial.map((i) => ({ ...i })));
  const [selId, setSelId] = useState<string>(() => {
    const found = initial.find((i) => !i.system) ?? initial[Math.min(1, initial.length - 1)];
    return found?.id ?? "";
  });
  const [tried, setTried] = useState(false);
  const issues = useMemo(
    () => validateItems(kind, items, { versioned, entityNames }),
    [kind, items, versioned, entityNames],
  );
  const sel = items.find((i) => i.id === selId) ?? null;
  const hasErrors = [...issues.values()].some((list) =>
    list.some((issue) => issue.level === "error"),
  );

  const updateItem = (id: string, patch: Record<string, unknown>): void => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next: EntityItem = { ...item, ...(patch as Partial<EntityItem>) };
        if ("refType" in patch) {
          next.refTo = "";
          next.refMode = "";
          next.weak = false;
          next.weakType = "";
          next.weakEntity = "";
          next.exportAutoInclude = false;
        }
        if (("scalar" in patch || "refType" in patch || "size" in patch) && kind === "property") {
          const ok =
            next.refType === "None" &&
            ["VarChar", "NVarChar"].includes(next.scalar) &&
            Number(next.size) >= 1 &&
            Number(next.size) <= 512;
          if (!ok) next.searchable = false;
        }
        if ("weak" in patch && !patch.weak) {
          next.weakType = "";
          next.weakEntity = "";
        }
        return next;
      }),
    );
  };

  const addItem = (): void => {
    const item = newItem(kind, items);
    setItems((prev) => [...prev, item]);
    setSelId(item.id);
  };

  const removeItem = (): void => {
    if (!sel || sel.system) return;
    const idx = items.findIndex((i) => i.id === sel.id);
    const next = items.filter((i) => i.id !== sel.id);
    setItems(next);
    setSelId(next[Math.min(idx, next.length - 1)]?.id ?? "");
  };

  const submit = (): void => {
    setTried(true);
    if (!hasErrors) onUpdate(items);
  };

  const schema = SCHEMAS[kind];
  const groups: { name: string; fields: SchemaField[] }[] = [];
  if (sel) {
    const ctx = { versioned, entityNames };
    schema.forEach((f) => {
      if (f.when && !f.when(sel, ctx)) return;
      let g = groups.find((x) => x.name === f.section);
      if (!g) {
        g = { name: f.section, fields: [] };
        groups.push(g);
      }
      g.fields.push(f);
    });
  }

  const renderControl = (f: SchemaField): ReactNode => {
    if (!sel) return null;
    const raw = (sel as unknown as Record<string, unknown>)[f.k];
    const text = typeof raw === "string" ? raw : "";
    const editable = !sel.system || f.edit === true;
    const missing = f.req === true && text.trim() === "";
    const label = field(f.k, f.label);
    if (f.kind === "fixed") return <>{f.value}</>;
    if (!editable) {
      return f.kind === "switch" ? <YesNo value={raw === true} /> : <>{text}</>;
    }
    if (f.kind === "text") {
      return (
        <Input
          value={text}
          onChange={(value) => updateItem(sel.id, { [f.k]: value })}
          style={FIELD}
          aria-label={label}
        />
      );
    }
    if (f.kind === "number") {
      return (
        <Input
          value={text}
          onChange={(value) => updateItem(sel.id, { [f.k]: value.replace(/\D/g, "") })}
          style={{ ...FIELD, width: 300 }}
          aria-label={label}
        />
      );
    }
    if (f.kind === "select") {
      return (
        <FormSelect
          label={label}
          value={text}
          options={f.opts ?? []}
          clearable={f.clearable !== false}
          invalid={missing}
          icon={f.icon === true ? <ShareAndroid20Regular /> : undefined}
          onChange={(value) => updateItem(sel.id, { [f.k]: value })}
        />
      );
    }
    if (f.kind === "combo") {
      return (
        <FormCombo
          label={label}
          value={text}
          invalid={missing}
          options={f.k === "refTo" ? refToOptions(sel.refType, entityNames) : entityNames}
          onChange={(value) => updateItem(sel.id, { [f.k]: value })}
        />
      );
    }
    return (
      <Switch
        checked={raw === true}
        onChange={(checked) => updateItem(sel.id, { [f.k]: checked })}
        aria-label={label}
      />
    );
  };

  return (
    <BaseDialog
      open
      width="1100px"
      title={t(KIND_TITLES[kind])}
      icon={<Settings20Regular />}
      onClose={onClose}
      subHeader={<EntitySub name={entityName} state={entityState} desc={entityDesc} />}
      showComments
      footer={
        <>
          <Button onClick={onClose}>{t("common.cancel")}</Button>
          <Button variant="primary" onClick={submit}>
            {t("entityTypes.dialog.update")}
          </Button>
        </>
      }
    >
      <div className={s.split}>
        <div className={s.col}>
          <div className={s.head}>
            <Text size={400}>{t(KIND_LABELS[kind])}</Text>
            <span className={s.itemName}>
              <IconButton
                icon={<Add20Regular />}
                onClick={addItem}
                ariaLabel={t("entityTypes.dialog.addItem")}
                className={s.iconBtn}
              />
              <IconButton
                icon={<Delete20Regular />}
                onClick={removeItem}
                disabled={!sel || sel.system}
                ariaLabel={t("entityTypes.dialog.removeItem")}
                className={s.iconBtn}
              />
            </span>
          </div>
          <div className={s.list} role="listbox" aria-label={t(KIND_LABELS[kind])}>
            {items.map((i) => (
              <div
                key={i.id}
                role="option"
                aria-selected={i.id === selId}
                className={mergeClasses(s.item, i.id === selId && s.itemOn)}
                onClick={() => setSelId(i.id)}
              >
                <span>
                  {i.name}
                  {i.system && kind === "property" ? ` (${t("entityTypes.manage.system")})` : ""}
                </span>
                <span className={s.itemName}>
                  <IssueIcon issues={issues.get(i.id) ?? []} />
                  {i.id === selId && !i.system && (
                    <IconButton
                      icon={<Delete20Regular />}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem();
                      }}
                      ariaLabel={t("entityTypes.dialog.removeItemName", { name: i.name })}
                      className={s.iconBtn}
                    />
                  )}
                </span>
              </div>
            ))}
            {items.length === 0 && (
              <div className={s.listEmpty}>{t("entityTypes.dialog.nothingDefined")}</div>
            )}
          </div>
        </div>
        <div className={s.col}>
          <div className={s.head} />
          <div className={s.detail}>
            {tried && hasErrors && (
              <MessageBar intent="error" style={{ marginBottom: 8 }}>
                <MessageBarBody>{t("entityTypes.dialog.fixErrors")}</MessageBarBody>
              </MessageBar>
            )}
            {sel ? (
              groups.map((g) => (
                <FormSection key={g.name} title={section(g.name)}>
                  {g.fields.map((f) =>
                    f.kind === "access" ? (
                      <AccessGrid
                        key={f.k}
                        value={{ ent: { ...sel.al.ent }, tpl: { ...sel.al.tpl } }}
                        readOnly={sel.system}
                        onChange={(al) => updateItem(sel.id, { al: toAccessLevel(al) })}
                      />
                    ) : (
                      <FormRow
                        key={f.k}
                        label={field(f.k, f.label)}
                        required={f.req === true && (!sel.system || f.edit === true)}
                        labelWidth={210}
                        ro={!(!sel.system || f.edit === true) || f.kind === "fixed"}
                      >
                        {renderControl(f)}
                      </FormRow>
                    ),
                  )}
                </FormSection>
              ))
            ) : (
              <div className={s.detailEmpty}>{t("entityTypes.dialog.selectItem")}</div>
            )}
          </div>
        </div>
      </div>
    </BaseDialog>
  );
}

type BooleanField = {
  [K in keyof EntityTypeDetails]: EntityTypeDetails[K] extends boolean ? K : never;
}[keyof EntityTypeDetails];

interface EntityTypeDialogProps {
  mode: "create" | "edit";
  initial?: EntityTypeDetails;
  existingNames: string[];
  entityNames: string[];
  onSave: (details: EntityTypeDetails) => void;
  onClose: () => void;
}

export function EntityTypeDialog({
  mode,
  initial,
  existingNames,
  entityNames,
  onSave,
  onClose,
}: EntityTypeDialogProps) {
  const s = useDialogStyles();
  const { t } = useAppTranslation();
  const edit = mode === "edit";
  const [f, setF] = useState<EntityTypeDetails>(() =>
    initial
      ? { ...initial }
      : detailsFor({
          name: "",
          description: "",
          system: false,
          relation: false,
          versioned: false,
          state: "Active",
        }),
  );
  const [show, setShow] = useState(false);

  const set = (patch: Partial<EntityTypeDetails>): void => {
    setF((prev) => {
      const next = { ...prev, ...patch };
      if ("versioned" in patch && !patch.versioned) {
        Object.assign(next, {
          allowAutoCS: false,
          makeEffective: false,
          csNameGen: "",
          notifyReq: false,
          notifyApp: false,
          useCsCtx: false,
          autoApproval: false,
          newStateFirst: "",
          newStateNext: "",
        });
      } else if ("allowAutoCS" in patch && !patch.allowAutoCS) {
        Object.assign(next, {
          makeEffective: false,
          csNameGen: "",
          approvalRef: "",
          notifyReq: false,
          notifyApp: false,
          useCsCtx: false,
          autoApproval: false,
        });
      }
      if ("relation" in patch && !patch.relation) {
        Object.assign(next, {
          sourceEntity: "",
          targetEntity: "",
          lockType: "LockNone",
          cloneBehavior: "NoCopy",
        });
      }
      if ("cloneable" in patch && !patch.cloneable) {
        next.cloneBehavior = "NoCopy";
      }
      return next;
    });
  };

  const applySwitch = (fieldName: BooleanField, checked: boolean): void => {
    const patch: Partial<EntityTypeDetails> = {};
    (patch as Record<string, boolean>)[fieldName] = checked;
    set(patch);
  };

  const name = f.name.trim();
  const errs = {
    name: edit
      ? null
      : name === ""
        ? t("entityTypes.dialog.validation.nameRequired")
        : !/^[A-Za-z][A-Za-z0-9]*$/.test(name)
          ? t("entityTypes.dialog.validation.namePattern")
          : existingNames.some((n) => n.toLowerCase() === name.toLowerCase())
            ? t("entityTypes.dialog.validation.nameUnique")
            : null,
    source:
      f.relation && f.sourceEntity === ""
        ? t("entityTypes.dialog.validation.sourceRequired")
        : null,
    target:
      f.relation && f.targetEntity === ""
        ? t("entityTypes.dialog.validation.targetRequired")
        : null,
    gen:
      f.versioned && f.allowAutoCS && f.csNameGen === ""
        ? t("entityTypes.dialog.validation.generatorRequired")
        : null,
    proc:
      f.purge === "Specific" && f.procedure.trim() === ""
        ? t("entityTypes.dialog.validation.procedureRequired")
        : null,
  };
  const bad = Object.values(errs).some((e) => e !== null);
  const cs = f.versioned && f.allowAutoCS;
  const submit = (): void => {
    setShow(true);
    if (!bad) onSave({ ...f, name: f.name.trim(), desc: f.desc.trim() });
  };

  const Sw = ({
    labelKey,
    fieldName,
    disabled,
  }: {
    labelKey: TranslationKey;
    fieldName: BooleanField;
    disabled?: boolean;
  }) => (
    <FormRow label={t(labelKey)} labelWidth={260}>
      <Switch
        checked={f[fieldName]}
        disabled={disabled}
        onChange={(checked) => applySwitch(fieldName, checked)}
        aria-label={t(labelKey)}
      />
    </FormRow>
  );

  const roleLabel = t("entityTypes.field.role");
  const workflowLabel = t("entityTypes.field.workflow");

  return (
    <BaseDialog
      open
      width="900px"
      title={edit ? t("entityTypes.dialog.editTitle") : t("entityTypes.dialog.createTitle")}
      icon={edit ? <Edit20Regular /> : <Add24Regular />}
      onClose={onClose}
      showComments
      footer={
        <>
          <Button onClick={onClose}>{t("common.cancel")}</Button>
          <Button variant="primary" onClick={submit}>
            {edit ? t("common.save") : t("entityTypes.dialog.create")}
          </Button>
        </>
      }
    >
      <div className={s.body}>
        <FormSection title={t("entityTypes.field.generalData")}>
          <div className={s.tileWrap}>
            <div className={s.tile}>
              <DocumentBulletList24Regular />
            </div>
            <div className={s.tileForm}>
              <FormRow
                label={t("entityTypes.field.name")}
                required
                labelWidth={150}
                error={show ? errs.name : null}
                ro={edit}
              >
                {edit ? (
                  f.name
                ) : (
                  <Input
                    value={f.name}
                    onChange={(value) => set({ name: value })}
                    style={FIELD}
                    aria-label={t("entityTypes.field.name")}
                  />
                )}
              </FormRow>
              <FormRow label={t("entityTypes.field.description")} labelWidth={150}>
                <Input
                  value={f.desc}
                  onChange={(value) => set({ desc: value })}
                  style={FIELD}
                  aria-label={t("entityTypes.field.description")}
                />
              </FormRow>
            </div>
          </div>
        </FormSection>

        <FormSection title={t("entityTypes.field.relation")}>
          <FormRow label={t("entityTypes.field.relation")} labelWidth={260}>
            <Switch
              checked={f.relation}
              disabled={edit}
              onChange={(checked) => set({ relation: checked })}
              aria-label={t("entityTypes.field.relation")}
            />
          </FormRow>
          {f.relation && (
            <FormRow
              label={t("entityTypes.field.sourceEntity")}
              required
              labelWidth={260}
              error={show ? errs.source : null}
            >
              <FormCombo
                label={t("entityTypes.field.sourceEntity")}
                value={f.sourceEntity}
                options={entityNames}
                onChange={(value) => set({ sourceEntity: value })}
              />
            </FormRow>
          )}
          {f.relation && (
            <FormRow
              label={t("entityTypes.field.targetEntity")}
              required
              labelWidth={260}
              error={show ? errs.target : null}
            >
              <FormCombo
                label={t("entityTypes.field.targetEntity")}
                value={f.targetEntity}
                options={entityNames}
                onChange={(value) => set({ targetEntity: value })}
              />
            </FormRow>
          )}
          <FormRow label={t("entityTypes.field.lockType")} labelWidth={260} ro={!f.relation}>
            {f.relation ? (
              <FormSelect
                label={t("entityTypes.field.lockType")}
                clearable={false}
                value={f.lockType}
                options={LOCK_TYPES}
                onChange={(value) => set({ lockType: value })}
              />
            ) : (
              f.lockType
            )}
          </FormRow>
          <FormRow
            label={t("entityTypes.field.cloneBehavior")}
            labelWidth={260}
            ro={!(f.relation && f.cloneable)}
          >
            {f.relation && f.cloneable ? (
              <FormSelect
                label={t("entityTypes.field.cloneBehavior")}
                clearable={false}
                value={f.cloneBehavior}
                options={CLONE_BEHAVIORS}
                onChange={(value) => set({ cloneBehavior: value })}
              />
            ) : (
              f.cloneBehavior
            )}
          </FormRow>
        </FormSection>

        <FormSection title={t("entityTypes.field.instances")}>
          <Sw labelKey="entityTypes.field.versioned" fieldName="versioned" />
          <Sw
            labelKey="entityTypes.field.allowAutomaticChangeSet"
            fieldName="allowAutoCS"
            disabled={!f.versioned}
          />
          {cs && (
            <Sw
              labelKey="entityTypes.field.makeChangeSetItemsEffectiveOnApproval"
              fieldName="makeEffective"
            />
          )}
          {cs && (
            <FormRow
              label={t("entityTypes.field.changeSetNameGenerator")}
              required
              labelWidth={260}
              error={show ? errs.gen : null}
            >
              <FormSelect
                label={t("entityTypes.field.changeSetNameGenerator")}
                value={f.csNameGen}
                options={NAME_GENERATORS}
                clearable={false}
                invalid={show && errs.gen !== null}
                onChange={(value) => set({ csNameGen: value })}
              />
            </FormRow>
          )}
          <FormRow label={t("entityTypes.field.approval")} labelWidth={260}>
            <div className={s.approvalCol}>
              <RadioGroup
                value={f.approvalKind}
                disabled={!cs}
                onChange={(value) => {
                  set({ approvalKind: value });
                  set({ approvalRef: "" });
                }}
                aria-label={t("entityTypes.field.approval")}
              >
                <Radio value="Role" label={roleLabel} />
                <Radio value="Workflow" label={workflowLabel} />
              </RadioGroup>
              {cs && (
                <FormSelect
                  label={f.approvalKind === "Role" ? roleLabel : workflowLabel}
                  value={f.approvalRef}
                  options={f.approvalKind === "Role" ? ROLES : WORKFLOWS}
                  onChange={(value) => set({ approvalRef: value })}
                  placeholder={t("entityTypes.dialog.selectApproval", {
                    kind: (f.approvalKind === "Role" ? roleLabel : workflowLabel).toLowerCase(),
                  })}
                />
              )}
            </div>
          </FormRow>
          <Sw labelKey="entityTypes.field.notifyRequester" fieldName="notifyReq" disabled={!cs} />
          <Sw labelKey="entityTypes.field.notifyApprovers" fieldName="notifyApp" disabled={!cs} />
          <Sw
            labelKey="entityTypes.field.useChangeSetApprovalContext"
            fieldName="useCsCtx"
            disabled={!cs}
          />
          <Sw
            labelKey="entityTypes.field.enableAutomaticApproval"
            fieldName="autoApproval"
            disabled={!cs}
          />
          {!f.versioned && (
            <Sw labelKey="entityTypes.field.displayChangeSetOnClone" fieldName="displayCsClone" />
          )}
          <Sw labelKey="entityTypes.field.allowDeleteInstances" fieldName="allowDelete" />
          {f.versioned && (
            <Sw
              labelKey="entityTypes.field.enableDefaultRevisionDates"
              fieldName="defaultRevDates"
            />
          )}
          {f.versioned && (
            <Sw labelKey="entityTypes.field.enableVersionCreation" fieldName="versionCreation" />
          )}
          {f.versioned && (
            <FormRow label={t("entityTypes.field.newStateForFirstRevision")} labelWidth={260}>
              <FormSelect
                label={t("entityTypes.field.newStateForFirstRevision")}
                value={f.newStateFirst}
                options={STATES}
                onChange={(value) => set({ newStateFirst: value })}
              />
            </FormRow>
          )}
          {f.versioned && (
            <FormRow label={t("entityTypes.field.newStateForNextRevisions")} labelWidth={260}>
              <FormSelect
                label={t("entityTypes.field.newStateForNextRevisions")}
                value={f.newStateNext}
                options={STATES}
                onChange={(value) => set({ newStateNext: value })}
              />
            </FormRow>
          )}
        </FormSection>

        <FormSection title={t("entityTypes.field.flags")}>
          <Sw labelKey="entityTypes.field.uniqueNameRequired" fieldName="uniqueName" />
          <Sw labelKey="entityTypes.field.replicateToOds" fieldName="replicateOds" />
          <Sw labelKey="entityTypes.field.historyEnabled" fieldName="historyEnabled" />
          <Sw labelKey="entityTypes.field.partitioned" fieldName="partitioned" />
          <Sw labelKey="entityTypes.field.visibleInBusinessData" fieldName="visibleBD" />
          <Sw labelKey="entityTypes.field.connectIoTEnabled" fieldName="connectIoT" />
          <Sw labelKey="entityTypes.field.semanticSearchEnabled" fieldName="semanticSearch" />
          <Sw labelKey="entityTypes.field.withAttributes" fieldName="withAttributes" />
          <Sw labelKey="entityTypes.field.withOperationAttributes" fieldName="withOpAttributes" />
          <Sw labelKey="entityTypes.field.systemManagedStateModels" fieldName="sysManagedSM" />
          <Sw labelKey="entityTypes.field.allowMultipleStateModels" fieldName="multipleSM" />
          <Sw labelKey="entityTypes.field.allowBarcodeIds" fieldName="barcodeIds" />
          <Sw labelKey="entityTypes.field.canBeImported" fieldName="canImport" />
          <Sw labelKey="entityTypes.field.canBeExported" fieldName="canExport" />
        </FormSection>

        <FormSection title={t("entityTypes.field.information")}>
          <FormRow label={t("entityTypes.field.historyRetentionTime")} labelWidth={260}>
            <Input
              value={f.histRetention}
              onChange={(value) => set({ histRetention: value.replace(/\D/g, "") })}
              style={{ ...FIELD, width: 300 }}
              aria-label={t("entityTypes.field.historyRetentionTime")}
            />
          </FormRow>
          <FormRow label={t("entityTypes.field.historyDefaultInterval")} labelWidth={260}>
            <Input
              value={f.histInterval}
              onChange={(value) => set({ histInterval: value.replace(/\D/g, "") })}
              style={{ ...FIELD, width: 300 }}
              aria-label={t("entityTypes.field.historyDefaultInterval")}
            />
          </FormRow>
          <FormRow label={t("entityTypes.field.purgeType")} labelWidth={260}>
            <FormSelect
              label={t("entityTypes.field.purgeType")}
              clearable={false}
              value={f.purge}
              options={PURGE_TYPES}
              onChange={(value) => set({ purge: value })}
            />
          </FormRow>
          {f.purge === "Specific" && (
            <FormRow
              label={t("entityTypes.field.procedure")}
              required
              labelWidth={260}
              error={show ? errs.proc : null}
            >
              <Input
                value={f.procedure}
                onChange={(value) => set({ procedure: value })}
                style={FIELD}
                aria-label={t("entityTypes.field.procedure")}
              />
            </FormRow>
          )}
          <Sw labelKey="entityTypes.field.cloneable" fieldName="cloneable" />
          <FormRow label={t("entityTypes.field.localizedMessageKey")} labelWidth={260}>
            <Input
              value={f.locKey}
              onChange={(value) => set({ locKey: value })}
              style={FIELD}
              aria-label={t("entityTypes.field.localizedMessageKey")}
            />
          </FormRow>
        </FormSection>
      </div>
    </BaseDialog>
  );
}

const UNITS = ["Days", "Weeks", "Months", "Years"];
const LOCATIONS = ["default", "cold", "archive", "Delete"];

function DeleteWarning() {
  const s = useDialogStyles();
  const { t } = useAppTranslation();
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen} positioning="above" withArrow>
      <PopoverTrigger disableButtonEnhancement>
        <IconButton
          icon={<Warning20Filled className={s.warnIcon} />}
          onClick={(e) => e.stopPropagation()}
          ariaLabel={t("entityTypes.ods.warning")}
          className={s.iconBtn}
        />
      </PopoverTrigger>
      <PopoverSurface className={s.warnPop}>
        <div className={s.warnHead}>
          <span className={s.warnHeadLabel}>
            <Warning20Filled />
            {t("entityTypes.ods.warning")}
          </span>
          <IconButton
            icon={<Dismiss16Regular />}
            onClick={() => setOpen(false)}
            ariaLabel={t("common.close")}
            className={s.iconBtn}
          />
        </div>
        <div className={s.warnBody}>{t("entityTypes.ods.deleteWarning")}</div>
      </PopoverSurface>
    </Popover>
  );
}

interface OdsDialogProps {
  entityName: string;
  entityDesc: string;
  entityState: string;
  initial: OdsModel;
  onUpdate: (ods: OdsModel) => void;
  onClose: () => void;
}

export function OdsDialog({
  entityName,
  entityDesc,
  entityState,
  initial,
  onUpdate,
  onClose,
}: OdsDialogProps) {
  const s = useDialogStyles();
  const { t } = useAppTranslation();
  const [tab, setTab] = useState<"state" | "history">("state");
  const [data, setData] = useState<OdsModel>(() => ({
    state: initial.state.map((x) => ({ ...x })),
    history: initial.history.map((x) => ({ ...x })),
  }));
  const [selId, setSelId] = useState<string | null>(() => initial.state[0]?.id ?? null);
  const list = data[tab];
  const cur = list.find((x) => x.id === selId) ?? list[0] ?? null;

  const patchRule = (id: string, patch: Partial<OdsRule>): void => {
    setData((d) => ({ ...d, [tab]: d[tab].map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
  };
  const addRule = (): void => {
    const rule: OdsRule = { id: nid(), n: "1", unit: "Years", loc: "default" };
    setData((d) => ({ ...d, [tab]: [...d[tab], rule] }));
    setSelId(rule.id);
  };
  const deleteRule = (): void => {
    if (!cur) return;
    setData((d) => ({ ...d, [tab]: d[tab].filter((x) => x.id !== cur.id) }));
    setSelId(null);
  };
  const invalid = [...data.state, ...data.history].some(
    (x) => Number(x.n) === 0 || x.unit === "" || x.loc === "",
  );

  const handleTabSelect = (value: string): void => {
    setTab(value === "history" ? "history" : "state");
    setSelId(null);
  };

  return (
    <BaseDialog
      open
      width="1000px"
      title={t("entityTypes.ods.title")}
      icon={<Settings20Regular />}
      onClose={onClose}
      subHeader={<EntitySub name={entityName} state={entityState} desc={entityDesc} />}
      headerExtra={
        <div className={s.odsTabs}>
          <TabList
            size="sm"
            selectedValue={tab}
            onTabSelect={handleTabSelect}
            aria-label={t("entityTypes.ods.title")}
          >
            <Tab value="state" className={s.tabUpper}>
              {t("entityTypes.ods.state")}
            </Tab>
            <Tab value="history" className={s.tabUpper}>
              {t("entityTypes.ods.history")}
            </Tab>
          </TabList>
        </div>
      }
      showComments
      footer={
        <>
          <Info20Filled className={s.footInfo} aria-label={t("entityTypes.field.information")} />
          <Button onClick={onClose}>{t("common.cancel")}</Button>
          <Button variant="primary" disabled={invalid} onClick={() => onUpdate(data)}>
            {t("entityTypes.dialog.update")}
          </Button>
        </>
      }
    >
      <div className={s.split}>
        <div className={s.col}>
          <div className={s.head}>
            <Text size={400}>{t("entityTypes.ods.retention")}</Text>
            <span className={s.itemName}>
              <IconButton
                icon={<Add20Regular />}
                onClick={addRule}
                ariaLabel={t("entityTypes.dialog.addItem")}
                className={s.iconBtn}
              />
              <IconButton
                icon={<Delete20Regular />}
                onClick={deleteRule}
                disabled={!cur}
                ariaLabel={t("entityTypes.dialog.removeItem")}
                className={s.iconBtn}
              />
            </span>
          </div>
          <div
            className={s.list}
            role="listbox"
            aria-label={t("entityTypes.ods.retentionInstances")}
          >
            {list.map((x) => (
              <div
                key={x.id}
                role="option"
                aria-selected={cur?.id === x.id}
                className={mergeClasses(s.item, cur?.id === x.id && s.itemOn)}
                onClick={() => setSelId(x.id)}
              >
                <span className={s.odsItem}>
                  <div className={s.odsItemTitle}>
                    {x.n === "" ? "?" : x.n} {x.unit}
                  </div>
                  <div>{x.loc}</div>
                </span>
                <span className={s.odsItemRow}>
                  {x.loc === "Delete" && (
                    <Warning20Filled
                      className={s.warnIcon}
                      aria-label={t("entityTypes.ods.warning")}
                    />
                  )}
                  {cur?.id === x.id && (
                    <IconButton
                      icon={<Delete20Regular />}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRule();
                      }}
                      ariaLabel={t("entityTypes.dialog.removeItem")}
                      className={s.iconBtn}
                    />
                  )}
                </span>
              </div>
            ))}
            {list.length === 0 && <div className={s.listEmpty}>{t("entityTypes.ods.noRules")}</div>}
          </div>
        </div>
        <div className={s.col}>
          <div className={s.head}>
            <Text size={400}>{t("entityTypes.ods.itemDetails")}</Text>
          </div>
          {cur && (
            <div className={mergeClasses(s.detail, s.odsDetail)}>
              <FormRow label={t("entityTypes.ods.olderThan")} required labelWidth={200}>
                <span className={s.odsOlderThan}>
                  <Input
                    value={cur.n}
                    onChange={(value) => patchRule(cur.id, { n: value.replace(/\D/g, "") })}
                    style={{ ...FIELD, width: 200 }}
                    aria-label={t("entityTypes.ods.olderThan")}
                  />
                  <div className={s.unitWrap}>
                    <FormSelect
                      label={t("entityTypes.ods.unit")}
                      value={cur.unit}
                      options={UNITS}
                      onChange={(value) => patchRule(cur.id, { unit: value })}
                    />
                  </div>
                </span>
              </FormRow>
              <FormRow
                label={t("entityTypes.ods.location")}
                required
                labelWidth={200}
                labelIcon={cur.loc === "Delete" ? <DeleteWarning /> : undefined}
              >
                <FormSelect
                  label={t("entityTypes.ods.location")}
                  value={cur.loc}
                  options={LOCATIONS}
                  onChange={(value) => patchRule(cur.id, { loc: value })}
                />
              </FormRow>
              <FormRow label={t("entityTypes.ods.onlyForTerminated")} labelWidth={200} ro>
                <YesNo value />
              </FormRow>
            </div>
          )}
        </div>
      </div>
    </BaseDialog>
  );
}

interface GenerateDialogProps {
  name: string;
  desc: string;
  state: string;
  onClose: () => void;
}

export function GenerateDialog({ name, desc, state, onClose }: GenerateDialogProps) {
  const s = useDialogStyles();
  const { t } = useAppTranslation();
  const run = (): void => {
    onClose();
    setTimeout(() => notify("success", t("entityTypes.generate.success", { name })), 1200);
  };
  return (
    <BaseDialog
      open
      size="md"
      title={t("entityTypes.generate.title")}
      icon={<Flash20Regular />}
      onClose={onClose}
      subHeader={<EntitySub name={name} state={state} desc={desc} defaultOpen />}
      footer={
        <>
          <Button onClick={onClose}>{t("common.cancel")}</Button>
          <Button variant="primary" onClick={run}>
            {t("entityTypes.generate.generate")}
          </Button>
        </>
      }
    >
      <div className={s.generateBody}>
        {t("entityTypes.generate.body1")}
        <br />
        {t("entityTypes.generate.body2")}
      </div>
    </BaseDialog>
  );
}

interface LbosDialogProps {
  onClose: () => void;
}

export function LbosDialog({ onClose }: LbosDialogProps) {
  const s = useDialogStyles();
  const { t } = useAppTranslation();
  const [st, setSt] = useState<LbosState>(() => {
    const current = lbosState();
    return current.phase === "running" ? current : { ...current, phase: "idle" };
  });
  useEffect(() => {
    const off = onLbos(setSt);
    if (lbosState().phase !== "running") startLbos();
    return off;
  }, []);
  const running = st.phase === "running" || st.phase === "idle";
  const close = (): void => {
    resetLbos();
    onClose();
  };
  const download = (): void => {
    notify("success", t("entityTypes.lbos.downloadStarted"));
    close();
  };
  const step = Math.max(st.step, 1);

  return (
    <BaseDialog
      open
      size="md"
      title={t("entityTypes.lbos.title")}
      icon={<ArrowDownload20Regular />}
      onClose={close}
      showComments={!running}
      footer={
        running ? (
          <Button onClick={close}>{t("common.close")}</Button>
        ) : (
          <>
            <Button onClick={close}>{t("common.cancel")}</Button>
            <Button variant="primary" onClick={download}>
              {t("entityTypes.dialog.download")}
            </Button>
          </>
        )
      }
    >
      {running && (
        <>
          <NoticeBar level="warn" title={t("entityTypes.lbos.updating")}>
            {t("entityTypes.lbos.updatingBody")}
          </NoticeBar>
          <div className={s.lbosCenter}>
            <Spinner size="large" aria-label={t("entityTypes.lbos.generatingAria")} />
            <div className={s.lbosStep}>
              <b>{t("entityTypes.lbos.stepOf", { step, count: STEP_COUNT, pct: st.pct })}</b>
              {": "}
              {t("entityTypes.lbos.generating", { target: targetOf(step) })}
            </div>
          </div>
        </>
      )}
      {st.phase === "done" && (
        <NoticeBar level="success" title={t("entityTypes.lbos.success")}>
          {t("entityTypes.lbos.successBody")}
        </NoticeBar>
      )}
      {st.phase === "failed" && (
        <>
          <NoticeBar level="error" title={t("entityTypes.lbos.failed")}>
            {t("entityTypes.lbos.failedBody", { date: st.last })}
          </NoticeBar>
          <div className={s.lbosErrors}>
            <span className={s.lbosErrorsLabel}>{`${t("entityTypes.lbos.errors")}:`}</span>
            {t("entityTypes.lbos.errorsBody")}
          </div>
        </>
      )}
    </BaseDialog>
  );
}
