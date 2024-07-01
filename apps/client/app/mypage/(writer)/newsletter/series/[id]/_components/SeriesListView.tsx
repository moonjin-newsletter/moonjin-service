"use client";

import useSWR from "swr";
import type { NewsletterCardDto, ResponseForm } from "@moonjin/api-types";
import { isNonEmptyArray } from "@toss/utils";
import * as I from "../../../../../../../components/icons";
import PublishedSeriesCard from "./PublishedSeriesCard";

export default function SeriesListView({ seriesId }: { seriesId: number }) {
  const { data: seriesList } = useSWR<ResponseForm<NewsletterCardDto[]>>(
    `newsletter/in/series/${seriesId}`,
  );

  return (
    <section className="w-full flex flex-col">
      <div className="w-full border-b border-gray-200 py-3">
        <span className="font-medium text-grayscale-500">
          총 {seriesList?.data?.length}개
        </span>
      </div>

      {isNonEmptyArray(seriesList?.data ?? []) ? (
        seriesList?.data?.map((letter, index) => (
          <PublishedSeriesCard key={index} letter={letter} />
        ))
      ) : (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center py-12">
          <I.Empty />
          <span className="text-grayscale-500 ">아직 작성된 글이 없습니다</span>
        </div>
      )}
    </section>
  );
}
