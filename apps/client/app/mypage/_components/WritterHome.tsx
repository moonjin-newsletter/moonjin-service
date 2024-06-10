import { type SendNewsletterResultDto } from "@moonjin/api-types";
import { isNonEmptyArray } from "@toss/utils";
import EmptyCard from "./EmptyCard";
import NewsLetterCard from "./NewsLetterCard";
import SeriesLetterCard from "./SeriesLetterCard";

export default function WritterHome({
  myNewsletterList,
}: {
  myNewsletterList: SendNewsletterResultDto[];
}) {
  return (
    <div className="flex flex-col w-full gap-y-12 mt-2 max-w-[740px]">
      <section className="w-full flex flex-col">
        {isNonEmptyArray(myNewsletterList ?? []) ? (
          myNewsletterList.map((newsletter, index) => (
            <>
              {newsletter.series ? (
                <SeriesLetterCard key={index} value={newsletter} />
              ) : (
                <NewsLetterCard key={index} value={newsletter} />
              )}
            </>
          ))
        ) : (
          <EmptyCard />
        )}
      </section>
    </div>
  );
}
