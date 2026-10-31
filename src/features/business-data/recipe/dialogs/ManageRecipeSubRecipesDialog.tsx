import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Body1Strong, Button, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface ManageRecipeSubRecipesDialogProps {
  open: boolean;
  onClose: () => void;
  recipeName: string;
}

interface SubRecipe {
  recipe: string;
  displayName: string;
  expressions: string;
}

const INITIAL: SubRecipe[] = [
  { recipe: "Baking Cookies [A]", displayName: "Baking Cookies", expressions: "$temperature" },
  { recipe: "Cookies Recipe-01 [A]", displayName: "Cookies Recipe-01", expressions: "" },
];

export function ManageRecipeSubRecipesDialog({
  open,
  onClose,
  recipeName,
}: ManageRecipeSubRecipesDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.recipe.dialogs.subRecipes";
  const [subRecipes, setSubRecipes] = useState<SubRecipe[]>(INITIAL);
  const [selected, setSelected] = useState(0);
  const [recipe, setRecipe] = useState(INITIAL[0].recipe);
  const [displayName, setDisplayName] = useState(INITIAL[0].displayName);
  const [expressions, setExpressions] = useState(INITIAL[0].expressions);
  const [comments, setComments] = useState("");

  const addSubRecipe = () => {
    const next = [...subRecipes, { recipe: "", displayName: "", expressions: "" }];
    setSubRecipes(next);
    setSelected(next.length - 1);
    setRecipe("");
    setDisplayName("");
    setExpressions("");
  };

  const removeSubRecipe = (index: number) => {
    const next = subRecipes.filter((_, i) => i !== index);
    setSubRecipes(next.length > 0 ? next : [{ recipe: "", displayName: "", expressions: "" }]);
    setSelected(0);
    if (next[0]) {
      setRecipe(next[0].recipe);
      setDisplayName(next[0].displayName);
      setExpressions(next[0].expressions);
    }
  };

  const selectSubRecipe = (index: number) => {
    setSelected(index);
    setRecipe(subRecipes[index].recipe);
    setDisplayName(subRecipes[index].displayName);
    setExpressions(subRecipes[index].expressions);
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
      <div style={{ marginBottom: 12, color: "#0078d4" }}>🎛 {recipeName}</div>
      <div style={{ display: "flex", columnGap: 16 }}>
        <div style={{ width: 320, flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Body1Strong>{t(`${k}.subRecipes`)}</Body1Strong>
            <div style={{ display: "flex", columnGap: 4 }}>
              <Button size="small" appearance="subtle" onClick={addSubRecipe}>
                +
              </Button>
              <Button size="small" appearance="subtle" onClick={() => removeSubRecipe(selected)}>
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
            {subRecipes.map((s, i) => (
              <div
                key={`${s.recipe}-${i}`}
                onClick={() => selectSubRecipe(i)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  backgroundColor: i === selected ? "#e3f2fd" : "transparent",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div style={{ fontWeight: 600 }}>{s.recipe}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{s.displayName}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", rowGap: 12 }}>
          <Body1Strong>{t(`${k}.detailsTitle`)}</Body1Strong>
          <Field label={t(`${k}.recipe`)} required>
            <Input value={recipe} onChange={(_, d) => setRecipe(d.value)} />
          </Field>
          <Field label={t(`${k}.displayName`)} required>
            <Input value={displayName} onChange={(_, d) => setDisplayName(d.value)} />
          </Field>
          <Field label={t(`${k}.parametersMapping`)}>
            <textarea
              value={expressions}
              onChange={(e) => setExpressions(e.target.value)}
              rows={6}
              style={{ width: "100%", fontFamily: "monospace", fontSize: 13 }}
            />
          </Field>
          <div>
            <Button appearance="secondary" onClick={() => setExpressions("")}>
              {t(`${k}.clearAllExpressions`)}
            </Button>
          </div>
        </div>
      </div>
      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={(_, d) => setComments(d.value)} />
      </Field>
    </BaseDialog>
  );
}
