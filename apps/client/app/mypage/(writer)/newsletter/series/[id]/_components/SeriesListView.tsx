"use client";

import useSWR from "swr";
import type { NewsletterDto, ResponseForm } from "@moonjin/api-types";
import { isNonEmptyArray } from "@toss/utils";
import { PublishedLetterCard } from "../../../_components/PublishedLetterCard";
import * as I from "../../../../../../../components/icons";

export default function SeriesListView({ seriesId }: { seriesId: number }) {
  const { data: seriesList } = useSWR<ResponseForm<NewsletterDto[]>>(
    `post?seriesId=${seriesId}`,
  );

  return (
    <section className="w-full flex flex-col">
      <div className="w-full">
        <span>총 {seriesList?.data?.length}개</span>
      </div>

      {isNonEmptyArray(seriesList?.data ?? []) ? (
        seriesList?.data?.map((letter, index) => (
          <PublishedLetterCard key={index} letter={letter} />
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
