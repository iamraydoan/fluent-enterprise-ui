import type { ReactElement, ReactNode } from "react";
import { ListPageHeader } from "@/components/common/ListPageHeader";
import type { HeaderAction } from "@/components/common/ListPageHeader";

interface ListPageHeaderConfig {
  icon: ReactElement;
  title: string;
  actions: readonly HeaderAction[];
}

interface ListPageProps {
  header: ListPageHeaderConfig;
  children: ReactNode;
}

export function ListPage({ header, children }: ListPageProps) {
  return (
    <>
      <ListPageHeader icon={header.icon} title={header.title} actions={header.actions} />
      {children}
    </>
  );
}
