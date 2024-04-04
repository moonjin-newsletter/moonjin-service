"use client";

import { Tab } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { isNonEmptyArray } from "@toss/utils";
import NewsLetterCard from "../../../_components/NewsLetterCard";
import { NewsletterDto, ReleasedSeriesWithWriterDto } from "@moonjin/api-types";
import SeriesLetterCard from "../../../_components/SeriesLetterCard";
import EmptyCard from "../../../_components/EmptyCard";
import { useSearchParams } from "next/navigation";
import { SeriesCardForReader } from "../../../_components/SeriesCard";

export default function SubscribeTab({
  seriesList,
  newsletterList,
}: {
  seriesList: ReleasedSeriesWithWriterDto[];
  newsletterList: NewsletterDto[];
}) {
  const params = useSearchParams();

  return (
    <Tab.Group defaultIndex={params.get("type") === "series" ? 1 : 0}>
      <Tab.List className="w-full flex gap-x-4">
        {["모든 뉴스레터", "시리즈"].map((category, index) => (
          <Tab key={index} as={Fragment}>
            {({ selected }) => (
              /* Use the `selected` state to conditionally style the selected tab. */
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
          <section className="flex flex-col w-full">
            {isNonEmptyArray(newsletterList) ? (
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
              <EmptyCard text={"구독중인 뉴스레터가 없습니다"} />
            )}
          </section>
        </Tab.Panel>
        <Tab.Panel>
          <section className=" w-full">
            {isNonEmptyArray(seriesList) ? (
              <div className="grid grid-cols-3">
                {seriesList.map((value, index) => (
                  <SeriesCardForReader seriesInfo={value} key={index} />
                ))}
              </div>
            ) : (
              <EmptyCard text={"구독중인 시리즈가 없습니다"} />
            )}
          </section>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
