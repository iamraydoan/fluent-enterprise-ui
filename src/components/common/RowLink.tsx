import type { ReactNode } from "react";
import { useSharedStyles } from "@/styles/shared";

interface RowLinkProps {
  onOpen: () => void;
  children: ReactNode;
}

export function RowLink({ onOpen, children }: RowLinkProps) {
  const sharedStyles = useSharedStyles();
  return (
    <a
      className={sharedStyles.tableLink}
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onOpen();
      }}
    >
      {children}
    </a>
  );
}
