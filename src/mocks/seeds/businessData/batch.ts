import type { BatchDetail, BatchRecord, Page } from "@/api";

const BATCHES: BatchRecord[] = [
  {
    name: "Batch-02",
    description: "Batch-02",
    resource: "Baker-01",
    systemState: "Created",
    loadState: "Not Loaded",
    state: "Active",
  },
  {
    name: "Batch-01",
    description: "Morning baking batch",
    resource: "Baker-02",
    systemState: "Released",
    loadState: "Loaded",
    state: "Active",
  },
  {
    name: "Batch-00",
    description: "Test batch",
    resource: "Mixer-01",
    systemState: "Closed",
    loadState: "Unloaded",
    state: "Terminated",
  },
];

export function queryBatches(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<BatchRecord> {
  let rows = BATCHES;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (batch) =>
        batch.name.toLowerCase().includes(needle) ||
        batch.description.toLowerCase().includes(needle),
    );
  }
  if (state !== undefined && state !== "" && state !== "all") {
    rows = rows.filter((batch) => batch.state.toLowerCase() === state.toLowerCase());
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildBatchDetail(name: string): BatchDetail {
  const record = BATCHES.find((batch) => batch.name === name) ?? {
    name,
    description: name,
    resource: "Baker-01",
    systemState: "Created",
    loadState: "Not Loaded",
    state: "Active",
  };
  const overlay = BATCH_DETAIL_OVERLAYS[record.name] ?? {};
  return {
    ...record,
    type: "Standard",
    universalState: record.state,
    dataGroup: "",
    step: "Baking",
    resourceJob: "JOB-0000000003",
    priority: 0,
    resourceType: "Standard",
    facility: "Cookie Factory",
    loadStartMode: "Before Release",
    loadMode: "None",
    materialSplitMode: "Allowed",
    allowProductMix: true,
    minimumBatchSize: "25 %",
    mainMaterial: "Cookie A1",
    service: "Baking",
    product: "Cookie A [A]",
    productDescription: "Cookie A",
    capacityClass: "Small",
    quantity: "900 Cookies",
    batchSize: "70 %",
    containerType: "General",
    ...overlay,
  };
}

const BATCH_DETAIL_OVERLAYS: Record<string, Partial<BatchDetail>> = {};

export interface BatchUpsertInput extends Partial<BatchDetail> {
  name: string;
}

export function createBatchDetail(input: BatchUpsertInput): BatchDetail {
  const record: BatchRecord = {
    name: input.name,
    description: input.description ?? "",
    resource: input.resource ?? "",
    systemState: "Created",
    loadState: "Not Loaded",
    state: "Active",
  };
  BATCHES.push(record);
  const overlay: Partial<BatchDetail> = { ...input };
  delete overlay.name;
  delete overlay.description;
  delete overlay.resource;
  delete overlay.systemState;
  delete overlay.loadState;
  delete overlay.state;
  BATCH_DETAIL_OVERLAYS[input.name] = overlay;
  return buildBatchDetail(input.name);
}

export function updateBatchDetail(
  name: string,
  input: Partial<BatchDetail>,
): BatchDetail | undefined {
  const record = BATCHES.find((b) => b.name === name);
  if (!record) return undefined;
  if (input.description !== undefined) record.description = input.description;
  if (input.resource !== undefined) record.resource = input.resource;
  if (input.systemState !== undefined) record.systemState = input.systemState;
  BATCH_DETAIL_OVERLAYS[name] = { ...BATCH_DETAIL_OVERLAYS[name], ...input };
  return buildBatchDetail(name);
}

