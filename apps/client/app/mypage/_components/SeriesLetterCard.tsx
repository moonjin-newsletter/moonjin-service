import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { NewsletterDto } from "@moonjin/api-types";

export default function SeriesLetterCard({ value }: { value: NewsletterDto }) {
  return (
    <Link
      href=""
      className="flex h-fit items-center w-full group gap-x-6  py-5 border-b border-grayscale-200"
    >
      <div className="flex  min-h-[120px] w-full justify-between h-full  flex-col ">
        <div className="flex flex-col h-fit gap-y-2  ">
          <strong className="  text-primary  text-sm font-semibold">
            [{value.series?.title}]
          </strong>
          <strong className="group-hover:underline text-lg text-grayscale-600 font-medium">
            {value.post.title}
          </strong>
          <span className="line-clamp-2 leading-relaxed text-sm text-grayscale-400">
            {value.post.preview}
          </span>
        </div>
        <div className="mt-4 gap-x-4 flex items-center text-sm text-grayscale-400">
          <div>
            <span className="italic">by.</span>
            {value.writer.nickname}
          </div>
          <div>
            발행일자.{format(new Date(value.post.releasedAt), "yyyy.MM.dd")}
          </div>
        </div>
      </div>
      <Image
        src={value.post.cover ?? ""}
        alt="뉴스레터 썸네일"
        width={120}
        height={120}
        className="size-[120px] min-w-[120px]  bg-gray-600 rounded object-cover"
      />
    </Link>
  );
}
