import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { PostWithSeriesDto } from "@moonjin/api-types";

export function UnreleasedNewsletterCard({
  value,
}: {
  value: PostWithSeriesDto;
}) {
  return (
    <Link
      href={`/write/${value.post.id}/edit`}
      className="flex h-fit items-center w-full group gap-x-6  py-5 border-b border-grayscale-200"
    >
      <div className="flex  min-h-[120px] w-full justify-between h-full  flex-col ">
        <div className="flex flex-col h-fit gap-y-2  ">
          {value?.series && (
            <span className="text-[13px] w-fit text-primary border-primary border-b">
              {value?.series?.title}
            </span>
          )}

          <strong className="group-hover:underline text-lg text-grayscale-600 font-medium">
            {value.post.title}
          </strong>
          <span className="line-clamp-2 leading-relaxed text-sm text-grayscale-400 font-light">
            {value.post.subtitle}
          </span>
        </div>
        <div className="text-[#999999] text-sm mt-3 flex items-center gap-x-1.5">
          <span>수정일</span>
          <span>
            {format(new Date(value.post.lastUpdatedAt), "yyyy.MM.dd")}
          </span>
        </div>
      </div>
      <Image
        src={value.post.cover ?? ""}
        alt="뉴스레터 썸네일"
        width={120}
        height={120}
        className="size-[120px] min-w-[120px]  bg-gray-100 rounded object-cover border border-grayscale-100"
      />
    </Link>
  );
}
