import { ChevronDown20Regular } from "@/components/icons";
import { Menu, MenuItemRadio, MenuList, MenuPopover, MenuTrigger } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

interface StateFilterProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function StateFilter({ value, options, onChange }: StateFilterProps) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const labels: Record<string, string> = {
    all: t("common.stateOptions.all"),
    active: t("common.stateOptions.active"),
    draft: t("common.stateOptions.draft"),
    terminated: t("common.stateOptions.terminated"),
  };
  return (
    <Menu
      checkedValues={{ state: [value] }}
      onCheckedValueChange={(_, d) => {
        const next = d.checkedItems[0];
        if (next) onChange(next);
      }}
    >
      <MenuTrigger disableButtonEnhancement>
        <button className={sharedStyles.dropdownButton}>
          {t("common.stateFilterLabel")} {labels[value] ?? labels.all}
          <ChevronDown20Regular />
        </button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {options.map((option) => (
            <MenuItemRadio key={option} name="state" value={option}>
              {labels[option] ?? option}
            </MenuItemRadio>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
