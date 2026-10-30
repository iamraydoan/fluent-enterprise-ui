import { http, HttpResponse } from "msw";
import { buildNotificationDetail, queryNotifications } from "../../seeds/businessData/notification";

export const notificationHandlers = [
  http.get("/business-data/notifications", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryNotifications(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/notifications/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    return HttpResponse.json(buildNotificationDetail(name));
  }),
];
