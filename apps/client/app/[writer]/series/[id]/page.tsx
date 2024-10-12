import WriterHeader from "../../_components/WriterHeader";
import { nfetch } from "@lib/fetcher/noAuth";
import {
  ResponseForm,
  SeriesDto,
  type SubscribingResponseDto,
  type WriterPublicCardDto,
} from "@moonjin/api-types";
import SeriesProfile from "./_components/SeriesProfile";
import SeriesList from "./_components/SeriesList";
import ssr from "@lib/fetcher/ssr";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Footer from "@components/layout/Footer";

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
  const isLogin = cookies().get("accessToken");

  const { data: writerInfo } = await nfetch<ResponseForm<WriterPublicCardDto>>(
    `writer/${moonjinId}/info/public`,
  );
  const { data: seriesInfo } = await nfetch<ResponseForm<SeriesDto>>(
    `writer/${moonjinId}/series/${seriesId}`,
  );
  const { data: subInfo } = isLogin
    ? await ssr(`subscribe/moonjinId/${writerInfo.writerInfo.moonjinId}`)
        .json<ResponseForm<SubscribingResponseDto>>()
        .catch(() => redirect("/auth/login"))
    : { data: null };

  return (
    <div className="bg-grayscale-100 min-h-screen">
      <WriterHeader />
      <main className="w-full flex flex-col items-center pb-20 ">
        <section className="max-w-[800px] w-full flex flex-col mx-auto mt-10 bg-white px-12 pt-14 pb-10 rounded-xl shadow">
          <SeriesProfile
            subInfo={subInfo}
            seriesInfo={seriesInfo}
            writerInfo={writerInfo}
          />
          <SeriesList moonjinId={moonjinId} seriesId={seriesId} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
