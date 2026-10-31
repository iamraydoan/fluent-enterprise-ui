import { useState } from "react";
import { Search20Regular } from "@/components/icons";
import { Input, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { containsIgnoreCase } from "@/lib/utils";

const useHubStyles = makeStyles({
  page: {
    flexGrow: 1,
    minHeight: 0,
    backgroundColor: "#FAFAFA",
    borderRadius: "0 0 12px 12px",
    display: "flex",
    flexDirection: "column",
    padding: "14px 20px 20px",
    overflow: "auto",
  },
  top: { display: "flex", justifyContent: "flex-end", paddingBottom: "18px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(126px, 1fr))",
    gap: "10px",
  },
  tile: {
    height: "118px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    rowGap: "10px",
    padding: "8px",
    backgroundColor: "#F0F0F0",
    border: "1px solid #CFCFCF",
    borderRadius: "4px",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    lineHeight: "16px",
    color: "#222",
    textAlign: "center",
    ":hover": { backgroundColor: "#E6EBF5", border: "1px solid #9DB5E8" },
    ":focus-visible": { outline: `2px solid ${tokens.colorBrandStroke1}`, outlineOffset: "1px" },
  },
  tileIcon: { fontSize: "32px", display: "grid", placeItems: "center", height: "32px" },
});

interface HubTile {
  id: string;
  labelKey: TranslationKey;
  icon: React.ReactNode;
  route: string;
}

interface HubPageProps {
  tiles: HubTile[];
  ariaLabelKey: TranslationKey;
  searchWidth?: number;
  onTileClick: (route: string) => void;
}

export function HubPage({ tiles, ariaLabelKey, searchWidth = 210, onTileClick }: HubPageProps) {
  const hubStyles = useHubStyles();
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useAppTranslation();
  const filtered = tiles.filter((tile) => containsIgnoreCase(t(tile.labelKey), searchQuery));

  return (
    <section className={hubStyles.page} aria-label={t(ariaLabelKey)}>
      <div className={hubStyles.top}>
        <Input
          appearance="outline"
          style={{ width: searchWidth, fontStyle: "italic" }}
          contentBefore={<Search20Regular />}
          placeholder={t("common.search")}
          value={searchQuery}
          onChange={(_, d) => setSearchQuery(d.value)}
          aria-label={t("common.search")}
        />
      </div>
      <div className={hubStyles.grid}>
        {filtered.map((tile) => (
          <button key={tile.id} className={hubStyles.tile} onClick={() => onTileClick(tile.route)}>
            <span className={hubStyles.tileIcon}>{tile.icon}</span>
            <span>{t(tile.labelKey)}</span>
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ padding: 40, textAlign: "center", color: "#777" }}>
          {t("common.noResults")}
        </div>
      )}
    </section>
  );
}
