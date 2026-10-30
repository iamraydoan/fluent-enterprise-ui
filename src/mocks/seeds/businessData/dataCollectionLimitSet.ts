import type {
  CopyDataCollectionLimitSetsInput,
  DataCollectionLimitSetDetail,
  DataCollectionLimitSetRecord,
  DataCollectionLimitSetUpsertInput,
  ManageLimitSetParametersInput,
  ParameterLimit,
  Page,
} from "@/api";

const RECORDS: DataCollectionLimitSetRecord[] = [
  {
    name: "Cookie Inspection Limits 001",
    description: "",
    dataCollection: "Cookie Inspection 001",
    state: "Created",
  },
  {
    name: "Cookie Baking Limit Set 001",
    description: "Baking limits",
    dataCollection: "Dough Mixing 001",
    state: "Effective",
  },
];

const OVERLAYS: Record<string, Partial<DataCollectionLimitSetDetail>> = {};

const DEFAULT_PARAMETER_LIMITS: ParameterLimit[] = [
  {
    parameter: "Thickness",
    overrideParameter: true,
    includeSampleLimits: true,
    minValue: "",
    maxValue: "",
    limitType: "Absolute",
    lowerErrorLimit: "300",
    lowerWarningLimit: "350",
    target: "400",
    upperWarningLimit: "450",
    upperErrorLimit: "500",
    sampleLimits: [
      {
        sampleId: "Sample 1",
        lowerErrorLimit: "300",
        lowerWarningLimit: "350",
        target: "400",
        upperWarningLimit: "450",
        upperErrorLimit: "500",
      },
    ],
  },
  {
    parameter: "Weight",
    overrideParameter: false,
    includeSampleLimits: false,
    minValue: "",
    maxValue: "",
    limitType: "Absolute",
    lowerErrorLimit: "",
    lowerWarningLimit: "",
    target: "",
    upperWarningLimit: "",
    upperErrorLimit: "",
    sampleLimits: [],
  },
];

export function queryDataCollectionLimitSets(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<DataCollectionLimitSetRecord> {
  let rows = RECORDS;
  if (q) {
    const n = q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(n));
  }
  if (state && state !== "" && state !== "all")
    rows = rows.filter((r) => r.state.toLowerCase() === state.toLowerCase());
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildDataCollectionLimitSetDetail(name: string): DataCollectionLimitSetDetail {
  const r = RECORDS.find((x) => x.name === name) ?? {
    name,
    description: name,
    dataCollection: "",
    state: "Created",
  };
  const overlay = OVERLAYS[name] ?? {};
  return {
    ...r,
    type: "General",
    universalState: r.state,
    dataGroup: "",
    changeSet: "",
    parameterLimits: DEFAULT_PARAMETER_LIMITS,
    ...overlay,
  };
}

export function createDataCollectionLimitSet(
  input: DataCollectionLimitSetUpsertInput,
): DataCollectionLimitSetDetail {
  const name =
    input.name ?? `Data Collection Limit Set ${String(RECORDS.length + 1).padStart(3, "0")}`;
  RECORDS.push({
    name,
    description: input.description ?? "",
    dataCollection: input.dataCollection ?? "",
    state: "Created",
  });
  OVERLAYS[name] = {
    type: input.type ?? "General",
    changeSet: input.changeSet ?? "",
    parameterLimits: input.parameterLimits ?? [],
  };
  return buildDataCollectionLimitSetDetail(name);
}

export function updateDataCollectionLimitSet(
  name: string,
  input: DataCollectionLimitSetUpsertInput,
): DataCollectionLimitSetDetail {
  const rec = RECORDS.find((x) => x.name === name);
  if (rec) {
    if (input.description !== undefined) rec.description = input.description;
    if (input.dataCollection !== undefined) rec.dataCollection = input.dataCollection;
  }
  const prev = OVERLAYS[name] ?? {};
  OVERLAYS[name] = {
    ...prev,
    ...(input.type !== undefined ? { type: input.type } : {}),
    ...(input.parameterLimits !== undefined ? { parameterLimits: input.parameterLimits } : {}),
  };
  return buildDataCollectionLimitSetDetail(name);
}

export function setDataCollectionLimitSetState(
  name: string,
  state: string,
): DataCollectionLimitSetDetail {
  const rec = RECORDS.find((x) => x.name === name);
  if (rec) rec.state = state;
  OVERLAYS[name] = { ...(OVERLAYS[name] ?? {}), state, universalState: state };
  return buildDataCollectionLimitSetDetail(name);
}

export function manageDataCollectionLimitSetParameters(
  name: string,
  input: ManageLimitSetParametersInput,
): DataCollectionLimitSetDetail {
  OVERLAYS[name] = { ...(OVERLAYS[name] ?? {}), parameterLimits: input.parameterLimits };
  return buildDataCollectionLimitSetDetail(name);
}

export function copyDataCollectionLimitSets(
  input: CopyDataCollectionLimitSetsInput,
): DataCollectionLimitSetDetail[] {
  return input.copies.map((copy) => {
    const source = buildDataCollectionLimitSetDetail(copy.source);
    RECORDS.push({
      name: copy.name,
      description: source.description,
      dataCollection: input.targetDataCollection,
      state: "Created",
    });
    OVERLAYS[copy.name] = {
      type: source.type,
      changeSet: input.changeSet ?? "",
      parameterLimits: source.parameterLimits,
    };
    return buildDataCollectionLimitSetDetail(copy.name);
  });
}
