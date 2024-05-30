import PublishTab from "./PublishTab";
import ssr from "../../../../../lib/fetcher/ssr";
import type {
  NewsletterDto,
  SeriesDto,
  ResponseForm,
} from "@moonjin/api-types";

export default async function Page() {
  const { data: newsletterList } = await ssr("post/me").then((res) =>
    res.json<ResponseForm<NewsletterDto[]>>(),
  );
  const { data: seriesList } = await ssr("series/me").then((res) =>
    res.json<ResponseForm<SeriesDto[]>>(),
  );

  return (
    <main className="overflow-hidden w-full max-w-[748px]">
      <PublishTab newsletterList={newsletterList} seriesList={seriesList} />
    </main>
  );
}
