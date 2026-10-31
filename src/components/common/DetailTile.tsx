import { makeStyles } from "@/components/ui";

const useTileStyles = makeStyles({
  tile: {
    width: "72px",
    height: "72px",
    flexShrink: 0,
    backgroundColor: "#C9E0EC",
    color: "#0F5C93",
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
