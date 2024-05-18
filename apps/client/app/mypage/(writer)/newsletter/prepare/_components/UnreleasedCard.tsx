import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { UnreleasedPostWithSeriesDto } from "@moonjin/api-types";

export function UnreleasedNewsletterCard({
  value,
}: {
  value: UnreleasedPostWithSeriesDto;
}) {
  return (
    <Link
      href={`/write/edit/${value.post.id}`}
      className="flex w-full justify-between  py-4 border-b border-grayscale-200"
    >
      <div className="flex w-full flex-col ">
        <div className="flex gap-x-1.5 items-center ">
          {value.series && (
            <div className="border border-grayscale-400 mb-2 text-grayscale-400 py-0.5 px-2 rounded text-xs">
              # {value.series.title}
            </div>
          )}

          {/*{value.post.category.map((category: any, index: number) => (*/}
          {/*  <div className="border border-grayscale-400 text-grayscale-400 py-0.5 px-2 rounded text-xs">*/}
          {/*    # {category}*/}
          {/*  </div>*/}
          {/*))}*/}
        </div>
        <div className="flex w-full h-full">
          <div className="max-w-[340px] h-full flex flex-col gap-y-2">
            <div className=" font-medium">{value.post.title}</div>
            <span className="line-clamp-2 text-sm text-grayscale-500">
              {value.post.preview}
            </span>
            <div className="mt-auto font-light gap-x-1.5 flex items-center text-sm text-grayscale-500">
              <div>
                수정일 :{" "}
                {format(new Date(value.post.lastUpdatedAt), "yyyy.MM.dd")}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Image
        src={value.post.cover ?? ""}
        alt="뉴스레터 썸네일"
        width={80}
        height={80}
        className="w-28 min-w-[112px] h-28 bg-gray-600 rounded-lg object-cover"
      />
    </Link>
  );
}
