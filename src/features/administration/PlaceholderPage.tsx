import { cloneElement } from "react";
import type { ReactElement } from "react";
import { IconContainer, VStack } from "@/components/common";
import { Wrench24Regular } from "@/components/icons";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

interface PlaceholderPageProps {
  title: string;
  icon?: ReactElement;
  body?: string;
}

export function PlaceholderPage({ title, icon, body }: PlaceholderPageProps) {
  const shared = useSharedStyles();
  const { t } = useAppTranslation();
  const renderedIcon = cloneElement(icon ?? <Wrench24Regular />, {
    style: { width: 40, height: 40 },
  });
  return (
    <VStack
      align="center"
      justify="center"
      gap="sm"
      grow
      p="xl"
      className={shared.headerBlock}
      aria-label={title}
    >
      <IconContainer icon={renderedIcon} size={40} tone="tertiary" />
      <Text weight="semibold" size={500} tone="primary" align="center">
        {title}
      </Text>
      <Text size={200} tone="tertiary" align="center">
        {body ?? t("placeholder.defaultBody")}
      </Text>
    </VStack>
  );
}
