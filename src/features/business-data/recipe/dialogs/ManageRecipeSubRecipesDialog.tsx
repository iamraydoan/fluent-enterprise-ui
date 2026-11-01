import { useState } from "react";
import { BaseDialog, DialogEntityBanner, DialogFooter, HStack, VStack } from "@/components/common";
import { Body1Strong, Button, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

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
      <DialogEntityBanner icon="🎛" name={recipeName} />
      <HStack gap={16}>
        <div style={{ width: 320, flexShrink: 0 }}>
          <HStack align="center" justify="space-between" style={{marginBottom: 8}}>
            <Body1Strong>{t(`${k}.subRecipes`)}</Body1Strong>
            <div style={{ display: "flex", columnGap: theme.spacing.xs }}>
              <Button size="sm" variant="subtle" onClick={addSubRecipe}>
                +
              </Button>
              <Button size="sm" variant="subtle" onClick={() => removeSubRecipe(selected)}>
                🗑
              </Button>
            </div>
          </HStack>
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
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  cursor: "pointer",
                  backgroundColor: i === selected ? theme.color.brandSubtle : "transparent",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div style={{ fontWeight: 600 }}>{s.recipe}</div>
                <div style={{ fontSize: 12, color: theme.color.textSecondary }}>{s.displayName}</div>
              </div>
            ))}
          </div>
        </div>
        <VStack gap={12}>
          <Body1Strong>{t(`${k}.detailsTitle`)}</Body1Strong>
          <Field label={t(`${k}.recipe`)} required>
            <Input value={recipe} onChange={setRecipe} />
          </Field>
          <Field label={t(`${k}.displayName`)} required>
            <Input value={displayName} onChange={setDisplayName} />
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
            <Button variant="secondary" onClick={() => setExpressions("")}>
              {t(`${k}.clearAllExpressions`)}
            </Button>
          </div>
        </VStack>
      </HStack>
      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={setComments} />
      </Field>
    </BaseDialog>
  );
}
