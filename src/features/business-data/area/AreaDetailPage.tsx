import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useAreaDetail } from "@/api";
import {
  cloneAction,
  DetailShell,
  DetailTabs,
  editAction,
  Empty,
  ListPage,
  refreshAction,
  terminateAction,
  TileGrid,
  unterminateAction,
} from "@/components/common";
import type { HeaderAction } from "@/components/common";
import { Box24Regular, MoreVertical24Regular } from "@/components/icons";
import { Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { theme } from "@/styles/theme";
import { useAreaDialogs } from "./useAreaDialogs";

const useDetailStyles = makeStyles({
  card: { padding: theme.spacing.lg, display: "flex", flexDirection: "column", rowGap: theme.spacing.md },
  cardTitle: {
    fontSize: "14px",
    fontWeight: theme.font.weightSemibold,
    paddingBottom: theme.spacing.sm,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  row: { display: "flex", columnGap: theme.spacing.md, fontSize: "13px" },
  label: { color: theme.color.textTertiary, minWidth: "120px" },
});

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
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
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
              <TileGrid minWidth="300px">
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>{t("businessData.area.detail.area")}</Text>
                  <KV label={t("businessData.area.detail.name")} value={area.name} />
                  <KV label={t("businessData.area.detail.description")} value={area.description} />
                  <KV label={t("businessData.area.detail.type")} value={area.type} />
                  <KV
                    label={t("businessData.area.detail.universalState")}
                    value={area.universalState}
                  />
                  <KV label={t("businessData.area.detail.dataGroup")} value={area.dataGroup} />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.area.detail.information")}
                  </Text>
                  <KV label={t("businessData.area.detail.facility")} value={area.facility} />
                  <KV
                    label={t("businessData.area.detail.displayOrder")}
                    value={String(area.displayOrder)}
                  />
                  <KV label={t("businessData.area.detail.areaType")} value={area.areaType} />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>{t("businessData.area.detail.planning")}</Text>
                  <KV label={t("businessData.area.detail.calendar")} value={area.calendar} />
                  <KV label={t("businessData.area.detail.schedule")} value={area.schedule} />
                  <KV label={t("businessData.area.detail.costCenter")} value={area.costCenter} />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.area.detail.shiftLogbooks")}
                  </Text>
                  <KV
                    label={t("businessData.area.detail.enableShiftLogbook")}
                    value={
                      area.enableShiftLogbook
                        ? t("businessData.area.detail.yes")
                        : t("businessData.area.detail.no")
                    }
                  />
                </div>
              </TileGrid>
            </DetailShell>
          )}
          {tab !== "details" && (
            <Empty>{t("businessData.area.detail.historyEmpty")}</Empty>
          )}
        </DetailTabs>
      </ListPage>
      {dialogs}
    </>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>{value === "" ? t("businessData.area.detail.emptyValue") : value}</span>
    </div>
  );
}
