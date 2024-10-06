"use client";

import Link from "next/link";
import Image from "next/image";
import { Tab } from "@headlessui/react";
import { range } from "@toss/utils";
import type { SeriesWithWriterDto } from "@moonjin/api-types";
import { format } from "date-fns";

export default function SeriesSection({
  seriesList,
}: {
  seriesList: SeriesWithWriterDto[];
}) {
  const chunkSize = 6;
  const chunkedSeriesList = [];

  for (let i = 0; i < seriesList.length; i += chunkSize) {
    chunkedSeriesList.push(seriesList.slice(i, i + chunkSize));
  }

  return (
    <section className="flex pt-40  flex-col  items-center w-full">
      <h2 className="font-serif  text-2xl font-bold text-grayscale-700">
        Moonjin Series
      </h2>
      <h4 className="text-gray-500 text-sm mt-2">
        문진만의 다양한 시리즈 뉴스레터들을 만나보세요
      </h4>
      <div className="w-full mt-5 flex flex-col items-center text-sm">
        <Tab.Group onChange={(index) => console.log(index)}>
          <Tab.Panels>
            {chunkedSeriesList.map((value, index) => (
              <Tab.Panel key={index}>
                <SeriesLayout sortedList={value} />
              </Tab.Panel>
            ))}
          </Tab.Panels>
          <Tab.List className="w-full mt-6 flex justify-center">
            {range(0, chunkedSeriesList.length).map((value, index) => (
              <Tab
                className="mx-2.5 py-1  text-sm font-semibold aria-selected:border-b-2 border-primary aria-selected:text-primary text-gray-600 outline-none"
                key={index}
              >
                0{value + 1}
              </Tab>
            ))}
          </Tab.List>
        </Tab.Group>
      </div>
    </section>
  );
}

