import { useState } from "react";
import { lookupBarcode, useBarcodeEntityInfo } from "@/api";
import type { BarcodeEntityKind, ScannedBarcode } from "@/api";
import type { HeaderAction } from "@/components/common";
import { ListPage, refreshAction, Empty, IconButton, Grid, HStack, VStack  } from "@/components/common";
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
import { makeStyles, Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";
import type { BarcodeActionTile } from "./barcodeIdentificationTypes";
import { EntityInfoDialog, InsertDialog, ScanDialog, SettingsDialog } from "./dialogs";

const usePageStyles = makeStyles({
  body: {
    minHeight: 0,
    padding: theme.spacing.lg,
    overflow: "auto",
  },
  emptyIcon: {
    color: theme.color.textQuaternary,
    "& svg": { width: "64px", height: "64px" },
  },
  
  listTitle: {
    fontSize: "14px",
    fontWeight: theme.font.weightSemibold,
    padding: `${theme.spacing.xs} 0 ${theme.spacing.md}`,
  },
  row: {
    padding: "10px 4px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  rowIcon: {
    color: theme.color.textBrand,
    display: "flex",
  },
  rowName: {
    color: theme.color.textBrand,
    fontWeight: theme.font.weightSemibold,
  },
  rowState: {
    color: theme.color.textSecondary,
  },
  eyeButton: {
    marginLeft: "auto",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    color: theme.color.textBrand,
    display: "flex",
    padding: theme.spacing.xs,
    borderRadius: theme.radius.md,
    ":hover": { backgroundColor: theme.color.surfaceHover },
  },
  hint: {
    padding: "12px 4px",
    color: theme.color.textQuaternary,
    fontSize: "13px",
    fontStyle: "italic",
  },
  notFound: {
    padding: `${theme.spacing.sm} ${theme.spacing.xs}`,
    color: theme.color.textDanger,
    fontSize: "13px",
  },
  
  tile: {
    minHeight: "110px",
    padding: theme.spacing.lg,
    backgroundColor: theme.color.surface,
    border: `1px solid ${theme.color.borderBrand}`,
    borderRadius: theme.radius.md,
    fontSize: "14px",
    color: theme.color.textBrand,
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
        <VStack className={styles.body}>
          {scanned.length === 0 ? (
            <Empty>
              <span className={styles.emptyIcon}>
                <BarcodeScanner24Regular />
              </span>
              <Text size={400}>{t(L.emptyTitle)}</Text>
              <Text size={300}>{t(L.emptySubtitle)}</Text>
              {notFoundCode && (
                <Text className={styles.notFound}>{t(L.notFound, { code: notFoundCode })}</Text>
              )}
            </Empty>
          ) : (
            <Grid columns="minmax(320px, 5fr) minmax(320px, 7fr)" gap="16px" align="start">
              <div>
                <Text className={styles.listTitle}>
                  {t(L.scannedTitle, { count: scanned.length })}
                </Text>
                {scanned.map((item) => (
                  <HStack gap="8px" align="center" key={item.code} className={styles.row}>
                    <span className={styles.rowIcon}>{ENTITY_ICONS[item.entityKind]}</span>
                    <Text className={styles.rowName}>{item.name}</Text>
                    <Text className={styles.rowState}>({item.state})</Text>
                    <IconButton
                      icon={<Eye24Regular />}
                      onClick={() => setInfoCode(item.code)}
                      aria-label={item.name}
                      size="sm"
                    />
                  </HStack>
                ))}
                <HStack gap="8px" align="center" className={styles.hint}>
                  <BarcodeScanner24Regular />
                  <Text size={300}>{t(L.scanHint)}</Text>
                </HStack>
                {notFoundCode && (
                  <Text className={styles.notFound}>{t(L.notFound, { code: notFoundCode })}</Text>
                )}
              </div>
              <Grid columns="repeat(2, 1fr)" gap="12px">
                {ACTION_TILES.map((tile) => (
                  <VStack gap="8px" align="center" justify="center" key={tile.id}   role="img" aria-label={t(tile.labelKey)} className={styles.tile}>
                    <span className={styles.tileIcon}>{tile.icon}</span>
                    <span>{t(tile.labelKey)}</span>
                  </VStack>
                ))}
              </Grid>
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
