import SubscribeTab from "./_components/SubscribeTab";
import ssr from "../../../../lib/fetcher/ssr";
import type {
  NewsletterCardDto,
  NewsletterDto,
  ResponseForm,
  SeriesWithWriterDto,
} from "@moonjin/api-types";

export default async function Page() {
  const { data: seriesList } = await ssr("series/following").then((res) =>
    res.json<ResponseForm<SeriesWithWriterDto[]>>(),
  );
  const { data: newsletterList } = await ssr("newsletter/receive/all").then(
    (res) => res.json<ResponseForm<NewsletterCardDto[]>>(),
  );

  return (
    <main className="overflow-hidden w-full max-w-[748px]">
      <SubscribeTab newsletterList={newsletterList} seriesList={seriesList} />
    </main>
  );
}
