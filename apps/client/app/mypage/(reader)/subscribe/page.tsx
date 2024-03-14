import SubscribeTab from "./_components/SubscribeTab";
import ssr from "../../../../lib/fetcher/ssr";
import type {
  ReleasedPostWithWriterDto,
  ReleasedSeriesWithWriterDto,
  ResponseForm,
} from "@moonjin/api-types";

export default async function Page() {
  const seriesList = await ssr("series/following").then((res) =>
    res.json<ResponseForm<ReleasedSeriesWithWriterDto[]>>(),
  );
  const newsletterList = await ssr("post/newsletter").then((res) =>
    res.json<ResponseForm<ReleasedPostWithWriterDto[]>>(),
  );

  return (
    <main className="overflow-hidden w-full max-w-[748px]">
      <SubscribeTab
        newsletterList={newsletterList.data}
        seriesList={seriesList.data}
      />
    </main>
  );
}
