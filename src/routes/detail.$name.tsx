import { createFileRoute } from "@tanstack/react-router";
import { DETAIL_TITLE_BY_NAME } from "@/data/navigation";
import { DetailPage } from "@/features/detail/DetailPage";

function DetailRoute() {
  const { name } = Route.useParams();
  return <DetailPage title={DETAIL_TITLE_BY_NAME[name] ?? name} />;
}

export const Route = createFileRoute("/detail/$name")({
  component: DetailRoute,
});
