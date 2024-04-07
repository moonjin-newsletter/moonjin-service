import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { NewsletterDto } from "@moonjin/api-types";

export default function PublishedSeriesCard({
  letter,
}: {
  letter: NewsletterDto;
}) {
  return (
    <Link href="" className="flex w-full  py-4 border-b border-grayscale-200">
      <Image
        src={letter.post.cover ?? ""}
        alt="뉴스레터 썸네일"
        width={80}
        height={80}
        className="w-28 min-w-[112px] h-28 bg-gray-600 rounded-lg object-cover"
      />
      <div className="flex w-full flex-col ml-4">
        <div className="flex gap-x-1.5 items-center ">
          <div className="border border-grayscale-400 text-grayscale-400 py-0.5 px-2 rounded text-xs">
            # {letter.post.category}
          </div>
          {letter.series && (
            <div className="text-xs font-medium text-grayscale-400">
              {letter.series.title}
            </div>
          )}
          {/*{value.post.category.map((category: any, index: number) => (*/}
          {/*  <div className="border border-grayscale-400 text-grayscale-400 py-0.5 px-2 rounded text-xs">*/}
          {/*    # {category}*/}
          {/*  </div>*/}
          {/*))}*/}
        </div>
        <div className="flex w-full">
          <div className="max-w-[340px]">
            <div className="mt-2 font-medium">{letter.post.title}</div>
            <span className="line-clamp-2 text-sm text-grayscale-500">
              {letter.post.content}
            </span>
          </div>
          <div className="ml-auto text-sm text-grayscale-500">
            <div>
              발행일:{" "}
              {format(new Date(letter.post.lastUpdatedAt), "yyyy-MM-dd")}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
