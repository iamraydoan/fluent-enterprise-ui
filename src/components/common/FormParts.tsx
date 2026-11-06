import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Checkmark20Filled, Dismiss20Filled } from "@/components/icons";
import { Combobox, Dropdown, Option, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { FIELD } from "./formFieldStyle";

const useFormPartsStyles = makeStyles({
  row: {
    display: "grid",
    gridTemplateColumns: "minmax(140px, 200px) minmax(0,1fr)",
    columnGap: "10px",
    alignItems: "start",
    minHeight: "36px",
  },
  label: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    columnGap: "6px",
    textAlign: "right",
    color: "#444",
    fontSize: "13px",
    lineHeight: "18px",
    paddingTop: "9px",
  },
  err: { color: "#B10E1C", fontSize: "12px", paddingTop: "2px" },
  ro: {
    lineHeight: "36px",
    fontSize: "13px",
    wordBreak: "break-word",
    display: "flex",
    alignItems: "center",
    columnGap: "6px",
  },
  h: { fontWeight: 600, fontSize: "14px", color: "#222", padding: "6px 0 10px" },
});

interface FormRowProps {
  label: ReactNode;
  required?: boolean;
  error?: string | null;
  ro?: boolean;
  labelWidth?: number;
  labelIcon?: ReactNode;
  children: ReactNode;
}

