import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import type { ReleasedPostWithWriterDto } from "@moonjin/api-types";

export default function NewsLetterCard({
  value,
}: {
  value: ReleasedPostWithWriterDto;
}) {
  return (
    <Link
      href=""
      className="flex hover:bg-gray-50 w-full  py-4 border-b border-grayscale-200"
    >
      <Image
        src={value.post.cover ?? ""}
        alt="뉴스레터 썸네일"
        width={120}
        height={120}
        className="size-[120px] min-w-[120px]  bg-gray-600 rounded"
      />
      <div className="flex w-full flex-col ml-4">
        <div className="flex gap-x-1.5 ">
          <div className="text-grayscale-400 py-0.5  rounded text-xs">
            {value.post.category}
          </div>
          {/*{value.post.category.map((category: any, index: number) => (*/}
          {/*  <div className="border border-grayscale-400 text-grayscale-400 py-0.5 px-2 rounded text-xs">*/}
          {/*    # {category}*/}
          {/*  </div>*/}
          {/*))}*/}
        </div>
        <div className="flex gap-y-1 flex-col w-full h-full">
          <div className="w-full">
            <div className="mt-1.5 font-medium">{value.post.title}</div>
            <span className="line-clamp-2 text-sm text-grayscale-500">
              {value.post.preview}
            </span>
          </div>
          <div className="mt-auto font-light gap-x-1.5 flex items-center text-sm text-grayscale-500">
            <div>{format(new Date(value.post.releasedAt), "yyyy.MM.dd")}</div>
            <div>
              <span className="italic">by.</span>
              {value.writer.nickname}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
