import { useState } from "react";
import { lookupBarcode, useBarcodeEntityInfo } from "@/api";
import type { BarcodeEntityKind, ScannedBarcode } from "@/api";
import { ListPage, refreshAction } from "@/components/common";
import type { HeaderAction } from "@/components/common";
import {
  ArrowExit24Regular,
  ArrowSplit24Regular,
  ArrowUndo24Regular,
  BarcodeScanner24Regular,
  Box24Regular,
  Branch24Regular,
  Calculator24Regular,
  Camera24Regular,
  Compose24Regular,
  Cube24Regular,
  Eye24Regular,
  Grid24Regular,
  Merge24Regular,
  MoreVertical24Regular,
  Pause24Regular,
  Settings20Regular,
  SplitVertical24Regular,
  Wrench24Regular,
} from "@/components/icons";
import { makeStyles, Text, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import type { BarcodeActionTile } from "./barcodeIdentificationTypes";
import { EntityInfoDialog, InsertDialog, ScanDialog, SettingsDialog } from "./dialogs";

const usePageStyles = makeStyles({
  body: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minHeight: 0,
    padding: "16px",
    overflow: "auto",
  },
  empty: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    rowGap: "8px",
    color: tokens.colorNeutralForeground3,
  },
  emptyIcon: {
    color: tokens.colorNeutralForeground4,
    "& svg": { width: "64px", height: "64px" },
  },
  columns: {
    display: "grid",
    gridTemplateColumns: "minmax(320px, 5fr) minmax(320px, 7fr)",
    columnGap: "16px",
    alignItems: "start",
  },
  listTitle: {
    fontSize: "14px",
    fontWeight: tokens.fontWeightSemibold,
    padding: "4px 0 12px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
    padding: "10px 4px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  rowIcon: {
    color: tokens.colorBrandForeground1,
    display: "flex",
  },
  rowName: {
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  rowState: {
    color: tokens.colorNeutralForeground2,
  },
  eyeButton: {
    marginLeft: "auto",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    color: tokens.colorBrandForeground1,
    display: "flex",
    padding: "4px",
    borderRadius: tokens.borderRadiusMedium,
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  hint: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
    padding: "12px 4px",
    color: tokens.colorNeutralForeground4,
    fontSize: "13px",
    fontStyle: "italic",
  },
  notFound: {
    padding: "8px 4px",
    color: tokens.colorPaletteRedForeground1,
    fontSize: "13px",
  },
  tiles: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  tile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    rowGap: "8px",
    minHeight: "110px",
    padding: "16px",
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorBrandStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "14px",
    color: tokens.colorBrandForeground1,
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  tileIcon: {
    display: "flex",
    "& svg": { width: "32px", height: "32px" },
  },
});

const L: Record<string, TranslationKey> = {
  pageTitle: "manufacturing.barcodeIdentification.pageTitle",
  emptyTitle: "manufacturing.barcodeIdentification.emptyTitle",
  emptySubtitle: "manufacturing.barcodeIdentification.emptySubtitle",
  scannedTitle: "manufacturing.barcodeIdentification.scannedTitle",
  scanHint: "manufacturing.barcodeIdentification.scanHint",
  notFound: "manufacturing.barcodeIdentification.notFound",
  scan: "manufacturing.barcodeIdentification.actions.scan",
  insertBarcode: "manufacturing.barcodeIdentification.actions.insertBarcode",
  reset: "manufacturing.barcodeIdentification.actions.reset",
  settings: "manufacturing.barcodeIdentification.actions.settings",
  split: "manufacturing.barcodeIdentification.tiles.split",
  splitByProduct: "manufacturing.barcodeIdentification.tiles.splitByProduct",
  merge: "manufacturing.barcodeIdentification.tiles.merge",
  hold: "manufacturing.barcodeIdentification.tiles.hold",
  temporaryOffFlow: "manufacturing.barcodeIdentification.tiles.temporaryOffFlow",
  recordLossBonus: "manufacturing.barcodeIdentification.tiles.recordLossBonus",
  combine: "manufacturing.barcodeIdentification.tiles.combine",
  compose: "manufacturing.barcodeIdentification.tiles.compose",
};

const ACTION_TILES: BarcodeActionTile[] = [
  { id: "split", labelKey: L.split, icon: <ArrowSplit24Regular /> },
  { id: "splitByProduct", labelKey: L.splitByProduct, icon: <SplitVertical24Regular /> },
  { id: "merge", labelKey: L.merge, icon: <Merge24Regular /> },
  { id: "hold", labelKey: L.hold, icon: <Pause24Regular /> },
  { id: "temporaryOffFlow", labelKey: L.temporaryOffFlow, icon: <ArrowExit24Regular /> },
  { id: "recordLossBonus", labelKey: L.recordLossBonus, icon: <Calculator24Regular /> },
  { id: "combine", labelKey: L.combine, icon: <Branch24Regular /> },
  { id: "compose", labelKey: L.compose, icon: <Compose24Regular /> },
];

