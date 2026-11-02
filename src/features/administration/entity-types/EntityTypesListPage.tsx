import { useState } from "react";
import { useCreateEntityType, useEntityTypes } from "@/api";
import type { EntityTypeRecord } from "@/api";
import {
  createAction,
  DataListPage,
  downloadLbosAction,
  exportAction,
  RECORD_STATE_COLUMN_OPTIONS,
  refreshAction,
} from "@/components/common";
import type { DataColumn, HeaderAction } from "@/components/common";
import { DocumentBulletList20Regular } from "@/components/icons";
import { useDetailNavigation } from "@/lib/useDetailNavigation";
import { useTabsStore } from "@/stores/tabs-store";
import { EntityTypeDialog, LbosDialog } from "./dialogs/EntityTypeDialogs";
import { modelFor, setEntityStore } from "./entityData";
import type { EntityTypeDetails, EntityTypeRow } from "./entityData";

const COLUMNS: DataColumn<EntityTypeRecord>[] = [
  {
    field: "name",
    headerName: "entityTypes.columns.name",
    type: "link",
    locked: true,
    width: "22%",
    truncate: true,
  },
  {
    field: "description",
    headerName: "entityTypes.columns.description",
    width: "22%",
    truncate: true,
  },
  {
    field: "system",
    headerName: "entityTypes.columns.system",
    type: "boolean",
    width: "14%",
    align: "center",
  },
  {
    field: "isRelation",
    headerName: "entityTypes.columns.relation",
    type: "boolean",
    width: "14%",
    align: "center",
  },
  {
    field: "versioned",
    headerName: "entityTypes.columns.versioned",
    type: "boolean",
    width: "14%",
    align: "center",
  },
  {
    field: "state",
    headerName: "entityTypes.columns.state",
    width: "14%",
    type: "enum",
    enumOptions: RECORD_STATE_COLUMN_OPTIONS,
  },
];

export function EntityTypesListPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const openDetail = useDetailNavigation("/administration/entity-types/$name", openRoute);
  const [createOpen, setCreateOpen] = useState(false);
  const [lbosOpen, setLbosOpen] = useState(false);
  const { data: listData } = useEntityTypes({ page: 1, limit: 200 });
  const createMutation = useCreateEntityType();

  const entityNames = (listData?.data ?? []).map((row) => row.name);

  const actions: HeaderAction[] = [
    { ...createAction, onClick: () => setCreateOpen(true) },
    refreshAction,
    exportAction,
    { ...downloadLbosAction, onClick: () => setLbosOpen(true) },
  ];

  const handleCreate = (details: EntityTypeDetails) => {
    const row: EntityTypeRow = {
      name: details.name,
      description: details.desc,
      system: false,
      relation: details.relation,
      versioned: details.versioned,
      state: "Active",
    };
    createMutation.mutate(
      {
        name: details.name,
        description: details.desc,
        versioned: details.versioned,
        isRelation: details.relation,
        lockType: details.lockType,
      },
      {
        onSuccess: () => {
          setEntityStore(details.name, {
            details: { ...details, state: "Active", system: false, licensed: false },
            model: modelFor(row, true),
          });
          setCreateOpen(false);
          openDetail(details.name);
        },
      },
    );
  };

  return (
    <>
      <DataListPage
        icon={<DocumentBulletList20Regular />}
        titleKey="entityTypes.pageLabel"
        listTitleKey="entityTypes.title"
        actions={actions}
        columns={COLUMNS}
        useListQuery={useEntityTypes}
        getRowId={(row) => row.id}
        onRowClick={(row) => openDetail(row.name)}
      />
      {createOpen && (
        <EntityTypeDialog
          mode="create"
          existingNames={entityNames}
          entityNames={entityNames}
          onSave={handleCreate}
          onClose={() => setCreateOpen(false)}
        />
      )}
      {lbosOpen && <LbosDialog onClose={() => setLbosOpen(false)} />}
    </>
  );
}
