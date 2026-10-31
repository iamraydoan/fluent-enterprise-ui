import { makeStyles, tokens } from "@/components/ui";

const useBannerStyles = makeStyles({
  banner: { marginBottom: "12px", color: tokens.colorBrandForeground1 },
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
