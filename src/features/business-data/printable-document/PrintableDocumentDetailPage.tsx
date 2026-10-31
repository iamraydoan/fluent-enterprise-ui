import { useState } from "react";
import { usePrintableDocumentDetail } from "@/api";
import type { DetailMoreMenuItem, DetailTab } from "@/components/common";
import { DetailShell, KV } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import {
  ClonePrintableDocumentDialog,
  CreatePrintableDocumentDialog,
  EditPrintableDocumentDialog,
  LayoutCreationDialog,
  LotTravelerDialog,
  PrintPrintableDocumentDialog,
  PrintersDialog,
  TerminatePrintableDocumentDialog,
  UnterminatePrintableDocumentDialog,
} from "./PrintableDocumentDialogs";

const useStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
  sectionTitle: { marginBottom: "8px" },
});

export function PrintableDocumentDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const shared = useSharedStyles();
  const { data: detail } = usePrintableDocumentDetail(name);

  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.printableDocument.left.details");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [lotTravelerOpen, setLotTravelerOpen] = useState(false);
  const [printersOpen, setPrintersOpen] = useState(false);

  if (!detail) {
    return <Text>{t("businessData.printableDocument.pageLabel")}</Text>;
  }

  const isTerminated = detail.state === "Terminated";

  const topTabs: DetailTab[] = [
    { value: "details", labelKey: "businessData.printableDocument.tabs.details" },
    { value: "references", labelKey: "businessData.printableDocument.tabs.references" },
    { value: "history", labelKey: "businessData.printableDocument.tabs.history" },
  ];

  const leftItems: TranslationKey[] = [
    "businessData.printableDocument.left.details",
    "businessData.printableDocument.left.layout",
    "businessData.printableDocument.left.contextItems",
    "businessData.printableDocument.left.printHistory",
    "businessData.printableDocument.left.attachments",
  ];

  const terminateItem: DetailMoreMenuItem = isTerminated
    ? {
        key: "unterminate",
        labelKey: "businessData.printableDocument.operations.unterminate.title",
        onClick: () => setUnterminateOpen(true),
      }
    : {
        key: "terminate",
        labelKey: "businessData.printableDocument.operations.terminate.title",
        onClick: () => setTerminateOpen(true),
      };

  const moreMenuItems: DetailMoreMenuItem[] = [
    {
      key: "print",
      labelKey: "businessData.printableDocument.operations.print.title",
      onClick: () => setPrintOpen(true),
    },
    {
      key: "layout",
      labelKey: "businessData.printableDocument.operations.layoutCreation.title",
      onClick: () => setLayoutOpen(true),
    },
    {
      key: "lotTraveler",
      labelKey: "businessData.printableDocument.operations.lotTraveler.title",
      onClick: () => setLotTravelerOpen(true),
    },
    {
      key: "printers",
      labelKey: "businessData.printableDocument.operations.printers.title",
      onClick: () => setPrintersOpen(true),
    },
    {
      key: "clone",
      labelKey: "businessData.printableDocument.operations.clone.title",
      onClick: () => setCloneOpen(true),
    },
    terminateItem,
  ];

  return (
    <>
      <DetailShell
        title={detail.name}
        icon={<Box24Regular />}
        topTabs={topTabs}
        top={top}
        onTop={setTop}
        leftItems={leftItems}
        left={left}
        onLeft={setLeft}
        onEdit={() => setEditOpen(true)}
        onAskAi={() => undefined}
        showState={false}
        moreMenuItems={moreMenuItems}
      >
        <div className={styles.cards}>
          <div className={shared.contentCard} style={{ padding: "14px 16px" }}>
            <Text weight="semibold" size={400} className={styles.sectionTitle}>
              {t("businessData.printableDocument.detail.generalData")}
            </Text>
            <KV
              rows={[
                [t("businessData.printableDocument.detail.fields.name"), detail.name],
                [t("businessData.printableDocument.detail.fields.description"), detail.description],
                [
                  t("businessData.printableDocument.detail.fields.documentType"),
                  detail.documentType,
                ],
                [t("businessData.printableDocument.detail.fields.state"), detail.state],
                [t("businessData.printableDocument.detail.fields.version"), detail.version],
              ]}
            />
          </div>
        </div>
      </DetailShell>
      <CreatePrintableDocumentDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditPrintableDocumentDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialName={detail.name}
      />
      <ClonePrintableDocumentDialog open={cloneOpen} onClose={() => setCloneOpen(false)} />
      <TerminatePrintableDocumentDialog
        open={terminateOpen}
        onClose={() => setTerminateOpen(false)}
      />
      <UnterminatePrintableDocumentDialog
        open={unterminateOpen}
        onClose={() => setUnterminateOpen(false)}
      />
      <PrintPrintableDocumentDialog open={printOpen} onClose={() => setPrintOpen(false)} />
      <LayoutCreationDialog open={layoutOpen} onClose={() => setLayoutOpen(false)} />
      <LotTravelerDialog open={lotTravelerOpen} onClose={() => setLotTravelerOpen(false)} />
      <PrintersDialog open={printersOpen} onClose={() => setPrintersOpen(false)} />
    </>
  );
}
