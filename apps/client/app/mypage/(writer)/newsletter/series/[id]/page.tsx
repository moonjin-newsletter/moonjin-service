import * as Io from "react-icons/io";
import Link from "next/link";
import Image from "next/image";
import SeriesListView from "./_components/SeriesListView";
import ssr from "../../../../../../lib/fetcher/ssr";

type pageProps = {
  id: string;
};
export default function Page({ params }: { params: pageProps }) {
  const seriesId = parseInt(params.id, 10);
  const seriesInfo = ssr("");

  return (
    <main className="overflow-hidden w-full max-w-[748px] flex flex-col">
      <Link
        href="/mypage/newsletter/publish"
        className="flex gap-x-1 items-center text-grayscale-700 text-lg font-medium"
      >
        <Io.IoIosArrowBack />
        시리즈 목록 보기
      </Link>
      <section className="flex mt-4 flex-col w-full p-5 bg-grayscale-100 rounded-lg">
        <div className="flex gap-x-2.5">
          <Image
            src=""
            alt="시리즈 이미지"
            className="bg-grayscale-400 min-w-[128px] w-32 h-32 rounded-lg"
          />
          <div className="w-full flex flex-col">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-grayscale-700">
                시리즈 제목
              </h1>
              <button className="py-1 ml-auto px-2.5 bg-grayscale-600 text-white rounded">
                삭제
              </button>
              <Link
                href=""
                className="py-1 ml-1 px-2.5 bg-primary text-white rounded"
              >
                수정
              </Link>
            </div>
            <div className="text-sm text-grayscale-500">#시리즈 카테고리</div>
            <div className="text-sm text-grayscale-500">
              시리즈 설명 시리즈 설명시리즈 설명시리즈 설명시리즈 설명시리즈
              설명시리즈 설명
            </div>
          </div>
        </div>
        <Link
          href=""
          className="mt-4 w-full font-medium bg-primary py-2 text-white rounded flex items-center justify-center"
        >
          글 작성하기
        </Link>
      </section>
      <SeriesListView seriesId={seriesId} />
    </main>
  );
}
