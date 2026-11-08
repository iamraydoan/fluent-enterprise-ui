import type { ReactNode } from "react";
import { makeStyles, mergeClasses, Text } from "@/components/ui";
import { useSharedStyles } from "@/styles/shared";
import { theme } from "@/styles/theme";
import { SectionHeader } from "./Section";
import { HStack, VStack } from "./Stack";
import type { StackGap } from "./Stack";

const useFieldStyles = makeStyles({
  row: { fontSize: "13px" },
  label: { color: theme.color.textTertiary },
});

const useCardTitleStyles = makeStyles({
  compact: {
    paddingBottom: theme.spacing.sm,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
});

export function DetailCard({
  title,
  titleVariant = "section",
  header,
  headerGap = "md",
  children,
  className,
}: {
  title?: ReactNode;
  titleVariant?: "section" | "compact";
  header?: ReactNode;
  headerGap?: StackGap;
  children: ReactNode;
  className?: string;
}) {
  const sharedStyles = useSharedStyles();
  const cardTitleStyles = useCardTitleStyles();
  return (
    <VStack gap="md" className={mergeClasses(sharedStyles.contentCard, className)}>
      {header !== undefined ? (
        <HStack align="center" justify="space-between" mb={headerGap}>
          {header}
        </HStack>
      ) : title !== undefined && titleVariant === "compact" ? (
        <Text size={300} weight="semibold" className={cardTitleStyles.compact}>
          {title}
        </Text>
      ) : (
        title !== undefined && <SectionHeader title={title} />
      )}
      {children}
    </VStack>
  );
}

export function DetailField({
  label,
  value,
  labelWidth = 120,
}: {
  label: string;
  value: ReactNode;
  labelWidth?: number;
}) {
  const fieldStyles = useFieldStyles();
  return (
    <HStack gap="12px" className={fieldStyles.row}>
      <span className={fieldStyles.label} style={{ minWidth: `${labelWidth}px` }}>
        {label}:
      </span>
      <span>{value}</span>
    </HStack>
  );
}