export function FormRow({
  label,
  required,
  error,
  ro,
  labelWidth,
  labelIcon,
  children,
}: FormRowProps) {
  const s = useFormPartsStyles();
  return (
    <div
      className={s.row}
      style={labelWidth ? { gridTemplateColumns: `${labelWidth}px minmax(0,1fr)` } : undefined}
    >
      <div className={s.label}>
        {labelIcon}
        <span>
          {required && <span style={{ color: "#C50F1F", marginRight: 6 }}>*</span>}
          {label}:
        </span>
      </div>
      <div style={{ minWidth: 0 }}>
        {ro ? <div className={s.ro}>{children}</div> : children}
        {error && (
          <div className={s.err} role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export function FormSection({ title, children }: { title: ReactNode; children: ReactNode }) {
  const s = useFormPartsStyles();
  return (
    <section style={{ display: "flex", flexDirection: "column", rowGap: 12, paddingBottom: 14 }}>
      <div className={s.h}>{title}</div>
      {children}
    </section>
  );
}

export function YesNo({ value }: { value: boolean }) {
  const { t } = useAppTranslation();
  return value ? (
    <>
      <Checkmark20Filled />
      {t("common.yes")}
    </>
  ) : (
    <>
      <Dismiss20Filled style={{ color: "#8A8A8A" }} />
      {t("common.no")}
    </>
  );
}

interface FormSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  clearable?: boolean;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  invalid?: boolean;
  icon?: ReactNode;
}

export function FormSelect({
  value,
  options,
  onChange,
  clearable = true,
  disabled,
  label,
  placeholder,
  invalid,
  icon,
}: FormSelectProps) {
  const dd = (
    <Dropdown
      clearable={clearable}
      value={value ?? ""}
      selectedOptions={value ? [value] : []}
      disabled={disabled}
      placeholder={placeholder}
      aria-label={label}
      buttonStyle={icon ? { paddingLeft: 34 } : undefined}
      invalid={invalid}
      style={FIELD}
      onOptionSelect={onChange}
    >
      {options.map((o) => (
        <Option key={o} value={o}>
          {o}
        </Option>
      ))}
    </Dropdown>
  );
  return icon ? (
    <div style={{ position: "relative" }}>
      {dd}
      <span
        style={{
          position: "absolute",
          left: 10,
          top: 0,
          bottom: 0,
          display: "grid",
          placeItems: "center",
          color: "#0F6CBD",
          pointerEvents: "none",
        }}
      >
        {icon}
      </span>
    </div>
  ) : (
    dd
  );
}

interface FormComboProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  invalid?: boolean;
}

export function FormCombo({
  value,
  options,
  onChange,
  placeholder,
  disabled,
  label,
  invalid,
}: FormComboProps) {
  const { t } = useAppTranslation();
  const [q, setQ] = useState<string | null>(null);
  const list = options.filter((o) => o.toLowerCase().includes((q ?? "").toLowerCase()));
  return (
    <Combobox
      clearable
      value={q ?? value ?? ""}
      selectedOptions={value ? [value] : []}
      placeholder={placeholder}
      disabled={disabled}
      aria-label={label}
      invalid={invalid}
      style={FIELD}
      onTextChange={setQ}
      onOptionSelect={(v) => {
        onChange(v);
        setQ(null);
      }}
      onOpenChange={(open) => {
        if (!open) setQ(null);
      }}
    >
      {list.map((o) => (
        <Option key={o} value={o}>
          {o}
        </Option>
      ))}
      {list.length === 0 && (
        <Option disabled value="__none">
          {t("common.noResults")}
        </Option>
      )}
    </Combobox>
  );
}

export interface AccessLevelState {
  ent: Record<string, boolean>;
  tpl: Record<string, boolean>;
  [group: string]: Record<string, boolean>;
}

interface AccessGridProps {
  value: AccessLevelState;
  onChange: (value: AccessLevelState) => void;
  readOnly?: boolean;
}

const RO_VIEW = "roView";
const RO_CREATE = "roCreate";
const RO_UPDATE = "roUpdate";
const HID_VIEW = "hidView";
const HID_CREATE = "hidCreate";
const HID_UPDATE = "hidUpdate";

export function AccessGrid({ value, onChange, readOnly }: AccessGridProps) {
  const { t } = useAppTranslation();
  const border = "1px solid #BDBDBD";
  const th: CSSProperties = {
    border,
    background: "#D6D6D6",
    fontWeight: 400,
    fontSize: 12,
    padding: "8px 4px",
    textAlign: "center",
  };
  const rowHead: CSSProperties = {
    border,
    background: "#EDEDED",
    fontSize: 13,
    padding: "10px 8px",
    textAlign: "left",
    fontWeight: 400,
    width: 150,
  };
  const groups: Array<[string, string]> = [
    ["ent", t("entityTypes.access.entity")],
    ["tpl", t("entityTypes.access.template")],
  ];
  const cell = (g: string, key: string, fixed?: boolean) => {
    const on = fixed === true || value[g]?.[key] === true;
    const toggle = () => {
      if (!readOnly && !fixed)
        onChange({ ...value, [g]: { ...value[g], [key]: !value[g]?.[key] } });
    };
    return (
      <td
        key={g + key}
        role="checkbox"
        aria-checked={on}
        aria-label={`${key} ${g}`}
        tabIndex={readOnly === true || fixed === true ? -1 : 0}
        onClick={toggle}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !readOnly && !fixed) {
            e.preventDefault();
            toggle();
          }
        }}
        style={{
          border,
          textAlign: "center",
          height: 36,
          background: on ? "#C6DCEA" : "#EEE",
          cursor: readOnly === true || fixed === true ? "default" : "pointer",
        }}
      >
        {on ? <Checkmark20Filled style={{ color: "#444" }} /> : null}
      </td>
    );
  };
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ borderCollapse: "collapse", width: "100%", minWidth: 640 }}
        aria-label={t("entityTypes.access.title")}
      >
        <thead>
          <tr>
            <th rowSpan={2} style={{ ...th, width: 150 }} />
            {groups.map(([g, l]) => (
              <th key={g} colSpan={3} style={th}>
                {l}
              </th>
            ))}
          </tr>
          <tr>
            {groups.flatMap(([g]) =>
              [
                t("entityTypes.access.view"),
                t("entityTypes.access.create"),
                t("entityTypes.access.update"),
              ].map((c) => (
                <th key={g + c} style={th}>
                  {c}
                </th>
              )),
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th style={rowHead}>{t("entityTypes.access.readOnly")}</th>
            {groups.flatMap(([g]) => [
              cell(g, RO_VIEW, true),
              cell(g, RO_CREATE),
              cell(g, RO_UPDATE),
            ])}
          </tr>
          <tr>
            <th style={rowHead}>{t("entityTypes.access.hidden")}</th>
            {groups.flatMap(([g]) => [cell(g, HID_VIEW), cell(g, HID_CREATE), cell(g, HID_UPDATE)])}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
