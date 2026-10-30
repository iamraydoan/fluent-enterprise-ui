import { http, HttpResponse } from "msw";
import { buildRecipeDetail, queryRecipes } from "../../seeds/businessData/recipe";

export const recipeHandlers = [
  http.get("/business-data/recipes", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryRecipes(
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/recipes/:name", ({ params }) =>
    HttpResponse.json(buildRecipeDetail(decodeURIComponent(params.name as string))),
  ),
];