const ENTITY_ICONS: Record<BarcodeEntityKind, React.ReactNode> = {
  material: <Box24Regular />,
  resource: <Wrench24Regular />,
  container: <Cube24Regular />,
};

export function BarcodeIdentificationPage() {
  const { t } = useAppTranslation();
  const styles = usePageStyles();
  const [scanned, setScanned] = useState<ScannedBarcode[]>([]);
  const [scanOpen, setScanOpen] = useState(false);
  const [insertOpen, setInsertOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [infoCode, setInfoCode] = useState<string | null>(null);
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);
  const { data: info } = useBarcodeEntityInfo(infoCode);

  const handleCode = async (code: string) => {
    const result = await lookupBarcode(code);
    if (result) {
      setScanned((prev) =>
        prev.some((item) => item.code === result.code) ? prev : [...prev, result],
      );
      setNotFoundCode(null);
    } else {
      setNotFoundCode(code);
    }
  };

  const handleScanDetected = (code: string) => {
    setScanOpen(false);
    void handleCode(code);
  };

  const handleInsertConfirm = (code: string) => {
    setInsertOpen(false);
    void handleCode(code);
  };

  const actions: HeaderAction[] = [
    { ...refreshAction, group: "general" },
    {
      id: "scan",
      icon: <Camera24Regular />,
      labelKey: L.scan,
      group: "actions",
      onClick: () => setScanOpen(true),
    },
    {
      id: "insertBarcode",
      icon: <Grid24Regular />,
      labelKey: L.insertBarcode,
      group: "actions",
      onClick: () => setInsertOpen(true),
    },
    {
      id: "reset",
      icon: <ArrowUndo24Regular />,
      labelKey: L.reset,
      group: "actions",
      onClick: () => {
        setScanned([]);
        setNotFoundCode(null);
      },
    },
    {
      id: "more",
      icon: <MoreVertical24Regular />,
      labelKey: "actionBar.more",
      menu: [
        { label: t(L.settings), icon: <Settings20Regular />, onClick: () => setSettingsOpen(true) },
      ],
    },
  ];

  return (
    <>
      <ListPage
        header={{
          icon: <BarcodeScanner24Regular />,
          title: t(L.pageTitle),
          actions,
        }}
      >
        <div className={styles.body}>
          {scanned.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>
                <BarcodeScanner24Regular />
              </span>
              <Text size={400}>{t(L.emptyTitle)}</Text>
              <Text size={300}>{t(L.emptySubtitle)}</Text>
              {notFoundCode && (
                <Text className={styles.notFound}>{t(L.notFound, { code: notFoundCode })}</Text>
              )}
            </div>
          ) : (
            <div className={styles.columns}>
              <div>
                <Text className={styles.listTitle}>
                  {t(L.scannedTitle, { count: scanned.length })}
                </Text>
                {scanned.map((item) => (
                  <div key={item.code} className={styles.row}>
                    <span className={styles.rowIcon}>{ENTITY_ICONS[item.entityKind]}</span>
                    <Text className={styles.rowName}>{item.name}</Text>
                    <Text className={styles.rowState}>({item.state})</Text>
                    <button
                      className={styles.eyeButton}
                      onClick={() => setInfoCode(item.code)}
                      aria-label={item.name}
                    >
                      <Eye24Regular />
                    </button>
                  </div>
                ))}
                <div className={styles.hint}>
                  <BarcodeScanner24Regular />
                  <Text size={300}>{t(L.scanHint)}</Text>
                </div>
                {notFoundCode && (
                  <Text className={styles.notFound}>{t(L.notFound, { code: notFoundCode })}</Text>
                )}
              </div>
              <div className={styles.tiles}>
                {ACTION_TILES.map((tile) => (
                  <button key={tile.id} className={styles.tile} onClick={() => undefined}>
                    <span className={styles.tileIcon}>{tile.icon}</span>
                    <span>{t(tile.labelKey)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ListPage>
      <ScanDialog
        open={scanOpen}
        onClose={() => setScanOpen(false)}
        onDetected={handleScanDetected}
      />
      <InsertDialog
        open={insertOpen}
        onClose={() => setInsertOpen(false)}
        onConfirm={handleInsertConfirm}
      />
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <EntityInfoDialog info={info ?? null} onClose={() => setInfoCode(null)} />
    </>
  );
}
