import { useState } from "react";
import { useRecipeDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailShellMoreAction, DetailTab } from "@/components/common";
import { Cube24Regular } from "@/components/icons";
import { Body1Strong, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { RecordState } from "@/lib/recordState";
import { ConfirmOperationDialog } from "../qualification/dialogs/ConfirmOperationDialog";
import { CloneRecipeDialog } from "./dialogs/CloneRecipeDialog";
import { ManageRecipeBodyDialog } from "./dialogs/ManageRecipeBodyDialog";
import { ManageRecipeParametersDialog } from "./dialogs/ManageRecipeParametersDialog";
import { ManageRecipeSubRecipesDialog } from "./dialogs/ManageRecipeSubRecipesDialog";
import { RecipeFormDialog } from "./dialogs/RecipeFormDialog";
import { UnterminateRecipeDialog } from "./dialogs/UnterminateRecipeDialog";
import { UploadRecipeToResourceDialog } from "./dialogs/UploadRecipeToResourceDialog";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.recipe.tabs.details" },
  { value: "contexts", labelKey: "businessData.recipe.tabs.contexts" },
  { value: "compare", labelKey: "businessData.recipe.tabs.compare" },
  { value: "references", labelKey: "businessData.recipe.tabs.references" },
  { value: "history", labelKey: "businessData.recipe.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.recipe.sections.details",
  "businessData.recipe.sections.parameters",
  "businessData.recipe.sections.body",
  "businessData.recipe.sections.subRecipes",
  "businessData.recipe.sections.resources",
  "businessData.recipe.sections.activeInstances",
  "businessData.recipe.sections.attachments",
];

interface RecipeDetailPageProps {
  name: string;
}

export function RecipeDetailPage({ name }: RecipeDetailPageProps) {
  const { t } = useAppTranslation();
  const { data, isLoading } = useRecipeDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.recipe.sections.details");
  const handleLeft = (value: TranslationKey) => setLeft(value);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);
  const [enableOpen, setEnableOpen] = useState(false);
  const [bodyOpen, setBodyOpen] = useState(false);
  const [parametersOpen, setParametersOpen] = useState(false);
  const [subRecipesOpen, setSubRecipesOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const isTerminated = data?.state === RecordState.Terminated;
  const mk = "businessData.recipe.more";

  const moreActions: DetailShellMoreAction[] = [
    { label: t(`${mk}.clone`), onClick: () => setCloneOpen(true) },
    ...(isTerminated
      ? [{ label: t(`${mk}.unterminate`), onClick: () => setUnterminateOpen(true) }]
      : [{ label: t(`${mk}.terminate`), onClick: () => setTerminateOpen(true) }]),
    { label: t(`${mk}.disable`), onClick: () => setDisableOpen(true) },
    { label: t(`${mk}.enable`), onClick: () => setEnableOpen(true) },
    { label: t(`${mk}.manageBody`), onClick: () => setBodyOpen(true) },
    { label: t(`${mk}.manageParameters`), onClick: () => setParametersOpen(true) },
    { label: t(`${mk}.manageSubRecipes`), onClick: () => setSubRecipesOpen(true) },
    { label: t(`${mk}.uploadToResource`), onClick: () => setUploadOpen(true) },
  ];

  if (isLoading || data === undefined) {
    return null;
  }

  const yesNo = (value: boolean) => (value ? t("common.yes") : t("common.no"));
  const stateLabel =
    data.state === RecordState.Active ? t("common.active") : t("common.terminated");

  let content;
  if (top !== "details" || left !== "businessData.recipe.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.recipe.sections.empty")}</Body1Strong>
          <Caption1>{t("businessData.recipe.sections.emptyBody")}</Caption1>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <CardGrid>
        <Card title={t("businessData.recipe.cards.recipe")}>
          <KV
            rows={[
              [t("businessData.recipe.details.name"), data.name],
              [t("businessData.recipe.details.description"), data.description],
              [t("businessData.recipe.details.type"), data.type],
              [t("businessData.recipe.details.state"), stateLabel],
              [t("businessData.recipe.details.dataGroup"), data.dataGroup],
            ]}
          />
        </Card>
        <Card title={t("businessData.recipe.cards.information")}>
          <KV
            rows={[
              [t("businessData.recipe.details.isEnabled"), yesNo(data.isEnabled)],
              [t("businessData.recipe.details.isExecutable"), yesNo(data.isExecutable)],
              [
                t("businessData.recipe.details.resourceRecipeName"),
                data.resourceRecipeName,
              ],
              [t("businessData.recipe.details.userInformation"), data.userInformation],
              [
                t("businessData.recipe.details.supplierInformation"),
                data.supplierInformation,
              ],
            ]}
          />
        </Card>
      </CardGrid>
    );
  }

  return (
    <>
      <DetailShell
        title={`${data.name} [${data.revision}.${data.version}]`}
        icon={<Cube24Regular />}
        topTabs={TOP_TABS}
        top={top}
        onTop={setTop}
        leftItems={LEFT_SECTIONS}
        left={left}
        onLeft={handleLeft}
        onEdit={() => setEditOpen(true)}
        onAskAi={() => {}}
        moreActions={moreActions}
      >
        {content}
      </DetailShell>
      <RecipeFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={t("businessData.recipe.dialogs.form.editTitle")}
        initial={data}
        nameReadOnly
        submitLabel={t("common.save")}
      />
      <CloneRecipeDialog
        open={cloneOpen}
        onClose={() => setCloneOpen(false)}
        sourceName={data.name}
      />
      <ConfirmOperationDialog
        open={terminateOpen}
        onClose={() => setTerminateOpen(false)}
        title={t("businessData.recipe.dialogs.terminate.title")}
        message={t("businessData.recipe.dialogs.terminate.message", { name: data.name })}
        confirmLabel={t("businessData.recipe.dialogs.terminate.confirm")}
      />
      <UnterminateRecipeDialog
        open={unterminateOpen}
        onClose={() => setUnterminateOpen(false)}
        recipeName={data.name}
      />
      <ConfirmOperationDialog
        open={disableOpen}
        onClose={() => setDisableOpen(false)}
        title={t("businessData.recipe.dialogs.disable.title")}
        message={t("businessData.recipe.dialogs.disable.message", { name: data.name })}
        confirmLabel={t("businessData.recipe.dialogs.disable.confirm")}
      />
      <ConfirmOperationDialog
        open={enableOpen}
        onClose={() => setEnableOpen(false)}
        title={t("businessData.recipe.dialogs.enable.title")}
        message={t("businessData.recipe.dialogs.enable.message", { name: data.name })}
        confirmLabel={t("businessData.recipe.dialogs.enable.confirm")}
      />
      <ManageRecipeBodyDialog
        open={bodyOpen}
        onClose={() => setBodyOpen(false)}
        recipeName={data.name}
      />
      <ManageRecipeParametersDialog
        open={parametersOpen}
        onClose={() => setParametersOpen(false)}
        recipeName={data.name}
      />
      <ManageRecipeSubRecipesDialog
        open={subRecipesOpen}
        onClose={() => setSubRecipesOpen(false)}
        recipeName={data.name}
      />
      <UploadRecipeToResourceDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        recipeName={data.name}
      />
    </>
  );
}
