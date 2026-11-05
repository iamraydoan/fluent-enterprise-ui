import { makeStyles, mergeClasses, Text } from "@/components/ui";
import { theme } from "@/styles/theme";

const useNavItemStyles = makeStyles({
  item: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
    width: "100%",
    padding: "8px 12px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    fontSize: "13px",
    borderRadius: theme.radius.md,
    ":hover": { backgroundColor: theme.color.surfaceHover },
  },
  active: {
    backgroundColor: theme.color.surfaceSelected,
    fontWeight: theme.font.weightSemibold,
  },
  desc: { fontSize: "12px", color: theme.color.textTertiary },
  count: { marginLeft: "auto", fontSize: "12px", fontWeight: theme.font.weightSemibold },
});

interface SidebarNavItemProps {
  icon?: React.ReactNode;
  label: string;
  description?: string;
  count?: React.ReactNode;
  endContent?: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

export function SidebarNavItem({
  icon,
  label,
  description,
  count,
  endContent,
  active,
  onClick,
}: SidebarNavItemProps) {
  const styles = useNavItemStyles();
  return (
    <button
      className={mergeClasses(styles.item, active && styles.active)}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span>
        <Text weight={active ? "semibold" : "regular"} size={300}>
          {label}
        </Text>
        {description && <div className={styles.desc}>{description}</div>}
      </span>
      {count !== undefined && <span className={styles.count}>{count}</span>}
      {endContent}
    </button>
  );
}
