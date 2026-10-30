import { useState } from "react";
import { useSetupMatrixDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailShellMoreAction, DetailTab } from "@/components/common";
import { Wrench20Regular } from "@/components/icons";
import { Body1Strong, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { RecordState } from "@/lib/recordState";
import { ConfirmOperationDialog } from "../qualification/dialogs/ConfirmOperationDialog";
import { SetupMatrixFormDialog } from "./dialogs/SetupMatrixFormDialog";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.setupMatrix.tabs.details" },
  { value: "references", labelKey: "businessData.setupMatrix.tabs.references" },
  { value: "history", labelKey: "businessData.setupMatrix.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.setupMatrix.sections.details",
  "businessData.setupMatrix.sections.setupMatrix",
  "businessData.setupMatrix.sections.attributes",
  "businessData.setupMatrix.sections.attachments",
];

const DLG = {
  edit: "edit",
  clone: "clone",
  terminate: "terminate",
  unterminate: "unterminate",
  manage: "manage",
} as const;

const CLONE_TITLE: TranslationKey = "businessData.setupMatrix.dialogs.clone.title";
const CLONE: TranslationKey = "businessData.setupMatrix.dialogs.clone.clone";

interface SetupMatrixDetailPageProps {
  name: string;
}

export function SetupMatrixDetailPage({ name }: SetupMatrixDetailPageProps) {
  const { t } = useAppTranslation();
  const { data, isLoading } = useSetupMatrixDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.setupMatrix.sections.details");
  const handleLeft = (value: string) => setLeft(value as TranslationKey);
  const [dialog, setDialog] = useState<string | null>(null);
  const close = () => setDialog(null);
  const open = (key: string) => () => setDialog(key);
  const dlg = (key: string) => dialog === key;

  const isTerminated = data?.state === RecordState.Terminated;
  const mk = "businessData.setupMatrix.more";

  const moreActions: DetailShellMoreAction[] = [
    { label: t(`${mk}.clone`), onClick: open(DLG.clone) },
    ...(isTerminated
      ? [{ label: t(`${mk}.unterminate`), onClick: open(DLG.unterminate) }]
      : [{ label: t(`${mk}.terminate`), onClick: open(DLG.terminate) }]),
    { label: t(`${mk}.manage`), onClick: open(DLG.manage) },
  ];

  if (isLoading || data === undefined) {
    return null;
  }

  const stateLabel =
    data.state === RecordState.Active ? t("common.active") : t("common.terminated");

  let content;
  if (top !== "details" || left !== "businessData.setupMatrix.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.setupMatrix.sections.empty")}</Body1Strong>
          <Caption1>{t("businessData.setupMatrix.sections.emptyBody")}</Caption1>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <CardGrid>
        <Card title={t("businessData.setupMatrix.cards.setupMatrix")}>
          <KV
            rows={[
              [t("businessData.setupMatrix.details.name"), data.name],
              [t("businessData.setupMatrix.details.description"), data.description],
              [t("businessData.setupMatrix.details.timeScale"), data.timeScale],
              [t("businessData.setupMatrix.details.useZeroInDiagonal"), data.useZeroInDiagonal ? t("common.yes") : t("common.no")],
              [t("businessData.setupMatrix.details.state"), stateLabel],
            ]}
          />
        </Card>
      </CardGrid>
    );
  }

  return (
    <>
      <DetailShell
        title={data.name}
        icon={<Wrench20Regular />}
        topTabs={TOP_TABS}
        top={top}
        onTop={setTop}
        leftItems={LEFT_SECTIONS}
        left={left}
        onLeft={handleLeft}
        onEdit={open(DLG.edit)}
        onAskAi={() => {}}
        moreActions={moreActions}
      >
        {content}
      </DetailShell>
      <SetupMatrixFormDialog
        open={dlg(DLG.edit)}
        onClose={close}
        title={t("businessData.setupMatrix.dialogs.form.editTitle")}
        initial={data}
        nameReadOnly
        submitLabel={t("common.save")}
      />
      <ConfirmOperationDialog
        open={dlg(DLG.clone)}
        onClose={close}
        title={t(CLONE_TITLE)}
        message={t("businessData.setupMatrix.dialogs.clone.message", { name: data.name })}
        confirmLabel={t(CLONE)}
      />
      <ConfirmOperationDialog
        open={dlg(DLG.terminate)}
        onClose={close}
        title={t("businessData.setupMatrix.dialogs.terminate.title")}
        message={t("businessData.setupMatrix.dialogs.terminate.message", { name: data.name })}
        confirmLabel={t("businessData.setupMatrix.dialogs.terminate.confirm")}
      />
      <ConfirmOperationDialog
        open={dlg(DLG.unterminate)}
        onClose={close}
        title={t("businessData.setupMatrix.dialogs.unterminate.title")}
        message={t("businessData.setupMatrix.dialogs.unterminate.message", { name: data.name })}
        confirmLabel={t("businessData.setupMatrix.dialogs.unterminate.confirm")}
      />
      <ConfirmOperationDialog
        open={dlg(DLG.manage)}
        onClose={close}
        title={t("businessData.setupMatrix.dialogs.manage.title")}
        message={t("businessData.setupMatrix.dialogs.manage.message", { name: data.name })}
        confirmLabel={t("businessData.setupMatrix.dialogs.manage.confirm")}
      />
    </>
  );
}
