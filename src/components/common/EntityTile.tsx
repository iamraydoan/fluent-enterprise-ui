import type { ReactNode } from "react";
import { makeStyles, mergeClasses, Text, tokens } from "@/components/ui";
import { cardSurface, tileSurface } from "@/styles/shared";

const useTileStyles = makeStyles({
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(var(--tile-min-width, 220px), 1fr))",
    gap: "12px",
    alignContent: "start",
  },
  tile: {
    ...cardSurface,
    backgroundColor: tileSurface.backgroundColor,
    position: "relative",
    padding: "12px 14px 12px 18px",
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
    minHeight: "100px",
    cursor: "pointer",
    overflow: "hidden",
    ":hover": { backgroundColor: tileSurface.hoverBackgroundColor },
  },
  accent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "5px",
  },
  title: {
    fontSize: "14px",
    fontWeight: tokens.fontWeightSemibold,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  subtitle: { fontSize: "12px", color: tokens.colorNeutralForeground3 },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingTop: "8px",
  },
});

interface TileGridProps {
  children: ReactNode;
  minWidth?: string;
  className?: string;
}

export function TileGrid({ children, minWidth = "220px", className }: TileGridProps) {
  const styles = useTileStyles();
  return (
    <div
      className={mergeClasses(styles.grid, className)}
      style={{ "--tile-min-width": minWidth } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

interface EntityTileProps {
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  accentColor?: string;
  backgroundColor?: string;
  onClick: () => void;
  ariaLabel?: string;
  className?: string;
}

export function EntityTile({
  title,
  subtitle,
  description,
  footer,
  accentColor,
  backgroundColor,
  onClick,
  ariaLabel,
  className,
}: EntityTileProps) {
  const styles = useTileStyles();
  return (
    <div
      className={mergeClasses(styles.tile, className)}
      style={backgroundColor ? { backgroundColor } : undefined}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick();
      }}
      aria-label={ariaLabel}
    >
      {accentColor && <div className={styles.accent} style={{ backgroundColor: accentColor }} />}
      <div>
        <Text weight="semibold" size={400} className={styles.title}>
          {title}
        </Text>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      {description && (
        <Text size={200} className={styles.subtitle}>
          {description}
        </Text>
      )}
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
