"use client";

import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import { isNonEmptyArray } from "@toss/utils";
import NewsLetterCard from "../../../_components/NewsLetterCard";
import { PostWithWriterUserDto, SeriesWithWriterDto } from "@moonjin/api-types";

export default function SubscribeTab({
  seriesList,
  newsletterList,
}: {
  seriesList: SeriesWithWriterDto[];
  newsletterList: PostWithWriterUserDto[];
}) {
  return (
    <Tab.Group>
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
                <NewsLetterCard key={index} value={value} />
              ))
            ) : (
              <div className="flex items-center justify-center bg-grayscale-400 rounded-lg text-white font-semibold">
                현재 구독 중인 뉴스레터가 없습니다.
              </div>
            )}
          </section>
        </Tab.Panel>
        <Tab.Panel>
          <section className="flex flex-col w-full">
            {isNonEmptyArray(seriesList) ? (
              seriesList.map((value, index) => (
                // <NewsLetterCard key={index} value={value} />
                <div>1</div>
              ))
            ) : (
              <div className="flex py-8 items-center justify-center bg-grayscale-400/60 rounded-lg text-white font-semibold">
                현재 구독 중인 뉴스레터가 없습니다.
              </div>
            )}
          </section>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
