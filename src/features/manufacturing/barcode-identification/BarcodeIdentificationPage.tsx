import { useState } from "react";
import { lookupBarcode, useBarcodeEntityInfo } from "@/api";
import type { BarcodeEntityKind, ScannedBarcode } from "@/api";
import { EntityTile, Grid, HStack, IconButton, ListPage, refreshAction, TileGrid, VStack } from "@/components/common";
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
import { makeStyles, Text} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";
import type { BarcodeActionTile } from "./barcodeIdentificationTypes";
import { EntityInfoDialog, InsertDialog, ScanDialog, SettingsDialog } from "./dialogs";

const usePageStyles = makeStyles({
  emptyIcon: {
    color: theme.color.textQuaternary,
    "& svg": { width: "64px", height: "64px" },
  },
  listTitle: {
    fontSize: "14px",
    fontWeight: theme.font.weightSemibold,
    padding: "4px 0 12px",
  },
  row: {
    padding: "10px 4px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  rowIcon: {
    color: theme.color.textBrand,
  },
  rowName: {
    color: theme.color.textBrand,
    fontWeight: theme.font.weightSemibold,
  },
  rowState: {
    color: theme.color.textSecondary,
  },
  hint: {
    padding: "12px 4px",
    color: theme.color.textQuaternary,
    fontSize: "13px",
    fontStyle: "italic",
  },
  notFound: {
    padding: "8px 4px",
    color: theme.color.textDanger,
    fontSize: "13px",
  },
  tileIcon: {
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
        <VStack grow p={16} style={{ overflow: "auto" }}>
          {scanned.length === 0 ? (
            <VStack grow align="center" justify="center" gap={8} style={{ color: theme.color.textTertiary }}>
              <span className={styles.emptyIcon}>
                <BarcodeScanner24Regular />
              </span>
              <Text size={400}>{t(L.emptyTitle)}</Text>
              <Text size={300}>{t(L.emptySubtitle)}</Text>
              {notFoundCode && (
                <Text className={styles.notFound}>{t(L.notFound, { code: notFoundCode })}</Text>
              )}
            </VStack>
          ) : (
            <Grid columns="minmax(320px, 5fr) minmax(320px, 7fr)" gap={16} align="start">
              <div>
                <Text className={styles.listTitle}>
                  {t(L.scannedTitle, { count: scanned.length })}
                </Text>
                {scanned.map((item) => (
                  <HStack key={item.code} align="center" gap={8} className={styles.row}>
                    <span className={styles.rowIcon}>{ENTITY_ICONS[item.entityKind]}</span>
                    <Text className={styles.rowName}>{item.name}</Text>
                    <Text className={styles.rowState}>({item.state})</Text>
                    <IconButton
                      icon={<Eye24Regular />}
                      onClick={() => setInfoCode(item.code)}
                      ariaLabel={item.name}
                    />
                  </HStack>
                ))}
                <HStack align="center" gap={8} className={styles.hint}>
                  <BarcodeScanner24Regular />
                  <Text size={300}>{t(L.scanHint)}</Text>
                </HStack>
                {notFoundCode && (
                  <Text className={styles.notFound}>{t(L.notFound, { code: notFoundCode })}</Text>
                )}
              </div>
              <TileGrid minWidth="140px">
                {ACTION_TILES.map((tile) => (
                  <EntityTile
                    key={tile.id}
                    title={<span className={styles.tileIcon}>{tile.icon}</span>}
                    subtitle={t(tile.labelKey)}
                    onClick={() => undefined}
                    ariaLabel={t(tile.labelKey)}
                  />
                ))}
              </TileGrid>
            </Grid>
          )}
        </VStack>
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
