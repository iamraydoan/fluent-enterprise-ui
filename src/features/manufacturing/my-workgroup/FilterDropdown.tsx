import { FilterGroup, MenuTriggerButton } from "@/components/common";
import { ChevronDown16Regular } from "@/components/icons";
import { Menu, MenuItemRadio, MenuList, MenuPopover, MenuTrigger } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function FilterDropdown({ label, value, options, onChange }: FilterDropdownProps) {
  const { t } = useAppTranslation();
  return (
    <FilterGroup label={label}>
      <Menu
        checkedValues={{ filter: [value] }}
        onCheckedValueChange={(checkedItems) => {
          const next = checkedItems[0];
          if (next !== undefined) onChange(next);
        }}
      >
        <MenuTrigger disableButtonEnhancement>
          <MenuTriggerButton ariaLabel={label}>
            {value === "" ? t("myWorkgroup.filters.all").toUpperCase() : value.toUpperCase()}
            <ChevronDown16Regular />
          </MenuTriggerButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItemRadio name="filter" value="">
              {t("myWorkgroup.filters.all")}
            </MenuItemRadio>
            {options.map((option) => (
              <MenuItemRadio key={option} name="filter" value={option}>
                {option}
              </MenuItemRadio>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
    </FilterGroup>
  );
}
