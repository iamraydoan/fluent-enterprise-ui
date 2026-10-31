import { http, HttpResponse } from "msw";
import {
  fabAreas,
  fabEnterprises,
  fabFacilities,
  fabMaterialsToReceive,
  fabResources,
  fabSites,
  fabSteps,
  fabUndispatchableMaterials,
} from "../seeds/manufacturing/fabExplorer";

const BASE = "/manufacturing/fab-explorer";

interface FabDashboardKpi {
  label: string;
  value: number;
  unit: string;
  trend: number;
}

const manufacturingDashboard: FabDashboardKpi[] = [
  { label: "OEE", value: 84, unit: "%", trend: 2.1 },
  { label: "Uptime", value: 86, unit: "%", trend: -1.2 },
  { label: "Performance Efficiency", value: 91, unit: "%", trend: 0.8 },
  { label: "Quality", value: 80, unit: "%", trend: -0.5 },
  { label: "On-Time Delivery", value: 87, unit: "%", trend: 1.4 },
];

const qualityDashboard: FabDashboardKpi[] = [
  { label: "First Pass Yield", value: 96.2, unit: "%", trend: 0.3 },
  { label: "Scrap Rate", value: 1.8, unit: "%", trend: -0.2 },
  { label: "Rework Rate", value: 2.1, unit: "%", trend: -0.1 },
  { label: "Customer Complaints", value: 3, unit: "", trend: -1 },
];

const maintenanceDashboard: FabDashboardKpi[] = [
  { label: "MTBF", value: 142, unit: "h", trend: 5.2 },
  { label: "MTTR", value: 2.4, unit: "h", trend: -0.3 },
  { label: "Planned Maintenance", value: 78, unit: "%", trend: 2.0 },
  { label: "Open Work Orders", value: 12, unit: "", trend: -2 },
];

export const fabExplorerHandlers = [
  http.get(`${BASE}/enterprises`, () => HttpResponse.json(fabEnterprises)),

  http.get(`${BASE}/sites`, ({ request }) => {
    const url = new URL(request.url);
    const enterprise = url.searchParams.get("enterprise");
    const result = enterprise ? fabSites.filter((s) => s.enterprise === enterprise) : fabSites;
    return HttpResponse.json(result);
  }),

  http.get(`${BASE}/facilities`, ({ request }) => {
    const url = new URL(request.url);
    const site = url.searchParams.get("site");
    const enterprise = url.searchParams.get("enterprise");
    let result = fabFacilities;
    if (site) result = result.filter((f) => f.site === site);
    if (enterprise) result = result.filter((f) => f.enterprise === enterprise);
    return HttpResponse.json(result);
  }),

  http.get(`${BASE}/facilities/:name`, ({ params }) => {
    const facility = fabFacilities.find((f) => f.name === params.name);
    if (!facility) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(facility);
  }),

  http.get(`${BASE}/areas`, ({ request }) => {
    const url = new URL(request.url);
    const facility = url.searchParams.get("facility");
    const result = facility ? fabAreas.filter((a) => a.facility === facility) : fabAreas;
    return HttpResponse.json(result);
  }),

  http.get(`${BASE}/areas/:name`, ({ params }) => {
    const area = fabAreas.find((a) => a.name === params.name);
    if (!area) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(area);
  }),

  http.get(`${BASE}/resources`, ({ request }) => {
    const url = new URL(request.url);
    const area = url.searchParams.get("area");
    const facility = url.searchParams.get("facility");
    let result = fabResources;
    if (area) result = result.filter((r) => r.area === area);
    if (facility) result = result.filter((r) => r.facility === facility);
    return HttpResponse.json(result);
  }),

  http.get(`${BASE}/steps`, ({ request }) => {
    const url = new URL(request.url);
    const area = url.searchParams.get("area");
    const result = area ? fabSteps.filter((s) => s.area === area) : fabSteps;
    return HttpResponse.json(result);
  }),

  http.get(`${BASE}/materials-to-receive`, ({ request }) => {
    const url = new URL(request.url);
    const facility = url.searchParams.get("facility");
    const remote = url.searchParams.get("remote");
    let result = fabMaterialsToReceive;
    if (facility) result = result.filter((m) => m.facility === facility);
    if (remote !== null) result = result.filter((m) => m.isRemote === (remote === "true"));
    return HttpResponse.json(result);
  }),

  http.get(`${BASE}/undispatchable-materials`, ({ request }) => {
    const url = new URL(request.url);
    const area = url.searchParams.get("area");
    const result = area
      ? fabUndispatchableMaterials.filter((m) => m.facility === "Cookie Factory")
      : fabUndispatchableMaterials;
    return HttpResponse.json(result);
  }),

  http.get(`${BASE}/dashboards/:kind`, ({ params }) => {
    const kind = params.kind as string;
    if (kind === "manufacturing") return HttpResponse.json(manufacturingDashboard);
    if (kind === "quality") return HttpResponse.json(qualityDashboard);
    if (kind === "maintenance") return HttpResponse.json(maintenanceDashboard);
    return HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),
];
