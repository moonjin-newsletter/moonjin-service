"use client";

import type { WriterPublicCardDto } from "@moonjin/api-types";
import * as I from "@components/icons";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { PiUserCircle } from "react-icons/pi";
import { FiShare2 } from "react-icons/fi";
import { IoChatbubblesOutline, IoClose } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";

import Link from "next/link";
import { commaizeNumber } from "@toss/utils";
import WebShareButton from "@components/share/WebShareButton";

export default function WriterInfoModal({
  unmount,
  writerInfo,
}: {
  unmount: any;
  writerInfo: WriterPublicCardDto;
}) {
  return (
    <div
      onClick={(e) => {
        unmount();
      }}
      className="fixed  top-0 flex items-center justify-center z-50 w-screen h-screen bg-black/40"
    >
      <section
        onClick={(e) => e.stopPropagation()}
        className=" h-fit min-w-[520px] w-[540px] overflow-y-auto py-8 px-10 rounded-lg bg-white"
      >
        <div className="w-full flex justify-between">
          <span className="text-2xl font-bold">작가정보</span>
          <button onClick={unmount}>
            <IoClose className="text-2xl" />
          </button>
        </div>
        <div className="w-full flex flex-col mt-6 gap-y-2">
          <p className="text-lg  text-primary font-bold">
            {writerInfo.user.nickname}
          </p>
          <p className="text-grayscale-400 text-sm">
            {writerInfo.user.description}
          </p>
        </div>
        <div className="w-full flex flex-col mt-10 gap-y-4">
          <div className="w-full flex items-center gap-x-3">
            <MdOutlineAlternateEmail className="text-xl" />
            <Link
              href={`mailto:${writerInfo.writerInfo.moonjinId}@moonjin.site`}
              className="underline text-grayscale-400"
            >
              {`${writerInfo.writerInfo.moonjinId}`}@moonjin.site
            </Link>
          </div>
          <div className="w-full flex items-center gap-x-3">
            <I.LogoIcon width="24" height="24" viewBox="0 0 67 67" />
            <Link
              href=""
              className="underline text-grayscale-400"
            >{`https://moonjin.site/@${writerInfo.writerInfo.moonjinId}`}</Link>
          </div>
        </div>
        <div className="w-full flex flex-col mt-10 gap-y-4 text-[#1C1C1C]">
          <div className="w-full flex items-center gap-x-3">
            <PiUserCircle className="text-[28px]" />
            <span>
              구독자 수 : {commaizeNumber(writerInfo.writerInfo.followerCount)}
              명
            </span>
          </div>
          <div className="w-full flex items-center gap-x-3">
            <I.PencilSimpleLine width="24" height="24" viewBox="0 0 20 20" />
            <span>
              뉴스레터 수 :{" "}
              {commaizeNumber(writerInfo.writerInfo.newsletterCount)}개
            </span>
          </div>
        </div>
        <div className="w-full flex  mt-10 gap-x-3 text-grayscale-600 ">
          <Link
            href=""
            className="border rounded-full py-2 px-4 font-medium text-sm border-grayscale-600 flex items-center gap-x-1.5"
          >
            <IoChatbubblesOutline className="text-lg" />
            고객센터
          </Link>
          <Link
            href=""
            className="border rounded-full py-2 px-4 font-medium text-sm border-grayscale-600 flex items-center gap-x-1.5"
          >
            <FiShare2 className="text-lg" />
            <WebShareButton
              title={`${writerInfo.user.nickname}님의 뉴스레터`}
              subtitle={"지금 작가의 서재 방문하기"}
              url={null}
            >
              <span>공유하기</span>
            </WebShareButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
