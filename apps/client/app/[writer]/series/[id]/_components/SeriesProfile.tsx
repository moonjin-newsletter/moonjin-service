import type { SeriesDto } from "@moonjin/api-types";
import Image from "next/image";

export default function SeriesProfile({
  seriesInfo,
}: {
  seriesInfo: SeriesDto;
}) {
  return (
    <header className="w-full h-[310px]  flex  gap-x-2 animate-fade">
      <Image
        src={seriesInfo.cover}
        alt={"시리즈 커버이미지"}
        width={240}
        height={310}
        className="w-[240px] h-[310px] object-cover shadow rounded peer"
      />
      <div className="flex flex-col w-[240px] h-full gap-y-2   ">
        <h1 className="text-2xl font-bold">{seriesInfo.title}</h1>
        <hr className="border-gray-700" />
        <p className="text-sm text-gray-500">{seriesInfo.description}</p>
        <hr className="border-gray-300" />
      </div>
    </header>
  );
}
