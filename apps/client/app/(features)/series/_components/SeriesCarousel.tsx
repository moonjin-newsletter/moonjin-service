"use client";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import useCarousel from "@components/carousel/useCarousel";
import type { SeriesWithWriterDto } from "@moonjin/api-types";
import Link from "next/link";

type SeriesCarouselProps = {
  seriesList: SeriesWithWriterDto[];
};

export default function SeriesCarousel({ seriesList }: SeriesCarouselProps) {
  const { Carousel, prevEvent, nextEvent } = useCarousel({
    length: seriesList.length - 1,
    width: 1006,
  });

  return (
    <div className="w-fit flex  items-center gap-x-10">
      <button
        onClick={prevEvent}
        className="h-10 w-10 border rounded-full  border-grayscale-300 p-auto flex items-center justify-center"
      >
        <IoIosArrowBack className="text-2xl" />
      </button>
      <div className="flex items-center w-[1006px] overflow-hidden rounded-xl shadow">
        <Carousel>
          <>
            {seriesList.map((series, index) => (
              <Link
                href={`/@${series.writer.moonjinId}/series/${series.series.id}`}
                key={index}
                className="flex items-center gap-x-60 justify-between w-[1006px] max-w-[1006px] bg-white rounded-xl px-14 py-10 "
              >
                <div className="break-keep">
                  <div className="px-3 py-1 rounded-full bg-grayscale-600 text-sm  text-white w-fit">
                    {series.series.category}
                  </div>
                  <h1 className="text-2xl font-serif font-semibold mt-3  text-grayscale-700">
                    {series.series.title}
                  </h1>
                  <p className="text-grayscale-500 text-sm mt-4 font-serif">
                    {series.series.description}
                  </p>
                  <p className="text-grayscale-500 text-sm mt-14 font-serif">
                    Written by.{series.writer.nickname}
                  </p>
                </div>
                <img
                  src={series.series.cover}
                  alt="Series"
                  className="rounded-xl w-[240px] h-[312px] object-cover"
                  width={240}
                  height={312}
                />
              </Link>
            ))}
          </>
        </Carousel>
      </div>
      <button
        onClick={nextEvent}
        className="h-10 w-10 border rounded-full border-grayscale-300 p-auto flex items-center justify-center"
      >
        <IoIosArrowForward className="text-2xl" />
      </button>
    </div>
  );
}
