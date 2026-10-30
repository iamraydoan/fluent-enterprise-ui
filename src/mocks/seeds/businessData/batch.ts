import type { BatchDetail, BatchRecord, Page  } from "@/api";

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

export function queryBatches(page: number, limit: number, q?: string, state?: string): Page<BatchRecord> {
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
  };
}
