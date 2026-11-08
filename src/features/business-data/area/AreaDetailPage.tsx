import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useAreaDetail } from "@/api";
import type { HeaderAction } from "@/components/common";
import {
  cloneAction,
  DetailCard,
  DetailField,
  DetailShell,
  DetailTabs,
  editAction,
  Empty,
  Grid,
  ListPage,
  refreshAction,
  terminateAction,
  unterminateAction,
} from "@/components/common";
import { Box24Regular, MoreVertical24Regular } from "@/components/icons";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useAreaDialogs } from "./useAreaDialogs";

const TABS = ["details", "areaView", "maintenance", "references", "history"] as const;
type AreaTab = (typeof TABS)[number];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.area.detail.sections.details",
  "businessData.area.detail.sections.steps",
  "businessData.area.detail.sections.resources",
  "businessData.area.detail.sections.subAreas",
  "businessData.area.detail.sections.attachments",
];

export function AreaDetailPage() {
  const { name } = useParams({ strict: false }) as { name: string };
  const { t } = useAppTranslation();
  const [tab, setTab] = useState<AreaTab>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const { data: area, isLoading } = useAreaDetail(decodeURIComponent(name));
  const {
    dialogs,
    openEdit,
    openClone,
    openTerminate,
    openUnterminate,
    openSupplyAreas,
    openTransferTypes,
    openDashboards,
  } = useAreaDialogs(area);

  const displayValue = (value: string) =>
    value === "" ? t("businessData.area.detail.emptyValue") : value;

  const detailActions: HeaderAction[] = [
    refreshAction,
    { ...editAction, onClick: openEdit },
    { ...cloneAction, onClick: openClone },
    area?.state === "Terminated"
      ? { ...unterminateAction, onClick: openUnterminate }
      : { ...terminateAction, onClick: openTerminate },
    {
      id: "more",
      icon: <MoreVertical24Regular />,
      labelKey: "actionBar.more",
      menu: [
        { label: t("businessData.area.operations.manageSupplyAreas"), onClick: openSupplyAreas },
        {
          label: t("businessData.area.operations.manageTransferTypes"),
          onClick: openTransferTypes,
        },
        { label: t("businessData.area.operations.viewDashboards"), onClick: openDashboards },
      ],
    },
  ];

  if (isLoading || !area) {
    return (
      <ListPage
        header={{
          icon: <Box24Regular />,
          title: decodeURIComponent(name),
          actions: [refreshAction, editAction],
        }}
      >
        <Empty>{t("businessData.area.detail.loading")}</Empty>
      </ListPage>
    );
  }

  return (
    <>
      <ListPage
        header={{
          icon: <Box24Regular />,
          title: `${area.name} (${area.state})`,
          actions: detailActions,
        }}
      >
        <DetailTabs
          tabs={TABS.map((value) => ({
            value,
            label: t(`businessData.area.detail.tabs.${value}`),
          }))}
          active={tab}
          onChange={(value) => setTab(value as typeof tab)}
        >
          {tab === "details" && (
            <DetailShell
              title={area.name}
              icon={<Box24Regular />}
              topTabs={[]}
              top="details"
              onTop={() => undefined}
              leftItems={[...LEFT_SECTIONS]}
              left={left}
              onLeft={setLeft}
              onEdit={() => undefined}
              onAskAi={() => undefined}
              showState={false}
            >
              <Grid columns="auto-fit" gap="md">
                <DetailCard title={t("businessData.area.detail.area")}>
                  <DetailField
                    label={t("businessData.area.detail.name")}
                    value={displayValue(area.name)}
                  />
                  <DetailField
                    label={t("businessData.area.detail.description")}
                    value={displayValue(area.description)}
                  />
                  <DetailField
                    label={t("businessData.area.detail.type")}
                    value={displayValue(area.type)}
                  />
                  <DetailField
                    label={t("businessData.area.detail.universalState")}
                    value={displayValue(area.universalState)}
                  />
                  <DetailField
                    label={t("businessData.area.detail.dataGroup")}
                    value={displayValue(area.dataGroup)}
                  />
                </DetailCard>
                <DetailCard title={t("businessData.area.detail.information")}>
                  <DetailField
                    label={t("businessData.area.detail.facility")}
                    value={displayValue(area.facility)}
                  />
                  <DetailField
                    label={t("businessData.area.detail.displayOrder")}
                    value={String(area.displayOrder)}
                  />
                  <DetailField
                    label={t("businessData.area.detail.areaType")}
                    value={displayValue(area.areaType)}
                  />
                </DetailCard>
                <DetailCard title={t("businessData.area.detail.planning")}>
                  <DetailField
                    label={t("businessData.area.detail.calendar")}
                    value={displayValue(area.calendar)}
                  />
                  <DetailField
                    label={t("businessData.area.detail.schedule")}
                    value={displayValue(area.schedule)}
                  />
                  <DetailField
                    label={t("businessData.area.detail.costCenter")}
                    value={displayValue(area.costCenter)}
                  />
                </DetailCard>
                <DetailCard title={t("businessData.area.detail.shiftLogbooks")}>
                  <DetailField
                    label={t("businessData.area.detail.enableShiftLogbook")}
                    value={
                      area.enableShiftLogbook
                        ? t("businessData.area.detail.yes")
                        : t("businessData.area.detail.no")
                    }
                  />
                </DetailCard>
              </Grid>
            </DetailShell>
          )}
          {tab !== "details" && <Empty>{t("businessData.area.detail.historyEmpty")}</Empty>}
        </DetailTabs>
      </ListPage>
      {dialogs}
    </>
  );
}
