import { Button, Menu, MenuItemRadio, MenuList, MenuPopover, MenuTrigger } from "@/components/ui";

export function MiniSelect({
  value,
  options,
  onSelect,
  ariaLabel,
}: {
  value: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
  ariaLabel?: string;
}) {
  const selected = options.find((o) => o.value === value);
  return (
    <Menu
      positioning="below-start"
      checkedValues={{ selected: value === "" ? [] : [value] }}
      onCheckedValueChange={(checkedItems) => onSelect(checkedItems[0] ?? "")}
    >
      <MenuTrigger disableButtonEnhancement>
        <Button variant="secondary" aria-label={ariaLabel}>
          {selected?.label ?? value}
        </Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {options.map((o) => (
            <MenuItemRadio key={o.value} name="selected" value={o.value}>
              {o.label}
            </MenuItemRadio>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
