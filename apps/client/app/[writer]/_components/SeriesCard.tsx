"use client";
import Link from "next/link";
import Image from "next/image";
import type { SeriesDto } from "@moonjin/api-types";
import { BiLike } from "react-icons/bi";

import { usePathname } from "next/navigation";
import { MdOutlineLibraryBooks } from "react-icons/md";

export default function SeriesCard({ seriesInfo }: { seriesInfo: SeriesDto }) {
  const pathname = usePathname();

  return (
    <Link
      href={`${pathname}/series/${seriesInfo.id}`}
      className="flex flex-col group"
    >
      <div className="w-full rounded shadow relative h-0 overflow-hidden pb-[121.73%]">
        <Image
          src={seriesInfo.cover}
          alt="시리즈 커버이미지"
          width={230}
          height={280}
          className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 group-hover:blur-sm transition duration-800 ease-in-out"
        />
        <div className="absolute  items-center justify-center text-white top-0 w-full h-full  bg-black/10  group-hover:flex hidden flex-col">
          <div className="font-medium bg-black/40 py-3 px-2.5 text-sm text-white/80 rounded-full">
            시리즈 목록 보기
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-2">
        <h2 className="line-clamp-1 font-medium text-lg">{seriesInfo.title}</h2>
        <span className="text-[#999999] line-clamp-1 mt-1">
          {seriesInfo.description}
        </span>
        <div className="flex items-center gap-x-3.5 mt-4 text-[#999999] text-sm">
          <div className="flex items-center gap-x-1">
            <BiLike />
            <span>{seriesInfo.likes}</span>
          </div>
          <div className="flex items-center gap-x-1">
            <MdOutlineLibraryBooks />
            <span>{seriesInfo.newsletterCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
