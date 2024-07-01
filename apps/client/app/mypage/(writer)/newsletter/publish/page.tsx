import PublishTab from "./PublishTab";
import ssr from "../../../../../lib/fetcher/ssr";
import type {
  ResponseForm,
  NewsletterCardDto,
  SeriesWithWriterDto,
} from "@moonjin/api-types";

export const revalidate = 0;

export default async function Page() {
  const { data: newsletterList } = await ssr("newsletter/send/all").then(
    (res) => res.json<ResponseForm<NewsletterCardDto[]>>(),
  );
  const { data: seriesList } = await ssr("series/me").then((res) =>
    res.json<ResponseForm<SeriesWithWriterDto[]>>(),
  );

  return (
    <main className="overflow-hidden w-full max-w-[748px]">
      <PublishTab newsletterList={newsletterList} seriesList={seriesList} />
    </main>
  );
}
