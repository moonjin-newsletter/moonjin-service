"use client";
import type { SeriesDto, WriterPublicCardDto } from "@moonjin/api-types";
import Image from "next/image";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { BiLike } from "react-icons/bi";
import { FaBookOpen } from "react-icons/fa6";
import { More } from "@components/icons";

export default function SeriesProfile({
  seriesInfo,
  writerInfo,
}: {
  seriesInfo: SeriesDto;
  writerInfo: WriterPublicCardDto;
}) {
  return (
    <header className="w-full flex flex-col gap-y-10  animate-fade">
      <section className="w-full h-[310px] flex gap-x-2">
        <Image
          src={seriesInfo.cover}
          alt={"시리즈 커버이미지"}
          width={240}
          height={310}
          className="w-[240px] h-[310px]  object-cover shadow rounded peer"
        />
        <div className="flex flex-col w-[240px] h-full gap-y-6 py-4 px-5 shadow  ">
          <div className="flex flex-col gap-y-2">
            <span className="text-[13px] text-gray-500">작가</span>
            <h2 className="font-semibold">{writerInfo.user.nickname}</h2>
            <h3 className="text-sm  text-primary">
              {writerInfo.writerInfo.moonjinId}@moonjin.site
            </h3>
          </div>
          <div className="flex flex-col gap-y-2">
            <span className="text-[13px] text-gray-500">작가소개</span>
            <p className="text-sm text-gray-500">
              {writerInfo.user.description}
            </p>
          </div>
        </div>
        <Link
          href={`/@${writerInfo.writerInfo.moonjinId}?tab=시리즈`}
          className="flex items-center justify center size-fit ml-auto p-3 border border-grayscale-300 rounded-full"
        >
          <IoClose className="text-xl text-grayscale-500" />
        </Link>
      </section>
      <section className="flex flex-col gap-y-4 max-w-[480px]">
        <div className="flex items-center gap-x-4">
          <h1 className="text-2xl font-semibold">{seriesInfo.title}</h1>
          <div className="px-4 py-1 text-[13px] border rounded-full border-grayscale-200 text-grayscale-400">
            {seriesInfo.category}
          </div>
        </div>
        <div className="w-full ">
          <strong className="text-base font-normal text-grayscale-400 break-keep">
            {seriesInfo.description}
          </strong>
        </div>
      </section>
      <section className="flex items-center justify-between max-w-[480px] w-full ">
        <div className="flex items-center gap-x-4   ">
          <div className="flex items-center gap-x-2 text-primary">
            <BiLike className="text-xl" />
            <span className="text-base">{11}</span>
          </div>
          <div className="flex items-center gap-x-2 text-grayscale-400">
            <FaBookOpen className="text-xl" />
            <span className="text-base">{2}</span>
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          <button className="px-5 py-2.5 text-sm font-medium text-white bg-black/80 rounded-full">
            작가 구독하기
          </button>
          <More />
        </div>
      </section>
    </header>
  );
}
