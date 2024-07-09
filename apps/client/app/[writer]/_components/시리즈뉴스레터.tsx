"use client";

import useSWRInfinite from "swr/infinite";
import type { ResponseForm, SeriesDto } from "@moonjin/api-types";
import SWRInfiniteScroll, {
  getKey,
} from "@components/infiniteScroll/SWRInfiniteScroll";
import { isNonEmptyArray, last } from "@toss/utils";
import { LoadingSkeleton } from "@components/infiniteScroll/LoadingSkeleton";
import SeriesCard from "./SeriesCard";
import EmptyCard from "./EmptyCard";

export default function 시리즈뉴스레터({ moonjinId }: { moonjinId: string }) {
  const swr = useSWRInfinite<ResponseForm<SeriesDto[]>>(
    getKey(`writer/${moonjinId}/series`),
  );
  const PAGE_SIZE = 10;

  return (
    <>
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
            page.data.map((seires, i) => (
              <SeriesCard key={i} seriesInfo={seires} />
            ))
          ) : (
            <EmptyCard text={"아직 작성된 시리즈가 없습니다."} />
          )
        }
      </SWRInfiniteScroll>
    </>
  );
}
