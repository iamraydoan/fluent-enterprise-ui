import type {
  DataCollectionDetail,
  DataCollectionInstance,
  DataCollectionParameter,
  DataCollectionRecord,
  DataCollectionUpsertInput,
  OpenDataCollectionInstanceInput,
  PerformImmediateInput, Page 
} from "@/api";

const RECORDS: DataCollectionRecord[] = [
  { name: "Cookie Inspection 001", description: "Cookie Inspection", scope: "Inspection", state: "Created" },
  { name: "Dough Mixing 001", description: "Mixing parameters", scope: "General", state: "Effective" },
];

const DC_OVERLAYS: Record<string, Partial<DataCollectionDetail>> = {};

const DEFAULT_PARAMETERS: DataCollectionParameter[] = [
  { parameter: "Thickness", dataType: "FreeText", isOptional: false, minimumSamples: 1, maximumSamples: 5, minimumSampleReadings: 1, maximumSampleReadings: 1, limitChecking: "IndividualValue" },
  { parameter: "Weight", dataType: "Decimal", isOptional: false, minimumSamples: 1, maximumSamples: 3, minimumSampleReadings: 1, maximumSampleReadings: 1, limitChecking: "IndividualValue" },
];

export function queryDataCollections(page: number, limit: number, q?: string, state?: string): Page<DataCollectionRecord> {
  let rows = RECORDS;
  if (q) {
    const n = q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(n) || r.description.toLowerCase().includes(n));
  }
  if (state && state !== "" && state !== "all") rows = rows.filter((r) => r.state.toLowerCase() === state.toLowerCase());
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildDataCollectionDetail(name: string): DataCollectionDetail {
  const r = RECORDS.find((x) => x.name === name) ?? { name, description: name, scope: "Inspection", state: "Created" };
  const detail: DataCollectionDetail = {
    ...r,
    type: "Generic",
    universalState: r.state,
    dataGroup: "",
    changeSet: "Clone 135",
    userInterface: "Modern",
    spcMode: "On Post Per Sample",
    limitCheckingMode: "On Post",
    parameters: DEFAULT_PARAMETERS,
    limitSets: [{ name: "Cookie Inspection Limits 001" }],
    instances: [{ name: "Cookie Inspection 001 / Lot A", state: "Open", description: "", limitSet: "", material: "", postedData: [] }],
  };
  const overlay = DC_OVERLAYS[name];
  return overlay ? { ...detail, ...overlay } : detail;
}

function patchOverlay(name: string, patch: Partial<DataCollectionDetail>): DataCollectionDetail {
  DC_OVERLAYS[name] = { ...(DC_OVERLAYS[name] ?? {}), ...patch };
  return buildDataCollectionDetail(name);
}

export function createDataCollectionDetail(input: DataCollectionUpsertInput): DataCollectionDetail {
  const name = input.name ?? `Data Collection ${String(RECORDS.length + 1).padStart(3, "0")}`;
  RECORDS.push({ name, description: input.description ?? "", scope: input.scope ?? "General", state: "Created" });
  DC_OVERLAYS[name] = {
    type: input.type ?? "Generic",
    dataGroup: input.dataGroup ?? "",
    changeSet: input.changeSet ?? "",
    userInterface: input.userInterface ?? "Modern",
    spcMode: input.spcMode ?? "On Post Per Sample",
    parameters: input.parameters ?? [],
    limitSets: [],
    instances: [],
  };
  return buildDataCollectionDetail(name);
}

export function updateDataCollectionDetail(name: string, input: DataCollectionUpsertInput): DataCollectionDetail {
  const rec = RECORDS.find((x) => x.name === name);
  if (rec) {
    if (input.description !== undefined) rec.description = input.description;
    if (input.scope !== undefined) rec.scope = input.scope;
  }
  const { name: _n, ...rest } = input;
  return patchOverlay(name, rest);
}

export function setDataCollectionState(name: string, state: "Active" | "Terminated"): DataCollectionDetail {
  const rec = RECORDS.find((x) => x.name === name);
  if (rec) rec.state = state;
  return patchOverlay(name, { state, universalState: state });
}

export function manageDataCollectionParameters(
  name: string,
  parameters: DataCollectionParameter[],
): DataCollectionDetail {
  return patchOverlay(name, { parameters });
}

export function openDataCollectionInstance(
  name: string,
  input: OpenDataCollectionInstanceInput,
): DataCollectionDetail {
  const current = buildDataCollectionDetail(name);
  const instance: DataCollectionInstance = {
    name: input.instanceName?.trim() !== "" ? (input.instanceName as string) : `${name} / Instance ${current.instances.length + 1}`,
    state: "Open",
    description: input.description ?? "",
    limitSet: input.limitSet ?? "",
    material: input.material ?? "",
    postedData: [],
  };
  return patchOverlay(name, { instances: [...current.instances, instance] });
}

export function performImmediateDataCollection(
  name: string,
  input: PerformImmediateInput,
): DataCollectionDetail {
  const current = buildDataCollectionDetail(name);
  const instance: DataCollectionInstance = {
    name: input.instanceName?.trim() !== "" ? (input.instanceName as string) : `${name} / Immediate ${current.instances.length + 1}`,
    state: "Closed",
    description: input.description ?? "",
    limitSet: input.limitSet ?? "",
    material: "",
    postedData: input.values ?? [],
  };
  return patchOverlay(name, { instances: [...current.instances, instance] });
}

export function updateDataCollectionInstance(
  name: string,
  instance: string,
  patch: { state: string },
): DataCollectionDetail {
  const current = buildDataCollectionDetail(name);
  return patchOverlay(name, {
    instances: current.instances.map((i) => (i.name === instance ? { ...i, state: patch.state } : i)),
  });
}

export function postDataCollectionInstance(
  name: string,
  instance: string,
  values: { parameter: string; value: string }[],
): DataCollectionDetail {
  const current = buildDataCollectionDetail(name);
  return patchOverlay(name, {
    instances: current.instances.map((i) => {
      if (i.name !== instance) return i;
      const merged = [...i.postedData];
      values.forEach((v) => {
        const idx = merged.findIndex((m) => m.parameter === v.parameter);
        if (idx >= 0) merged[idx] = v;
        else merged.push(v);
      });
      return { ...i, postedData: merged };
    }),
  });
}

export function correctDataCollectionInstance(
  name: string,
  instance: string,
  values: { parameter: string; value: string }[],
): DataCollectionDetail {
  const current = buildDataCollectionDetail(name);
  return patchOverlay(name, {
    instances: current.instances.map((i) => (i.name === instance ? { ...i, postedData: values } : i)),
  });
}

export function resetDataCollectionInstance(name: string, instance: string): DataCollectionDetail {
  const current = buildDataCollectionDetail(name);
  return patchOverlay(name, {
    instances: current.instances.map((i) => (i.name === instance ? { ...i, postedData: [] } : i)),
  });
}
