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
      className="flex hover:bg-gray-50 w-full gap-x-2  py-4 border-b border-grayscale-200"
    >
      <div className="flex w-full flex-col ">
        <div className="flex gap-y-1 flex-col w-full h-full">
          <div className="w-full flex flex-col gap-y-1.5">
            <div className=" font-medium">{value.post.title}</div>
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
      <Image
        src={value.post.cover ?? ""}
        alt="뉴스레터 썸네일"
        width={120}
        height={120}
        className="size-[120px] min-w-[120px]  bg-gray-600 rounded"
      />
    </Link>
  );
}
