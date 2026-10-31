import { http, HttpResponse } from "msw";
import {
  listWorkgroupInfos,
  queryMyWorkgroupResources,
  queryMyWorkgroupSteps,
} from "../seeds/myWorkgroup";

export const myWorkgroupHandlers = [
  http.get("/my-workgroup/resources", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const get = (name: string) => {
      const value = params.get(name);
      return value === null || value === "" ? undefined : value;
    };
    return HttpResponse.json(
      queryMyWorkgroupResources({
        workgroup: get("workgroup"),
        type: get("type"),
        systemState: get("systemState"),
        facility: get("facility"),
        state: get("state"),
        q: get("q"),
      }),
    );
  }),
  http.get("/my-workgroup/steps", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const get = (name: string) => {
      const value = params.get(name);
      return value === null || value === "" ? undefined : value;
    };
    return HttpResponse.json(
      queryMyWorkgroupSteps({
        workgroup: get("workgroup"),
        processingType: get("processingType"),
        type: get("type"),
        facility: get("facility"),
        q: get("q"),
      }),
    );
  }),
  http.get("/my-workgroups", () => HttpResponse.json(listWorkgroupInfos())),
];
