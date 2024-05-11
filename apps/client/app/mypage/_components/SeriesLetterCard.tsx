import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { NewsletterDto } from "@moonjin/api-types";

export default function SeriesLetterCard({ value }: { value: NewsletterDto }) {
  return (
    <Link
      href=""
      className="flex w-full hover:bg-gray-50 py-4 border-b border-grayscale-200"
    >
      <Image
        src={value.post.cover ?? ""}
        alt="뉴스레터 썸네일"
        width={120}
        height={120}
        className="size-[120px] min-w-[120px]  bg-gray-600 rounded"
      />
      <div className="flex w-full flex-col ml-4">
        <div className="flex gap-x-1.5 items-center ">
          <div className=" rounded py-0.5 px-2 border border-primary text-primary  text-xs font-light">
            # {value.series?.title}
          </div>
          <div className="text-grayscale-400 py-0.5 px-1 rounded text-xs">
            {value.post.category}
          </div>
        </div>
        <div className="flex gap-y-1 flex-col w-full h-full">
          <div className="w-full">
            <div className="mt-2  font-medium">{value.post.title}</div>
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
