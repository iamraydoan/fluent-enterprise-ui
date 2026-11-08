import type { ReactNode } from "react";
import { makeStyles, mergeClasses } from "@/components/ui";
import { useSharedStyles } from "@/styles/shared";
import { theme } from "@/styles/theme";
import { SectionHeader } from "./Section";
import { HStack, VStack } from "./Stack";

const useFieldStyles = makeStyles({
  row: { fontSize: "13px" },
  label: { color: theme.color.textTertiary, minWidth: "120px" },
});

export function DetailCard({
  title,
  children,
  className,
}: {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const sharedStyles = useSharedStyles();
  return (
    <VStack gap="md" className={mergeClasses(sharedStyles.contentCard, className)}>
      {title !== undefined && <SectionHeader title={title} />}
      {children}
    </VStack>
  );
}

export function DetailField({ label, value }: { label: string; value: ReactNode }) {
  const fieldStyles = useFieldStyles();
  return (
    <HStack gap="12px" className={fieldStyles.row}>
      <span className={fieldStyles.label}>{label}:</span>
      <span>{value}</span>
    </HStack>
  );
}
