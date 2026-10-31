import { useState } from "react";
import { Card, Empty, KV, ListPage, refreshAction } from "@/components/common";
import {
  ArrowRotateClockwise24Regular,
  Cube24Regular,
  ZoomIn24Regular,
  ZoomOut24Regular,
} from "@/components/icons";
import { Button, Text, makeStyles, mergeClasses, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface DetectedTag {
  id: string;
  entity: string;
  type: "Material" | "Resource";
  x: number;
  y: number;
}

interface TagDetail {
  state: string;
  product?: string;
  quantity?: string;
  storagePosition?: string;
  oee?: string;
}

const TAGS: DetectedTag[] = [
  { id: "tag-1", entity: "MAT-1042", type: "Material", x: 22, y: 30 },
  { id: "tag-2", entity: "Placement Machine", type: "Resource", x: 58, y: 45 },
  { id: "tag-3", entity: "MAT-2087", type: "Material", x: 78, y: 22 },
];

const TAG_DETAILS: Record<string, TagDetail> = {
  "tag-1": {
    state: "Active",
    product: "PCB-Assembly-A",
    quantity: "250",
    storagePosition: "WH-01-A-12",
  },
  "tag-2": { state: "Running", oee: "80%" },
  "tag-3": {
    state: "Quarantine",
    product: "Capacitor-10uF",
    quantity: "5000",
    storagePosition: "WH-02-B-04",
  },
};

const useArStyles = makeStyles({
  body: { display: "flex", columnGap: "12px", flexGrow: 1, minHeight: 0 },
  viewportCard: { flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column" },
  viewport: {
    position: "relative",
    flexGrow: 1,
    minHeight: "420px",
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground3,
    backgroundImage: `repeating-linear-gradient(45deg, ${tokens.colorNeutralBackground4} 0 12px, transparent 12px 24px)`,
    overflow: "hidden",
    transition: "transform 0.2s ease",
  },
  viewportLabel: {
    position: "absolute",
    top: "12px",
    left: "12px",
    color: tokens.colorNeutralForeground3,
    fontSize: "12px",
  },
  tag: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    padding: "6px 10px",
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    fontSize: "12px",
    fontWeight: tokens.fontWeightSemibold,
    border: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  tagSelected: {
    outline: `2px solid ${tokens.colorBrandStroke1}`,
    outlineOffset: "2px",
  },
  controls: { display: "flex", columnGap: "8px", marginTop: "12px" },
  side: { width: "340px", flexShrink: 0, display: "flex", flexDirection: "column", rowGap: "12px" },
});

export function AugmentedRealityPage() {
  const { t } = useAppTranslation();
  const styles = useArStyles();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const selected = TAGS.find((tag) => tag.id === selectedId) ?? null;
  const detail = selected ? TAG_DETAILS[selected.id] : null;

  const detailRows: [string, string][] = [];
  if (selected && detail) {
    detailRows.push([t("manufacturing.augmentedReality.fields.entity"), selected.entity]);
    detailRows.push([t("manufacturing.augmentedReality.fields.type"), selected.type]);
    detailRows.push([t("manufacturing.augmentedReality.fields.state"), detail.state]);
    if (detail.product)
      detailRows.push([t("manufacturing.augmentedReality.fields.product"), detail.product]);
    if (detail.quantity)
      detailRows.push([t("manufacturing.augmentedReality.fields.quantity"), detail.quantity]);
    if (detail.storagePosition)
      detailRows.push([
        t("manufacturing.augmentedReality.fields.storagePosition"),
        detail.storagePosition,
      ]);
    if (detail.oee) detailRows.push(["OEE", detail.oee]);
  }

  return (
    <ListPage
      header={{
        icon: <Cube24Regular />,
        title: t("manufacturing.augmentedReality.pageLabel"),
        actions: [refreshAction],
      }}
    >
      <div className={styles.body}>
        <div className={styles.viewportCard}>
          <Card title={t("manufacturing.augmentedReality.viewportTitle")}>
            <div
              className={styles.viewport}
              style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
            >
              <span className={styles.viewportLabel}>
                {t("manufacturing.augmentedReality.viewportEmpty")}
              </span>
              {TAGS.map((tag) => (
                <button
                  key={tag.id}
                  className={mergeClasses(styles.tag, tag.id === selectedId && styles.tagSelected)}
                  style={{ left: `${tag.x}%`, top: `${tag.y}%` }}
                  onClick={() => setSelectedId(tag.id)}
                >
                  {tag.entity}
                </button>
              ))}
            </div>
            <div className={styles.controls}>
              <Button
                appearance="secondary"
                icon={<ZoomIn24Regular />}
                onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
              >
                {t("manufacturing.augmentedReality.zoomIn")}
              </Button>
              <Button
                appearance="secondary"
                icon={<ZoomOut24Regular />}
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
              >
                {t("manufacturing.augmentedReality.zoomOut")}
              </Button>
              <Button
                appearance="secondary"
                icon={<ArrowRotateClockwise24Regular />}
                onClick={() => setRotation((r) => (r + 90) % 360)}
              >
                {t("manufacturing.augmentedReality.rotate")}
              </Button>
            </div>
          </Card>
        </div>
        <div className={styles.side}>
          <Card title={t("manufacturing.augmentedReality.detectedTags")}>
            {TAGS.length === 0 ? (
              <Empty>
                <Text>{t("manufacturing.augmentedReality.noTags")}</Text>
              </Empty>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", rowGap: "8px" }}>
                {TAGS.map((tag) => (
                  <Button
                    key={tag.id}
                    appearance={tag.id === selectedId ? "primary" : "secondary"}
                    onClick={() => setSelectedId(tag.id)}
                  >
                    {tag.entity} ({tag.type})
                  </Button>
                ))}
              </div>
            )}
          </Card>
          <Card title={t("manufacturing.augmentedReality.entityDetails")}>
            {selected && detail ? (
              <KV rows={detailRows} />
            ) : (
              <Empty>
                <Text>{t("manufacturing.augmentedReality.selectTag")}</Text>
              </Empty>
            )}
          </Card>
        </div>
      </div>
    </ListPage>
  );
}
