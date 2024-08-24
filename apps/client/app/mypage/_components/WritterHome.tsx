import { type NewsletterCardDto } from "@moonjin/api-types";
import { isNonEmptyArray } from "@toss/utils";
import EmptyCard from "./EmptyCard";
import NewsLetterCard from "./NewsLetterCard";

export default function WritterHome({
  myNewsletterList,
}: {
  myNewsletterList: NewsletterCardDto[];
}) {
  return (
    <div className="flex flex-col w-full gap-y-12  max-w-[740px]">
      <section className="w-full flex flex-col">
        {isNonEmptyArray(myNewsletterList ?? []) ? (
          myNewsletterList.map((newsletter, index) => (
            <>
              <NewsLetterCard key={index} newsletterInfo={newsletter} />
            </>
          ))
        ) : (
          <EmptyCard />
        )}
      </section>
    </div>
  );
}
