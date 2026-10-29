import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search20Regular } from "@/components/icons";
import { Input, makeStyles, Text, tokens } from "@/components/ui";
import { ADMINISTRATION_TILES } from "@/data/navigation";
import { containsIgnoreCase } from "@/lib/utils";
import { useTabsStore } from "@/stores/tabs-store";
import { useSharedStyles } from "@/styles/shared";

const useHubStyles = makeStyles({
  searchRow: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "4px 0 12px",
  },
  tileGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "12px",
    padding: "8px 0 16px",
  },
  tileButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    rowGap: "10px",
    minHeight: "112px",
    padding: "16px 8px",
    backgroundColor: "#FFFFFF",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: "8px",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    color: "#222",
    textAlign: "center",
    ":hover": { backgroundColor: "#F3F2F1" },
  },
});

export function AdministrationHubPage() {
  const sharedStyles = useSharedStyles();
  const hubStyles = useHubStyles();
  const openRoute = useTabsStore((state) => state.openRoute);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const tiles = ADMINISTRATION_TILES.filter((tile) => containsIgnoreCase(tile.label, searchQuery));
  return (
    <section className={sharedStyles.contentCard} aria-label="Administration">
      <div className={hubStyles.searchRow}>
        <Input
          className={sharedStyles.searchInput}
          appearance="outline"
          contentBefore={<Search20Regular />}
          placeholder="Search"
          value={searchQuery}
          onChange={(_, d) => setSearchQuery(d.value)}
          aria-label="Search"
        />
      </div>
      <div className={hubStyles.tileGrid}>
        {tiles.map((tile) => (
          <button
            key={tile.id}
            className={hubStyles.tileButton}
            onClick={() => {
              openRoute(tile.route);
              navigate({ to: tile.route });
            }}
          >
            {tile.icon}
            <Text size={300}>{tile.label}</Text>
          </button>
        ))}
      </div>
      {tiles.length === 0 && (
        <div style={{ padding: 40, textAlign: "center", color: tokens.colorNeutralForeground3 }}>
          No tiles found
        </div>
      )}
    </section>
  );
}
