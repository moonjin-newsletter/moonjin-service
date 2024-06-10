import * as Io from "react-icons/io";
import Link from "next/link";
import SeriesListView from "./_components/SeriesListView";
import type { ResponseForm, SeriesDto } from "@moonjin/api-types";
import SeriesProfile from "./_components/SeriesProfile";
import ssr from "@lib/fetcher/ssr";

type pageProps = {
  id: string;
};

export const revalidate = 0;

export default async function Page({ params }: { params: pageProps }) {
  const seriesId = parseInt(params.id, 10);

  const { data: seriesInfo } = await ssr(`series/writing/${seriesId}`).then(
    (res) => res.json<ResponseForm<SeriesDto>>(),
  );

  return (
    <main className="overflow-hidden w-full max-w-[748px] flex flex-col">
      <Link
        href="/mypage/newsletter/publish"
        className="flex gap-x-1 items-center text-grayscale-700 text-lg font-medium w-fit"
      >
        <Io.IoIosArrowBack />
        시리즈 목록 보기
      </Link>
      <SeriesProfile seriesId={seriesId} seriesInfo={seriesInfo} />
      <SeriesListView seriesId={seriesId} />
    </main>
  );
}
