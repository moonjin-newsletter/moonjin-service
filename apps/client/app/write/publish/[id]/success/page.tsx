"use client";

import React from "react";
import LottieFrame from "@components/lottie/LottieFrame";
import SendingAnimation from "./Sending.json";
import type {
  NewsletterSummaryDto,
  ResponseForm,
  UserDto,
  WriterDto,
} from "@moonjin/api-types";
import Image from "next/image";
import useSWR from "swr";
import { format } from "date-fns";
import * as process from "process";
import Link from "next/link";
import toast from "react-hot-toast";

type pageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: pageProps) {
  const letterId = parseInt(params.id, 10);
  const { data: newsletterInfo } = useSWR<ResponseForm<NewsletterSummaryDto>>(
    `newsletter/${letterId}/summary`,
  );
  const { data: userInfo } =
    useSWR<ResponseForm<{ user: UserDto } | WriterDto>>("user");

  console.log(newsletterInfo);

  function onClickCopy() {
    if (window) {
      window.navigator.clipboard
        .writeText(
          `${process.env.NEXT_PUBLIC_CLIENT_URL}/@${userInfo?.data?.user.nickname}/${newsletterInfo?.data?.id}`,
        )
        .then(() => {
          // 복사가 완료되면 이 부분이 호출된다.
          toast.success("URL 복사완료");
        });
    }
  }

  return (
    <main className="w-full mt-14 pt-20 pb-10 min-h-screen flex flex-col items-center ">
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
            <section className="flex gap-x-14  justify-center w-full ">
              <div className="w-fit">
                <Image
                  src={newsletterInfo?.data?.cover ?? ""}
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
                <div className="font-semibold text-lg mt-2">
                  {newsletterInfo?.data?.title}
                </div>
                <span className="text-sm mt-8 font-medium text-grayscale-500">
                  뉴스레터 발송일자
                </span>
                <div className="font-semibold  mt-2">
                  {format(
                    new Date(newsletterInfo.data?.sentAt),
                    "yyyy년 MM월 dd일 HH시 mm분 ",
                  )}
                </div>
                <span className="text-sm mt-8 font-medium text-grayscale-500">
                  뉴스레터 URL 링크 주소
                </span>
                <div className="flex items-center gap-x-2.5">
                  <Link
                    className="font-medium  text-primary underline mt-2"
                    href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/@${userInfo?.data?.user.nickname}/${newsletterInfo?.data?.id}`}
                  >
                    {`${process.env.NEXT_PUBLIC_CLIENT_URL}
                      /@
                      ${userInfo?.data?.user.nickname}
                      /${newsletterInfo?.data?.id}
                      `}
                  </Link>
                  <button
                    onClick={onClickCopy}
                    className="py-1 px-3 text-sm font-medium bg-primary text-white rounded-full"
                  >
                    링크복사
                  </button>
                </div>
              </div>
            </section>
            <div className="w-full flex justify-center mt-20">
              <Link
                href={"/mypage/newsletter/publish"}
                className="text-sm font-semibold px-6 py-3 text-white bg-grayscale-600 rounded"
              >
                발송 목록으로 이동하기
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
