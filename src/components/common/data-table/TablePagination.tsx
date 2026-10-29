import {
  Button,
  ChevronDown20Regular,
  ChevronLeft20Regular,
  ChevronRight20Regular,
  Menu,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from "@/components/ui";
import { useSharedStyles } from "@/styles/shared";

interface TablePaginationProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  currentPage: number;
  pages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({
  pageSize,
  onPageSizeChange,
  currentPage,
  pages,
  total,
  onPageChange,
}: TablePaginationProps) {
  const sharedStyles = useSharedStyles();
  return (
    <div className={sharedStyles.tableFooter}>
      <span style={{ display: "inline-flex", alignItems: "center", columnGap: 6 }}>
        Rows per Page:
        <Menu
          checkedValues={{ size: [String(pageSize)] }}
          onCheckedValueChange={(_, d) => {
            onPageSizeChange(Number(d.checkedItems[0]));
          }}
        >
          <MenuTrigger disableButtonEnhancement>
            <button className={sharedStyles.dropdownButton} style={{ fontSize: 13 }}>
              {pageSize}
              <ChevronDown20Regular />
            </button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {[10, 25, 50, 100].map((n) => (
                <MenuItemRadio key={n} name="size" value={String(n)}>
                  {n}
                </MenuItemRadio>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
      </span>
      <div style={{ lineHeight: "19px" }}>
        Page {currentPage} of {pages}
        <br />({total} Records)
      </div>
      <div>
        <Button
          appearance="subtle"
          icon={<ChevronLeft20Regular />}
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        />
        <Button
          appearance="subtle"
          icon={<ChevronRight20Regular />}
          disabled={currentPage >= pages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        />
      </div>
    </div>
  );
}
