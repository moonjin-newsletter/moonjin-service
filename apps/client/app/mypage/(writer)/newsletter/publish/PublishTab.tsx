"use client";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import Link from "next/link";
import { isNonEmptyArray } from "@toss/utils";
import * as I from "@components/icons";
import type {
  NewsletterCardDto,
  SeriesWithWriterDto,
} from "@moonjin/api-types";
import { SeriesCardForWritter } from "../../../_components/SeriesCard";
import { PublishedLetterCard } from "../_components/PublishedLetterCard";

export default function PublishTab({
  newsletterList,
  seriesList,
}: {
  newsletterList: NewsletterCardDto[];
  seriesList: SeriesWithWriterDto[];
}) {
  return (
    <Tab.Group>
      <Tab.List className="w-full h-fit flex items-center gap-x-4">
        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={`${
                selected ? "border-b font-semibold" : null
              } border-primary whitespace-nowrap py-1 outline-none`}
            >
              전체 뉴스레터
            </button>
          )}
        </Tab>
        <Tab as={Fragment}>
          {({ selected }) => (
            <div className="flex w-full items-center  outline-none">
              <button
                className={`${
                  selected ? "border-b font-semibold" : null
                } border-primary py-1 outline-none`}
              >
                시리즈
              </button>
              {selected && (
                <div className="ml-auto">
                  <Link
                    href="/mypage/newsletter/series/new"
                    className={` py-1.5 px-4 bg-primary text-white text-sm rounded`}
                  >
                    시리즈 만들기
                  </Link>
                </div>
              )}
            </div>
          )}
        </Tab>
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

function SeriesLayout({ seriesList }: { seriesList: SeriesWithWriterDto[] }) {
  return (
    <section className="w-full  gap-x-2.5 flex flex-col">
      <div className="w-full mt-4 grid grid-cols-3 grid-flow-row">
        {seriesList.map((series, idx) => (
          <SeriesCardForWritter seriesInfo={series} key={idx} />
        ))}
      </div>
    </section>
  );
}
