"use client";

import Link from "next/link";
import { postData } from "../_data";
import Image from "next/image";
import { Tab } from "@headlessui/react";
import { range } from "@toss/utils";

export default function SeriesSection() {
  return (
    <section className="flex pt-40 pb-10 flex-col  items-center w-full">
      <h2 className="font-serif  text-2xl font-bold text-grayscale-700">
        Moonjin Series
      </h2>
      <h4 className="text-gray-500 text-sm mt-2">
        문진만의 다양한 시리즈 뉴스레터들을 만나보세요
      </h4>
      <div className="w-full mt-5 flex flex-col items-center text-sm">
        <Tab.Group>
          <Tab.Panels>
            {range(0, 4).map((value, index) => (
              <Tab.Panel key={index}>
                <SeriesLayout layout={null} />
              </Tab.Panel>
            ))}
          </Tab.Panels>
          <Tab.List className="w-full mt-6 flex justify-center">
            {range(1, 5).map((value, index) => (
              <Tab
                className="mx-2.5 py-1  text-sm font-semibold aria-selected:border-b-2 border-primary aria-selected:text-primary text-gray-600 outline-none"
                key={index}
              >
                0{value}
              </Tab>
            ))}
          </Tab.List>
        </Tab.Group>
      </div>
    </section>
  );
}

function SeriesLayout({ layout }: { layout: any }) {
  return (
    <div className="mt-4 w-fit flex gap-x-1 rounded-lg overflow-hidden">
      <Link
        href=""
        className="w-80 h-[450px] bg-gray-600 relative overflow-hidden group"
      >
        <div className="absolute py-8 top-0 left-0 bg-black/20 z-10 text-white flex flex-col items-center w-full h-full px-12 transition group-hover:bg-black/50">
          <span className="text-lg mt-auto font-semibold leading-relaxed">
            {postData[0].title}
          </span>
          <div className="text-sm text-grayscale-0/60">
            By.{postData[0].writer}
          </div>
          <div className="text-sm text-grayscale-0/50 font-light">
            {postData[0].createdAt}
          </div>
          <div className="font-semibold border-b border-white/80 py-1 mt-28 ">
            View all series
          </div>
        </div>

        <Image
          src={postData[0].thumbnail[0]}
          width={320}
          height={320}
          alt="게시물이미지"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-200 ease-in-out"
        />
      </Link>
      <div className="w-60 h-[450px] overflow-hidden flex flex-col gap-y-1">
        <Link
          href=""
          className="w-full h-1/2 bg-gray-600 relative overflow-hidden group "
        >
          <div className="absolute py-8 top-0 left-0 bg-black/20  z-10 text-white flex flex-col items-center w-full h-full px-12 group-hover:bg-black/50 group-hover:transition">
            <span className="text-lg mt-auto font-semibold leading-relaxed">
              {postData[1].title}
            </span>
            <div className="text-sm text-grayscale-0/60">
              By.{postData[1].writer}
            </div>
            <div className="text-sm text-grayscale-0/50 font-light">
              {postData[1].createdAt}
            </div>
            <div className="font-semibold border-b border-white/80 py-1  mt-2">
              바로가기
            </div>
          </div>
          <Image
            src={postData[1].thumbnail[0]}
            width={320}
            height={320}
            alt="게시물이미지"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-200 ease-in-out"
          />
        </Link>
        <Link
          href=""
          className="w-full h-1/2 bg-gray-600 overflow-hidden relative group"
        >
          <div className="absolute py-8 top-0 left-0 bg-black/10 group-hover:transition group-hover:bg-black/50  z-10 text-white flex flex-col items-center w-full h-full px-12 ">
            <span className="text-lg mt-auto font-semibold leading-relaxed">
              {postData[2].title}
            </span>
            <div className="text-sm text-grayscale-0/60">
              By.{postData[1].writer}
            </div>
            <div className="text-sm text-grayscale-0/50 font-light">
              {postData[1].createdAt}
            </div>
            <div className="font-semibold border-b border-white/80 py-1  mt-2">
              바로가기
            </div>
          </div>
          <Image
            src={postData[2].thumbnail[0]}
            width={320}
            height={320}
            alt="게시물이미지"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-200 ease-in-out"
          />
        </Link>
      </div>
      <Link
        href=""
        className="w-52 h-[450px] bg-gray-600 overflow-hidden group relative"
      >
        <div className="absolute py-8 top-0 left-0 bg-black/20 z-10 text-white flex flex-col items-center w-full h-full px-12 transition group-hover:bg-black/50">
          <span className="text-lg mt-auto font-semibold leading-relaxed">
            {postData[3].title}
          </span>
          <div className="text-sm text-grayscale-0/60">
            By.{postData[3].writer}
          </div>
          <div className="text-sm text-grayscale-0/50 font-light">
            {postData[3].createdAt}
          </div>
          <div className="font-semibold border-b border-white/80 py-1 mt-28 ">
            View all series
          </div>
        </div>
        <Image
          src={postData[3].thumbnail[0]}
          width={320}
          height={320}
          alt="게시물이미지"
          className="w-full h-full object-cover peer-hover:scale-105 transition duration-150 ease-in-out"
        />
      </Link>
      <Link
        href=""
        className="w-52 h-[450px] bg-gray-600 overflow-hidden relative group"
      >
        <div className="absolute py-8 top-0 left-0 bg-black/20 z-10 text-white flex flex-col items-center w-full h-full px-12 transition group-hover:bg-black/50">
          <span className="text-lg mt-auto font-semibold leading-relaxed">
            {postData[4].title}
          </span>
          <div className="text-sm text-grayscale-0/60">
            By.{postData[4].writer}
          </div>
          <div className="text-sm text-grayscale-0/50 font-light">
            {postData[4].createdAt}
          </div>
          <div className="font-semibold border-b border-white/80 py-1 mt-28 ">
            View all series
          </div>
        </div>
        <Image
          src={postData[4].thumbnail[0]}
          width={320}
          height={320}
          alt="게시물이미지"
          className="w-full h-full object-cover peer-hover:scale-105 transition duration-150 ease-in-out"
        />
      </Link>
    </div>
  );
}
