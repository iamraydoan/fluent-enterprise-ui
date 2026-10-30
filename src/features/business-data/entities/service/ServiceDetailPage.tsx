import { useState } from "react";
import { useServiceDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailShellMoreAction, DetailTab } from "@/components/common";
import { Wrench20Regular } from "@/components/icons";
import { Body1Strong, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { RecordState } from "@/lib/recordState";
import { ConfirmOperationDialog } from "../qualification/dialogs/ConfirmOperationDialog";
import { ManageCompatibleServicesDialog } from "./dialogs/ManageCompatibleServicesDialog";
import { ManageServiceResourcesDialog } from "./dialogs/ManageServiceResourcesDialog";
import { ServiceFormDialog } from "./dialogs/ServiceFormDialog";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.service.tabs.details" },
  { value: "contexts", labelKey: "businessData.service.tabs.contexts" },
  { value: "references", labelKey: "businessData.service.tabs.references" },
  { value: "history", labelKey: "businessData.service.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.service.sections.details",
  "businessData.service.sections.resources",
  "businessData.service.sections.compatibleServices",
  "businessData.service.sections.attributes",
  "businessData.service.sections.attachments",
];

const DLG = {
  edit: "edit",
  clone: "clone",
  terminate: "terminate",
  unterminate: "unterminate",
  disable: "disable",
  enable: "enable",
  manageCompatible: "manageCompatible",
  manageResources: "manageResources",
} as const;

const CLONE_TITLE: TranslationKey = "businessData.service.dialogs.clone.title";
const CLONE: TranslationKey = "businessData.service.dialogs.clone.clone";

interface ServiceDetailPageProps {
  name: string;
}

export function ServiceDetailPage({ name }: ServiceDetailPageProps) {
  const { t } = useAppTranslation();
  const { data, isLoading } = useServiceDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.service.sections.details");
  const handleLeft = (value: string) => setLeft(value as TranslationKey);
  const [dialog, setDialog] = useState<string | null>(null);
  const close = () => setDialog(null);
  const open = (key: string) => () => setDialog(key);
  const dlg = (key: string) => dialog === key;

  const isTerminated = data?.state === RecordState.Terminated;
  const mk = "businessData.service.more";

  const moreActions: DetailShellMoreAction[] = [
    { label: t(`${mk}.clone`), onClick: open(DLG.clone) },
    ...(isTerminated
      ? [{ label: t(`${mk}.unterminate`), onClick: open(DLG.unterminate) }]
      : [{ label: t(`${mk}.terminate`), onClick: open(DLG.terminate) }]),
    { label: t(`${mk}.disable`), onClick: open(DLG.disable) },
    { label: t(`${mk}.enable`), onClick: open(DLG.enable) },
    { label: t(`${mk}.manageCompatible`), onClick: open(DLG.manageCompatible) },
    { label: t(`${mk}.manageResources`), onClick: open(DLG.manageResources) },
  ];

  if (isLoading || data === undefined) {
    return null;
  }

  const stateLabel =
    data.state === RecordState.Active ? t("common.active") : t("common.terminated");

  let content;
  if (top !== "details" || left !== "businessData.service.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.service.sections.empty")}</Body1Strong>
          <Caption1>{t("businessData.service.sections.emptyBody")}</Caption1>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <CardGrid>
        <Card title={t("businessData.service.cards.service")}>
          <KV
            rows={[
              [t("businessData.service.details.name"), data.name],
              [t("businessData.service.details.description"), data.description],
              [t("businessData.service.details.type"), data.type],
              [t("businessData.service.details.processingType"), data.processingType],
              [t("businessData.service.details.enabled"), data.enabled ? t("common.yes") : t("common.no")],
              [t("businessData.service.details.state"), stateLabel],
              [t("businessData.service.details.dataGroup"), data.dataGroup],
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
      <ServiceFormDialog
        open={dlg(DLG.edit)}
        onClose={close}
        title={t("businessData.service.dialogs.form.editTitle")}
        initial={data}
        nameReadOnly
        submitLabel={t("common.save")}
      />
      <ConfirmOperationDialog
        open={dlg(DLG.clone)}
        onClose={close}
        title={t(CLONE_TITLE)}
        message={t("businessData.service.dialogs.clone.message", { name: data.name })}
        confirmLabel={t(CLONE)}
      />
      <ConfirmOperationDialog
        open={dlg(DLG.terminate)}
        onClose={close}
        title={t("businessData.service.dialogs.terminate.title")}
        message={t("businessData.service.dialogs.terminate.message", { name: data.name })}
        confirmLabel={t("businessData.service.dialogs.terminate.confirm")}
      />
      <ConfirmOperationDialog
        open={dlg(DLG.unterminate)}
        onClose={close}
        title={t("businessData.service.dialogs.unterminate.title")}
        message={t("businessData.service.dialogs.unterminate.message", { name: data.name })}
        confirmLabel={t("businessData.service.dialogs.unterminate.confirm")}
      />
      <ConfirmOperationDialog
        open={dlg(DLG.disable)}
        onClose={close}
        title={t("businessData.service.dialogs.disable.title")}
        message={t("businessData.service.dialogs.disable.message", { name: data.name })}
        confirmLabel={t("businessData.service.dialogs.disable.confirm")}
      />
      <ConfirmOperationDialog
        open={dlg(DLG.enable)}
        onClose={close}
        title={t("businessData.service.dialogs.enable.title")}
        message={t("businessData.service.dialogs.enable.message", { name: data.name })}
        confirmLabel={t("businessData.service.dialogs.enable.confirm")}
      />
      <ManageCompatibleServicesDialog
        open={dlg(DLG.manageCompatible)}
        onClose={close}
        serviceName={data.name}
      />
      <ManageServiceResourcesDialog
        open={dlg(DLG.manageResources)}
        onClose={close}
        serviceName={data.name}
      />
    </>
  );
}
