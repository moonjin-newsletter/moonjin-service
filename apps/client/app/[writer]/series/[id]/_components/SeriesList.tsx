"use client";

import useSWRInfinite from "swr/infinite";
import type { NewsletterCardDto, ResponseForm } from "@moonjin/api-types";
import SWRInfiniteScroll, {
  getKey,
} from "@components/infiniteScroll/SWRInfiniteScroll";
import { isNonEmptyArray, last } from "@toss/utils";
import { LoadingSkeleton } from "@components/infiniteScroll/LoadingSkeleton";
import NewsLetterCard from "../../../_components/NewsLetterCard";
import EmptyCard from "../../../_components/EmptyCard";

export default function SeriesList({
  moonjinId,
  seriesId,
}: {
  moonjinId: string;
  seriesId: number;
}) {
  const swr = useSWRInfinite<ResponseForm<NewsletterCardDto[]>>(
    getKey(`writer/${moonjinId}/series/${seriesId}/newsletter`),
  );
  const PAGE_SIZE = 10;

  return (
    <>
      <hr className="mb-4 mt-8" />
      <SWRInfiniteScroll
        swr={swr}
        isReachingEnd={({ data }) => {
          if (!data || !isNonEmptyArray(data)) return false; // 데이터가 아예 없으면, 아직 불러오지 않은 상태 (끝이 아님)
          if (!isNonEmptyArray(data[0].data)) return true; // 데이터가 있지만, 첫번째 페이지가 비어있으면, 그냥 데이터가 없는 것. (끝)
          return last(data).data.length < PAGE_SIZE; // 데이터가 있고, 마지막 페이지가 {PAGE_SIZE} 미만이면, 있는 데이터를 모두 불러온 것. (끝)}
        }}
        loader={LoadingSkeleton}
      >
        {(page) =>
          isNonEmptyArray(page.data) ? (
            page.data.map((newsletter, i) => (
              <NewsLetterCard key={i} newsletterInfo={newsletter} />
            ))
          ) : (
            <EmptyCard text={"아직 작성된 뉴스레터가 없습니다."} />
          )
        }
      </SWRInfiniteScroll>
    </>
  );
}
