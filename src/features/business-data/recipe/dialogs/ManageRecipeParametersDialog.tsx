import { useState } from "react";
import { BaseDialog, DialogFooter, DialogEntityBanner } from "@/components/common";
import { Body1Strong, Button, Checkbox, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

interface ManageRecipeParametersDialogProps {
  open: boolean;
  onClose: () => void;
  recipeName: string;
}

interface RecipeParameter {
  name: string;
  units: string;
  parameterGroup: string;
  type: string;
  value: string;
  overridable: boolean;
}

const TYPES = ["Input", "Constant", "Expression", "Rule"];

const INITIAL: RecipeParameter[] = [
  {
    name: "Mold Temperature",
    units: "°C",
    parameterGroup: "",
    type: "Input",
    value: "100",
    overridable: true,
  },
];

export function ManageRecipeParametersDialog({
  open,
  onClose,
  recipeName,
}: ManageRecipeParametersDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.recipe.dialogs.parameters";
  const [parameters, setParameters] = useState<RecipeParameter[]>(INITIAL);
  const [selected, setSelected] = useState(0);
  const [name, setName] = useState(INITIAL[0].name);
  const [units, setUnits] = useState(INITIAL[0].units);
  const [group, setGroup] = useState("");
  const [type, setType] = useState(INITIAL[0].type);
  const [value, setValue] = useState(INITIAL[0].value);
  const [overridable, setOverridable] = useState(INITIAL[0].overridable);
  const [comments, setComments] = useState("");

  const addParameter = () => {
    const next = [
      ...parameters,
      {
        name: `Parameter ${parameters.length + 1}`,
        units: "",
        parameterGroup: "",
        type: "Constant",
        value: "",
        overridable: false,
      },
    ];
    setParameters(next);
    setSelected(next.length - 1);
    setName(next[next.length - 1].name);
    setUnits("");
    setGroup("");
    setType("Constant");
    setValue("");
    setOverridable(false);
  };

  const removeParameter = (index: number) => {
    const next = parameters.filter((_, i) => i !== index);
    setParameters(
      next.length > 0
        ? next
        : [
            {
              name: "Parameter 1",
              units: "",
              parameterGroup: "",
              type: "Constant",
              value: "",
              overridable: false,
            },
          ],
    );
    setSelected(0);
  };

  const selectParameter = (index: number) => {
    setSelected(index);
    setName(parameters[index].name);
    setUnits(parameters[index].units);
    setGroup(parameters[index].parameterGroup);
    setType(parameters[index].type);
    setValue(parameters[index].value);
    setOverridable(parameters[index].overridable);
  };

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(1100px, 92vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.update`)} />
      }
    >
      <DialogEntityBanner icon="🎛" name={recipeName} />
      <div style={{ display: "flex", columnGap: theme.spacing.lg }}>
        <div style={{ width: 320, flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: theme.spacing.sm,
            }}
          >
            <Body1Strong>{t(`${k}.parameters`)}</Body1Strong>
            <div style={{ display: "flex", columnGap: theme.spacing.xs }}>
              <Button size="sm" variant="subtle" onClick={addParameter}>
                +
              </Button>
              <Button size="sm" variant="subtle" onClick={() => removeParameter(selected)}>
                🗑
              </Button>
            </div>
          </div>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 4,
              minHeight: 300,
              overflow: "auto",
            }}
          >
            {parameters.map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                onClick={() => selectParameter(i)}
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  cursor: "pointer",
                  backgroundColor: i === selected ? theme.color.brandSubtle : "transparent",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: theme.color.textTertiary }}>{p.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", rowGap: theme.spacing.md }}>
          <Body1Strong>{t(`${k}.detailsTitle`)}</Body1Strong>
          <Field label={t(`${k}.parameter`)} required>
            <Input value={name} onChange={setName} />
          </Field>
          <Field label={t(`${k}.units`)}>
            <Input value={units} onChange={setUnits} />
          </Field>
          <Field label={t(`${k}.parameterGroup`)}>
            <Input value={group} onChange={setGroup} />
          </Field>
          <Field label={t(`${k}.type`)} required>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t(`${k}.value`)}>
            <Input value={value} onChange={setValue} />
          </Field>
          <Field label={t(`${k}.overridable`)}>
            <Checkbox
              checked={overridable}
              onChange={setOverridable}
            />
          </Field>
        </div>
      </div>
      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={setComments} />
      </Field>
    </BaseDialog>
  );
}
