import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search20Regular } from "@/components/icons";
import { Input, makeStyles, tokens } from "@/components/ui";
import { ADMINISTRATION_TILES } from "@/data/navigation";
import { containsIgnoreCase } from "@/lib/utils";
import { useTabsStore } from "@/stores/tabs-store";

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

export function AdministrationHubPage() {
  const hubStyles = useHubStyles();
  const openRoute = useTabsStore((state) => state.openRoute);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const tiles = ADMINISTRATION_TILES.filter((tile) => containsIgnoreCase(tile.label, searchQuery));
  return (
    <section className={hubStyles.page} aria-label="Administration">
      <div className={hubStyles.top}>
        <Input
          appearance="outline"
          style={{ width: 210, fontStyle: "italic" }}
          contentBefore={<Search20Regular />}
          placeholder="Search"
          value={searchQuery}
          onChange={(_, d) => setSearchQuery(d.value)}
          aria-label="Search"
        />
      </div>
      <div className={hubStyles.grid}>
        {tiles.map((tile) => (
          <button
            key={tile.id}
            className={hubStyles.tile}
            onClick={() => {
              openRoute(tile.route);
              navigate({ to: tile.route });
            }}
          >
            <span className={hubStyles.tileIcon}>{tile.icon}</span>
            <span>{tile.label}</span>
          </button>
        ))}
      </div>
      {tiles.length === 0 && (
        <div style={{ padding: 40, textAlign: "center", color: "#777" }}>No results</div>
      )}
    </section>
  );
}
