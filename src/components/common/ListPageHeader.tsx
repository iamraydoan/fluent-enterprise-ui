import { useState } from "react";
import type { ReactElement } from "react";
import { ActionBar } from "@/components/common/ActionBar";
import { PageHeader } from "@/components/common/PageHeader";
import { RibbonButton } from "@/components/common/RibbonButton";
import type { RibbonMenuItem } from "@/components/common/RibbonButton";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

export interface HeaderAction {
  id: string;
  icon: ReactElement;
  label?: string;
  labelKey?: TranslationKey;
  onClick?: () => void;
  menu?: RibbonMenuItem[];
  group?: "general" | "actions";
}

interface ListPageHeaderProps {
  icon: ReactElement;
  title: string;
  actions: readonly HeaderAction[];
}

const GROUP_LABEL_KEYS = {
  general: "actionBar.groups.general",
  actions: "actionBar.groups.actions",
} as const;

export function ListPageHeader({ icon, title, actions }: ListPageHeaderProps) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const [collapsed, setCollapsed] = useState(false);
  const groups: ("general" | "actions")[] = ["general", "actions"];
  return (
    <div className={sharedStyles.headerBlock}>
      {!collapsed && (
        <ActionBar>
          {groups.map((group) => {
            const groupActions = actions.filter((action) => (action.group ?? "general") === group);
            if (groupActions.length === 0) return null;
            return (
              <div key={group} className={sharedStyles.actionBarGroup}>
                <div className={sharedStyles.actionBarGroupButtons}>
                  {groupActions.map((action) => {
                    const label =
                      action.label ?? (action.labelKey ? t(action.labelKey) : undefined);
                    if (!label) return null;
                    return (
                      <RibbonButton
                        key={action.id}
                        sharedStyles={sharedStyles}
                        icon={action.icon}
                        label={label}
                        onClick={action.onClick}
                        menu={action.menu}
                      />
                    );
                  })}
                </div>
                <div className={sharedStyles.actionBarGroupLabel}>{t(GROUP_LABEL_KEYS[group])}</div>
              </div>
            );
          })}
        </ActionBar>
      )}
      <PageHeader collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)}>
        <span style={{ display: "inline-flex", alignItems: "center", columnGap: 12 }}>
          {icon}
          <Text size={300}>{title}</Text>
        </span>
      </PageHeader>
    </div>
  );
}
