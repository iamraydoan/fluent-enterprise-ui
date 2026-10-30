import { http, HttpResponse } from "msw";
import { QUERY_FOLDERS, buildQueryDetail, queryQueries } from "../seeds/queries";

export const queryHandlers = [
  http.get("/queries", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const get = (name: string) => {
      const value = params.get(name);
      return value === null || value === "" ? undefined : value;
    };
    return HttpResponse.json(
      queryQueries({
        folder: get("folder"),
        q: get("q"),
        showSystemItems: params.get("showSystemItems") === "true",
      }),
    );
  }),
  http.get("/queries/:name", ({ params }) => {
    const name = decodeURIComponent(String(params.name));
    return HttpResponse.json(buildQueryDetail(name));
  }),
  http.get("/query-folders", () => HttpResponse.json(QUERY_FOLDERS)),
];
