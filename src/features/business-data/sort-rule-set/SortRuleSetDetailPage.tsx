import { useState } from "react";
import { useSortRuleSetDetail } from "@/api";
import type { DetailTab } from "@/components/common";
import { DetailShell, Empty, KV, Panel, HStack, VStack  } from "@/components/common";
import { ArrowUp20Regular } from "@/components/icons";
import { Body1Strong, Button } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { theme } from "@/styles/theme";
import { formatRuleMeta } from "./sortRuleSetHelpers";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.sortRuleSet.tabs.details" },
  { value: "references", labelKey: "businessData.sortRuleSet.tabs.references" },
  { value: "history", labelKey: "businessData.sortRuleSet.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.sortRuleSet.sections.details",
  "businessData.sortRuleSet.sections.rules",
  "businessData.sortRuleSet.sections.attributes",
  "businessData.sortRuleSet.sections.attachments",
];

export function SortRuleSetDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const { data, isLoading } = useSortRuleSetDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.sortRuleSet.sections.details");
  const handleLeft = (value: string) => setLeft(value as TranslationKey);

  if (isLoading || data === undefined) {
    return (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.sortRuleSet.notFound")}</Body1Strong>
        </Empty>
      </Panel>
    );
  }

  let content;
  if (top !== "details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.sortRuleSet.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else if (left === "businessData.sortRuleSet.sections.rules") {
    content = (
      <Panel>
        <HStack align="center" justify="space-between">
          <Body1Strong>
            {t("businessData.sortRuleSet.sections.rules")} ({data.rules.length})
          </Body1Strong>
          <Button>{t("businessData.sortRuleSet.manageRules")}</Button>
        </HStack>
        <VStack gap="8px" style={{marginTop: theme.spacing.md}}>
          {data.rules.map((rule, index) => (
            <div key={rule.rule} className={sharedStyles.contentCard} style={{ padding: theme.spacing.md }}>
              <Body1Strong>
                {index + 1}. {rule.rule}
              </Body1Strong>
              <div>{formatRuleMeta(rule)}</div>
            </div>
          ))}
        </VStack>
      </Panel>
    );
  } else if (
    left === "businessData.sortRuleSet.sections.attributes" ||
    left === "businessData.sortRuleSet.sections.attachments"
  ) {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.sortRuleSet.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <div className={sharedStyles.contentCard} style={{ padding: theme.spacing.lg, marginBottom: theme.spacing.md }}>
        <Body1Strong>{t("businessData.sortRuleSet.sections.details")}</Body1Strong>
        <KV
          rows={[
            [t("businessData.sortRuleSet.detail.name"), data.name],
            [t("businessData.sortRuleSet.detail.description"), data.description],
            [t("businessData.sortRuleSet.detail.scope"), data.scope],
            [
              t("businessData.sortRuleSet.detail.state"),
              t(`common.${data.state.toLowerCase()}` as TranslationKey),
            ],
            [t("businessData.sortRuleSet.detail.dataGroup"), data.dataGroup],
          ]}
        />
      </div>
    );
  }

  return (
    <DetailShell
      title={data.name}
      icon={<ArrowUp20Regular />}
      topTabs={TOP_TABS}
      top={top}
      onTop={setTop}
      leftItems={LEFT_SECTIONS}
      left={left}
      onLeft={handleLeft}
      onEdit={() => {}}
      onAskAi={() => {}}
    >
      {content}
    </DetailShell>
  );
}
