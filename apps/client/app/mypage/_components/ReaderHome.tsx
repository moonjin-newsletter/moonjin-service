import Link from "next/link";
import * as Io from "react-icons/io";
import Image from "next/image";
import NewsLetterCard from "./NewsLetterCard";
import { dummyLetter, dummySeries } from "../_data";

export function ReaderHome() {
  return (
    <div className="flex flex-col w-full gap-y-12 max-w-[740px]">
      <SeriesNewsletter />
      <NewsletterList />
    </div>
  );
}

function SeriesNewsletter() {
  return (
    <section className="flex flex-col w-full">
      <div className="flex justify-end">
        <Link
          href=""
          className="flex items-center text-grayscale-500 gap-x-2.5"
        >
          시리즈 전체보기 <Io.IoIosArrowForward />
        </Link>
      </div>
      <div
        className="w-full flex overflow-x-scroll gap-x-3 mt-4"
        style={{ scrollbarColor: "#ffffff" }}
      >
        {dummySeries.map((value, index) => (
          <Link
            href={""}
            className="flex flex-col min-w-[230px] w-[230px] h-fit pb-6"
          >
            <div className="group w-full h-fit relative">
              <Image
                src=""
                alt="시리즈 배너"
                className="w-full h-72 object-fill bg-gray-200 rounded-lg"
              />{" "}
              <div className="absolute text-white bottom-0 w-full rounded-b-lg items-center bg-black/40 py-5 group-hover:flex hidden flex-col">
                <div className="font-semibold">시리즈 자세히 보기</div>
              </div>
            </div>

            <div className="flex flex-col mt-2">
              <div className="text-lg line-clamp-1 font-semibold text-grayscale-700">
                {value.title}
              </div>
              <span className="text-grayscale-600 line-clamp-2">
                {value.body}
              </span>
              <span className="text-xs mt-0.5 line-clamp-1 text-grayscale-400">
                written by.{value.writer}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function NewsletterList() {
  return (
    <section className="flex flex-col w-full">
      <div className="flex ">
        <div className="border-b font-semibold border-primary">
          구독한 뉴스레터
        </div>
        <div className="py-1 font-semibold px-2 ml-2 text-sm rounded bg-gray-200 text-gray-400">
          {dummyLetter.length}
        </div>

        <Link
          href=""
          className="flex ml-auto items-center text-grayscale-500 gap-x-2.5"
        >
          뉴스레터 전체보기 <Io.IoIosArrowForward />
        </Link>
      </div>
      <div className="flex flex-col w-full mt-4">
        {dummyLetter.map((value, index) => (
          <NewsLetterCard key={index} value={value} />
        ))}
      </div>
    </section>
  );
}
