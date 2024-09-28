"use client";

import { Tab } from "@headlessui/react";
import { Suspense, useState } from "react";
import useSWR from "swr";
import VerticalCard from "@components/card/VerticalCard";
import type { NewsletterCardDto, ResponseForm } from "@moonjin/api-types";

export default function CategoryTab({
  tabList,
  cardType,
  requestUrl,
  requestSort = "recent",
}: {
  tabList: string[];
  cardType: "newsletter" | "series";
  requestUrl: string;
  requestSort?: "recent" | "popular";
}) {
  const [category, setCategory] = useState<string>(tabList[0]);

  const { data } = useSWR<ResponseForm<NewsletterCardDto[]>>(
    requestUrl + `?category=${category}&sort=${requestSort}`,
    { suspense: true },
  );

  const categoryPostList = data?.data;

  return (
    <>
      <Tab.Group
        selectedIndex={tabList.findIndex((value) => value === category)}
        onChange={(index) => setCategory(tabList[index])}
      >
        <Tab.List className="w-full flex flex-wrap justify-center max-w-[480px] mx-auto gap-x-2 gap-y-3">
          {tabList.map((value, index) => (
            <Tab
              className=" text-sm py-1.5 px-4 rounded-full border border-grayscale-300 aria-selected:border-primary aria-selected:text-primary text-gray-400 outline-none"
              key={index}
            >
              {value}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {tabList.map((value, index) => (
            <Tab.Panel key={index}>
              <Suspense fallback={<div>loading...</div>}>
                <div className="grid grid-cols-4 mt-12 gap-x-7 gap-y-12  w-full">
                  {categoryPostList?.map((card, idx) => (
                    <div key={idx}>
                      {cardType === "series" ? (
                        ""
                      ) : (
                        <VerticalCard
                          title={card.post.title}
                          subtitle={card.post.subtitle}
                          createdAt={card.post.createdAt}
                          href={`/@${card.writer.moonjinId}/post/${card.post.id}`}
                          thumbnail={card.post.cover}
                          writer={card.writer}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </Suspense>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}
