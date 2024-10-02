import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import Graphic from "@public/static/images/graphic-series.png";
import Image from "next/image";
import SeriesCarousel from "./_components/SeriesCarousel";
import CategoryTab from "../../_components/CategoryTab";
import { Category } from "@moonjin/api-types";
import { postData } from "../../_data";

const seriesList = [
  {
    thumbnail: "https://via.placeholder.com/200",
    title: "의사들이 아이패드를 휴대하지 않는 이유",
    description:
      "비상계엄하의 군사재판은 군인·군무원의 범죄나 군사에 관한 간첩죄의 경우와 초병·초소·유독음식물공급·포로에 관한 죄중 법률이 정한 경우에 한하여 단심으로 할 수 있다.",
  },
  {
    thumbnail: "https://via.placeholder.com/200",
    title: "Series Title",
    description: "Series Description",
  },
  {
    thumbnail: "https://via.placeholder.com/200",
    title: "Series Title",
    description: "Series Description",
  },
  {
    thumbnail: "https://via.placeholder.com/200",
    title: "Series Title",
    description: "Series Description",
  },
];

export const revalidate = 600;

export default function Page() {
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
          <SeriesCarousel seriesList={seriesList} />
          <div className="flex">
            <h2 className="font-serif text-2xl pl-5 pr-14 leading-9">
              이<br />
              주<br />의<br /> 인<br />
              기<br />글<br />
            </h2>
            <ul className="flex gap-x-8">
              {[
                { category: "", title: "", description: "", thumbnail: "" },
                { category: "", title: "", description: "", thumbnail: "" },
                { category: "", title: "", description: "", thumbnail: "" },
              ].map((post, index) => (
                <li
                  key={index}
                  className="p-8 size-fit  flex flex-col bg-grayscale-700/5 max-w-[290px] rounded-lg"
                >
                  <Image
                    src={postData[0].thumbnail[0]}
                    alt={"titel"}
                    width={260}
                    height={260}
                    className={"rounded-lg size-[260px]"}
                  />
                  <div className="break-keep mt-6">
                    <div className="px-3 py-1 rounded-full bg-grayscale-600 text-sm  text-white w-fit">
                      고민|사색
                    </div>
                    <h1 className="text-lg font-serif font-semibold mt-3  text-grayscale-700">
                      시리즈입니다.
                    </h1>
                    <p className="text-grayscale-500 line-clamp-4 text-sm mt-4 font-serif">
                      이것은 설명입니다. 이것은 설명입니다.이것은
                      설명입니다.이것은 설명입니다.이것은 설명입니다.
                    </p>
                    <p className="text-grayscale-500 text-sm mt-8 font-serif">
                      Written by.고기형
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
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
