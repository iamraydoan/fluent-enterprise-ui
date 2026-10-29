import { ChevronDown20Regular } from "@/components/icons";
import { Menu, MenuItemRadio, MenuList, MenuPopover, MenuTrigger } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

interface SelectFilterOption {
  value: string;
  labelKey: TranslationKey;
}

interface SelectFilterProps {
  labelKey: TranslationKey;
  value: string;
  options: SelectFilterOption[];
  onChange: (value: string) => void;
}

export function SelectFilter({ labelKey, value, options, onChange }: SelectFilterProps) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const selected = options.find((option) => option.value === value);
  return (
    <Menu
      checkedValues={{ filter: [value] }}
      onCheckedValueChange={(_, d) => {
        const next = d.checkedItems[0];
        if (next) onChange(next);
      }}
    >
      <MenuTrigger disableButtonEnhancement>
        <button className={sharedStyles.dropdownButton}>
          {t(labelKey)} {selected ? t(selected.labelKey) : ""}
          <ChevronDown20Regular />
        </button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {options.map((option) => (
            <MenuItemRadio key={option.value} name="filter" value={option.value}>
              {t(option.labelKey)}
            </MenuItemRadio>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
