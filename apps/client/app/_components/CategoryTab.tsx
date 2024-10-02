"use client";

import { Tab } from "@headlessui/react";
import { useEffect, useState } from "react";
import VerticalCard from "@components/card/VerticalCard";
import type { NewsletterCardDto, ResponseForm } from "@moonjin/api-types";
import { isNonEmptyArray, last, range } from "@toss/utils";
import useSWRInfinite from "swr/infinite";
import SWRInfiniteScroll, {
  getKey,
} from "@components/infiniteScroll/SWRInfiniteScroll";

export default function CategoryTab({
  tabList,
  cardType,
  requestUrl,
  requestSort = "recent",
  infiniteScroll = false,
}: {
  tabList: string[];
  cardType: "newsletter" | "series";
  requestUrl: string;
  requestSort?: "recent" | "popular";
  infiniteScroll?: boolean;
}) {
  const [category, setCategory] = useState<string>(tabList[0]);
  const PAGE_SIZE = 12;

  const swr = useSWRInfinite<ResponseForm<NewsletterCardDto[]>>(
    getKey(
      `${requestUrl}?category=${category}&sort=${requestSort}&take=${PAGE_SIZE}`,
    ),
  );

  useEffect(() => {
    if (!infiniteScroll) {
      swr.setSize(1);
      // swr.mutate();
    }
  }, []);

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
                  <SWRInfiniteScroll
                    swr={swr}
                    isReachingEnd={({ data }) => {
                      if (!data || !isNonEmptyArray(data)) return false; // 데이터가 아예 없으면, 아직 불러오지 않은 상태 (끝이 아님)
                      if (!isNonEmptyArray(data[0].data)) return true; // 데이터가 있지만, 첫번째 페이지가 비어있으면, 그냥 데이터가 없는 것. (끝)
                      if (!infiniteScroll) return true; // 무한 스크롤이면, 무조건 끝이 아님
                      return last(data).data.length < PAGE_SIZE; // 데이터가 있고, 마지막 페이지가 {PAGE_SIZE} 미만이면, 있는 데이터를 모두 불러온 것. (끝)}
                    }}
                    loader={<div className="min-h-[376px] w-full"></div>}
                  >
                    {(page) =>
                      page.data.map((card, i) => (
                        <>
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
                        </>
                      ))
                    }
                  </SWRInfiniteScroll>
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
