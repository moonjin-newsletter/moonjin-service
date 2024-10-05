import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import Graphic from "@public/static/images/graphic-series.png";
import Image from "next/image";
import SeriesCarousel from "./_components/SeriesCarousel";
import CategoryTab from "../../_components/CategoryTab";
import {
  Category,
  type ResponseForm,
  type SeriesWithWriterDto,
} from "@moonjin/api-types";
import { nfetch } from "@lib/fetcher/noAuth";

export const revalidate = 600;

export default async function Page() {
  const { data: popularSeriesList } = await nfetch<
    ResponseForm<SeriesWithWriterDto[]>
  >("series/popular?take=10");

  const popularNewsletterList: any[] = [];
  // const { data: popularNewsletterList } = await nfetch<
  //   ResponseForm<NewsletterCardDto[]>
  // >("newsletter/list?take=3");
  //
  // console.log(popularNewsletterList[0]);

  return (
    <>
      <Header />
      <main className="w-full min-h-screen max-w-[100vw] overflow-hidden pt-28 pb-32 flex flex-col items-center">
        <section className="w-full flex flex-col items-center max-w-[1006px]">
          <Image src={Graphic} alt="Series" width={200} height={200} />
          <h1 className="text-2xl font-bold mt-4 font-serif text-primary">
            Series Newsletter
          </h1>
          <p className="text-grayscale-500 text-center text-sm mt-2 font-serif">
            문진의 작가분들이 연재하는 시리즈 간행물을 만나보세요.
          </p>
        </section>

        <section className=" gap-y-28 pt-36 pb-32 mt-24 flex flex-col items-center text-sm relative">
          <Image
            src={"/static/images/background-series.png"}
            alt="백그라운드 이미지"
            width={1920}
            height={1630}
            className="absolute top-0 left-1/2 -translate-x-1/2 min-w-[100vw] object-fill w-full h-[1380px] max-h-[1380px] z-[-1]"
          />
          <SeriesCarousel seriesList={popularSeriesList} />
          <div className="flex">
            <h2 className="font-serif text-2xl pl-5 pr-14 leading-9">
              이<br />
              주<br />의<br /> 인<br />
              기<br />글<br />
            </h2>
            <ul className="flex gap-x-8">
              {popularNewsletterList?.map((n, index) => (
                <li
                  key={index}
                  className="p-8 size-fit  flex flex-col bg-grayscale-700/5 max-w-[290px] rounded-lg"
                >
                  <Image
                    src={n.post.cover}
                    alt={"titel"}
                    width={260}
                    height={260}
                    className={"rounded-lg size-[260px]"}
                  />
                  <div className="break-keep mt-6">
                    <div className="px-3 py-1 rounded-full bg-grayscale-600 text-sm  text-white w-fit">
                      {n.post.category}
                    </div>
                    <h1 className="text-lg font-serif font-semibold mt-3  text-grayscale-700">
                      {n.post.title}
                    </h1>
                    <p className="text-grayscale-500 line-clamp-4 text-sm mt-4 font-serif">
                      {n.post.subtitle}
                    </p>
                    <p className="text-grayscale-500 text-sm mt-8 font-serif">
                      Written by.{n.writer.nickname}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="w-full flex flex-col items-center max-w-[1006px] mt-32">
          <div className="w-full  flex flex-col items-center text-sm">
            <CategoryTab
              requestUrl={"newsletter/list"}
              tabList={Category.list}
              cardType={"newsletter"}
              infiniteScroll={true}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
