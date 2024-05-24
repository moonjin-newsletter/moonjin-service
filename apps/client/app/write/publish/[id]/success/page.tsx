"use client";

import React from "react";
import LottieFrame from "@components/lottie/LottieFrame";
import SendingAnimation from "./Sending.json";

export default function Page() {
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
      </div>
    </main>
  );
}
