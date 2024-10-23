"use client";

import { LogoStrokeBlack, LogoSymbolGray } from "@components/icons";
import Link from "next/link";
import { Button } from "@headlessui/react";
import toast from "react-hot-toast";
import { isMobileWeb } from "@toss/utils";

export default function CheckMobile({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isMobileWeb())
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center px-12">
        <LogoStrokeBlack
          width="44"
          height="44"
          viewBox="0 0 40 40"
          className="text-grayscale-600"
        />
        <h2 className="text-2xl font-bold text-grayscale-700/95 mt-5">
          곧 모바일 버전이 출시됩니다.
        </h2>
        <span className="text-grayscale-500 mt-3 text-center leading-relaxed">
          편리한 모바일 서비스를 제공하기 위해
          <br />
          열심히 준비중입니다.
        </span>
        <div className="mt-6 flex flex-col items-center gap-y-4">
          <Button
            className="bg-grayscale-600 text-sm py-2 px-4 rounded text-white"
            onClick={() =>
              toast.success("응원 감사합니다!", { icon: <LogoSymbolGray /> })
            }
          >
            응원하기
          </Button>
          <Link
            href="https://www.instagram.com/moonjin_official"
            target="_blank"
            className="underline text-grayscale-400 text-sm"
          >
            인스타그램 방문하기
          </Link>
        </div>
      </div>
    );

  return <>{children}</>;
}
