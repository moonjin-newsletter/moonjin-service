import PublishTab from "./_components/PublishTab";
import ssr from "../../../../../lib/fetcher/ssr";
import type { ReleasedSeriesDto, ResponseForm } from "@moonjin/api-types";

export default async function Page() {
  const { data: seriesList } = await ssr("series/me").then((res) =>
    res.json<ResponseForm<ReleasedSeriesDto[]>>(),
  );

  return (
    <main className="overflow-hidden w-full max-w-[748px]">
      <PublishTab seriesList={seriesList} />
    </main>
  );
}
