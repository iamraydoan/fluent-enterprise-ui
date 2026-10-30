import type { RecipeDetail, RecipeRecord } from "@/api";
import { RecordState } from "@/api";

const RECORDS: RecipeRecord[] = [
  {
    name: "Baking Cookies",
    revision: "A",
    version: "1",
    description: "Baking Temperature sub-recipe",
    type: "Standard",
    state: RecordState.Active,
    isEnabled: true,
    isExecutable: true,
  },
  {
    name: "Cookie Recipe-02",
    revision: "A",
    version: "1",
    description: "Cookies suitable for vegetarians",
    type: "Standard",
    state: RecordState.Active,
    isEnabled: true,
    isExecutable: true,
  },
  {
    name: "EQ BakingWafers",
    revision: "B",
    version: "1",
    description: "Wafer baking program",
    type: "Standard",
    state: RecordState.Active,
    isEnabled: true,
    isExecutable: false,
  },
];

export function queryRecipes(q?: string, state?: string): RecipeRecord[] {
  let rows = RECORDS;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (record) =>
        record.name.toLowerCase().includes(needle) ||
        record.description.toLowerCase().includes(needle),
    );
  }
  if (state !== undefined && state !== "") {
    rows = rows.filter((record) => record.state === state);
  }
  return rows;
}

export function buildRecipeDetail(name: string): RecipeDetail {
  const record = RECORDS.find((item) => item.name === name) ?? {
    name,
    revision: "A",
    version: "1",
    description: "",
    type: "Standard",
    state: RecordState.Active,
    isEnabled: true,
    isExecutable: true,
  };
  return {
    ...record,
    dataGroup: "",
    resourceRecipeName: name === "Baking Cookies" ? "Temperature" : "",
    userInformation: name === "Baking Cookies" ? "Test user info" : "",
    supplierInformation: name === "Baking Cookies" ? "Test supplier info" : "",
  };
}
