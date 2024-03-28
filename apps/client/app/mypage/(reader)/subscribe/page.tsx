import SubscribeTab from "./_components/SubscribeTab";
import ssr from "../../../../lib/fetcher/ssr";
import type {
  NewsletterDto,
  ReleasedSeriesWithWriterDto,
  ResponseForm,
} from "@moonjin/api-types";

export default async function Page() {
  const { data: seriesList } = await ssr("series/following").then((res) =>
    res.json<ResponseForm<ReleasedSeriesWithWriterDto[]>>(),
  );
  const { data: newsletterList } = await ssr("post/newsletter").then((res) =>
    res.json<ResponseForm<NewsletterDto[]>>(),
  );

  return (
    <main className="overflow-hidden w-full max-w-[748px]">
      <SubscribeTab newsletterList={newsletterList} seriesList={seriesList} />
    </main>
  );
}