function SeriesLayout({ sortedList }: { sortedList: SeriesWithWriterDto[] }) {
  return (
    <div className="mt-4 w-fit flex gap-x-1 rounded-lg overflow-hidden">
      <Link
        href={`/@${sortedList[0].writer.id}/series/${sortedList[0].series.id}`}
        className="w-[248px] h-[450px] bg-gray-600 relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 bg-black/20 z-10 text-white flex flex-col items-center w-full h-full px-12 transition group-hover:bg-black/50 justify-center">
          <span className="text-lg font-semibold leading-relaxed pt-4">
            {sortedList[0].series.title}
          </span>
          <div className="text-sm text-grayscale-0/60">
            By.{sortedList[0].writer.nickname}
          </div>
          <div className="text-sm text-grayscale-0/50 font-light">
            {format(new Date(sortedList[0].series.createdAt), "yyyy-MM-dd")}
          </div>
          <div className="absolute bottom-6 font-semibold border-b border-white/80 hidden group-hover:flex animate-fade">
            View all series
          </div>
        </div>

        <Image
          src={sortedList[0].series.cover}
          width={320}
          height={320}
          alt="게시물이미지"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-200 ease-in-out"
        />
      </Link>
      <div className="w-[248px] h-[450px] overflow-hidden flex flex-col gap-y-1">
        <Link
          href={`/@${sortedList[1].writer.id}/series/${sortedList[1].series.id}`}
          className="w-full h-1/2 bg-gray-600 relative overflow-hidden group "
        >
          <div className="absolute top-0 left-0 bg-black/20 z-10 text-white flex flex-col items-center w-full h-full px-12 transition group-hover:bg-black/50 justify-center">
            <span className="text-lg font-semibold leading-relaxed pt-4">
              {sortedList[1].series.title}
            </span>
            <div className="text-sm text-grayscale-0/60">
              By.{sortedList[1].writer.nickname}
            </div>
            <div className="text-sm text-grayscale-0/50 font-light">
              {format(new Date(sortedList[1].series.createdAt), "yyyy-MM-dd")}
            </div>
            <div className="absolute bottom-6 font-semibold border-b border-white/80 hidden group-hover:flex animate-fade">
              View all series
            </div>
          </div>
          <Image
            src={sortedList[1].series.cover}
            width={320}
            height={320}
            alt="게시물이미지"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-200 ease-in-out"
          />
        </Link>
        <Link
          href={`/@${sortedList[2].writer.id}/series/${sortedList[2].series.id}`}
          className="w-full h-1/2 bg-gray-600 overflow-hidden relative group"
        >
          <div className="absolute top-0 left-0 bg-black/20 z-10 text-white flex flex-col items-center w-full h-full px-12 transition group-hover:bg-black/50 justify-center">
            <span className="text-lg font-semibold leading-relaxed pt-4">
              {sortedList[2].series.title}
            </span>
            <div className="text-sm text-grayscale-0/60">
              By.{sortedList[2].writer.nickname}
            </div>
            <div className="text-sm text-grayscale-0/50 font-light">
              {format(new Date(sortedList[2].series.createdAt), "yyyy-MM-dd")}
            </div>
            <div className="absolute bottom-6 font-semibold border-b border-white/80 hidden group-hover:flex animate-fade">
              View all series
            </div>
          </div>
          <Image
            src={sortedList[2].series.cover}
            width={320}
            height={320}
            alt="게시물이미지"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-200 ease-in-out"
          />
        </Link>
      </div>
      <Link
        href={`/@${sortedList[3].writer.id}/series/${sortedList[3].series.id}`}
        className="w-[248px] h-[450px] bg-gray-600 overflow-hidden group relative"
      >
        <div className="absolute top-0 left-0 bg-black/20 z-10 text-white flex flex-col items-center w-full h-full px-12 transition group-hover:bg-black/50 justify-center">
          <span className="text-lg font-semibold leading-relaxed pt-4">
            {sortedList[3].series.title}
          </span>
          <div className="text-sm text-grayscale-0/60">
            By.{sortedList[3].writer.nickname}
          </div>
          <div className="text-sm text-grayscale-0/50 font-light">
            {format(new Date(sortedList[3].series.createdAt), "yyyy-MM-dd")}
          </div>
          <div className="absolute bottom-6 font-semibold border-b border-white/80 hidden group-hover:flex animate-fade">
            View all series
          </div>
        </div>
        <Image
          src={sortedList[3].series.cover}
          width={320}
          height={320}
          alt="게시물이미지"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-150 ease-in-out"
        />
      </Link>

      <div className="w-[248px] h-[450px] overflow-hidden flex flex-col gap-y-1">
        <Link
          href={`/@${sortedList[4].writer.id}/series/${sortedList[4].series.id}`}
          className="w-full h-1/2 bg-gray-600 relative overflow-hidden group "
        >
          <div className="absolute top-0 left-0 bg-black/20 z-10 text-white flex flex-col items-center w-full h-full px-12 transition group-hover:bg-black/50 justify-center">
            <span className="text-lg font-semibold leading-relaxed pt-4">
              {sortedList[4].series.title}
            </span>
            <div className="text-sm text-grayscale-0/60">
              By.{sortedList[4].writer.nickname}
            </div>
            <div className="text-sm text-grayscale-0/50 font-light">
              {format(new Date(sortedList[4].series.createdAt), "yyyy-MM-dd")}
            </div>
            <div className="absolute bottom-6 font-semibold border-b border-white/80 hidden group-hover:flex animate-fade">
              View all series
            </div>
          </div>
          <Image
            src={sortedList[4].series.cover}
            width={320}
            height={320}
            alt="게시물이미지"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-200 ease-in-out"
          />
        </Link>
        <Link
          href={`/@${sortedList[5].writer.id}/series/${sortedList[5].series.id}`}
          className="w-full h-1/2 bg-gray-600 overflow-hidden relative group"
        >
          <div className="absolute top-0 left-0 bg-black/20 z-10 text-white flex flex-col items-center w-full h-full px-12 transition group-hover:bg-black/50 justify-center">
            <span className="text-lg font-semibold leading-relaxed pt-4">
              {sortedList[5].series.title}
            </span>
            <div className="text-sm text-grayscale-0/60">
              By.{sortedList[5].writer.nickname}
            </div>
            <div className="text-sm text-grayscale-0/50 font-light">
              {format(new Date(sortedList[5].series.createdAt), "yyyy-MM-dd")}
            </div>
            <div className="absolute bottom-6 font-semibold border-b border-white/80 hidden group-hover:flex animate-fade">
              View all series
            </div>
          </div>
          <Image
            src={sortedList[5].series.cover}
            width={320}
            height={320}
            alt="게시물이미지"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-200 ease-in-out"
          />
        </Link>
      </div>
    </div>
  );
}
