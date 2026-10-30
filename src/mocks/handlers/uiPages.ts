import { http, HttpResponse } from "msw";
import { UI_PAGE_FOLDERS, queryUIPages } from "../seeds/uiPages";

export const uiPageHandlers = [
  http.get("/ui-pages", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const get = (name: string) => {
      const value = params.get(name);
      return value === null || value === "" ? undefined : value;
    };
    return HttpResponse.json(
      queryUIPages({
        folder: get("folder"),
        scope: get("scope"),
        section: get("section"),
        entityType: get("entityType"),
        q: get("q"),
        showTerminated: params.get("showTerminated") === "true",
        showSystemItems: params.get("showSystemItems") === "true",
      }),
    );
  }),
  http.get("/ui-page-folders", () => HttpResponse.json(UI_PAGE_FOLDERS)),
];
