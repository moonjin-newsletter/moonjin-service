"use client";

import { Tab } from "@headlessui/react";
import { useState } from "react";
import useSWR from "swr";
import VerticalCard from "@components/card/VerticalCard";
import type { NewsletterCardDto, ResponseForm } from "@moonjin/api-types";
import { range } from "@toss/utils";

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

  const { data, isLoading } = useSWR<ResponseForm<NewsletterCardDto[]>>(
    requestUrl + `?category=${category}&sort=${requestSort}`,
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
              <>
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
              </>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}

const SkeletonCard = () => {
  return (
    <div className="grid  grid-cols-4 mt-12 gap-x-7 gap-y-12  w-full">
      {range(16).map((_, idx) => (
        <div className="border border-gray-300 shadow rounded-lg p-4 max-w-sm w-full mx-auto">
          <div className="animate-pulse">
            {/* 이미지 스켈레톤 */}
            <div className="rounded-lg bg-gray-300 h-40 w-full mb-4"></div>

            {/* 텍스트 스켈레톤 */}
            <div className="space-y-4">
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>

            {/* 하단 프로필, 날짜 등 */}
            <div className="flex items-center space-x-2 mt-4">
              <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
