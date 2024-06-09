import Link from "next/link";
import * as Io from "react-icons/io";
import NewsLetterCard from "./NewsLetterCard";

import type {
  NewsletterCardDto,
  NewsletterDto,
  SeriesWithWriterDto,
} from "@moonjin/api-types";
import { isNonEmptyArray } from "@toss/utils";
import EmptyCard from "./EmptyCard";
import { SeriesCardForReader } from "./SeriesCard";
import SeriesLetterCard from "./SeriesLetterCard";

export function ReaderHome({
  seriesList,
  newsletterList,
}: {
  seriesList: SeriesWithWriterDto[];
  newsletterList: NewsletterCardDto[];
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
  seriesList: SeriesWithWriterDto[];
}) {
  return (
    <section className="flex flex-col w-full">
      <div className="flex justify-end">
        <Link
          href="/mypage/subscribe?type=series"
          className="flex items-center text-grayscale-500 gap-x-1 text-sm"
        >
          시리즈 전체보기 <Io.IoIosArrowForward />
        </Link>
      </div>
      <div
        className="w-full flex overflow-x-auto scrollbar-none gap-x-4 mt-4"
        style={{ scrollbarColor: "#ffffff" }}
      >
        {isNonEmptyArray(seriesList) ? (
          seriesList.map((value, index) => (
            <SeriesCardForReader
              seriesInfo={value}
              key={index}
              width={190}
              height={230}
            />
          ))
        ) : (
          <EmptyCard text="구독 중인 시리즈가 없습니다" />
        )}
      </div>
    </section>
  );
}

function NewsletterList({
  newsletterList,
}: {
  newsletterList: NewsletterCardDto[];
}) {
  return (
    <section className="flex flex-col w-full">
      <div className="flex ">
        <div className="border-b font-semibold border-primary">
          구독한 뉴스레터
        </div>
        <div className="py-0.5 font-semibold px-2 ml-2 text-sm rounded bg-primary text-white">
          {newsletterList?.length ?? 0}
        </div>

        <Link
          href="/mypage/subscribe"
          className="flex ml-auto items-center text-grayscale-500 gap-x-1 text-sm"
        >
          뉴스레터 전체보기 <Io.IoIosArrowForward />
        </Link>
      </div>
      <div className="flex flex-col w-full mt-4">
        {isNonEmptyArray(newsletterList ?? []) ? (
          newsletterList.map((value, index) => (
            <>
              {value.series ? (
                <SeriesLetterCard value={value} />
              ) : (
                <NewsLetterCard key={index} value={value} />
              )}
            </>
          ))
        ) : (
          <EmptyCard text="구독 중인 뉴스레터가 없습니다" />
        )}
      </div>
    </section>
  );
}
