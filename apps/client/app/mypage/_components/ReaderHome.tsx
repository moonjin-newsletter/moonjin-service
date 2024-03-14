import Link from "next/link";
import * as Io from "react-icons/io";
import Image from "next/image";
import NewsLetterCard from "./NewsLetterCard";

import type {
  ReleasedPostWithWriterDto,
  ReleasedSeriesWithWriterDto,
  ResponseForm,
} from "@moonjin/api-types";
import { isNonEmptyArray } from "@toss/utils";

export function ReaderHome({
  seriesList,
  newsletterList,
}: {
  seriesList: ReleasedSeriesWithWriterDto[];
  newsletterList: ReleasedPostWithWriterDto[];
}) {
  return (
    <div className="flex flex-col w-full gap-y-12 max-w-[740px]">
      <SeriesNewsletter seriesList={seriesList} />
      <NewsletterList newsletterList={newsletterList} />
    </div>
  );
}

function SeriesNewsletter({
  seriesList,
}: {
  seriesList: ReleasedSeriesWithWriterDto[];
}) {
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
        {isNonEmptyArray(seriesList) ? (
          seriesList.map((value, index) => (
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
                  {value.series.title}
                </div>
                <span className="text-grayscale-600 line-clamp-2">
                  {value.series.description}
                </span>
                <span className="text-xs mt-0.5 line-clamp-1 text-grayscale-400">
                  written by.{value.writer.nickname}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <Link href={""}>구독중인 뉴스레터 시리즈가 없습니다</Link>
        )}
      </div>
    </section>
  );
}

function NewsletterList({
  newsletterList,
}: {
  newsletterList: ReleasedPostWithWriterDto[];
}) {
  return (
    <section className="flex flex-col w-full">
      <div className="flex ">
        <div className="border-b font-semibold border-primary">
          구독한 뉴스레터
        </div>
        <div className="py-1 font-semibold px-2 ml-2 text-sm rounded bg-gray-200 text-gray-400">
          {newsletterList?.length ?? 0}
        </div>

        <Link
          href=""
          className="flex ml-auto items-center text-grayscale-500 gap-x-2.5"
        >
          뉴스레터 전체보기 <Io.IoIosArrowForward />
        </Link>
      </div>
      <div className="flex flex-col w-full mt-4">
        {isNonEmptyArray(newsletterList ?? []) ? (
          newsletterList.map((value, index) => (
            <NewsLetterCard key={index} value={value} />
          ))
        ) : (
          <Link href="">구독중인 뉴스레터가 없습니다</Link>
        )}
      </div>
    </section>
  );
}
