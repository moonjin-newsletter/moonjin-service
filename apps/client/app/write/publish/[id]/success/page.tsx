"use client";

import React from "react";
import LottieFrame from "@components/lottie/LottieFrame";
import SendingAnimation from "./Sending.json";
import type {
  ResponseForm,
  UnreleasedPostWithSeriesDto,
} from "@moonjin/api-types";
import Image from "next/image";
import useSWR from "swr";
import { format } from "date-fns";

type pageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: pageProps) {
  const letterId = parseInt(params.id, 10);
  const { data: newsletterInfo } = useSWR<
    ResponseForm<UnreleasedPostWithSeriesDto>
  >(`post/${letterId}/metadata`);

  return (
    <main className="w-full mt-14 pt-20 min-h-screen flex flex-col items-center ">
      <div className="max-w-[1006px] w-full flex flex-col gap-x-10">
        <section className="w-full flex flex-col items-center">
          <LottieFrame
            lottie={{
              loop: true,
              autoplay: true,
              animationData: SendingAnimation,
              isStopped: false,
              isPaused: false,
            }}
            gap={0}
            className="mx-auto  mt-3.5 h-[128px] w-[128px]"
          ></LottieFrame>
          <h1 className="font-bold text-xl mt-3 text-center text-grayscale-700">
            모든 구독자에게 정상적으로
            <br />
            뉴스레터 발송을 완료하였습니다!
          </h1>
        </section>
        {newsletterInfo?.data && (
          <>
            <hr className="w-full my-10" />
            <section className="flex gap-x-8  justify-center w-full ">
              <div className="w-fit">
                <Image
                  src={newsletterInfo?.data?.post.cover ?? ""}
                  alt={"레터 이미지"}
                  width={280}
                  height={280}
                  className="rounded"
                />
              </div>
              <div className="w-fit flex flex-col">
                <span className="text-sm font-medium text-grayscale-500">
                  뉴스레터 제목
                </span>
                <div className="font-semibold text-lg">
                  {newsletterInfo?.data?.post?.title}
                </div>
                <span className="text-sm mt-5 font-medium text-grayscale-500">
                  뉴스레터 발송일자
                </span>
                <div className="font-semibold text-lg">
                  {/*{format(*/}
                  {/*  new Date(newsletterInfo.data.post.releasedAt),*/}
                  {/*  "yyyy년 MM월 dd일",*/}
                  {/*)}*/}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
