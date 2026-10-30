import type {
  ContainerDetail,
  ContainerPosition,
  ContainerRecord,
  ContainerUpsertInput,
  Page,
} from "@/api";

const RECORDS: ContainerRecord[] = [
  {
    name: "Container 001",
    description: "Container 001 of 100",
    type: "General",
    systemState: "Available",
    state: "Active",
  },
  {
    name: "Container 002",
    description: "In transit container",
    type: "General",
    systemState: "In Transit",
    state: "Active",
  },
];

const CONTAINER_OVERLAYS: Record<string, Partial<ContainerDetail>> = {};

function defaultPositions(): ContainerPosition[] {
  return Array.from({ length: 10 }, (_, i) => ({
    position: i + 1,
    material:
      i < 8
        ? [
            "Cookie A1",
            "Cookie A1",
            "Cookie A5",
            "Cookie C3",
            "",
            "Cookie D3",
            "Cookie B1",
            "Cookie D2",
          ][i]
        : "",
    product: i < 8 ? "Cookie A [A]" : "",
    step: i < 8 ? "Mixing" : "",
    quantity: i < 8 ? [40, 40, 40, 50, 0, 70, 100, 70][i] : 0,
    unit: "Kg",
  }));
}

export function queryContainers(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<ContainerRecord> {
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

export function buildContainerDetail(name: string): ContainerDetail {
  const r = RECORDS.find((x) => x.name === name) ?? {
    name,
    description: name,
    type: "General",
    systemState: "Available",
    state: "Active",
  };
  const positions = defaultPositions();
  const detail: ContainerDetail = {
    ...r,
    universalState: r.state,
    dataGroup: "",
    facility: "Cookie Factory",
    parent: "",
    onHold: false,
    positionUnitType: "Material",
    allowMixedTypes: false,
    usedPositions: 8,
    totalPositions: 10,
    capacityValidationMode: "Units",
    capacityForm: "",
    capacityUnit: "Kg",
    capacityPerPosition: 10,
    positionSorting: "Ascending",
    vendor: "",
    vendorId: "",
    autoGeneratePositions: false,
    orientation: "None",
    materials: positions
      .filter((p) => p.material !== "")
      .map((p) => ({
        position: p.position,
        material: p.material,
        product: p.product,
        step: p.step,
        quantity: `${p.quantity} ${p.unit}`,
      })),
    positions,
  };
  const overlay = CONTAINER_OVERLAYS[name];
  return overlay ? { ...detail, ...overlay } : detail;
}

export function createContainerDetail(input: ContainerUpsertInput): ContainerDetail {
  const name = input.name ?? `Container ${String(RECORDS.length + 1).padStart(3, "0")}`;
  RECORDS.push({
    name,
    description: input.description ?? "",
    type: input.type ?? "General",
    systemState: "Available",
    state: "Active",
  });
  CONTAINER_OVERLAYS[name] = {
    dataGroup: input.dataGroup ?? "",
    facility: input.facility ?? "",
    vendor: input.vendor ?? "",
    vendorId: input.vendorId ?? "",
    positionUnitType: input.positionUnitType ?? "Material",
    autoGeneratePositions: input.autoGeneratePositions ?? false,
    totalPositions: input.totalPositions ?? 10,
    capacityValidationMode: input.capacityValidationMode ?? "None",
    capacityForm: input.capacityForm ?? "",
    capacityUnit: input.capacityUnit ?? "",
    capacityPerPosition: input.capacityPerPosition ?? 0,
    allowMixedTypes: input.allowMixedTypes ?? false,
    orientation: input.orientation ?? "None",
    positionSorting: input.positionSorting ?? "Ascending",
  };
  return buildContainerDetail(name);
}

export function updateContainerDetail(name: string, input: ContainerUpsertInput): ContainerDetail {
  const rec = RECORDS.find((x) => x.name === name);
  if (rec) {
    if (input.description !== undefined) rec.description = input.description;
    if (input.type !== undefined) rec.type = input.type;
  }
  CONTAINER_OVERLAYS[name] = { ...(CONTAINER_OVERLAYS[name] ?? {}), ...input };
  return buildContainerDetail(name);
}

export function setContainerState(name: string, state: "Active" | "Terminated"): ContainerDetail {
  const rec = RECORDS.find((x) => x.name === name);
  if (rec) rec.state = state;
  CONTAINER_OVERLAYS[name] = { ...(CONTAINER_OVERLAYS[name] ?? {}), state, universalState: state };
  return buildContainerDetail(name);
}

export function applyContainerOperation(
  name: string,
  operation: string,
  payload: Record<string, unknown>,
): ContainerDetail {
  const current = buildContainerDetail(name);
  switch (operation) {
    case "make-available":
      CONTAINER_OVERLAYS[name] = { ...(CONTAINER_OVERLAYS[name] ?? {}), systemState: "Available" };
      break;
    case "make-unavailable":
      CONTAINER_OVERLAYS[name] = {
        ...(CONTAINER_OVERLAYS[name] ?? {}),
        systemState: "Unavailable",
      };
      break;
    case "empty": {
      const cleared = current.positions.map((p) => ({
        ...p,
        material: "",
        product: "",
        step: "",
        quantity: 0,
      }));
      CONTAINER_OVERLAYS[name] = {
        ...(CONTAINER_OVERLAYS[name] ?? {}),
        positions: cleared,
        materials: [],
        usedPositions: 0,
      };
      break;
    }
    case "manage-positions": {
      const updates = payload.positions as { position: number; material: string }[] | undefined;
      if (updates) {
        const positions = current.positions.map((p) => {
          const u = updates.find((x) => x.position === p.position);
          return u ? { ...p, material: u.material } : p;
        });
        CONTAINER_OVERLAYS[name] = {
          ...(CONTAINER_OVERLAYS[name] ?? {}),
          positions,
          materials: positions
            .filter((p) => p.material !== "")
            .map((p) => ({
              position: p.position,
              material: p.material,
              product: p.product,
              step: p.step,
              quantity: `${p.quantity} ${p.unit}`,
            })),
          usedPositions: positions.filter((p) => p.material !== "").length,
        };
      }
      break;
    }
    default:
      break;
  }
  return buildContainerDetail(name);
}
