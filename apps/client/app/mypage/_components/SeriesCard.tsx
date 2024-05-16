import Link from "next/link";
import Image from "next/image";
import type { SeriesDto } from "@moonjin/api-types";

export function SeriesCardForReader({ seriesInfo }: { seriesInfo: any }) {
  return (
    <Link
      href={""}
      className="flex flex-col min-w-[230px] w-[230px] h-fit pb-6"
    >
      <div className="group w-full h-fit relative">
        <Image
          width={200}
          height={320}
          src={seriesInfo.series.cover ?? ""}
          alt="시리즈 배너"
          className="w-full h-72 object-cover bg-gray-200 rounded-lg"
        />{" "}
        <div className="absolute text-white bottom-0 w-full rounded-b-lg items-center bg-black/40 py-5 group-hover:flex hidden flex-col">
          <div className="font-semibold">시리즈 자세히 보기</div>
        </div>
      </div>

      <div className="flex flex-col mt-2">
        <div className="text-lg line-clamp-1 font-semibold text-grayscale-700">
          {seriesInfo.series.title}
        </div>
        <span className="text-grayscale-600 line-clamp-2">
          {seriesInfo.series.description}
        </span>
        <span className="text-xs mt-0.5 line-clamp-1 text-grayscale-400">
          written by.{seriesInfo.writer.nickname}
        </span>
      </div>
    </Link>
  );
}

export function SeriesCardForWritter({
  seriesInfo,
}: {
  seriesInfo: SeriesDto;
}) {
  return (
    <Link
      href={`/mypage/newsletter/series/${seriesInfo.id}`}
      className="flex flex-col min-w-[230px] w-[230px] h-fit pb-6"
    >
      <div className="group w-full h-fit relative">
        <Image
          width={200}
          height={320}
          src={seriesInfo.cover ?? ""}
          alt="시리즈 배너"
          className="w-full h-72 object-cover bg-gray-200 rounded-lg"
        />{" "}
        <div className="absolute text-white bottom-0 w-full rounded-b-lg items-center bg-black/40 py-5 group-hover:flex hidden flex-col">
          <div className="font-semibold">시리즈 자세히 보기</div>
        </div>
      </div>

      <div className="flex flex-col mt-2">
        <div className="text-lg line-clamp-1 font-semibold text-grayscale-700">
          {seriesInfo.title}
        </div>
        <span className="text-grayscale-600 line-clamp-2">
          {seriesInfo.description}
        </span>
        {/*<span className="text-xs mt-0.5 line-clamp-1 text-grayscale-400">*/}
        {/*  written by.{seriesInfo.subscribe.nickname}*/}
        {/*</span>*/}
      </div>
    </Link>
  );
}
