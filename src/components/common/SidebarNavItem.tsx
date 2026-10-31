import { makeStyles, mergeClasses, Text, tokens } from "@/components/ui";

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
    borderRadius: tokens.borderRadiusMedium,
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  active: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    fontWeight: tokens.fontWeightSemibold,
  },
  desc: { fontSize: "12px", color: tokens.colorNeutralForeground3 },
});

interface SidebarNavItemProps {
  icon?: React.ReactNode;
  label: string;
  description?: string;
  active: boolean;
  onClick: () => void;
}

export function SidebarNavItem({ icon, label, description, active, onClick }: SidebarNavItemProps) {
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
    </button>
  );
}
