import type { ExperimentDefinitionDetail, ExperimentDefinitionRecord, Page } from "@/api";
import { RecordState } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

const DEFINITIONS: ExperimentDefinitionRecord[] = [
  {
    name: "Experiment_Definition_01",
    description: "",
    type: "Standard",
    product: "Ammonium Phosphate [A]",
    state: RecordState.Active,
  },
  {
    name: "New Material Trial",
    description: "Trial for new material",
    type: "Standard",
    product: "Cookie [A]",
    state: RecordState.Active,
  },
  {
    name: "Old Experiment",
    description: "",
    type: "Standard",
    product: "",
    state: RecordState.Terminated,
  },
];

const DETAILS: Record<string, ExperimentDefinitionDetail> = {
  Experiment_Definition_01: {
    name: "Experiment_Definition_01",
    description: "",
    type: "Standard",
    product: "Ammonium Phosphate [A]",
    state: RecordState.Active,
    dataGroup: "",
    ignoreInSamplingPlans: true,
    ignoreInSpcCharts: true,
    closeExperimentAutomatically: false,
    ownerRole: "Administrators",
    purpose: "",
    note: "",
    result: "",
    conclusions: "",
    productGroup: "",
    maximumNumberOfMaterials: 51,
    requiredMaterialType: "Durable",
    requiredMaterialForm: "Lot",
    mode: "Sub Materials",
    requiredSubMaterialsForm: "Lot",
    requiredSubMaterialsCount: 10,
    plannedStartDate: Date.UTC(2026, 8, 23, 9, 1),
    plannedEndDate: Date.UTC(2026, 8, 24, 9, 1),
    flow: "Warehouse [A]",
    firstStep: "Warehouse",
    firstStepFlowPath: "Warehouse [A] > Warehouse",
    lastStep: "Mixing",
    lastStepFlowPath: "Warehouse [A] > Mixing",
  },
};

export function queryExperimentDefinitions(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<ExperimentDefinitionRecord> {
  const rows = filterByState(filterByQuery(DEFINITIONS, q, ["name", "description"]), state);
  return paginate(rows, page, limit);
}

export function getExperimentDefinitionDetail(
  name: string,
): ExperimentDefinitionDetail | undefined {
  return DETAILS[name];
}
