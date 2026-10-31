import { useState } from "react";
import { usePackageDetail } from "@/api";
import type { DetailMoreMenuItem } from "@/components/common";
import { DetailShell, KV } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import {
  PackageReportDialog,
  ShipPackagesDialog,
  TerminatePackageDialog,
  UnterminatePackageDialog,
} from "./PackageDialogs";

const useStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
  sectionTitle: { marginBottom: "8px" },
});

const TOP_TABS: { value: string; labelKey: TranslationKey }[] = [
  { value: "details", labelKey: "businessData.package.tabs.details" },
  { value: "references", labelKey: "businessData.package.tabs.references" },
  { value: "history", labelKey: "businessData.package.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  "businessData.package.left.details",
  "businessData.package.left.contents",
  "businessData.package.left.subMaterials",
  "businessData.package.left.attachments",
];

export function PackageDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const shared = useSharedStyles();
  const { data: detail } = usePackageDetail(name);

  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>(LEFT_ITEMS[0]);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [shipOpen, setShipOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  if (!detail) {
    return <Text>{t("businessData.package.pageLabel")}</Text>;
  }

  const isTerminated = detail.state === "Terminated";

  const terminateItem: DetailMoreMenuItem = isTerminated
    ? {
        key: "unterminate",
        labelKey: "businessData.package.operations.unterminate.title",
        onClick: () => setUnterminateOpen(true),
      }
    : {
        key: "terminate",
        labelKey: "businessData.package.operations.terminate.title",
        onClick: () => setTerminateOpen(true),
      };

  const moreMenuItems: DetailMoreMenuItem[] = [
    {
      key: "ship",
      labelKey: "businessData.package.operations.ship.title",
      onClick: () => setShipOpen(true),
    },
    {
      key: "report",
      labelKey: "businessData.package.operations.report.title",
      onClick: () => setReportOpen(true),
    },
    terminateItem,
  ];

  return (
    <>
      <DetailShell
        title={detail.name}
        icon={<Box24Regular />}
        topTabs={TOP_TABS}
        top={top}
        onTop={setTop}
        leftItems={LEFT_ITEMS}
        left={left}
        onLeft={setLeft}
        onEdit={() => undefined}
        onAskAi={() => undefined}
        showState={false}
        moreActions={moreMenuItems}
      >
        {top === "details" && left === LEFT_ITEMS[0] && (
          <div className={styles.cards}>
            <div className={shared.contentCard} style={{ padding: "14px 16px" }}>
              <Text weight="semibold" size={400} className={styles.sectionTitle}>
                {t("businessData.package.detail.generalData")}
              </Text>
              <KV
                rows={[
                  [t("businessData.package.detail.fields.name"), detail.name],
                  [t("businessData.package.detail.fields.description"), detail.description],
                  [t("businessData.package.detail.fields.product"), detail.product],
                  [t("businessData.package.detail.fields.level"), detail.level],
                  [t("businessData.package.detail.fields.state"), detail.state],
                  [t("businessData.package.detail.fields.packedQuantity"), detail.packedQuantity],
                  [t("businessData.package.detail.fields.contentType"), detail.contentType],
                ]}
              />
            </div>
          </div>
        )}
        {top === "details" && left === LEFT_ITEMS[1] && (
          <div className={shared.contentCard} style={{ padding: "14px 16px" }}>
            <Text weight="semibold" size={400} className={styles.sectionTitle}>
              {t("businessData.package.left.contents")}
            </Text>
          </div>
        )}
        {top === "details" && left === LEFT_ITEMS[2] && (
          <div className={shared.contentCard} style={{ padding: "14px 16px" }}>
            <Text weight="semibold" size={400} className={styles.sectionTitle}>
              {t("businessData.package.left.subMaterials")}
            </Text>
          </div>
        )}
        {top === "references" && (
          <div className={shared.contentCard} style={{ padding: "14px 16px" }}>
            <Text weight="semibold" size={400} className={styles.sectionTitle}>
              {t("businessData.package.tabs.references")}
            </Text>
          </div>
        )}
        {top === "history" && (
          <div className={shared.contentCard} style={{ padding: "14px 16px" }}>
            <Text weight="semibold" size={400} className={styles.sectionTitle}>
              {t("businessData.package.tabs.history")}
            </Text>
          </div>
        )}
      </DetailShell>

      <TerminatePackageDialog open={terminateOpen} onClose={() => setTerminateOpen(false)} />
      <UnterminatePackageDialog open={unterminateOpen} onClose={() => setUnterminateOpen(false)} />
      <ShipPackagesDialog open={shipOpen} onClose={() => setShipOpen(false)} />
      <PackageReportDialog open={reportOpen} onClose={() => setReportOpen(false)} />
    </>
  );
}
