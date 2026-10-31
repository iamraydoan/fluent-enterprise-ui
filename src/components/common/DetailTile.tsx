import { makeStyles } from "@/components/ui";
import { detailTileColors } from "@/styles/shared";

const useTileStyles = makeStyles({
  tile: {
    width: "72px",
    height: "72px",
    flexShrink: 0,
    backgroundColor: detailTileColors.background,
    color: detailTileColors.foreground,
    display: "grid",
    placeItems: "center",
    fontSize: "44px",
    borderRadius: "8px",
  },
});

interface DetailTileProps {
  icon: React.ReactNode;
}

export function DetailTile({ icon }: DetailTileProps) {
  const styles = useTileStyles();
  return <div className={styles.tile}>{icon}</div>;
}
