import { makeStyles } from "@/components/ui";
import { theme } from "@/styles/theme";

const useBannerStyles = makeStyles({
  banner: { marginBottom: "12px", color: theme.color.textBrand },
});

interface DialogEntityBannerProps {
  icon: React.ReactNode;
  name: string;
}

export function DialogEntityBanner({ icon, name }: DialogEntityBannerProps) {
  const styles = useBannerStyles();
  return (
    <div className={styles.banner}>
      {icon} {name}
    </div>
  );
}
