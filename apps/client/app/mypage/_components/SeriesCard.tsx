import Link from "next/link";
import Image from "next/image";
import type { SeriesWithWriterDto } from "@moonjin/api-types";

export function SeriesCardForReader({
  seriesInfo,
  width,
  height,
}: {
  seriesInfo: any;
  width: number;
  height: number;
}) {
  return (
    <Link
      style={{ width: width }}
      href={`/@${seriesInfo.writer.moonjinId}/series/${seriesInfo.series.id}`}
      className={` flex group flex-col w-fit h-fit pb-6 `}
    >
      <div className={`relative w-fit h-fit overflow-hidden rounded-lg`}>
        <Image
          width={width ?? 190}
          height={height ?? 230}
          src={seriesInfo.series.cover ?? ""}
          alt="시리즈 배너"
          style={{
            width: width,
            height: height,
          }}
          className={`  shadow object-cover bg-gray-200  group-hover:scale-105 group-hover:blur-sm   transition duration-800 ease-in-out`}
        />
        <div className="absolute  items-center justify-center text-white top-0 w-full h-full  bg-black/10  group-hover:flex hidden flex-col">
          <div className="font-medium bg-black/40 py-3 px-2.5 text-sm text-white/80 rounded-full">
            시리즈 목록 보기
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col mt-2">
        <div className="text-lg line-clamp-1 font-bold text-grayscale-700">
          {seriesInfo.series.title}
        </div>
        <span className="text-grayscale-600 font-semibold text-sm line-clamp-2">
          {seriesInfo.series.description}
        </span>
        <span className="text-xs mt-1 line-clamp-1 text-grayscale-400">
          written by.{seriesInfo.writer.nickname}
        </span>
      </div>
    </Link>
  );
}

export function SeriesCardForWritter({
  seriesInfo,
}: {
  seriesInfo: SeriesWithWriterDto;
}) {
  return (
    <Link
      href={`/mypage/newsletter/series/${seriesInfo.series.id}`}
      className="flex flex-col min-w-[230px] w-[230px] h-fit pb-6"
    >
      <div className="group w-full h-fit relative overflow-hidden rounded-lg">
        <Image
          width={200}
          height={320}
          src={seriesInfo.series.cover ?? ""}
          alt="시리즈 배너"
          className={`w-full h-72  shadow object-cover bg-gray-200  group-hover:scale-105 group-hover:blur-sm   transition duration-800 ease-in-out`}
        />{" "}
        <div className="absolute  items-center justify-center text-white top-0 w-full h-full  bg-black/10  group-hover:flex hidden flex-col">
          <div className="font-medium bg-black/40 py-3 px-2.5 text-sm text-white/80 rounded-full">
            시리즈 목록 보기
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-2">
        <div className="text-lg line-clamp-1 font-semibold text-grayscale-700">
          {seriesInfo.series.title}
        </div>
        <span className="text-grayscale-600 line-clamp-2">
          {seriesInfo.series.description}
        </span>
        {/*<span className="text-xs mt-0.5 line-clamp-1 text-grayscale-400">*/}
        {/*  written by.{seriesInfo.subscribe.nickname}*/}
        {/*</span>*/}
      </div>
    </Link>
  );
}
