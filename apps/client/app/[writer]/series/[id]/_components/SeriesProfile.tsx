"use client";
import type {
  SeriesDto,
  SubscribingResponseDto,
  WriterPublicCardDto,
} from "@moonjin/api-types";
import Image from "next/image";
import { MdOutlineLibraryBooks } from "react-icons/md";
import SubModalProvider from "@components/modal/SubModalProvider";
import Link from "next/link";

export default function SeriesProfile({
  seriesInfo,
  writerInfo,
  subInfo,
}: {
  seriesInfo: SeriesDto;
  writerInfo: WriterPublicCardDto;
  subInfo: SubscribingResponseDto | null;
}) {
  return (
    <header className="w-full flex  gap-y-10  animate-fade gap-x-6">
      <section className="w-fit h-[310px] flex gap-x-2">
        <Image
          src={seriesInfo.cover}
          alt={"시리즈 커버이미지"}
          width={240}
          height={310}
          className="w-[240px] min-w-[240px] h-[310px]  object-cover shadow rounded peer"
        />
      </section>
      <section className="flex flex-col w-full ">
        <Link
          href={`/@${writerInfo.writerInfo.moonjinId}`}
          className="flex items-center gap-x-2 group "
        >
          <div className="flex  gap-x-1 text-sm text-grayscale-500">
            <span className="font-serif font-medium">By.</span>
            {/*<Image*/}
            {/*  src={writerInfo.user.image}*/}
            {/*  alt={"작가 프로필이미지"}*/}
            {/*  width={32}*/}
            {/*  height={32}*/}
            {/*  className="w-[24px] h-[24px] rounded-full object-cover border border-grayscale-200"*/}
            {/*/>*/}
            <h2 className="group-hover:underline">
              {writerInfo.user.nickname}
            </h2>
          </div>
        </Link>
        <div className="flex items-center gap-x-4 mt-4">
          <h1 className="text-2xl font-semibold text-grayscale-600">
            {seriesInfo.title}
          </h1>
          <div className="px-4 py-1 text-[13px] border rounded-full border-grayscale-200 text-grayscale-400">
            {seriesInfo.category}
          </div>
        </div>
        <div className="w-full mt-4">
          <strong className="text-sm font-light text-grayscale-500 leading-relaxed break-keep">
            {seriesInfo.description}
          </strong>
        </div>
        <div className="w-full flex justify-between mt-auto">
          <div className="flex items-center gap-x-4   ">
            {/*<div className="flex items-center gap-x-2 text-primary">*/}
            {/*  <BiLike className="text-xl" />*/}
            {/*  <span className="text-base">{seriesInfo.likes}</span>*/}
            {/*</div>*/}
            <div className="flex items-center gap-x-2 text-grayscale-400">
              <MdOutlineLibraryBooks className="text-xl" />
              <span className="text-base font-light">
                {seriesInfo.newsletterCount}개의 뉴스레터
              </span>
            </div>
          </div>
          <div className="flex items-center gap-x-3">
            <SubModalProvider
              subInfo={subInfo}
              writerInfo={writerInfo}
              subChildren={
                <div className="py-2 px-4 rounded-full text-sm bg-grayscale-600 text-white">
                  작가 구독하기
                </div>
              }
              unSubChildren={
                <div className="py-2 px-4 rounded-full text-sm bg-primary text-white">
                  구독 중
                </div>
              }
            />
          </div>
        </div>
      </section>
    </header>
  );
}
