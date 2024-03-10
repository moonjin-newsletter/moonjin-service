import SubscribeTab from "./_components/SubscribeTab";
import ssr from "../../../../lib/fetcher/ssr";
import type {
  PostWithWriterUserDto,
  ResponseForm,
  SeriesWithWriterDto,
} from "@moonjin/api-types";

export default async function Page() {
  const seriesList = await ssr("series/following").then((res) =>
    res.json<ResponseForm<SeriesWithWriterDto[]>>(),
  );
  const newsletterList = await ssr("post/newsletter").then((res) =>
    res.json<ResponseForm<PostWithWriterUserDto[]>>(),
  );

  console.log(newsletterList.data);

  return (
    <main className="overflow-hidden w-full max-w-[748px]">
      <SubscribeTab
        newsletterList={newsletterList.data}
        seriesList={seriesList.data}
      />
    </main>
  );
}
