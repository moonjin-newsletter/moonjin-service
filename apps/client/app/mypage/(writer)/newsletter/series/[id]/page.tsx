import * as Io from "react-icons/io";
import Link from "next/link";
import Image from "next/image";
import SeriesListView from "./_components/SeriesListView";

type pageProps = {
  id: string;
};
export default function Page({ params }: { params: pageProps }) {
  const seriesId = parseInt(params.id, 10);

  return (
    <main className="overflow-hidden w-full max-w-[748px] flex flex-col">
      <Link
        href=""
        className="flex gap-x-1 items-center text-grayscale-700 text-lg font-medium"
      >
        <Io.IoIosArrowBack />
        시리즈 목록 보기
      </Link>
      <section className="flex w-full p-5 bg-grayscale-200 rounded-lg">
        <Image src="" alt="시리즈 이미지" />
      </section>
      <SeriesListView seriesId={seriesId} />
    </main>
  );
}
