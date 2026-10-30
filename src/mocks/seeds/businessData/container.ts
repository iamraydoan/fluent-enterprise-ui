import type { ContainerDetail, ContainerPosition, ContainerRecord } from "@/api";
import type { Page } from "@/api";

const RECORDS: ContainerRecord[] = [
  { name: "Container 001", description: "Container 001 of 100", type: "General", systemState: "Available", state: "Active" },
  { name: "Container 002", description: "In transit container", type: "General", systemState: "In Transit", state: "Active" },
];

export function queryContainers(page: number, limit: number, q?: string, state?: string): Page<ContainerRecord> {
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

export function buildContainerDetail(name: string): ContainerDetail {
  const r = RECORDS.find((x) => x.name === name) ?? { name, description: name, type: "General", systemState: "Available", state: "Active" };
  const positions: ContainerPosition[] = Array.from({ length: 10 }, (_, i) => ({
    position: i + 1,
    material: i < 8 ? ["Cookie A1", "Cookie A1", "Cookie A5", "Cookie C3", "", "Cookie D3", "Cookie B1", "Cookie D2"][i] : "",
    product: i < 8 ? "Cookie A [A]" : "",
    step: i < 8 ? "Mixing" : "",
    quantity: i < 8 ? [40, 40, 40, 50, 0, 70, 100, 70][i] : 0,
    unit: "Kg",
  }));
  return {
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
    capacityUnit: "Kg",
    capacityPerPosition: 10,
    positionSorting: "Ascending",
    materials: positions.filter((p) => p.material !== "").map((p) => ({
      position: p.position, material: p.material, product: p.product, step: p.step, quantity: `${p.quantity} ${p.unit}`,
    })),
    positions,
  };
}
