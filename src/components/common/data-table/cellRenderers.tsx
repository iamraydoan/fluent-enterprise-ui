import type { ReactNode } from "react";
import { RowLink } from "@/components/common/RowLink";
import { Checkmark20Filled, Dismiss20Filled } from "@/components/icons";
import { makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

const useBooleanCellStyles = makeStyles({
  cell: {
    display: "flex",
    justifyContent: "center",
  },
  no: {
    color: tokens.colorNeutralForeground3,
  },
});

export function BooleanCell({ value }: { value: unknown }) {
  const { t } = useAppTranslation();
  const styles = useBooleanCellStyles();
  if (value === null || value === undefined) return null;
  return (
    <div className={styles.cell}>
      {value ? (
        <Checkmark20Filled aria-label={t("common.yes")} />
      ) : (
        <Dismiss20Filled aria-label={t("common.no")} className={styles.no} />
      )}
    </div>
  );
}

export function LinkCell({ onOpen, children }: { onOpen: () => void; children: ReactNode }) {
  return <RowLink onOpen={onOpen}>{children}</RowLink>;
}
