import type {
  ChecklistDetail,
  ChecklistInstance,
  ChecklistInstanceItemState,
  ChecklistItem,
  ChecklistRecord,
  ChecklistUpsertInput,
  Page,
} from "@/api";

const RECORDS: ChecklistRecord[] = [
  {
    name: "Material Deviation Checklist 002",
    description: "Material Deviation Checklist 002",
    scope: "MaterialTracking",
    executionMode: "Long Running",
    state: "Effective",
  },
  {
    name: "Preventive Maintenance 01",
    description: "Monthly PM checklist",
    scope: "Maintenance Management",
    executionMode: "Immediate",
    state: "Effective",
  },
];

const CHECKLIST_OVERLAYS = new Map<string, Partial<ChecklistDetail>>();

const BASE_ITEMS: ChecklistItem[] = [
  {
    name: "Item 01: Verify Material Deviation",
    description: "Confirm that the material deviation has been correctly identified.",
    itemType: "Verification",
    documentationUrl: "",
    activityType: "Manual Task",
    trackingType: "End",
    rule: "",
    timeCategory: "Value Added",
    standardDuration: "5m",
    floating: false,
    optional: false,
    executedOutOfOrder: false,
    group: "",
    instructions: "",
    conditionType: "None",
    conditionExpression: "",
    parameters: [],
  },
  {
    name: "Item 02: Isolate Affected Material",
    description: "Physically and systemically segregate all affected material.",
    itemType: "Isolation",
    documentationUrl: "",
    activityType: "Manual Task",
    trackingType: "End",
    rule: "",
    timeCategory: "Required Non-Value Added",
    standardDuration: "5m",
    floating: false,
    optional: false,
    executedOutOfOrder: false,
    group: "",
    instructions: "",
    conditionType: "None",
    conditionExpression: "",
    parameters: [],
  },
];

const BASE_INSTANCES: ChecklistInstance[] = [
  {
    name: "Instance 2026-10-001",
    state: "Open",
    executingState: "Executing",
    material: "MAT-001",
    items: [
      {
        name: "Item 01: Verify Material Deviation",
        activityType: "Manual Task",
        state: "Completed",
        optional: false,
        floating: false,
      },
      {
        name: "Item 02: Isolate Affected Material",
        activityType: "Manual Task",
        state: "Not Started",
        optional: false,
        floating: false,
      },
    ],
    deviations: [],
  },
];

export function queryChecklists(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<ChecklistRecord> {
  let rows = RECORDS;
  if (q) {
    const n = q.toLowerCase();
    rows = rows.filter(
      (r) => r.name.toLowerCase().includes(n) || r.description.toLowerCase().includes(n),
    );
  }
  if (state && state !== "" && state !== "all")
    rows = rows.filter((r) => r.state.toLowerCase() === state.toLowerCase());
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildChecklistDetail(name: string): ChecklistDetail {
  const r = RECORDS.find((x) => x.name === name) ?? {
    name,
    description: name,
    scope: "General",
    executionMode: "Immediate",
    state: "Effective",
  };
  const overlay = CHECKLIST_OVERLAYS.get(name) ?? {};
  return {
    ...r,
    type: "Standard",
    universalState: r.state,
    dataGroup: "",
    changeSet: "",
    useAutomaticChangeSet: false,
    approvalRole: "",
    makeEffectiveOnApproval: false,
    bom: "BOM 001 [A]",
    product: "",
    dataCollection: "",
    dataCollectionLimitSet: "",
    materialDeviationProtocol: "DeviationProtocol_001 [A]",
    defineStandardTimes: true,
    trackExecutionTimes: true,
    documentationUrl: "",
    standardDuration: "10m",
    items: BASE_ITEMS,
    instances: BASE_INSTANCES,
    ...overlay,
  };
}

function writeOverlay(name: string, patch: Partial<ChecklistDetail>): ChecklistDetail {
  const current = CHECKLIST_OVERLAYS.get(name) ?? {};
  const next = { ...current, ...patch };
  CHECKLIST_OVERLAYS.set(name, next);
  return buildChecklistDetail(name);
}

export function createChecklistDetail(input: ChecklistUpsertInput): ChecklistDetail {
  const name = (input.name ?? "").trim();
  if (!RECORDS.some((r) => r.name === name)) {
    RECORDS.push({
      name,
      description: input.description ?? "",
      scope: input.scope ?? "General",
      executionMode: input.executionMode ?? "Immediate",
      state: "Created",
    });
  }
  const { name: _name, ...rest } = input;
  CHECKLIST_OVERLAYS.set(name, {
    description: input.description ?? "",
    scope: input.scope ?? "General",
    executionMode: input.executionMode ?? "Immediate",
    ...rest,
  });
  return buildChecklistDetail(name);
}

export function updateChecklistDetail(name: string, input: ChecklistUpsertInput): ChecklistDetail {
  const rec = RECORDS.find((r) => r.name === name);
  if (rec) {
    if (input.description !== undefined) rec.description = input.description;
    if (input.scope !== undefined) rec.scope = input.scope;
    if (input.executionMode !== undefined) rec.executionMode = input.executionMode;
  }
  const { name: _name, ...rest } = input;
  return writeOverlay(name, rest);
}

export function setChecklistState(name: string, state: string): ChecklistDetail {
  const rec = RECORDS.find((r) => r.name === name);
  if (rec) rec.state = state;
  return writeOverlay(name, { state, universalState: state });
}

export function openChecklistInstance(
  name: string,
  input: { name?: string; material?: string },
): ChecklistDetail {
  const detail = buildChecklistDetail(name);
  const instance: ChecklistInstance = {
    name: (input.name ?? "").trim() || `${name} - Instance ${detail.instances.length + 1}`,
    state: "Open",
    executingState: "Executing",
    material: input.material ?? "",
    items: detail.items.map((i) => ({
      name: i.name,
      activityType: i.activityType,
      state: "Not Started" as ChecklistInstanceItemState,
      optional: i.optional,
      floating: i.floating,
    })),
    deviations: [],
  };
  return writeOverlay(name, { instances: [...detail.instances, instance] });
}

export function updateChecklistInstance(
  name: string,
  instance: string,
  patch: Partial<ChecklistInstance>,
): ChecklistDetail {
  const detail = buildChecklistDetail(name);
  const next = detail.instances.map((i) => (i.name === instance ? { ...i, ...patch } : i));
  return writeOverlay(name, { instances: next });
}

export function performChecklistInstance(
  name: string,
  instance: string,
  items: { name: string; state: ChecklistInstanceItemState }[],
  close?: boolean,
): ChecklistDetail {
  const detail = buildChecklistDetail(name);
  const next = detail.instances.map((inst) => {
    if (inst.name !== instance) return inst;
    const nextItems = inst.items.map((it) => {
      const update = items.find((u) => u.name === it.name);
      return update ? { ...it, state: update.state } : it;
    });
    return {
      ...inst,
      items: nextItems,
      executingState: close ? ("Closed" as const) : inst.executingState,
    };
  });
  return writeOverlay(name, { instances: next });
}

export function openMaterialDeviation(
  name: string,
  instance: string,
  deviation: { itemName: string; deviationType: string },
): ChecklistDetail {
  const detail = buildChecklistDetail(name);
  const next = detail.instances.map((inst) => {
    if (inst.name !== instance) return inst;
    return {
      ...inst,
      deviations: [...inst.deviations, `${deviation.deviationType}: ${deviation.itemName}`],
    };
  });
  return writeOverlay(name, { instances: next });
}
