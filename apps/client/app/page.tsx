import Image from "next/image";
import CategoryTab from "./_components/CategoryTab";
import Link from "next/link";

import Header from "@components/layout/Header";
import HomeSection from "./_components/HomeSection";
import SeriesSection from "./_components/SeriesSection";

import {
  Category,
  type NewsletterCardDto,
  type ResponseForm,
  type SeriesWithWriterDto,
  type WriterProfileDto,
} from "@moonjin/api-types";
import Footer from "@components/layout/Footer";
import { nfetch } from "@lib/fetcher/noAuth";
import StartSection from "./_components/StartSection";

export const revalidate = 600;

export default async function Page() {
  const { data: topLetterList } = await nfetch<
    ResponseForm<NewsletterCardDto[]>
  >("newsletter/curation/weekly");
  const { data: popularSeriesList } = await nfetch<
    ResponseForm<SeriesWithWriterDto[]>
  >("series/list?sort=recent&take=24");
  const { data: writerList } =
    await nfetch<ResponseForm<WriterProfileDto[]>>("writer/popular");

  return (
    <main className=" w-full min-h-screen  ">
      <Header initialColor="bg-white" />
      <div className="relative flex flex-col items-center justify-center w-full h-full min-h-screen overflow-hidden">
        <HomeSection topLetterList={topLetterList} />
        <SeriesSection seriesList={popularSeriesList} />
        <section className="flex pt-52  flex-col  items-center w-full max-w-[1006px]">
          <h2 className="font-serif  text-2xl font-bold text-grayscale-700">
            Moonjin Writers
          </h2>
          <h4 className="text-grayscale-400 text-sm mt-2">
            문진의 새로운 작가를 만나보세요
          </h4>

          <div className="w-full max-w-[1006px] mt-8 flex flex-col items-center text-sm">
            <div className="flex mt-12 gap-x-[26px] gap-y-10 flex-wrap w-full">
              {writerList.slice(0, 4).map((writer, idx) => (
                <div key={idx}>
                  <WriterCard writer={writer} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex pt-52  flex-col  items-center w-full max-w-[1006px]">
          <h2 className="font-serif  text-2xl font-bold text-grayscale-700">
            Moonjin Newsletters
          </h2>
          <h4 className="text-grayscale-400 text-sm mt-2">
            문진의 다양한 뉴스레터들을 만나보세요
          </h4>

          <div className="w-full mt-8 flex flex-col items-center text-sm">
            <CategoryTab
              requestUrl={"newsletter/list"}
              tabList={Category.list}
              infiniteScroll={false}
            />
          </div>
        </section>

        <StartSection />
      </div>
      <Footer />
    </main>
  );
}

function WriterCard({ writer }: { writer: WriterProfileDto }) {
  return (
    <Link
      href={`/@${writer.writerInfo.moonjinId}`}
      className="w-[232px] flex flex-col items-center px-2 h-full grow"
    >
      <div className="relative ">
        <Image
          src={writer.user.image}
          width={112}
          height={112}
          alt="작가이미지"
          className="bg-grayscale-200 rounded-full w-28 h-28  border-2 border-primary object-cover relative z-10"
        />
        <div className="absolute left-8 bottom-[1px] bg-primary rounded-[50%] w-24 h-4 overflow-hidden z-0" />
      </div>
      <h3 className="text-xl font-semibold mt-5">{writer.user.nickname}</h3>

      <div className="text-sm text-grayscale-400 font-light mt-2 line-clamp-3">
        {writer.user.description}
      </div>

      <button className="py-2 mt-8 px-6 font-medium text-sm rounded-lg bg-grayscale-700/95 text-white">
        방문하기
      </button>
    </Link>
  );
}