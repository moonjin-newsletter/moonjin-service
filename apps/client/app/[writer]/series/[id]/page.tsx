import WriterHeader from "../../_components/WriterHeader";
import { nfetch } from "@lib/fetcher/noAuth";
import { ResponseForm, SeriesDto } from "@moonjin/api-types";

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

  const seriesInfo = await nfetch<ResponseForm<SeriesDto>>(
    `series/${seriesId}`,
  );

  return (
    <>
      <WriterHeader />
      <main className="w-full flex flex-col items-center  ">
        <section className="max-w-[760px] w-full flex flex-col mx-auto mt-20 pb-8"></section>
      </main>
    </>
  );
}
