"use client";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import Link from "next/link";
import { isNonEmptyArray } from "@toss/utils";
import * as I from "../../../../../../components/icons";
import type { NewsletterDto, ReleasedSeriesDto } from "@moonjin/api-types";
import { SeriesCardForWritter } from "../../../../_components/SeriesCard";
import { PublishedLetterCard } from "../../_components/PublishedLetterCard";

export default function PublishTab({
  newsletterList,
  seriesList,
}: {
  newsletterList: NewsletterDto[];
  seriesList: ReleasedSeriesDto[];
}) {
  return (
    <Tab.Group>
      <Tab.List className="w-full flex gap-x-4">
        {["전체 뉴스레터", "시리즈"].map((category, index) => (
          <Tab key={index} as={Fragment}>
            {({ selected }) => (
              <button
                className={`${
                  selected ? "border-b-2 font-semibold" : null
                } border-primary py-1 outline-none`}
              >
                {category}
              </button>
            )}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="w-full mt-4">
        <Tab.Panel>
          {isNonEmptyArray(newsletterList ?? []) ? (
            newsletterList?.map((letter, index) => (
              <PublishedLetterCard key={index} letter={letter} />
            ))
          ) : (
            <div className="w-full flex flex-col gap-y-4 items-center justify-center py-12">
              <I.Empty />
              <span className="text-grayscale-500 ">
                아직 작성된 글이 없습니다
              </span>
            </div>
          )}
        </Tab.Panel>
        <Tab.Panel>
          <SeriesLayout seriesList={seriesList} />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}

function SeriesLayout({ seriesList }: { seriesList: ReleasedSeriesDto[] }) {
  return (
    <section className="w-full  gap-x-2.5 flex flex-col">
      <Link
        href="/mypage/newsletter/series/new"
        className={` ml-auto py-1.5 px-4 bg-primary text-white text-sm rounded`}
      >
        시리즈 만들기
      </Link>
      <div className="w-full mt-8 grid grid-cols-3 grid-flow-row">
        {seriesList.map((series, idx) => (
          <SeriesCardForWritter seriesInfo={series} key={idx} />
        ))}
      </div>
    </section>
  );
}
