import Link from "next/link";
import Image from "next/image";
import type { SeriesDto } from "@moonjin/api-types";
import { BiLike } from "react-icons/bi";
import { FaBookOpen } from "react-icons/fa6";

export default function SeriesCard({ seriesInfo }: { seriesInfo: SeriesDto }) {
  return (
    <Link href={""} className="flex flex-col">
      <div className="w-full relative h-0 overflow-hidden pb-[82.14%]">
        <Image
          src={seriesInfo.cover}
          alt="시리즈 커버이미지"
          width={230}
          height={280}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <h2 className="line-clamp-1 font-medium text-lg">{seriesInfo.title}</h2>
        <span className="text-[#999999] line-clamp-1 mt-1">
          {seriesInfo.description}
        </span>
        <div className="flex items-center gap-x-3.5 mt-4 text-[#999999] text-sm">
          <div className="flex items-center gap-x-1">
            <BiLike />
            <span>{11}</span>
          </div>
          <div className="flex items-center gap-x-1">
            <FaBookOpen />
            <span>{2}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
