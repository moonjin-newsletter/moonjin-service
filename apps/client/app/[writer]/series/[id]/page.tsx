import WriterHeader from "../../_components/WriterHeader";
import { nfetch } from "@lib/fetcher/noAuth";
import {
  ResponseForm,
  SeriesDto,
  type WriterPublicCardDto,
} from "@moonjin/api-types";
import SeriesProfile from "./_components/SeriesProfile";
import SeriesList from "./_components/SeriesList";

type pageProps = {
  params: {
    writer: string;
    id: string;
  };
};

export const revalidate = 0;

export default async function Page({ params }: pageProps) {
  const [, moonjinId] = decodeURI(params.writer).split("%40");
  const seriesId = parseInt(params.id, 10);

  const { data: writerInfo } = await nfetch<ResponseForm<WriterPublicCardDto>>(
    `writer/${moonjinId}/info/public`,
  );
  const { data: seriesInfo } = await nfetch<ResponseForm<SeriesDto>>(
    `writer/${moonjinId}/series/${seriesId}`,
  );

  return (
    <>
      <WriterHeader />
      <main className="w-full flex flex-col items-center  ">
        <section className="max-w-[760px] w-full flex flex-col mx-auto mt-20 pb-8">
          <SeriesProfile seriesInfo={seriesInfo} writerInfo={writerInfo} />
          <SeriesList moonjinId={moonjinId} seriesId={seriesId} />
        </section>
      </main>
    </>
  );
}
